import { NextResponse } from "next/server";
import { verifyCloudProof } from "@worldcoin/idkit";

const APP_ID = process.env.WORLD_ID_APP_ID!;
const ACTION_ID = process.env.WORLD_ID_ACTION_ID!;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        try {
            await verifyCloudProof(
                body,
                APP_ID as `app_${string}`,
                ACTION_ID,
                body.signal || ''
            );

            console.log('WorldID verified in route.ts!');
        } catch (error) {
            console.error("Failed route.ts", error);
            return NextResponse.json(
                { error: "WorldID route.ts failed!" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User verified successful in route.ts!"
        });
    } catch (error) {
        console.error("Here got error in route.ts", error);
        return NextResponse.json(
            { error: "Internal server error!" },
            { status: 500 }
        );
    }
}
