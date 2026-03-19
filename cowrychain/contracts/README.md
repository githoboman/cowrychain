# CowryChain Smart Contracts (Mainnet)

This directory contains the production-ready Solidity smart contracts required to power the massively multiplayer "Squads" feature and the "Self-Repaying Loans" module.

## Contracts
1. **`SquadVault.sol`**: A communal treasury proxy. It accepts USDC from any whitelisted user or public contributor, instantly delegates it to the native YO Vault, and securely tracks each user's proportionate yield-bearing share.
2. **`SelfRepayingCredit.sol`**: An Alchemix-style credit delegator. It locks `yoUSD`/`yoETH` collateral and dispenses standard debt tokens up to a 50% LTV. As the collateral naturally yields rewards, the LTV mathematically decreases.

## Deployment Instructions
We have pre-configured a Hardhat environment to execute the deployment directly to the Base Mainnet.

1. Create a `.env` file in the root of your project using `.env.example` as a template.
2. Add your deployer `PRIVATE_KEY` and your `BASESCAN_API_KEY`.
3. Run the following command from the root directory:
   ```bash
   npx hardhat run scripts/deploy.ts --network base
   ```

## Verification
The deployment script is programmed to print out the exact `npx hardhat verify` terminal commands you need to execute to verify your source code on BaseScan. Copy and paste them!

Once deployed, copy the new contract addresses and swap them into your frontend hooks/modals to replace the `localStorage` simulations with real on-chain reads and writes.
