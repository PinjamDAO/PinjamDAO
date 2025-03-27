import { LogOutSession } from "@/services/session";
import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import User from "@/models/users"
import { WorldIDResponse } from "@/types/type";
import { LogInSession, setCurrentUser } from "@/services/session";

// destroy session aka log out
export async function DELETE() {
    await LogOutSession()
    return NextResponse.json({ 'msg': 'sign out' })
}

// get a session aka log in
export async function POST(request: Request) {
    await connectDB()

    const data: WorldIDResponse = await request.json()
    
    // check db timeee
    const user = await User.findOne({
        worldId: data.nullifier_hash
    }).exec()

    if (user !== null) {
        // set session
        await LogInSession(data.nullifier_hash);
        return NextResponse.json({ 'msg': 'ok' })
    }

    // temporary set id as your worldid
    await setCurrentUser(data.nullifier_hash)
    return NextResponse.json({ 'msg': 'user not found' }, { status: 404 });
}
