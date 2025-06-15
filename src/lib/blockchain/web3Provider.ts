
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { polygonMumbai } from 'viem/chains';
import { BLOCKCHAIN_CONFIG } from './config';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Provider {
  private static instance: Web3Provider;
  private publicClient: any;
  private walletClient: any;
  private isConnected = false;

  private constructor() {
    this.initializeClients();
  }

  static getInstance(): Web3Provider {
    if (!Web3Provider.instance) {
      Web3Provider.instance = new Web3Provider();
    }
    return Web3Provider.instance;
  }

  private initializeClients() {
    this.publicClient = createPublicClient({
      chain: polygonMumbai,
      transport: http(BLOCKCHAIN_CONFIG.NETWORK.rpcUrl)
    });

    if (typeof window !== 'undefined' && window.ethereum) {
      this.walletClient = createWalletClient({
        chain: polygonMumbai,
        transport: custom(window.ethereum)
      });
    }
  }

  async connectWallet(): Promise<{ address: string; isConnected: boolean }> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Switch to Polygon Mumbai if needed
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }] // Mumbai chainId in hex
        });
      } catch (switchError: any) {
        // Add network if it doesn't exist
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x13881',
              chainName: 'Polygon Mumbai',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: [BLOCKCHAIN_CONFIG.NETWORK.rpcUrl],
              blockExplorerUrls: [BLOCKCHAIN_CONFIG.NETWORK.blockExplorer]
            }]
          });
        }
      }

      this.isConnected = true;
      return { address: accounts[0], isConnected: true };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.publicClient.getBalance({ address });
    return balance.toString();
  }

  async signMessage(message: string): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Wallet not connected');
    }
    return await this.walletClient.signMessage({ message });
  }

  getPublicClient() {
    return this.publicClient;
  }

  getWalletClient() {
    return this.walletClient;
  }

  isWalletConnected(): boolean {
    return this.isConnected;
  }
}
