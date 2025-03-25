import { getCurrentUser } from "@/services/session";
import { getEthBalance } from "@/services/wallet";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { NextResponse } from "next/server";

// get current logged in user wallet information
export async function GET(request: Request) {
    const user = await getCurrentUser()
    if (user === null) {
        // back to login page you go
        // return NextResponse.redirect(new URL('/', request.url))
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    const res = await client.getWalletTokenBalance({
        id: user.walletID
    })
    return NextResponse.json(res.data)
    // return NextResponse.json({
    //     'count': await getEthBalance(user.walletAddress)
    // })
}