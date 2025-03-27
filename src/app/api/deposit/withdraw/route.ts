import Task, { TaskProgress, TaskType, updateTaskState } from "@/models/tasks"
import { userType } from "@/models/users"
import { getOnGoingDeposit, withdrawDeposit } from "@/services/blockchain"
import connectDB from "@/services/db"
import { getCurrentUser } from "@/services/session"
import { extractBody, truncateDecimals } from "@/services/utils"
import { NextResponse } from "next/server"

async function createJob(amount: string, user: userType) {   
    await connectDB()

    const job = await Task.create({
        userId: user.worldId,
        taskType: TaskType.WithdrawDeposit
    })
    await job.save()
    
    try {
        await updateTaskState(job, TaskProgress.WithdrawDeposit)
        await withdrawDeposit(amount, user)
    } catch (e: any) {
        console.log(e)
        return await updateTaskState(job, TaskProgress.Failed)
    }
}

export async function POST(request: Request) {
    const user = await getCurrentUser()
    const data = await extractBody(request)

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const deposit = await getOnGoingDeposit()
    if (!deposit.depositTime) // ah ok, sure
        return NextResponse.json({
            'msg': 'no active deposit'
        }, {  status: 404 })

    const now = new Date()
    if (now < deposit.lockEndTime) {
        return NextResponse.json({
            'msg': 'Lock period has not ended'
        }, { status: 403 })
    }

    let toSend = deposit.amount
    if (data.amount !== undefined) {
        if (parseFloat(data.amount) === 0) {
            return NextResponse.json({
                'msg': 'cannot withdraw 0 USDC'
            }, { status: 400 } )
        }

        if (parseFloat(data.amount) > parseFloat(deposit.amount)) {
            return NextResponse.json({
                'msg': 'attempt to withdraw more than you put in'
            }, { status: 400 })
        }

        toSend = truncateDecimals(data.amount, 6)
    }

    createJob(toSend, user)
    return NextResponse.json({})
}