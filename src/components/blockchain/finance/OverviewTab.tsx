
import { WalletConnection } from "../WalletConnection";
import { OverviewCard } from "./OverviewCard";

export const OverviewTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <WalletConnection />
      <div className="lg:col-span-2">
        <OverviewCard />
      </div>
    </div>
  );
};
