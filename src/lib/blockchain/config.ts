
export const BLOCKCHAIN_CONFIG = {
  // Using Polygon Mumbai testnet for development
  NETWORK: {
    chainId: 80001,
    name: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com'
  },
  
  // Contract addresses (will be deployed)
  CONTRACTS: {
    IDENTITY: '0x1234567890123456789012345678901234567890',
    PULSEPAY: '0x2345678901234567890123456789012345678901',
    PERFORMANCE: '0x3456789012345678901234567890123456789012',
    GOVERNANCE: '0x4567890123456789012345678901234567890123'
  },
  
  // IPFS configuration
  IPFS: {
    gateway: 'https://ipfs.io/ipfs/',
    apiUrl: 'https://api.pinata.cloud'
  }
};

export const PULSE_TOKEN_CONFIG = {
  name: 'PulseToken',
  symbol: 'PULSE',
  decimals: 18,
  totalSupply: '1000000000' // 1 billion tokens
};
