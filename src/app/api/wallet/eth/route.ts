import { getCurrentUser } from "@/services/session"
import { getEthBalance } from "@/services/wallet"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const user = await getCurrentUser()
    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    return NextResponse.json({
        eth: await getEthBalance(user.walletAddress)
    })
}