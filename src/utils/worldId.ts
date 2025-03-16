import { ISuccessResult } from "@worldcoin/idkit";
// import { Connection, PublicKey, Transaction } from '@solana/web3.js'; //tbc to use Solana or ETH network, sol faster than eth.
// import { useWallet } from '@solana/wallet-adapter-react'; // tbc

const WORLD_ID_APP_ID = "get_from_world_id";
const WORLD_ID_ACTION_ID = "action id from worldid";
const WORLD_ID_SIGNAL = "user-auth";

//solana
export const SOLANA_NETWORK = "devnet" //mainnet-beta for real case

export function useWorldID() {
    // const { publicKey, signTransaction } = useWallet();

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