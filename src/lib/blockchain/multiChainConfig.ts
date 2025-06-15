
export interface ChainConfig {
  chainId: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  contracts: {
    USDC: string;
    USDT: string;
    DAI: string;
    WETH: string;
  };
  defiProtocols: {
    uniswap: string;
    aave: string;
    compound: string;
  };
}

export const SUPPORTED_CHAINS: { [key: number]: ChainConfig } = {
  // Ethereum Mainnet
  1: {
    chainId: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
    contracts: {
      USDC: '0xA0b86a33E6441e98ff8db4F5A7B67B0CfAbCd4Ae',
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    },
    defiProtocols: {
      uniswap: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      aave: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
      compound: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B'
    }
  },
  // Polygon
  137: {
    chainId: 137,
    name: 'Polygon',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    contracts: {
      USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    },
    defiProtocols: {
      uniswap: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
      aave: '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf',
      compound: '0xF25212E676D1F7F89Cd72fFEe66158f541246445'
    }
  },
  // BSC
  56: {
    chainId: 56,
    name: 'BSC',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
    contracts: {
      USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      USDT: '0x55d398326f99059fF775485246999027B3197955',
      DAI: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
      WETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
    },
    defiProtocols: {
      uniswap: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      aave: '0xfA7F8980b0f1E64A2062791cc3b0871572f1F7f0',
      compound: '0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827'
    }
  }
};

export const DEFAULT_CHAIN_ID = 137; // Polygon
