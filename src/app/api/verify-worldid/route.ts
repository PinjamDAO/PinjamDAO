import { NextResponse } from "next/server";
import { verifyCloudProof } from "@worldcoin/idkit";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const APP_ID = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID!;
        const ACTION_ID = process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID!;

        try {
            const verification = await verifyCloudProof(
                body,
                APP_ID as `app_${string}`,
                ACTION_ID
            );

            if (verification.success) {
                console.log('WorldID verified in route.ts!');
                // Here you would:
                // 1. Generate a session for the verified user
                // 2. Store their nullifier_hash (unique identifier) in your database
                // 3. Associate their verification with your application's database system

                return NextResponse.json({
                    success: true,
                    message:"User verified successfully!"
                });
            } else {
                throw new Error("Verified failed!")
            } 
        } catch (error) {
            console.error("Failed to verified WorldID:", error);
            return NextResponse.json(
                { error: "Failed to verify identity. Please try again."},
                { status: 400}
            );
        }
    } catch (error) {
        console.error("Here got error in route.ts", error);
        return NextResponse.json(
            { error: "Internal server error!" },
            { status: 500 }
        );
    }
}
