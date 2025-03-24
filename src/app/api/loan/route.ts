import { connectToBlockchain, connectToMicroloan, depositUSDC, getLoanDetails, waitForTransaction } from "@/services/blockchain";
import { getCurrentUser } from "@/services/session";
import { getEthBalance, getUSDCBalance } from "@/services/wallet";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import { ethers } from "ethers";
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
    const MIN = 0.000001
    let balance = await getUSDCBalance(user.walletAddress)

    // check usdc balance, if 0, ask user to fuck off
    if (balance <= MIN) {
        return NextResponse.json({
            'msg': 'Nothing in wallet'
        }, { status: 402 })
    }
    balance = Number((balance - MIN).toFixed(6))

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
        blockchain: "ETH-SEPOLIA",
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
    if (transData?.transaction?.state !== "COMPLETE")
        return NextResponse.json({
            msg: 'Transaction failed'
        }, { status: 500 })

    // throw from wallet to blockchain
    await depositUSDC(balance.toString())

    // done
    return NextResponse.json({})
}

export async function GET(request: Request) {
    const microLoan = await connectToMicroloan()

    return NextResponse.json({
        deposited: ethers.formatUnits(await microLoan.totalUSDCDeposited(), 6),
        loaned: ethers.formatUnits(await microLoan.totalUSDCLoaned(), 6),
        available: ethers.formatUnits(await microLoan.availableUSDC(), 6)
    })

}