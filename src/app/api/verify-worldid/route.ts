import { NextResponse } from "next/server";
import { verifyCloudProof } from "@worldcoin/idkit-core/backend";
import { VerificationLevel } from "@worldcoin/idkit-core";

export async function POST(request: Request) {
    try {
        const proof = await request.json();
        console.log("Received proof in API route:", proof);
        
        // Get environment variables with fallbacks
        const app_id = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || "app_staging_338b219233c319fb6dd354f3919be66e";
        const action = process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID || "vhack_action";
        
        try {
            const verifyRes = await verifyCloudProof(
                proof,
                app_id as `app_${string}`,
                action
            );
            
            console.log("Verification result:", verifyRes);
            
            if (verifyRes.success) {
                return NextResponse.json({
                    success: true,
                    message: "User verified successfully!",
                    nullifier: verifyRes.nullifier_hash
                });
            } else {
                return NextResponse.json({
                    success: false,
                    code: verifyRes.code,
                    attribute: verifyRes.attribute,
                    detail: verifyRes.detail || "Verification failed"
                }, { status: 400 });
            }
        } catch (error) {
            console.error("Failed to verify WorldID:", error);
            return NextResponse.json(
                { 
                    success: false,
                    error: "Failed to verify identity",
                    detail: error instanceof Error ? error.message : "Unknown error"
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error in route.ts:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}