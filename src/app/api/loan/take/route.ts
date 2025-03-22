import { depositCollateral, payoutLoan, takeLoan, waitForTransaction } from "@/services/blockchain";
import { getCurrentUser } from "@/services/session";
import { getEthBalance } from "@/services/wallet";
import { initiateDeveloperControlledWalletsClient, TransactionState } from "@circle-fin/developer-controlled-wallets";
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

    const balance = await getEthBalance(user.walletAddress)

    // check eth balance, if 0, ask user to fuck off
    if (balance === 0) {
        return NextResponse.json({
            'msg': 'Nothing in wallet'
        }, { status: 402 })
    }

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

    await depositCollateral(balance.toString())
    const amount = await takeLoan(balance.toString())

    if (amount === undefined)
        return NextResponse.json({ 
            msg: 'that failed' 
        }, { status: 500 })

    // transfer this fucking loan, from the fucking wallet, to the 
    // target wallet
    // how the fuck should i get the target wallet? i dont fucking know man
    // nightmare nightmare nightmare nightmare

    await payoutLoan(data.addr, amount)

    return NextResponse.json({ 
        loan_amount: amount 
    })
}