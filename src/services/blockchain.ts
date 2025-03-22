import { ethers, Wallet } from "ethers";
import dotenv from "dotenv";
import TOKENS from "@/app/constant";
import { BalancesData, TransactionState } from "@circle-fin/developer-controlled-wallets/dist/types/clients/developer-controlled-wallets";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

dotenv.config();

// hawhaw thanks derek

// Load contract ABI
const MicroLoanArtifact = require("./contracts/MicroLoan.json");
const IERC20Artifact = require("./contracts/IERC20.json");

// Define contract addresses
const MICROLOAN_ADDRESS = process.env.MICROLOAN_ADDRESS!;
const USDC_ADDRESS = process.env.USDC_CONTRACT_ADDRESS!;

// async function getContractInfo() {
//   // Get the signer
//   const [signer] = await ethers.getSigners();
//   console.log("Connected with account:", signer.address);

//   // Connect to MicroLoan contract
//   const microLoan = new ethers.Contract(MICROLOAN_ADDRESS, MicroLoanArtifact.abi, signer);

//   // Connect to USDC contract
//   const usdc = new ethers.Contract(USDC_ADDRESS, IERC20Artifact.abi, signer);

//   // Get contract info
//   console.log("\n----- Contract Information -----");
//   console.log(`USDC Address: ${await microLoan.usdcToken()}`);
//   console.log(`Pyth Price Feed Address: ${await microLoan.pythPriceFeed()}`);
//   console.log(`ETH Price ID: ${await microLoan.ethPriceId()}`);

//   // Get pool stats
//   console.log("\n----- Pool Statistics -----");
//   console.log(`Total USDC Deposited: ${ethers.formatUnits(await microLoan.totalUSDCDeposited(), 6)} USDC`);
//   console.log(`Total USDC Loaned: ${ethers.formatUnits(await microLoan.totalUSDCLoaned(), 6)} USDC`);
//   console.log(`Available USDC: ${ethers.formatUnits(await microLoan.availableUSDC(), 6)} USDC`);

//   // Get user balance
//   console.log("\n----- User Balances -----");
//   console.log(`ETH Balance: ${ethers.formatEther(await ethers.provider.getBalance(signer.address))} ETH`);
//   console.log(`USDC Balance: ${ethers.formatUnits(await usdc.balanceOf(signer.address), 6)} USDC`);

//   // Get user loan info
//   const loan = await microLoan.loans(signer.address);
//   console.log("\n----- User Loan Information -----");
//   console.log(`Loan Amount: ${ethers.formatUnits(loan.loanAmount, 6)} USDC`);
//   console.log(`Collateral Amount: ${ethers.formatEther(loan.collateralAmount)} ETH`);
//   console.log(`Active: ${loan.active}`);
//   console.log(`Liquidated: ${loan.liquidated}`);

//   // Get user deposit info
//   const deposit = await microLoan.deposits(signer.address);
//   console.log("\n----- User Deposit Information -----");
//   console.log(`Deposit Amount: ${ethers.formatUnits(deposit.amount, 6)} USDC`);
//   console.log(`Interest Earned: ${ethers.formatUnits(deposit.interestEarned, 6)} USDC`);

//   // Get expected available USDC if locked period passed
//   if (deposit.amount > 0) {
//     console.log(`Lock End Time: ${new Date(Number(deposit.lockEndTime) * 1000).toLocaleString()}`);
//     const currentTime = Math.floor(Date.now() / 1000);
//     if (currentTime >= Number(deposit.lockEndTime)) {
//       console.log(`Lock period has ended. You can withdraw your USDC.`);
//     } else {
//       const timeRemaining = Number(deposit.lockEndTime) - currentTime;
//       console.log(`Lock period will end in ${Math.floor(timeRemaining / 3600)} hours and ${Math.floor((timeRemaining % 3600) / 60)} minutes.`);
//     }
//   }
// }

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForTransaction(id: string) {
    const client = initiateDeveloperControlledWalletsClient({
        apiKey: process.env.CIRCLE_API_KEY!,
        entitySecret: process.env.CIRCLE_SECRET!
    });

    let done = false, transactionDetails

    while (!done) {
        transactionDetails = await client.getTransaction({
            id: id
        })
        const endStates: Array<TransactionState> = [TransactionState.Complete, TransactionState.Failed, TransactionState.Cancelled]

        done = endStates.includes(transactionDetails.data!.transaction!.state)
        await sleep(1000)
    }
    return transactionDetails
}

