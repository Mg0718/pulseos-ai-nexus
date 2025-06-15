
import { SUPPORTED_CHAINS, ChainConfig } from './multiChainConfig';
import { Web3Provider } from './web3Provider';

export interface CrossChainTransaction {
  id: string;
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  amount: string;
  recipient: string;
  status: 'pending' | 'bridging' | 'completed' | 'failed';
  txHash?: string;
  bridgeTxHash?: string;
  estimatedFee: string;
  estimatedTime: number; // seconds
}

export interface GasOptimization {
  recommendedChain: number;
  estimatedGas: string;
  estimatedCost: string;
  savingsPercentage: number;
  reasoning: string;
}

export class CrossChainManager {
  private web3Provider: Web3Provider;

  constructor() {
    this.web3Provider = Web3Provider.getInstance();
  }

  async getSupportedChains(): Promise<ChainConfig[]> {
    return Object.values(SUPPORTED_CHAINS);
  }

  async getCurrentChain(): Promise<ChainConfig | null> {
    try {
      const chainId = await this.web3Provider.getWalletClient()?.getChainId();
      return SUPPORTED_CHAINS[chainId] || null;
    } catch (error) {
      console.error('Failed to get current chain:', error);
      return null;
    }
  }

  async switchToChain(chainId: number): Promise<boolean> {
    try {
      const chainConfig = SUPPORTED_CHAINS[chainId];
      if (!chainConfig) {
        throw new Error(`Unsupported chain: ${chainId}`);
      }

      // Request chain switch
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });

      return true;
    } catch (error: any) {
      // Chain not added, try to add it
      if (error.code === 4902) {
        return await this.addChain(chainId);
      }
      console.error('Failed to switch chain:', error);
      return false;
    }
  }

  private async addChain(chainId: number): Promise<boolean> {
    try {
      const chainConfig = SUPPORTED_CHAINS[chainId];
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          chainName: chainConfig.name,
          nativeCurrency: chainConfig.nativeCurrency,
          rpcUrls: chainConfig.rpcUrls,
          blockExplorerUrls: chainConfig.blockExplorerUrls
        }]
      });

      return true;
    } catch (error) {
      console.error('Failed to add chain:', error);
      return false;
    }
  }

  async estimateCrossChainTransaction(
    fromChain: number,
    toChain: number,
    token: string,
    amount: string
  ): Promise<CrossChainTransaction> {
    // Simulate cross-chain estimation
    const id = `cross_${Date.now()}`;
    const estimatedFee = (parseFloat(amount) * 0.003).toString(); // 0.3% fee
    const estimatedTime = fromChain === toChain ? 60 : 900; // 1 min same chain, 15 min cross-chain

    return {
      id,
      fromChain,
      toChain,
      fromToken: token,
      toToken: token,
      amount,
      recipient: '', // Will be set during execution
      status: 'pending',
      estimatedFee,
      estimatedTime
    };
  }

  async executeCrossChainTransaction(transaction: CrossChainTransaction): Promise<string> {
    try {
      // Simulate cross-chain execution
      console.log('Executing cross-chain transaction:', transaction);
      
      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      return txHash;
    } catch (error) {
      console.error('Cross-chain transaction failed:', error);
      throw error;
    }
  }

  async optimizeGasRoute(
    operation: 'transfer' | 'swap' | 'stake',
    amount: string,
    token: string
  ): Promise<GasOptimization> {
    // Mock gas optimization logic
    const chains = Object.values(SUPPORTED_CHAINS);
    const currentTime = Date.now();
    
    // Simulate gas price analysis
    let bestChain = 137; // Default to Polygon
    let lowestCost = '50.00';
    let savings = 0;

    if (operation === 'transfer' && parseFloat(amount) < 1000) {
      bestChain = 137; // Polygon for small transfers
      lowestCost = '0.50';
      savings = 95;
    } else if (operation === 'swap') {
      bestChain = 56; // BSC for swaps
      lowestCost = '2.00';
      savings = 80;
    }

    return {
      recommendedChain: bestChain,
      estimatedGas: '21000',
      estimatedCost: lowestCost,
      savingsPercentage: savings,
      reasoning: `${SUPPORTED_CHAINS[bestChain].name} offers the lowest fees for ${operation} operations`
    };
  }
}
