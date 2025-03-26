import Deposit from "@/models/deposits"
import connectDB from "@/services/db"
import { getCurrentUser, getSessionID } from "@/services/session"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const user = await getCurrentUser()
    // const data = await request.json()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    await connectDB()

    return NextResponse.json(await Deposit.find({
        userID: await getSessionID()
    }))
}