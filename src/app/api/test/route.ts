import Test from "@/models/test";
import { getCollateralValue } from "@/services/blockchain";
import connectDB from "@/services/db";
import { ethers } from "ethers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // await connectDB();

    // const test = await Test.create({
    //     'msg': 'tthis is a test'
    // })
    // await test.save()
    // test.msg = "updated msg"
    // await test.save()

    // return NextResponse.json({
    //     "msg": 'Ok'
    // })
    return NextResponse.json({
        'wei': Number(ethers.parseEther('0.0001')),
        'res': await getCollateralValue('0.0001')
    })
}

export async function  POST (request: Request) {    
    const data = await request.json()
    console.log(data.test)
    return NextResponse.json({})
}