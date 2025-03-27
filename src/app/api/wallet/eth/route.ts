import { getCollateralValue } from "@/services/blockchain"
import { getCurrentUser } from "@/services/session"
import { getEthBalance } from "@/services/wallet"
import { NextResponse } from "next/server"

export async function GET() {
    const user = await getCurrentUser()
    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const amount = await getEthBalance(user.walletAddress)
    return NextResponse.json({
        eth: parseFloat(amount),
        canLoan: parseFloat(await getCollateralValue(amount))
    })
}
