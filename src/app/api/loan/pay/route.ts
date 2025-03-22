import { getLoanDetails, repayLoan, waitForTransaction } from "@/services/blockchain"
import { getCurrentUser } from "@/services/session"
import { getUSDCBalance } from "@/services/wallet"
import { initiateDeveloperControlledWalletsClient, TransactionState } from "@circle-fin/developer-controlled-wallets"
import { NextResponse } from "next/server"

// pay your loan
export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const loanDetails = await getLoanDetails()
    const usdcBalance = await getUSDCBalance(user.walletAddress)

    // convert to wei (what the fuck is wei)
    const totalDue = loanDetails.totalDue

    if (usdcBalance < totalDue) {
        return NextResponse.json({
            'msg': 'Not enough to repay load'
        }, { status: 402 })
    }

    // pay loan
    // everything below here should be dispatched as a job, but im too fucking lazy
    // transfer to main wallet
    // transfer from circle wallet, to personal wallet
    
    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    const res = await client.createTransaction({
        amount: [totalDue.toString()],
        destinationAddress: process.env.WALLET_ADDR!,
        tokenAddress: process.env.USDC_CONTRACT_ADDRESS!,
        walletId: user.walletID,
        fee: {
            type: 'level',
            config: {
                feeLevel: 'LOW'
            }
        }
    })

    // you know what time it is, time to poll~~~
    const transData = await waitForTransaction(res.data!.id)
    if (transData?.data?.transaction?.state !== TransactionState.Complete)
        return NextResponse.json({
            msg: 'Transaction failed'
        }, { status: 500 })

    // personal wallet to blockchain epic
    await repayLoan(totalDue)

    return NextResponse.json({})
}