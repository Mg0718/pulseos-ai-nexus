
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnection } from "../WalletConnection";
import { MultiSigWallet } from "../MultiSigWallet";
import { RiskAnalytics } from "../RiskAnalytics";
import { AutomatedPayroll } from "../AutomatedPayroll";
import InvoiceAutomation from "../InvoiceAutomation";
import { TaxIntegration } from "../TaxIntegration";
import { ComplianceMonitoring } from "../ComplianceMonitoring";
import { BlockchainSecurityDashboard } from "../BlockchainSecurityDashboard";
import PulsePayBlockchain from "../PulsePayBlockchain";
import { OverviewTab } from "./OverviewTab";

export const BlockchainTabs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-9 bg-white/10 backdrop-blur-xl border-white/20">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
            Overview
          </TabsTrigger>
          <TabsTrigger value="multisig" className="text-white data-[state=active]:bg-white/20">
            Multi-Sig
          </TabsTrigger>
          <TabsTrigger value="risk" className="text-white data-[state=active]:bg-white/20">
            Risk Analytics
          </TabsTrigger>
          <TabsTrigger value="payroll" className="text-white data-[state=active]:bg-white/20">
            Payroll
          </TabsTrigger>
          <TabsTrigger value="invoices" className="text-white data-[state=active]:bg-white/20">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-white data-[state=active]:bg-white/20">
            Tax
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-white data-[state=active]:bg-white/20">
            Compliance
          </TabsTrigger>
          <TabsTrigger value="security" className="text-white data-[state=active]:bg-white/20">
            Security
          </TabsTrigger>
          <TabsTrigger value="pulsepay" className="text-white data-[state=active]:bg-white/20">
            PulsePay
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="multisig" className="mt-6">
          <MultiSigWallet />
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
          <RiskAnalytics />
        </TabsContent>

        <TabsContent value="payroll" className="mt-6">
          <AutomatedPayroll />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoiceAutomation />
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <TaxIntegration />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceMonitoring />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <BlockchainSecurityDashboard />
        </TabsContent>

        <TabsContent value="pulsepay" className="mt-6">
          <PulsePayBlockchain />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
