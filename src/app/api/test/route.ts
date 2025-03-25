import Test from "@/models/test";
import connectDB from "@/services/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await connectDB();

    const test = await Test.create({
        'msg': 'tthis is a test'
    })
    await test.save()
    test.msg = "updated msg"
    await test.save()

    return NextResponse.json({
        "msg": 'Ok'
    })
}