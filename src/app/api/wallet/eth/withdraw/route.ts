import { waitForTransaction } from "@/services/blockchain"
import { getCurrentUser } from "@/services/session"
import { getEthBalance } from "@/services/wallet"
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets"
import { NextResponse } from "next/server"

// withdraw collateral
export async function POST( request: Request ) {
    const data = await request.json()
    const user = await getCurrentUser()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    if (!data.addr || !data.amount) 
        return NextResponse.json({
            'msg': 'empty receiving addr'
        }, { status: 401 })
        
    
    let balance = await getEthBalance(user.walletAddress)

    const MIN = 0.000000000000000001

    // check eth balance, if 0, ask user to fuck off
    if (balance <= MIN) { // minimum wallet must have 0.000000000000000001, dont ask me, ask circle wallet
        return NextResponse.json({
            'msg': 'Nothing in wallet'
        }, { status: 402 })
    }

    if (data.amount > balance - MIN) {
        return NextResponse.json({
            'msg': 'Not enough in wallet'
        }, { status: 400 })
    }
    
    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    const res = await client.createTransaction({
        amount: [data.amount.toString()],
        destinationAddress: data.addr,
        blockchain: "ETH-SEPOLIA",
        tokenAddress: "",
        walletId: user.walletID,
        fee: {
            type: 'level',
            config: {
                feeLevel: 'LOW'
            }
        }
    })

    // we really dont need to poll here actually
    const transData = await waitForTransaction(res.data!.id);
    console.log(transData)
    if (transData?.transaction?.state !== "COMPLETE")
        return NextResponse.json({
            msg: 'Transaction failed'
        }, { status: 500 })

    return NextResponse.json({})
}