import Task, { TaskProgress, TaskType, updateTaskState } from "@/models/tasks";
import { userType } from "@/models/users";
import { connectToBlockchain, connectToMicroloan, depositUSDC, getLoanDetails, waitForTransaction } from "@/services/blockchain";
import connectDB from "@/services/db";
import { getCurrentUser } from "@/services/session";
import { checkOngoingTasks } from "@/services/task";
import { extractBody, truncateDecimals } from "@/services/utils";
import { getEthBalance, getUSDCBalance } from "@/services/wallet";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { dataLength, ethers } from "ethers";
import { NextResponse } from "next/server";
import Deposit from "@/models/deposits"

async function createJob(balance: string, user: userType) {
    await connectDB()

    const job = await Task.create({
        userId: user.worldId,
        taskType: TaskType.DepositUSDC
    })
    await job.save()

    try {
        const client = initiateDeveloperControlledWalletsClient({
            apiKey: process.env.CIRCLE_API_KEY!,
            entitySecret: process.env.CIRCLE_SECRET!
        });
    
        await updateTaskState(job, TaskProgress.USDCToMainWallet)
        let res;
        try {
            res = await client.createTransaction({
                amount: [balance],
                destinationAddress: process.env.WALLET_ADDR!,
                tokenAddress: process.env.USDC_CONTRACT_ADDRESS!, // turns out, they are the same thing
                blockchain: "ETH-SEPOLIA",
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
    
        await updateTaskState(job, TaskProgress.USDCToBlockchain)
        // throw from wallet to blockchain
        await depositUSDC(balance)
    
        await updateTaskState(job, TaskProgress.Saving)

        const record = await Deposit.create({
            userID: user.worldId,
            amount: balance
        })
        await record.save()

        await updateTaskState(job, TaskProgress.Done)
    } catch (e) {
        console.log(e)
        return await updateTaskState(job, TaskProgress.Failed)
    }
}

// send money for people to loan hehehaw
export async function POST(request: Request) {
    const user = await getCurrentUser()
    const data = await extractBody(request)
    // const data = await request.json()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    if (await checkOngoingTasks(TaskType.DepositUSDC)) {
        return NextResponse.json({
            'msg': 'already depositing usdc'
        }, { status: 409 })
    }

    // circle wallet -> our own wallet
    // const MIN = 0.000001
    let balance = await getUSDCBalance(user.walletAddress)
    let balanceFloat = parseFloat(balance)

    // check usdc balance, if 0, ask user to fuck off
    if (balanceFloat <= 0) {
    // if (balance <= MIN) {
        return NextResponse.json({
            'msg': 'Nothing in wallet'
        }, { status: 402 })
    }
    // balance = Number((balance - MIN).toFixed(6))

    let amountToSend = balance
    if (data.amount !== undefined) {
        if (parseFloat(data.amount) === 0) {
            return NextResponse.json({
                'msg': 'Cant deposit 0 USDC'
            }, { status: 402 })
        }

        if (parseFloat(data.amount) > balanceFloat) {
            return NextResponse.json({
                'msg': 'Not enough USDC funds in wallet'
            }, { status: 402 })
        }
        amountToSend = truncateDecimals(data.amount, 6)
        // amountToSend = data.amount
    }
    
    createJob(amountToSend, user)
    return NextResponse.json({})
}

export async function GET(request: Request) {
    const microLoan = await connectToMicroloan()

    return NextResponse.json({
        deposited: ethers.formatUnits(await microLoan.totalUSDCDeposited(), 6),
        loaned: ethers.formatUnits(await microLoan.totalUSDCLoaned(), 6),
        available: ethers.formatUnits(await microLoan.availableUSDC(), 6)
    })

}