import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Standard Base Mainnet Addresses
  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC
  // Ensure you insert the official yoUSD vault address here prior to deploying
  const yoUSD_ADDRESS = "0x0000000000000000000000000000000000000000"; 

  console.log("-----------------------------------------");
  console.log("Deploying SquadVault...");
  const SquadVault = await ethers.getContractFactory("SquadVault");
  const squadVault = await SquadVault.deploy(
    "CowryChain Official Vault",
    USDC_ADDRESS,
    yoUSD_ADDRESS,
    deployer.address
  );
  await squadVault.waitForDeployment();
  const squadVaultAddress = await squadVault.getAddress();
  console.log("✅ SquadVault deployed to:", squadVaultAddress);

  console.log("-----------------------------------------");
  console.log("Deploying SelfRepayingCredit...");
  
  const CreditDelegator = await ethers.getContractFactory("SelfRepayingCredit");
  const credit = await CreditDelegator.deploy(
    yoUSD_ADDRESS, // Collateral token (yoUSD)
    USDC_ADDRESS   // Borrowable token 
  );
  await credit.waitForDeployment();
  const creditAddress = await credit.getAddress();
  console.log("✅ SelfRepayingCredit deployed to:", creditAddress);

  console.log("-----------------------------------------");
  console.log("Deployment Complete! Export these addresses to your frontend.");
  console.log("To verify on BaseScan:");
  console.log(`npx hardhat verify --network base ${squadVaultAddress} "CowryChain Official Vault" "${USDC_ADDRESS}" "${yoUSD_ADDRESS}" "${deployer.address}"`);
  console.log(`npx hardhat verify --network base ${creditAddress} "${yoUSD_ADDRESS}" "${USDC_ADDRESS}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
