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

3. `cd` into the directory containing `PinjamDAO-Smart-Contract` and follow the setup instructions until 'Deployment'.

4. `cd` out of the directory.

5. Copy the Application Binary Interface (`MicroLoan.json`) from `/PinjamDAO-Smart-Contractartifacts/contracts/MicroLoan.sol/` into `PinjamDAO/src/services/contracts`

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

WALLET_ADDR=

// your ethereum wallet private key
PRIVATE_KEY=

// Infura API Key
INFURA_API_KEY=

// Etherscan API Key
ETHERSCAN_API_KEY=

// Contract Addresses
USDC_CONTRACT_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
PYTH_PRICE_FEED=0xDd24F84d36BF92C65F92307595335bdFab5Bbd21
ETH_PRICE_ID=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace

// Deployed Contract Address (from PinjamDAO-Smart-Contract)
MICROLOAN_ADDRESS=
```

8. `npm run dev` or `npm run build && npm start` to start.

# Authentication

Use `simulator.worldcoin.org` on mobile to scan the QR code that pops up on screen when a user tries to log in.