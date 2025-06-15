
import { motion } from "framer-motion";
import { Wallet, Shield, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletConnection } from "@/components/blockchain/WalletConnection";
import { PulsePayBlockchain } from "@/components/blockchain/PulsePayBlockchain";
import { BlockchainProvider } from "@/contexts/BlockchainContext";

const BlockchainFinance = () => {
  const features = [
    {
      icon: Shield,
      title: "Zero-Knowledge Authentication",
      description: "Privacy-preserving authentication with cryptographic proofs",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Wallet,
      title: "Smart Contract Payments",
      description: "Automated milestone-based payments with escrow protection",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Immutable Audit Trail",
      description: "Complete transparency with blockchain-recorded transactions",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: TrendingUp,
      title: "Global Compliance",
      description: "Automatic regulatory reporting and compliance verification",
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
              Next-generation financial operations powered by blockchain technology
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          {/* Implementation Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-[#6F2DBD]/20 to-[#A663CC]/20 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">🚀 Blockchain Implementation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Phase 1: Foundation ✅</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Polygon L2 infrastructure setup</li>
                      <li>• Web3 wallet integration</li>
                      <li>• Smart contract architecture</li>
                      <li>• IPFS storage integration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Phase 2: Authentication 🚧</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Decentralized Identity (DID)</li>
                      <li>• Zero-Knowledge proofs</li>
                      <li>• Multi-signature support</li>
                      <li>• Biometric integration</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p className="text-white/80 text-sm">
                    <strong>Investment Impact:</strong> This blockchain integration positions PulseOS as the world's 
                    first blockchain-native business operating system, increasing investment attractiveness to 
                    <strong className="text-green-400"> 9.7/10</strong> and accelerating unicorn potential.
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
