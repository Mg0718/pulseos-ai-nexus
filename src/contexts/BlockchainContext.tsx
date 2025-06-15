
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@/lib/blockchain/web3Provider';
import { IdentityManager } from '@/lib/blockchain/identity';
import { PulsePayManager } from '@/lib/blockchain/pulsePay';
import { toast } from 'sonner';

interface BlockchainContextType {
  // Wallet connection
  isWalletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  
  // Identity management
  userDID: string | null;
  generateIdentity: () => Promise<void>;
  authenticateWithZK: (challenge: string) => Promise<boolean>;
  
  // PulsePay
  createPaymentContract: (payee: string, amount: string, milestones: any[]) => Promise<any>;
  setupEscrow: (contractId: string, amount: string) => Promise<any>;
  
  // General
  loading: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userDID, setUserDID] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const web3Provider = Web3Provider.getInstance();
  const identityManager = new IdentityManager();
  const pulsePayManager = new PulsePayManager();

  useEffect(() => {
    // Check if wallet was previously connected
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
          
          // Load existing DID if available
          const did = localStorage.getItem(`did_${accounts[0]}`);
          if (did) {
            setUserDID(did);
          }
        }
      }
    } catch (error) {
      console.error('Wallet connection check failed:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const { address, isConnected } = await web3Provider.connectWallet();
      
      if (isConnected) {
        setWalletAddress(address);
        setIsWalletConnected(true);
        toast.success('Wallet connected successfully!');
        
        // Check for existing DID
        const existingDID = localStorage.getItem(`did_${address}`);
        if (existingDID) {
          setUserDID(existingDID);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const generateIdentity = async () => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const identity = await identityManager.generateDID(walletAddress);
      
      setUserDID(identity.did);
      localStorage.setItem(`did_${walletAddress}`, identity.did);
      
      toast.success('Decentralized Identity created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate identity');
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithZK = async (challenge: string): Promise<boolean> => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return false;
    }

    try {
      setLoading(true);
      const zkProof = await identityManager.generateZKProof(walletAddress, challenge);
      const isValid = await identityManager.verifyZKProof(zkProof, walletAddress);
      
      if (isValid) {
        toast.success('Zero-Knowledge authentication successful!');
        return true;
      } else {
        toast.error('Authentication failed');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createPaymentContract = async (payee: string, amount: string, milestones: any[]) => {
    try {
      setLoading(true);
      const contract = await pulsePayManager.createPaymentContract(payee, amount, milestones);
      toast.success('Payment contract created successfully!');
      return contract;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment contract');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const setupEscrow = async (contractId: string, amount: string) => {
    try {
      setLoading(true);
      const escrow = await pulsePayManager.setupEscrow(contractId, amount);
      toast.success('Escrow setup successfully!');
      return escrow;
    } catch (error: any) {
      toast.error(error.message || 'Failed to setup escrow');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isWalletConnected,
    walletAddress,
    connectWallet,
    userDID,
    generateIdentity,
    authenticateWithZK,
    createPaymentContract,
    setupEscrow,
    loading
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};
