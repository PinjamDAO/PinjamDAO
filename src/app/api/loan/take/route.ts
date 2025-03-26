import tasks from "@/models/tasks";
import Task, { TaskProgress, TaskType, updateTaskState } from "@/models/tasks";
import { userType } from "@/models/users";
import { depositCollateral, getActiveLoan, getAvailableUSDC, getCollateralValue, payoutLoan, takeLoan, waitForTransaction } from "@/services/blockchain";
import connectDB from "@/services/db";
import { getCurrentUser } from "@/services/session";
import { extractBody, truncateDecimals } from "@/services/utils";
import { getEthBalance } from "@/services/wallet";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { NextResponse } from "next/server";

async function createJob(balance: string, addr: string, user: userType) {
    await connectDB()

    const job = await Task.create({
        userId: user.worldId,
        taskType: TaskType.GetLoan
    })
    await job.save()

    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    await updateTaskState(job, TaskProgress.ETHToMainWallet)
    let res;
    try {
        res = await client.createTransaction({
            amount: [balance],
            destinationAddress: process.env.WALLET_ADDR!,
            blockchain: "ETH-SEPOLIA",
            tokenAddress: "",
            walletId: user.walletID,
            fee: {
                type: 'level',
                config: {
                    feeLevel: 'HIGH'
                }
            }
        })
    } catch (e: any) {
        console.log(e)
        console.log(e.response.data.errors)
        return await updateTaskState(job, TaskProgress.Failed)
    }

    // poll for the transaction here to be completed
    const transData = await waitForTransaction(res.data!.id);
    if (transData?.transaction?.state !== "COMPLETE")
        return await updateTaskState(job, TaskProgress.Failed)

    await updateTaskState(job, TaskProgress.DepositCollateral)
    // oh boy oh boy time to interact with blockchain!@!!!!
    await depositCollateral(balance)

    await updateTaskState(job, TaskProgress.SendingLoan)
    const amount = await takeLoan(addr)

    if (amount === undefined)
        return await updateTaskState(job, TaskProgress.Failed)

    await updateTaskState(job, TaskProgress.Done)
}

// pay collateral, get loan
export async function POST(request: Request) {
    const user = await getCurrentUser()
    const data = await extractBody(request)
    // const data = await request.json()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    if (!data.addr) 
        return NextResponse.json({
            'msg': 'empty receiving addr'
        }, { status: 401 })

    let balance = await getEthBalance(user.walletAddress)
    let balanceFloat = parseFloat(balance)

    const MIN = 0.000000000000000001

    // check eth balance, if 0, ask user to fuck off
    if (balanceFloat <= 0) {
    // if (balance <= MIN) { // minimum wallet must have 0.000000000000000001, dont ask me, ask circle wallet
        return NextResponse.json({
            'msg': 'Nothing in wallet'
        }, { status: 402 })
    }

    const loan = await getActiveLoan()
    if (loan.active) {
        return NextResponse.json({
            'msg': 'Already have an active loan'
        }, { status: 400 })
    }

    let sendAmount = balance
    if (data.amount !== undefined) {
        if (parseFloat(data.amount) === 0) {
            return NextResponse.json({
                'msg': 'Cant take 0 USDC loan'
            }, { status: 402 })
        }

        if (parseFloat(data.amount) > balanceFloat) {
            return NextResponse.json({
                'msg': 'Not enough funds in wallet'
            }, { status: 402 })
        }
        sendAmount = truncateDecimals(data.amount, 18)
        // sendAmount = data.amount
    }

    const loanAmount = await getCollateralValue(sendAmount)
    const available = await getAvailableUSDC()

    if (parseFloat(loanAmount) > parseFloat(available)) {
        return NextResponse.json({
            'msg': 'Not enough USDC funds in blockchain'
        }, { status: 402 })
    }

    // circle complains if you want to transfer everything out
    // balance = Number((balance - MIN).toFixed(18))
    createJob(sendAmount, data.addr, user)
    return NextResponse.json({ })
}