
export interface PaymentContract {
  id: string;
  payee: string;
  payer: string;
  totalAmount: string;
  amount: string;
  currency: string;
  milestones: PaymentMilestone[];
  createdAt: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface PaymentMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: number;
  amount: string;
  status: 'pending' | 'completed' | 'disputed';
}

export interface EscrowDetails {
  contractId: string;
  contractAddress: string;
  amount: string;
  balance: string;
  status: 'pending' | 'active' | 'released' | 'refunded';
  createdAt: number;
  terms: string;
  releaseConditions: string;
  disputeResolver: string;
}

export interface PaymentResult {
  transactionId: string;
  status: string;
  amount: string;
  currency: string;
  payee: string;
  timestamp: string;
  ipfsHash: string;
  blockchainNetwork: string;
  gasUsed?: string;
  transactionFee?: string;
}

export interface PayrollResult {
  successful: Array<{
    employeeId: string;
    name: string;
    amount: number;
    transactionId: string;
    status: string;
    timestamp: string;
    ipfsHash: string;
    blockchainNetwork: string;
  }>;
  failed: Array<{
    employeeId: string;
    name: string;
    error: string;
  }>;
}

export interface TaxOptimization {
  originalTax: number;
  optimizedTax: number;
  totalSavings: number;
  optimizations: Array<{
    type: string;
    savings: number;
    description: string;
  }>;
  recommendations: string[];
}
