'use client'

import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';
import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

export default function WorldIDLogin() {
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // This function handles the verification with your API endpoint
    const verifyProof = async (proof: any) => {
        try {
            console.log('Verifying proof:', proof);
            
            const response = await fetch('/api/verify-worldid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proof),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Verification failed!');
            }

            const data = await response.json();
            return data.success; // Return true if verification was successful
        } catch (error) {
            console.error("Verification error:", error);
            throw error; // Rethrow to be caught by the widget
        }
    };

    // This function is called after successful verification
    const onSuccess = () => {
        console.log("WorldID verification successful!");
        setVerified(true);
        setLoading(false);
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
                app_id="app_staging_338b219233c319fb6dd354f3919be66e"
                action="vhack_action"
                verification_level={VerificationLevel.Device}
                handleVerify={verifyProof}
                onSuccess={onSuccess}
                // Setup for when the widget is loading or processing
                onError={(error) => {
                    console.error("Error during verification:", error);
                    setError(error.message || "Verification failed");
                    setLoading(false);
                }}
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