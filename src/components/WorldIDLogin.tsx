import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import Image from "next/image";
import { motion } from "motion/react";
import { useWorldID } from "@/utils/worldId";
import { useState } from "react";

export default function WorldIDLogin() {
    const { worldIdConfig } = useWorldID();
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);

    const handleVerify = async(result: ISuccessResult) => {
        try {
            setLoading(true);

            const response = await fetch ('/api/verify-worldid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...result,
                    signal: worldIdConfig.signal,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Verification failed!');
            }

            setVerified(true);
        } catch (error) {
            console.error("Verification failed in error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <IDKitWidget
            app_id={worldIdConfig.app_id as `app_${string}`}
            action={worldIdConfig.action_id}
            signal={worldIdConfig.signal}
            onSuccess={handleVerify}
            verification_level={VerificationLevel.Orb}
        >
            {({ open }) => (
                <motion.div className="flex flex-row justify-evenly w-64 h-12 bg-white text-black font-bold text-base rounded-lg"
                whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.9 }}
                onClick={open}>
                <div className="flex items-center">Continue With WorldID</div>
                <Image src={'/worldID.svg'} alt="worldID" width={25} height={25}/>
                </motion.div>
            )}
        </IDKitWidget>
    );
}