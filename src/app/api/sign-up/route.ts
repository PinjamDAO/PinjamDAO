import connectDB from "@/services/db";
import User from "@/models/users"
import { NextResponse } from "next/server";
import { getSessionID, LogInSession } from "@/services/session";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

// sign up
export async function POST(request: Request) {
    await connectDB()

    const nullifier_hash = await getSessionID()
    const exist = (await User.find({
        worldId: nullifier_hash
    }).countDocuments().exec()) > 0

    if (exist) {
        return NextResponse.json({
            message: 'Account already exist'
        }, { status: 409 })
    }

    // create fucking wallet
    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    const response = await client.createWallets({
        blockchains: ["ETH-SEPOLIA"],
        count: 1,
        walletSetId: process.env.CIRCLE_WALLETSET_ID!,
        accountType: "SCA" // yeeepeee, free gas fees :DD
    });
    const walletID = response.data?.wallets[0].id
    const walletAddress = response.data?.wallets[0].address

    const data = Object.assign(await request.json(), {
        worldId: nullifier_hash,
        walletID: walletID,
        walletAddress: walletAddress
    })

    const newUser = await User.create(data)
    await newUser.save()

    await LogInSession(nullifier_hash);
    return NextResponse.json({'msg': 'success'})
}