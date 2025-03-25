import Task, { TaskProgress, TaskType, updateTaskState } from "@/models/tasks"
import { userType } from "@/models/users"
import { getLoanDetails, repayLoan, sendCollateralToCircle, waitForTransaction } from "@/services/blockchain"
import connectDB from "@/services/db"
import { getCurrentUser } from "@/services/session"
import { getUSDCBalance } from "@/services/wallet"
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets"
import { NextResponse } from "next/server"

async function createJob(totalDue: string, user: userType) {
    await connectDB()

    const job = await Task.create({
        userId: user.worldId,
        taskType: TaskType.PayLoan
    })
    await job.save()

    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    await updateTaskState(job, TaskProgress.USDCToMainWallet)
    const res = await client.createTransaction({
        amount: [totalDue],
        destinationAddress: process.env.WALLET_ADDR!,
        blockchain: 'ETH-SEPOLIA',
        tokenAddress: process.env.USDC_CONTRACT_ADDRESS!,
        walletId: user.walletID,
        fee: {
            type: 'level',
            config: {
                feeLevel: 'HIGH'
            }
        }
    })
    // you know what time it is, time to poll~~~
    const transData = await waitForTransaction(res.data!.id)
    if (transData?.transaction?.state !== "COMPLETE")
        await updateTaskState(job, TaskProgress.Failed)

    await updateTaskState(job, TaskProgress.RepayingLoan)

    // personal wallet to blockchain epic
    if (await repayLoan(totalDue)) {
        // if repayLoan returned true, loan is fully repaid
        // need to repay collateral here, send to circle wallet
        await updateTaskState(job, TaskProgress.RepayingCollateral)
        await sendCollateralToCircle(totalDue, user.walletAddress);
    }
    await updateTaskState(job, TaskProgress.Done)
}

// pay your loan
export async function POST(request: Request) {
    const user = await getCurrentUser()
    const data = await request.json()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const loanDetails = await getLoanDetails()
    const usdcBalance = await getUSDCBalance(user.walletAddress)
    const totalDue = loanDetails.totalDue

    // well you know the drill, dumbass chua didnt include amount as a optional parameter hahahahhaa
    let sendAmount = totalDue
    if (data.amount !== undefined) {
        if (parseFloat(data.amount) === 0) {
            return NextResponse.json({
                'msg': 'Cant repay loan with 0 USDC'
            }, { status: 402 })
        }

        if (parseFloat(data.amount) > parseFloat(usdcBalance)) {
            return NextResponse.json({
                'msg': 'Not enough funds in wallet'
            }, { status: 402 })
        }
        sendAmount = data.amount
    } else {
        if (parseFloat(usdcBalance) < Number(totalDue)) {
            return NextResponse.json({
                'msg': 'Not enough to repay load'
            }, { status: 402 })
        }
    }
    
    createJob(sendAmount, user);
    return NextResponse.json({})
}