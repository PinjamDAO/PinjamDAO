import { ethers } from "ethers"
import { connectToBlockchain, connectToUSDC } from "./blockchain"

export async function getEthBalance(walletAddress: ethers.AddressLike) {
    const { provider, signer } = await connectToBlockchain()
    const balance = await provider.getBalance(walletAddress)
    return parseFloat(ethers.formatEther(balance))
}

export async function getUSDCBalance(walletAddress: ethers.AddressLike) {
    const usdc = await connectToUSDC()
    const balance = await usdc.balanceOf(walletAddress);
    return parseFloat(ethers.formatUnits(balance, 6))
}


