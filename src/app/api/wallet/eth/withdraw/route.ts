import Task, { TaskProgress, TaskType, updateTaskState } from "@/models/tasks"
import { userType } from "@/models/users"
import { waitForTransaction } from "@/services/blockchain"
import connectDB from "@/services/db"
import { getCurrentUser } from "@/services/session"
import { extractBody, truncateDecimals } from "@/services/utils"
import { getEthBalance } from "@/services/wallet"
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets"
import { NextResponse } from "next/server"

async function createJob(user: userType, amount: string, receivAddr: string) {
    await connectDB()

    const job = await Task.create({
        userId: user.worldId,
        taskType: TaskType.WithdrawETH
    })
    await job.save()

    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    await updateTaskState(job, TaskProgress.RefundingCollateral)
    const res = await client.createTransaction({
        amount: [amount],
        destinationAddress: receivAddr,
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

    const transData = await waitForTransaction(res.data!.id);
    if (transData?.transaction?.state !== "COMPLETE")
        return await updateTaskState(job, TaskProgress.Failed)

    return await updateTaskState(job, TaskProgress.Done)
}

// withdraw collateral
export async function POST( request: Request ) {
    const user = await getCurrentUser()
    const data = await extractBody(request)

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    if (!data.addr || !data.amount) 
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

    data.amount = truncateDecimals(data.amount, 6)
    const amountFloat = parseFloat(data.amount)
    if (amountFloat > balanceFloat) {
    // if (data.amount > balance - MIN) {
        return NextResponse.json({
            'msg': 'Not enough in wallet'
        }, { status: 400 })
    }
    
    createJob(user, data.amount, data.addr)
    return NextResponse.json({})
}