import { SessionData, sessionOptions } from "@/types/type";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import User from "@/models/users";
import connectDB from "./db";

export async function getCurrentUser() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    await connectDB()

    const userData = await User.findOne({
        worldId: session.id
    }).exec()
    return userData
}

export async function LogInSession(userID: String | undefined) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    if (userID)
        session.id = userID
    session.log_in = true
}

export async function LogOutSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    session.destroy()
}

export async function setCurrentUser(userID: String) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    session.id = userID
    await session.save()
}

export async function getSessionID() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    return session.id 
}