import { getCurrentUser } from "@/services/session"
import { getUSDCBalance } from "@/services/wallet"
import { NextResponse } from "next/server"

export async function GET() {
    const user = await getCurrentUser()
    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    return NextResponse.json({
        usdc: parseFloat(await getUSDCBalance(user.walletAddress))
    })
}