import { getLoanDetails } from "@/services/blockchain"
import { getCurrentUser } from "@/services/session"
import { NextResponse } from "next/server"

// get details on your ACTIVE loan
export async function GET() {
    const user = await getCurrentUser()
    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const loanDetails = await getLoanDetails()
    return NextResponse.json(loanDetails)
}