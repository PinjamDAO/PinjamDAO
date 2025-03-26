import { TaskType } from "@/models/tasks";
import { checkOngoingTasks } from "@/services/task";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    return NextResponse.json({
        take: await checkOngoingTasks(TaskType.GetLoan),
        pay: await checkOngoingTasks(TaskType.PayLoan),
        deposit: await checkOngoingTasks(TaskType.DepositUSDC),
    })
}