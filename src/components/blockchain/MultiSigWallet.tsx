
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { MultiSigWalletInfo } from "./multisig/MultiSigWalletInfo";
import { MultiSigTransactionForm } from "./multisig/MultiSigTransactionForm";
import { MultiSigTransactionCard } from "./multisig/MultiSigTransactionCard";

interface MultiSigTransaction {
  id: string;
  amount: string;
  recipient: string;
  description: string;
  approvals: string[];
  requiredApprovals: number;
  status: 'pending' | 'approved' | 'executed' | 'rejected';
  createdAt: Date;
  threshold: number;
}

export const MultiSigWallet = () => {
  const { isWalletConnected, walletAddress, loading } = useBlockchain();
  const [transactions, setTransactions] = useState<MultiSigTransaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    recipient: '',
    description: ''
  });

  // Mock multi-sig owners
  const owners = [
    '0x742d35Cc6636Fbc18...a6e1',
    '0x892f47Bb9f1c4592...b7f2',
    '0x1a2b3c4d5e6f7890...c8d9'
  ];

  const requiredApprovals = 2; // 2 out of 3 multi-sig

  useEffect(() => {
    loadMultiSigTransactions();
  }, []);

  const loadMultiSigTransactions = () => {
    const mockTransactions: MultiSigTransaction[] = [
      {
        id: '1',
        amount: '50000',
        recipient: '0xRecipient1...abc',
        description: 'Q4 Marketing Budget',
        approvals: ['0x742d35Cc6636Fbc18...a6e1'],
        requiredApprovals: 2,
        status: 'pending',
        createdAt: new Date(),
        threshold: 3
      },
      {
        id: '2',
        amount: '125000',
        recipient: '0xRecipient2...def',
        description: 'Equipment Purchase',
        approvals: ['0x742d35Cc6636Fbc18...a6e1', '0x892f47Bb9f1c4592...b7f2'],
        requiredApprovals: 2,
        status: 'approved',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        threshold: 3
      }
    ];
    setTransactions(mockTransactions);
  };

  const handleTransactionChange = (field: string, value: string) => {
    setNewTransaction(prev => ({ ...prev, [field]: value }));
  };

  const createMultiSigTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.recipient) return;

    const transaction: MultiSigTransaction = {
      id: Date.now().toString(),
      amount: newTransaction.amount,
      recipient: newTransaction.recipient,
      description: newTransaction.description,
      approvals: [walletAddress!],
      requiredApprovals,
      status: 'pending',
      createdAt: new Date(),
      threshold: owners.length
    };

    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction({ amount: '', recipient: '', description: '' });
  };

  const approveTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === transactionId && !tx.approvals.includes(walletAddress!)) {
        const newApprovals = [...tx.approvals, walletAddress!];
        const newStatus = newApprovals.length >= tx.requiredApprovals ? 'approved' : 'pending';
        return { ...tx, approvals: newApprovals, status: newStatus };
      }
      return tx;
    }));
  };

  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Multi-Signature Wallet
            </CardTitle>
            <p className="text-white/70 text-sm">
              Secure high-value transactions with multi-party approval
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <MultiSigWalletInfo
              owners={owners}
              requiredApprovals={requiredApprovals}
              pendingCount={pendingCount}
            />

            {isWalletConnected && (
              <MultiSigTransactionForm
                newTransaction={newTransaction}
                onTransactionChange={handleTransactionChange}
                onSubmit={createMultiSigTransaction}
                loading={loading}
              />
            )}

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Multi-Sig Transactions</h3>
              {transactions.map((transaction, index) => (
                <MultiSigTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                  isWalletConnected={isWalletConnected}
                  walletAddress={walletAddress}
                  onApprove={approveTransaction}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
