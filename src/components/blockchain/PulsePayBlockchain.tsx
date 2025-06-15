import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, DollarSign, FileCheck, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useBlockchain } from "@/contexts/BlockchainContext";

export const PulsePayBlockchain = () => {
  const { isWalletConnected, createPaymentContract, setupEscrow, loading, isMetaMaskInstalled } = useBlockchain();
  
  const [contractForm, setContractForm] = useState({
    payee: '',
    amount: '',
    description: ''
  });

  const handleCreateContract = async () => {
    if (!contractForm.payee || !contractForm.amount) return;
    
    const milestones = [
      {
        description: contractForm.description || 'Project completion',
        amount: contractForm.amount,
        dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      }
    ];

    try {
      const contract = await createPaymentContract(
        contractForm.payee,
        contractForm.amount,
        milestones
      );
      
      // Automatically setup escrow
      await setupEscrow(contract.id, contractForm.amount);
      
      // Reset form
      setContractForm({ payee: '', amount: '', description: '' });
    } catch (error) {
      console.error('Contract creation failed:', error);
    }
  };

  const blockchainFeatures = [
    {
      icon: Shield,
      title: "Smart Contract Escrow",
      description: "Automatic escrow with milestone-based releases",
      color: "text-green-400"
    },
    {
      icon: Clock,
      title: "Immutable Records",
      description: "All transactions recorded on blockchain",
      color: "text-blue-400"
    },
    {
      icon: DollarSign,
      title: "Stablecoin Payments",
      description: "USDC payments for global stability",
      color: "text-yellow-400"
    },
    {
      icon: FileCheck,
      title: "Compliance Ready",
      description: "Automatic regulatory reporting",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Blockchain-Powered PulsePay</h2>
        <p className="text-white/70">Secure, transparent, and automated global payments</p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blockchainFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  <div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-white/60 text-sm">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Smart Contract Creation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Create Smart Payment Contract
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isMetaMaskInstalled ? (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">Please install MetaMask to create smart contracts</p>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                  MetaMask Not Installed
                </Badge>
              </div>
            ) : !isWalletConnected ? (
              <div className="text-center py-8">
                <p className="text-white/70 mb-4">Connect your wallet to create smart contracts</p>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  Wallet Connection Required
                </Badge>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payee" className="text-white">Payee Address</Label>
                    <Input
                      id="payee"
                      placeholder="0x..."
                      value={contractForm.payee}
                      onChange={(e) => setContractForm(prev => ({ ...prev, payee: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">Amount (USDC)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="1000"
                      value={contractForm.amount}
                      onChange={(e) => setContractForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Project Description</Label>
                  <Input
                    id="description"
                    placeholder="Website development project"
                    value={contractForm.description}
                    onChange={(e) => setContractForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <Button
                  onClick={handleCreateContract}
                  disabled={loading || !contractForm.payee || !contractForm.amount}
                  className="w-full bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating Contract...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Create Smart Contract
                    </>
                  )}
                </Button>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Auto-Escrow
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Milestone-Based
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Dispute Resolution
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
