import Test from "@/models/test";
import { getCollateralValue } from "@/services/blockchain";
import connectDB from "@/services/db";
import { extractBody } from "@/services/utils";
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
        'wei': Number(ethers.parseEther('1')),
        'res': await getCollateralValue('1')
    })
}

export async function  POST (request: Request) {    
    const data = await extractBody(request)
    console.log(data.test)
    return NextResponse.json({})
}