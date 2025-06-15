import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@/lib/blockchain/web3Provider';
import { IdentityManager } from '@/lib/blockchain/identity';
import { EnhancedBlockchainPulsePay } from '@/lib/blockchain/enhancedPulsePay';
import { BlockchainSessionLogger, LoginSession } from '@/lib/blockchain/sessionLogger';
import { PaymentContract, EscrowDetails, PaymentMilestone } from '@/lib/blockchain/pulsePay';
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
  
  // Session logging
  logLoginSession: (userId: string, ipAddress: string, userAgent: string) => Promise<LoginSession>;
  getSecurityAuditTrail: (userId: string, fromDate: Date, toDate: Date) => Promise<any>;
  
  // Enhanced PulsePay
  processBlockchainPayment: (payee: string, amount: string, currency?: string) => Promise<any>;
  processBlockchainPayroll: (employees: any[]) => Promise<any>;
  
  // PulsePay Contract Management
  createPaymentContract: (payee: string, totalAmount: string, milestones: Omit<PaymentMilestone, 'id' | 'status'>[]) => Promise<PaymentContract>;
  setupEscrow: (contractId: string, amount: string) => Promise<EscrowDetails>;
  
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
  const enhancedPulsePay = new EnhancedBlockchainPulsePay();
  const sessionLogger = new BlockchainSessionLogger();

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

  const logLoginSession = async (userId: string, ipAddress: string, userAgent: string): Promise<LoginSession> => {
    try {
      setLoading(true);
      const session = await sessionLogger.logLoginSession(userId, ipAddress, userAgent);
      toast.success('Login session logged on blockchain');
      return session;
    } catch (error: any) {
      toast.error(error.message || 'Failed to log session on blockchain');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSecurityAuditTrail = async (userId: string, fromDate: Date, toDate: Date) => {
    try {
      setLoading(true);
      return await sessionLogger.getSecurityAuditTrail(userId, fromDate, toDate);
    } catch (error: any) {
      toast.error(error.message || 'Failed to retrieve audit trail');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const processBlockchainPayment = async (payee: string, amount: string, currency: string = 'USD') => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const result = await enhancedPulsePay.processBlockchainManagedPayment(payee, amount, currency);
      toast.success('Blockchain payment processed successfully!');
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to process blockchain payment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const processBlockchainPayroll = async (employees: any[]) => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const result = await enhancedPulsePay.processBlockchainPayroll(employees);
      toast.success(`Blockchain payroll processed: ${result.successful.length} successful, ${result.failed.length} failed`);
      return result;
    } catch (error: any) {
      toast.error(error.message || 'Failed to process blockchain payroll');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createPaymentContract = async (payee: string, totalAmount: string, milestones: Omit<PaymentMilestone, 'id' | 'status'>[]) => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      const contract = await enhancedPulsePay.createPaymentContract(payee, totalAmount, milestones);
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
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first');
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      const escrowDetails = await enhancedPulsePay.setupEscrow(contractId, amount);
      toast.success('Escrow setup successfully!');
      return escrowDetails;
    } catch (error: any) {
      toast.error(error.message || 'Failed to set up escrow');
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
    logLoginSession,
    getSecurityAuditTrail,
    processBlockchainPayment,
    processBlockchainPayroll,
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
