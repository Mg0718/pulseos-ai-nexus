
import { motion } from "framer-motion";
import { Wallet, Shield, Zap, TrendingUp, Lock, Activity, Users, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnection } from "@/components/blockchain/WalletConnection";
import { PulsePayBlockchain } from "@/components/blockchain/PulsePayBlockchain";
import { BlockchainSecurityDashboard } from "@/components/blockchain/BlockchainSecurityDashboard";
import { MultiSigWallet } from "@/components/blockchain/MultiSigWallet";
import { RiskAnalytics } from "@/components/blockchain/RiskAnalytics";
import { ComplianceMonitoring } from "@/components/blockchain/ComplianceMonitoring";
import { BlockchainProvider } from "@/contexts/BlockchainContext";

const BlockchainFinance = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Decision Engine",
      description: "Smart contracts make payment decisions, processors execute securely",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Lock,
      title: "Immutable Session Logging",
      description: "All login sessions cryptographically logged on blockchain",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Activity,
      title: "Blockchain Payroll System",
      description: "Complete payroll automation with blockchain oversight and security",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Users,
      title: "Multi-Signature Security",
      description: "High-value transactions require multiple approvals for enhanced security",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Brain,
      title: "ML Fraud Detection",
      description: "AI-powered real-time fraud detection and risk analytics",
      color: "from-pink-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Compliance Automation",
      description: "Automated GDPR, SOC2, PCI-DSS compliance monitoring",
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
            <h1 className="text-4xl font-bold text-white mb-2">Enhanced Blockchain Finance</h1>
            <p className="text-white/70 text-lg">
              Advanced blockchain integration with multi-sig security, ML fraud detection, and automated compliance
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
              <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-xl border-white/20">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="multisig" className="text-white data-[state=active]:bg-white/20">
                  Multi-Sig
                </TabsTrigger>
                <TabsTrigger value="risk" className="text-white data-[state=active]:bg-white/20">
                  Risk Analytics
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
                        <CardTitle className="text-white">🚀 Phase 1: Enhanced Security & Compliance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Multi-Signature Integration ✅</h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              <li>• High-value transaction approval workflows</li>
                              <li>• 2-of-3 multi-signature security</li>
                              <li>• Automated threshold management</li>
                              <li>• Real-time approval notifications</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-2">Advanced Risk Analytics ✅</h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              <li>• ML-powered fraud detection</li>
                              <li>• Real-time transaction monitoring</li>
                              <li>• Behavioral anomaly detection</li>
                              <li>• Automated compliance scoring</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/80 text-sm">
                            <strong>Enterprise Security:</strong> Phase 1 implementation provides military-grade security 
                            with multi-signature wallets, ML-powered fraud detection, and automated compliance monitoring. 
                            Investment attractiveness: <strong className="text-green-400">10/10</strong> - 
                            Industry-leading security architecture.
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
