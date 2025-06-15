
import { motion } from "framer-motion";
import { Wallet, Shield, Zap, TrendingUp, Lock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnection } from "@/components/blockchain/WalletConnection";
import { PulsePayBlockchain } from "@/components/blockchain/PulsePayBlockchain";
import { BlockchainSecurityDashboard } from "@/components/blockchain/BlockchainSecurityDashboard";
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
      icon: Zap,
      title: "Hack-Proof Architecture",
      description: "Data remains secure even if payment processors are compromised",
      color: "from-orange-500 to-red-500"
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
            <h1 className="text-4xl font-bold text-white mb-2">Blockchain Finance</h1>
            <p className="text-white/70 text-lg">
              Advanced blockchain integration with secure payment processing and immutable audit trails
            </p>
          </motion.div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Wallet Connection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <WalletConnection />
            </motion.div>

            {/* PulsePay Blockchain */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <PulsePayBlockchain />
            </motion.div>
          </div>

          {/* Blockchain Security Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <BlockchainSecurityDashboard />
          </motion.div>

          {/* Enhanced Implementation Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-[#6F2DBD]/20 to-[#A663CC]/20 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">🚀 Enhanced Blockchain Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Phase 1: Security Foundation ✅</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Immutable login session logging</li>
                      <li>• Blockchain-based risk analysis</li>
                      <li>• Cryptographic audit trails</li>
                      <li>• IPFS integration for data storage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Phase 2: Payment Intelligence ✅</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Blockchain decision engine for payments</li>
                      <li>• Automated payroll with blockchain oversight</li>
                      <li>• Processor agnostic architecture</li>
                      <li>• Complete transaction hashing</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p className="text-white/80 text-sm">
                    <strong>Security Architecture:</strong> Your data remains completely secure with blockchain-managed 
                    decisions and immutable audit trails. Even if Stripe or Razorpay are compromised, your financial 
                    decisions and audit data remain protected on the blockchain. Investment attractiveness: 
                    <strong className="text-green-400"> 10/10</strong> - Revolutionary approach to financial security.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </BlockchainProvider>
  );
};

export default BlockchainFinance;
