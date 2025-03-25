import { getLoanDetails, getLoanHistory } from "@/services/blockchain"
import { getCurrentUser } from "@/services/session"
import { NextResponse } from "next/server"

// get details on history of loans
export async function GET(request: Request) {
    const user = await getCurrentUser()
    if (user === null) {
        return NextResponse.json({
            'msg': 'not log in'
        }, { status: 401 })
    }

    const loanDetails = await getLoanHistory()
    return NextResponse.json(loanDetails)
}