# PinjamDAO

This repo contains the Frontend and Backend of PinjamDAO.

# Features



# Installation & Setup

1. Clone all 3 repositories

```
https://github.com/VHack-2025/PinjamDAO
https://github.com/VHack-2025/PinjamDAO-Smart-Contract
https://github.com/VHack-2025/PinjamDAO-Flask
```

2. `cd` into the directory containing `PinjamDAO-Flask`, follow the setup instructions and start the backend.

3. `cd` into the directory containing `PinjamDAO-Smart-Contract` and follow the setup instructions until 'Compilation'.

4. `cd` out of the directory.

5. Copy the ABI from `artifacts/contracts/MicroLoan.sol/` into `PinjamDAO/src/services/contracts`

```
cp ./PinjamDAO-Smart-Contract/artifacts/contracts/MicroLoan.sol/MicroLoan.json ./PinjamDAO/src/services/contracts
```

6. `cd` into the directory containing this repo

7. Create a `.env` with the follwing fields:

```js
// MongoDB credentials
MONGODB_URI=
SESSION_NAME=
SESSION_PASSWORD=

// Circle Wallet Credentials
CIRCLE_API_KEY=
CIRCLE_WALLETSET_ID=
CIRCLE_SECRET=

// Deployed Contract Address
MICROLOAN_ADDRESS=
WALLET_ADDR=
PRIVATE_KEY=

// Infura API Key
INFURA_API_KEY=

// Etherscan API Key
ETHERSCAN_API_KEY=

// USDC Contract Address
USDC_CONTRACT_ADDRESS=
PYTH_PRICE_FEED=
ETH_PRICE_ID=

```

8. `npm run dev` or `npm run build && npm start` to start.