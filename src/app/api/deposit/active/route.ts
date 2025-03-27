import { getOnGoingDeposit } from "@/services/blockchain";
import { getCurrentUser } from "@/services/session";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getCurrentUser()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const data = await getOnGoingDeposit()
    if (!data.depositTime) // ah ok, sure
        return NextResponse.json({})
    return NextResponse.json(data)
}