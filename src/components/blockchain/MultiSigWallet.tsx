
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, CheckCircle2, Clock, AlertTriangle, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useBlockchain } from "@/contexts/BlockchainContext";

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
    // Load existing multi-sig transactions
    loadMultiSigTransactions();
  }, []);

  const loadMultiSigTransactions = () => {
    // Mock data for demonstration
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'executed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
            {/* Wallet Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">Owners</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">{owners.length}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Required</span>
                </div>
                <p className="text-2xl font-bold text-green-400">{requiredApprovals}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Pending</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {transactions.filter(tx => tx.status === 'pending').length}
                </p>
              </div>
            </div>

            {/* Create New Transaction */}
            {isWalletConnected && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Create Multi-Sig Transaction</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50000"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-white">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={newTransaction.recipient}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, recipient: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Input
                    id="description"
                    placeholder="Purpose of transaction"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <Button
                  onClick={createMultiSigTransaction}
                  disabled={loading || !newTransaction.amount || !newTransaction.recipient}
                  className="w-full bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Create Multi-Sig Transaction
                </Button>
              </div>
            )}

            {/* Transaction List */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Multi-Sig Transactions</h3>
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{transaction.description}</h4>
                      <p className="text-white/60 text-sm">
                        ${parseFloat(transaction.amount).toLocaleString()} to {formatAddress(transaction.recipient)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white/70 text-sm">
                        Approvals: {transaction.approvals.length}/{transaction.requiredApprovals}
                      </span>
                      {transaction.approvals.map((_, i) => (
                        <CheckCircle2 key={i} className="w-4 h-4 text-green-400" />
                      ))}
                    </div>
                    
                    {transaction.status === 'pending' && isWalletConnected && 
                     !transaction.approvals.includes(walletAddress!) && (
                      <Button
                        onClick={() => approveTransaction(transaction.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
