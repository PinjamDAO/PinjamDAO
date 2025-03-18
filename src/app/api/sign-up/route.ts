import connectDB from "@/services/db";
import User from "@/models/users"
import { NextResponse } from "next/server";
import { getSessionID, LogInSession } from "@/services/session";
import { data } from "motion/react-client";

// sign up
export async function POST(request: Request) {
    await connectDB()

    const nullifier_hash = await getSessionID()
    const worldID = {
        worldId: nullifier_hash
    }
    const exist = (await User.find(worldID).countDocuments().exec()) > 0

    if (exist) {
        return NextResponse.json({
            message: 'Account already exist'
        }, { status: 409 })
    }

    const data = Object.assign(await request.json(), worldID)
    const newUser = await User.create(data)
    await newUser.save()

    await LogInSession(nullifier_hash);
    return NextResponse.json({'msg': 'success'})
}