import { depositUSDC, getLoanDetails, waitForTransaction } from "@/services/blockchain";
import { getCurrentUser } from "@/services/session";
import { getEthBalance } from "@/services/wallet";
import { initiateDeveloperControlledWalletsClient, TokenBlockchain, TransactionState } from "@circle-fin/developer-controlled-wallets";
import { NextResponse } from "next/server";

// send money for people to loan hehehaw
export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    // circle wallet -> our own wallet
    const balance = await getEthBalance(user.walletAddress)

    // check usdc balance, if 0, ask user to fuck off
    if (balance === 0) {
        return NextResponse.json({
            'msg': 'Nothing in wallet'
        }, { status: 402 })
    }

    // everything below here should be dispatched as a job, but im too fucking lazy
    // transfer to main wallet
    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    const res = await client.createTransaction({
        amount: [balance.toString()],
        destinationAddress: process.env.WALLET_ADDR!,
        tokenAddress: process.env.USDC_CONTRACT_ADDRESS!, // turns out, they are the same thing
        walletId: user.walletID,
        fee: {
            type: 'level',
            config: {
                feeLevel: 'LOW'
            }
        }
    })

    // poll for the transaction here to be completed
    const transData = await waitForTransaction(res.data!.id);
    if (transData?.data?.transaction?.state !== TransactionState.Complete)
        return NextResponse.json({
            msg: 'Transaction failed'
        }, { status: 500 })

    // throw from wallet to blockchain
    await depositUSDC(balance.toString())

    // done
    return NextResponse.json({})
}

// get details on your loan
export async function GET(request: Request) {
    const user = await getCurrentUser()
    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const loanDetails = await getLoanDetails()
    return NextResponse.json(loanDetails)
}