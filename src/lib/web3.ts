import { BrowserProvider, formatEther, Contract } from 'ethers';

/**
 * Teaching Point: window.ethereum
 * Injected by MetaMask into the browser, allows communication with the blockchain
 * We check for it to verify MetaMask is installed
 */

export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: {
    method: string;
    params?: unknown[];
  }) => Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

/**
 * USDC Token Contract Details
 * USDC is an ERC-20 stablecoin on Ethereum Mainnet
 * Teaching Point: Smart contract interaction via ethers.js
 */
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // Mainnet USDC, This is the smart contract address of USDC on Ethereum Mainnet

// This is the Application Binary Interface - it defines what functions the USDC contract has.
const USDC_ABI = [
  'function balanceOf(address account) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
  'function symbol() public view returns (string)',
];

/**
 * Check if MetaMask is installed in the browser
 * @returns true if window.ethereum exists, false otherwise
 */
export function checkMetaMask(): boolean {
  return typeof window.ethereum !== 'undefined';
}

/**
 * Teaching Point: eth_requestAccounts
 * MetaMask shows a popup to the user asking for permission to connect
 * Returns an array of addresses, accounts[0] is the primary account
 */
export async function connectWallet(): Promise<string> {
  if (!checkMetaMask()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    // Request access to user's accounts
    const accounts = (await window.ethereum!.request({
      method: 'eth_requestAccounts', // ← Ethereum standard method
    })) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect MetaMask.');
    }

    // Return the primary account (accounts[0])
    return accounts[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Teaching Point: Provider (ethers' BrowserProvider)
 * Acts as a bridge between your dApp and the blockchain
 * Uses MetaMask's RPC endpoint under the hood
 */
export async function getBalance(address: string): Promise<string> {
  if (!checkMetaMask()) {
    throw new Error('MetaMask is not installed.');
  }

  try {
    // Create a provider that uses window.ethereum (MetaMask)
    // BrowserProvider Acts as a bridge between your dApp and the blockchain
    const provider = new BrowserProvider(window.ethereum!);

    /**
     * Teaching Point: getBalance()
     * Returns a BigInt in wei (smallest ETH unit)
     * formatEther() converts wei to ETH (1 ETH = 10^18 wei)
     * Calls the blockchain to get the ETH balance
     */
    const balance = await provider.getBalance(address);
    const ethBalance = formatEther(balance);

    return ethBalance;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Format a wallet address for display (shows first 6 and last 4 characters)
 * Example: 0x1234...5678
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Get USDC token balance for an address
 * 
 * Teaching Point: Smart Contract Interaction
 * 1. Contract object: Interface to interact with smart contracts
 * 2. ABI (Application Binary Interface): Defines contract functions
 * 3. ERC-20: Standard for fungible tokens on Ethereum
 * 4. balanceOf(): Read-only view function, returns balance in wei (10^6 for USDC)
 * 
 * @param address Wallet address to check USDC balance
 * @returns USDC balance formatted as a string
 */
export async function getUSDCBalance(address: string): Promise<string> {
  if (!checkMetaMask()) {
    throw new Error('MetaMask is not installed.');
  }

  try {
    // Create a provider that uses window.ethereum (MetaMask)
    const provider = new BrowserProvider(window.ethereum!);

    /**
     * Create a Contract instance
     * Parameters:
     * 1. Token address (USDC on mainnet)
     * 2. ABI (function definitions)
     * 3. Provider (connection to blockchain)
     */
    const usdcContract = new Contract(USDC_ADDRESS, USDC_ABI, provider);

    /**
     * Call balanceOf() - returns balance in wei (smallest unit)
     * USDC has 6 decimals (1 USDC = 10^6 wei)
     */
    const balance = (await usdcContract.balanceOf(address)) as bigint;

    /**
     * Convert wei to USDC
     * USDC uses 6 decimals, so divide by 10^6
     */
    const usdcBalance = Number(balance) / 1_000_000;

    return usdcBalance.toFixed(2);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch USDC balance: ${error.message}`);
    }
    throw error;
  }
}

