
import { motion } from "framer-motion";
import { Wallet, Shield, Zap, TrendingUp, Lock, Activity, Users, Brain, FileText, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnection } from "@/components/blockchain/WalletConnection";
import { PulsePayBlockchain } from "@/components/blockchain/PulsePayBlockchain";
import { BlockchainSecurityDashboard } from "@/components/blockchain/BlockchainSecurityDashboard";
import { MultiSigWallet } from "@/components/blockchain/MultiSigWallet";
import { RiskAnalytics } from "@/components/blockchain/RiskAnalytics";
import { ComplianceMonitoring } from "@/components/blockchain/ComplianceMonitoring";
import { AutomatedPayroll } from "@/components/blockchain/AutomatedPayroll";
import { InvoiceAutomation } from "@/components/blockchain/InvoiceAutomation";
import { TaxIntegration } from "@/components/blockchain/TaxIntegration";
import { BlockchainProvider } from "@/contexts/BlockchainContext";

const BlockchainFinance = () => {
  const features = [
    {
      icon: Shield,
      title: "Multi-Signature Security",
      description: "Multi-party approval workflows for high-value transactions",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Brain,
      title: "ML Risk Analytics",
      description: "AI-powered fraud detection and real-time monitoring",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Automated Payroll",
      description: "Smart contract-based payroll with performance bonuses",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: FileText,
      title: "Invoice Automation",
      description: "Smart contract invoice processing with auto-approvals",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Calculator,
      title: "Tax Integration",
      description: "Automated tax calculation and regulatory compliance",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: Lock,
      title: "Immutable Logging",
      description: "All transactions cryptographically secured on blockchain",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <BlockchainProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Advanced Blockchain Finance</h1>
            <p className="text-white/70 text-lg">
              Smart contract automation with multi-sig security, ML analytics, and regulatory compliance
            </p>
          </motion.div>

          {/* Enhanced Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Blockchain Features Tabs */}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <WalletConnection />
                  <div className="lg:col-span-2">
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">🚀 Phase 2: Smart Contract Automation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Automated Payroll System ✅</h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              <li>• Smart contract-based recurring payments</li>
                              <li>• Performance-based bonus releases</li>
                              <li>• Automated tax calculation & withholding</li>
                              <li>• Multi-frequency payment schedules</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Invoice Automation ✅</h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              <li>• Smart contract invoice processing</li>
                              <li>• Automated approval workflows</li>
                              <li>• Configurable approval rules</li>
                              <li>• Real-time payment execution</li>
                            </ul>
                          </div>
                          <div className="md:col-span-2">
                            <h4 className="text-white font-semibold mb-2">Tax Integration & Compliance ✅</h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              <li>• Multi-jurisdiction tax calculation • Cross-border payment optimization • Real-time compliance monitoring • Automated regulatory reporting</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/80 text-sm">
                            <strong>Smart Contract Automation:</strong> Phase 2 delivers comprehensive automation 
                            with intelligent payroll processing, streamlined invoice workflows, and advanced tax compliance. 
                            Investment attractiveness: <strong className="text-green-400">10/10</strong> - 
                            Revolutionary automation capabilities.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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
        </div>
      </div>
    </BlockchainProvider>
  );
};

export default BlockchainFinance;
