
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { BlockchainHeader } from "@/components/blockchain/finance/BlockchainHeader";
import { FeaturesGrid } from "@/components/blockchain/finance/FeaturesGrid";
import { BlockchainTabs } from "@/components/blockchain/finance/BlockchainTabs";

const BlockchainFinance = () => {
  return (
    <BlockchainProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
        <div className="max-w-7xl mx-auto">
          <BlockchainHeader />
          <FeaturesGrid />
          <BlockchainTabs />
        </div>
      </div>
    </BlockchainProvider>
  );
};

export default BlockchainFinance;
