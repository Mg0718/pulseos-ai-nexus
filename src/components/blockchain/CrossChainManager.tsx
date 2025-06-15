
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Zap, TrendingUp } from "lucide-react";
import { CrossChainManager, CrossChainTransaction, GasOptimization } from '@/lib/blockchain/crossChainManager';
import { SUPPORTED_CHAINS } from '@/lib/blockchain/multiChainConfig';
import { toast } from 'sonner';

export const CrossChainManagerComponent = () => {
  const [crossChainManager] = useState(new CrossChainManager());
  const [fromChain, setFromChain] = useState<number>(137);
  const [toChain, setToChain] = useState<number>(1);
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDC');
  const [transaction, setTransaction] = useState<CrossChainTransaction | null>(null);
  const [gasOptimization, setGasOptimization] = useState<GasOptimization | null>(null);
  const [loading, setLoading] = useState(false);

  const chains = Object.values(SUPPORTED_CHAINS);
  const tokens = ['USDC', 'USDT', 'DAI', 'WETH'];

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      optimizeGas();
    }
  }, [amount, token, fromChain]);

  const optimizeGas = async () => {
    try {
      const optimization = await crossChainManager.optimizeGasRoute('transfer', amount, token);
      setGasOptimization(optimization);
    } catch (error) {
      console.error('Gas optimization failed:', error);
    }
  };

  const estimateTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const estimation = await crossChainManager.estimateCrossChainTransaction(
        fromChain,
        toChain,
        token,
        amount
      );
      setTransaction(estimation);
      toast.success('Transaction estimated successfully');
    } catch (error) {
      toast.error('Failed to estimate transaction');
    } finally {
      setLoading(false);
    }
  };

  const executeTransaction = async () => {
    if (!transaction) return;

    setLoading(true);
    try {
      const txHash = await crossChainManager.executeCrossChainTransaction(transaction);
      toast.success(`Transaction submitted: ${txHash.substring(0, 10)}...`);
      setTransaction(null);
    } catch (error) {
      toast.error('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const switchChain = async (chainId: number) => {
    setLoading(true);
    try {
      const success = await crossChainManager.switchToChain(chainId);
      if (success) {
        toast.success(`Switched to ${SUPPORTED_CHAINS[chainId].name}`);
      } else {
        toast.error('Failed to switch chain');
      }
    } catch (error) {
      toast.error('Chain switch failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Cross-Chain Bridge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">From Chain</label>
              <Select value={fromChain.toString()} onValueChange={(value) => setFromChain(Number(value))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chains.map((chain) => (
                    <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-white/70 text-sm">To Chain</label>
              <Select value={toChain.toString()} onValueChange={(value) => setToChain(Number(value))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chains.map((chain) => (
                    <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/70 text-sm">Token</label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {gasOptimization && (
            <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-green-300 font-medium">Gas Optimization</span>
                <Badge className="bg-green-500/20 text-green-300">
                  {gasOptimization.savingsPercentage}% savings
                </Badge>
              </div>
              <p className="text-white/70 text-sm">{gasOptimization.reasoning}</p>
              <p className="text-white text-sm mt-1">
                Estimated cost: ${gasOptimization.estimatedCost}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={estimateTransaction} disabled={loading} className="flex-1">
              Estimate Transaction
            </Button>
            {gasOptimization && (
              <Button 
                onClick={() => switchChain(gasOptimization.recommendedChain)}
                disabled={loading}
                variant="outline"
                className="border-white/20 text-white"
              >
                Switch to {SUPPORTED_CHAINS[gasOptimization.recommendedChain].name}
              </Button>
            )}
          </div>

          {transaction && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-2">Transaction Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Amount:</span>
                  <span className="text-white">{transaction.amount} {token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Fee:</span>
                  <span className="text-white">{transaction.estimatedFee} {token}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Estimated Time:</span>
                  <span className="text-white">{Math.floor(transaction.estimatedTime / 60)} minutes</span>
                </div>
              </div>
              <Button onClick={executeTransaction} disabled={loading} className="w-full mt-4">
                Execute Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
