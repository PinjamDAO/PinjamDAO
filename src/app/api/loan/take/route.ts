import { depositCollateral, payoutLoan, takeLoan, waitForTransaction } from "@/services/blockchain";
import { getCurrentUser } from "@/services/session";
import { getEthBalance } from "@/services/wallet";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { NextResponse } from "next/server";

// pay collateral, get loan
export async function POST(request: Request) {
    const user = await getCurrentUser()
    const data = await request.json()

    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    if (!data.addr) 
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

    // circle complains if you want to transfer everything out
    balance = Number((balance - MIN).toFixed(18))

    // everything below here should be dispatched as a job, but im too fucking lazy
    // make payment n loan baby
    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    const res = await client.createTransaction({
        amount: [balance.toString()],
        destinationAddress: process.env.WALLET_ADDR!,
        blockchain: "ETH-SEPOLIA",
        tokenAddress: "",
        walletId: user.walletID,
        fee: {
            type: 'level',
            config: {
                feeLevel: 'HIGH'
            }
        }
    })

    // poll for the transaction here to be completed
    const transData = await waitForTransaction(res.data!.id);
    console.log(transData)
    if (transData?.transaction?.state !== "COMPLETE")
        return NextResponse.json({
            msg: 'Transaction failed'
        }, { status: 500 })


    // oh boy oh boy time to interact with blockchain!@!!!!
    await depositCollateral(balance.toString())
    const amount = await takeLoan(balance.toString(), data.addr)

    if (amount === undefined)
        return NextResponse.json({
            msg: 'blockchain failed, request refund from devs' 
        }, { status: 500 })

    return NextResponse.json({ 
        loan_amount: amount 
    })
}