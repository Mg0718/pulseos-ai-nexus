
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MultiSigTransactionFormProps {
  newTransaction: {
    amount: string;
    recipient: string;
    description: string;
  };
  onTransactionChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const MultiSigTransactionForm = ({
  newTransaction,
  onTransactionChange,
  onSubmit,
  loading
}: MultiSigTransactionFormProps) => {
  return (
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
            onChange={(e) => onTransactionChange('amount', e.target.value)}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipient" className="text-white">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={newTransaction.recipient}
            onChange={(e) => onTransactionChange('recipient', e.target.value)}
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
          onChange={(e) => onTransactionChange('description', e.target.value)}
          className="bg-white/10 border-white/20 text-white"
        />
      </div>

      <Button
        onClick={onSubmit}
        disabled={loading || !newTransaction.amount || !newTransaction.recipient}
        className="w-full bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
      >
        <Shield className="w-4 h-4 mr-2" />
        Create Multi-Sig Transaction
      </Button>
    </div>
  );
};
