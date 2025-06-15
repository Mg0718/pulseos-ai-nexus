
import { Users, Key, Clock } from "lucide-react";

interface MultiSigWalletInfoProps {
  owners: string[];
  requiredApprovals: number;
  pendingCount: number;
}

export const MultiSigWalletInfo = ({
  owners,
  requiredApprovals,
  pendingCount
}: MultiSigWalletInfoProps) => {
  return (
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
        <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
      </div>
    </div>
  );
};
