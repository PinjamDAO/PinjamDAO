"use client";

import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function WorldIDLogin({ onSuccess }: { onSuccess: (result: ISuccessResult) => void }) {
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // App ID and action from environment variables (with fallbacks for development)
    const app_id = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || "app_staging_338b219233c319fb6dd354f3919be66e";
    const action = process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID || "vhack_action";

    const handleProof = async (result: ISuccessResult) => {
        try {
            setLoading(true);
            console.log("Proof received from IDKit:", result);
            
            const response = await fetch('/api/verify-worldid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Verification failed!');
            }

            const data = await response.json();
            console.log("Response from backend:", data);
            
            if (!data.success) {
                throw new Error(data.detail || "Verification failed");
            }
        } catch (error) {
            console.error("Verification error:", error);
            setError(error instanceof Error ? error.message : "Unknown error occurred");
            setLoading(false);
            throw error; // Rethrow to be caught by the widget
        }
    };

    if (verified) {
        return (
            <div className="text-green-600 font-semibold">
                ✓ Identity verified! You can now apply for a microloan.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <IDKitWidget
                app_id={app_id as `app_${string}`}
                action={action}
                onSuccess={onSuccess}
                handleVerify={handleProof}
                verification_level={VerificationLevel.Device}
            >
                {({ open }) => (
                    <motion.div 
                        className="flex flex-row justify-between px-4 items-center w-64 h-12 bg-white text-black font-bold text-base rounded-lg cursor-pointer"
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            open();
                        }}
                    >
                        <div className="flex items-center">
                            {loading ? 'Verifying...' : 'Continue With WorldID'}
                        </div>
                        <Image src={'/worldID.svg'} alt="worldID" width={25} height={25} />
                    </motion.div>
                )}
            </IDKitWidget>
            
            {error && (
                <div className="text-red-500 text-sm mt-2">
                    Error: {error}
                </div>
            )}
        </div>
    );
}