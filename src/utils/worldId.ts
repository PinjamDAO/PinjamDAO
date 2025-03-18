import { ISuccessResult } from "@worldcoin/idkit";

const WORLD_ID_APP_ID = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || 'app_staging_338b219233c319fb6dd354f3919be66e';
const WORLD_ID_ACTION_ID = process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID || 'vhack_action';
const WORLD_ID_SIGNAL = process.env.NEXT_PUBLIC_WORLD_ID_SIGNAL || 'user-auth';

export function useWorldID() {
    const onSuccess = async (result: ISuccessResult) => {
        try {
            console.log("Verified WorldID successfully!", result);

            const response = await fetch('/api/verify-worldid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...result,
                    signal: WORLD_ID_SIGNAL,
                }),
            });

            if (!response.ok) {
                throw new Error("Backend failed to verify.");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error processing WorldID", error);
            throw error;
        }
    };

    return {
        worldIdConfig: {
            app_id: WORLD_ID_APP_ID,
            action_id: WORLD_ID_ACTION_ID,
            signal: WORLD_ID_SIGNAL,
            onSuccess,
        }
    };
}