export async function connectToBlockchain() {
    const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`)
    new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
    return provider
}

export async function payoutLoan(recvAddr: string, toSend: string) {
    const receiverAddress = recvAddr    
    const usdcContract = await connectToUSDC()

    try {
        const amount = ethers.parseUnits(toSend, 6); // 10 USDC (USDC has 6 decimals)

        console.log(`Sending ${amount} USDC to ${receiverAddress}...`);

        const tx = await usdcContract.transfer(receiverAddress, amount);
        console.log(`Transaction sent! Hash: ${tx.hash}`);

        // Wait for confirmation
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    } catch (error) {
        console.error("Error sending USDC:", error);
    }
}

export async function getLoanInfo() {
    // Get the signer
    const provider = await connectToBlockchain()
    const signer = await provider.getSigner()
    // const [signer] = await ethers.getSigners();
    
    // Connect to MicroLoan contract
    const microLoan = new ethers.Contract(MICROLOAN_ADDRESS, MicroLoanArtifact.abi, signer);
    
    const loan = await microLoan.loans(signer.address);
    return loan;
}

export async function connectToUSDC() {
    const provider = await connectToBlockchain()
    const signer = await provider.getSigner()
    return new ethers.Contract(USDC_ADDRESS, IERC20Artifact.abi, signer)
}

export async function connectToMicroloan() {
    const provider = await connectToBlockchain()
    const signer = await provider.getSigner()
    return new ethers.Contract(MICROLOAN_ADDRESS, MicroLoanArtifact.abi, signer);    
}

export async function depositUSDC(amount: string) {
  // Get the signer
  const provider = await connectToBlockchain()
  const signer = await provider.getSigner();

  // Connect to MicroLoan contract
  const microLoan = new ethers.Contract(MICROLOAN_ADDRESS, MicroLoanArtifact.abi, signer);

  // Connect to USDC contract
  const usdc = new ethers.Contract(USDC_ADDRESS, IERC20Artifact.abi, signer);

  // Convert amount to wei (USDC has 6 decimals)
  const amountInWei = ethers.parseUnits(amount, 6);

  // Check USDC balance
  const balance = await usdc.balanceOf(signer.address);
  if (balance < amountInWei) {
    console.error(`Insufficient USDC balance. You have ${ethers.formatUnits(balance, 6)} USDC.`);
    return;
  }

  // Approve USDC transfer
  console.log(`Approving ${amount} USDC...`);
  const approveTx = await usdc.approve(await microLoan.getAddress(), amountInWei);
  await approveTx.wait();
  console.log(`Approved!`);

  // Deposit USDC
  console.log(`Depositing ${amount} USDC...`);
  const depositTx = await microLoan.depositUSDC(amountInWei);
  await depositTx.wait();
  console.log(`Successfully deposited ${amount} USDC!`);
}

export async function depositCollateral(amount: string) {
    // Get the signer
    const provider = await connectToBlockchain()
    const signer = await provider.getSigner();

    // Connect to MicroLoan contract
    const microLoan = new ethers.Contract(MICROLOAN_ADDRESS, MicroLoanArtifact.abi, signer);

    // Convert amount to wei
    const amountInWei = ethers.parseEther(amount);

    // Check ETH balance
    const balance = await provider.getBalance(signer.address);
    if (balance < amountInWei) {
        console.error(`Insufficient ETH balance. You have ${ethers.formatEther(balance)} ETH.`);
        return;
    }

    // Deposit ETH as collateral
    console.log(`Depositing ${amount} ETH as collateral...`);
    const depositTx = await microLoan.depositCollateral({ value: amountInWei });
    await depositTx.wait();
    console.log(`Successfully deposited ${amount} ETH as collateral!`);
}

export async function takeLoan(amount: string) {
    // Get the signer
    const provider = await connectToBlockchain()
    const signer = await provider.getSigner();

    // Connect to MicroLoan contract
    const microLoan = new ethers.Contract(MICROLOAN_ADDRESS, MicroLoanArtifact.abi, signer);

    // Get loan details
    const loan = await microLoan.loans(signer.address);
    if (loan.active) {
        console.error("You already have an active loan!");
        return;
    }

    if (loan.collateralAmount == 0) {
        console.error("You must deposit collateral before taking a loan!");
        return;
    }

    // Convert amount to wei (USDC has 6 decimals)
    const amountInWei = ethers.parseUnits(amount, 6);

    // Create a unique nullifier hash (in production you would integrate with WorldID)
    const nullifierHash = ethers.encodeBytes32String(`loan-${Date.now()}`);

    // Check available USDC
    const availableUSDC = await microLoan.availableUSDC();
    if (availableUSDC < amountInWei) {
        console.error(`Insufficient USDC liquidity. Available: ${ethers.formatUnits(availableUSDC, 6)} USDC`);
        return;
    }

    // Take loan
    console.log(`Taking loan of ${amount} USDC...`);
    const takeLoanTx = await microLoan.takeLoan(amountInWei, nullifierHash);
    await takeLoanTx.wait();
    console.log(`Successfully borrowed ${amount} USDC!`);
    return amount
}

export async function getLoanDetails() {
    // Get the signer
    const provider = await connectToBlockchain()
    const signer = await provider.getSigner();

    // Connect to MicroLoan contract
    const microLoan = new ethers.Contract(MICROLOAN_ADDRESS, MicroLoanArtifact.abi, signer);
    const loanDetails = await microLoan.loans(signer.address)
    const interest = await microLoan.calculateBorrowerInterest(signer.address);
    const res = Object.assign(loanDetails, {
        interest: interest,
        totalDue: loanDetails.loanAmount + interest
    })
    return res
}

export async function repayLoan(amount: string) {
    // Get the signer
    const provider = await connectToBlockchain()
    const signer = await provider.getSigner();

    // Connect to MicroLoan contract
    const microLoan = new ethers.Contract(MICROLOAN_ADDRESS, MicroLoanArtifact.abi, signer);

    // Connect to USDC contract
    const usdc = new ethers.Contract(USDC_ADDRESS, IERC20Artifact.abi, signer);

    // Get loan details
    const loan = await microLoan.loans(signer.address);
    if (!loan.active) {
        console.error("You don't have an active loan to repay!");
        return;
    }

    // Calculate interest
    const interest = await microLoan.calculateBorrowerInterest(signer.address);
    const totalDue = loan.loanAmount + interest;
    console.log(`Loan amount: ${ethers.formatUnits(loan.loanAmount, 6)} USDC`);
    console.log(`Interest accrued: ${ethers.formatUnits(interest, 6)} USDC`);
    console.log(`Total due: ${ethers.formatUnits(totalDue, 6)} USDC`);

    // // Convert amount to wei (USDC has 6 decimals)
    const amountInWei = ethers.parseUnits(amount, 6);
    // if (amountInWei > totalDue) {
    //     console.error(`Repayment amount exceeds total due. Maximum: ${ethers.formatUnits(totalDue, 6)} USDC`);
    //     return;
    // }

    // // Check USDC balance
    // const balance = await usdc.balanceOf(signer.address);
    // if (balance < amountInWei) {
    //     console.error(`Insufficient USDC balance. You have ${ethers.formatUnits(balance, 6)} USDC.`);
    //     return;
    // }

    // Approve USDC transfer
    console.log(`Approving ${amount} USDC...`);
    const approveTx = await usdc.approve(await microLoan.getAddress(), amountInWei);
    await approveTx.wait();
    console.log(`Approved!`);

    // Repay loan
    console.log(`Repaying ${amount} USDC...`);
    const repayTx = await microLoan.repayLoan(amountInWei);
    await repayTx.wait();
    console.log(`Successfully repaid ${amount} USDC!`);

    // Check if loan is fully repaid
    const updatedLoan = await microLoan.loans(signer.address);
    if (!updatedLoan.active) {
        console.log(`🎉 Loan fully repaid! Your collateral has been returned.`);
    } else {
        console.log(`Remaining loan amount: ${ethers.formatUnits(updatedLoan.loanAmount, 6)} USDC`);
    }
}
