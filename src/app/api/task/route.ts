import Task from "@/models/tasks";
import { getCurrentUser, getSessionID } from "@/services/session";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const task = await Task.find({
        userId: await getSessionID()
    }).exec()

    return NextResponse.json(task)
}