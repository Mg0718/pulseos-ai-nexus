
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface MultiSigTransactionCardProps {
  transaction: MultiSigTransaction;
  index: number;
  isWalletConnected: boolean;
  walletAddress: string | null;
  onApprove: (transactionId: string) => void;
}

export const MultiSigTransactionCard = ({
  transaction,
  index,
  isWalletConnected,
  walletAddress,
  onApprove
}: MultiSigTransactionCardProps) => {
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
    <motion.div
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
         walletAddress && !transaction.approvals.includes(walletAddress) && (
          <Button
            onClick={() => onApprove(transaction.id)}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Approve
          </Button>
        )}
      </div>
    </motion.div>
  );
};
