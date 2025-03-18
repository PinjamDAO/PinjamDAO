import { getCurrentUser } from "@/services/session";
import { NextResponse } from "next/server";

// get current logged in user
export async function GET(request: Request) {
    const user = await getCurrentUser()
    if (user === null) {
        // back to login page you go
        // return NextResponse.redirect(new URL('/', request.url))
        return NextResponse.json({
            'msg': 'not log in'
        })
    }

    return NextResponse.json(user)
}