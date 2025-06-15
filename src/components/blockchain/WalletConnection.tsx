
import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Shield, Key, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBlockchain } from "@/contexts/BlockchainContext";

export const WalletConnection = () => {
  const {
    isWalletConnected,
    walletAddress,
    userDID,
    connectWallet,
    generateIdentity,
    loading
  } = useBlockchain();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Blockchain Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isWalletConnected ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white/70" />
              </div>
              <p className="text-white/70">
                Connect your wallet to access blockchain features
              </p>
              <Button
                onClick={connectWallet}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Wallet Connected</span>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-white/60 text-sm">Address</p>
                <p className="text-white font-mono">{formatAddress(walletAddress!)}</p>
              </div>

              {userDID ? (
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">DID Created</span>
                  </div>
                  <p className="text-white/80 text-sm font-mono">{userDID}</p>
                </div>
              ) : (
                <Button
                  onClick={generateIdentity}
                  disabled={loading}
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {loading ? "Creating..." : "Create Digital Identity"}
                </Button>
              )}

              <div className="flex gap-2">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Polygon Mumbai
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  ZK-Proofs
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
