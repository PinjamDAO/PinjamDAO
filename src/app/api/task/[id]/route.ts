import { NextResponse } from "next/server";
import Task from "@/models/tasks";
import { getCurrentUser } from "@/services/session";
import { userType } from "@/models/users";

export async function GET(
    _: Request, 
    { params }: { params: Promise<{ id: string }>}
) {
    const user: userType = await getCurrentUser()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const { id } = await params
    const task = await Task.findById(id)
    if (task.userId !== user.worldId) {
        return NextResponse.json({
            'msg': 'no perm'
        }, { status: 403 })
    } 

    return NextResponse.json(task)
}