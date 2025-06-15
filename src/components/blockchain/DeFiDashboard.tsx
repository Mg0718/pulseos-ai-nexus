
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Zap, Target } from "lucide-react";
import { DeFiManager, YieldFarmingPool, StablecoinOptimization, LiquidityPosition } from '@/lib/blockchain/defiManager';
import { toast } from 'sonner';

export const DeFiDashboard = () => {
  const [defiManager] = useState(new DeFiManager());
  const [yieldPools, setYieldPools] = useState<YieldFarmingPool[]>([]);
  const [optimization, setOptimization] = useState<StablecoinOptimization | null>(null);
  const [liquidityPositions, setLiquidityPositions] = useState<LiquidityPosition[]>([]);
  const [balance, setBalance] = useState('10000');
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDeFiData();
  }, []);

  const loadDeFiData = async () => {
    try {
      const pools = await defiManager.getAvailableYieldPools(137); // Polygon
      setYieldPools(pools);
      
      const positions = await defiManager.getLiquidityPositions('0x123...'); // Mock address
      setLiquidityPositions(positions);
    } catch (error) {
      console.error('Failed to load DeFi data:', error);
    }
  };

  const optimizeAllocation = async () => {
    if (!balance || parseFloat(balance) <= 0) {
      toast.error('Please enter a valid balance');
      return;
    }

    setLoading(true);
    try {
      const result = await defiManager.optimizeStablecoinAllocation(balance, riskTolerance);
      setOptimization(result);
      toast.success('Portfolio optimized successfully');
    } catch (error) {
      toast.error('Failed to optimize portfolio');
    } finally {
      setLoading(false);
    }
  };

  const stakeInPool = async () => {
    if (!selectedPool || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please select a pool and enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const txHash = await defiManager.stakeFunds(selectedPool, stakeAmount);
      toast.success(`Staking transaction submitted: ${txHash.substring(0, 10)}...`);
      setStakeAmount('');
      setSelectedPool('');
    } catch (error) {
      toast.error('Staking failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Optimization */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Stablecoin Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Portfolio Balance (USD)</label>
              <Input
                type="number"
                placeholder="10000"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/70 text-sm">Risk Tolerance</label>
              <Select value={riskTolerance} onValueChange={(value: any) => setRiskTolerance(value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={optimizeAllocation} disabled={loading} className="w-full">
            <TrendingUp className="w-4 h-4 mr-2" />
            Optimize Portfolio
          </Button>

          {optimization && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-3">Optimized Allocation</h4>
              <div className="space-y-3">
                {optimization.optimizedAllocation.map((allocation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{allocation.token}</div>
                      <div className="text-white/70 text-sm">{allocation.protocol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">${allocation.amount}</div>
                      <div className="text-green-400 text-sm">{allocation.apy}% APY</div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Projected Annual Yield:</span>
                    <span className="text-green-400 font-medium">${optimization.projectedYield}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Yield Farming Pools */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Yield Farming Pools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/70 text-sm">Select Pool</label>
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Choose a pool" />
                </SelectTrigger>
                <SelectContent>
                  {yieldPools.map((pool) => (
                    <SelectItem key={pool.id} value={pool.id}>
                      {pool.name} - {pool.apy}% APY
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-white/70 text-sm">Amount to Stake</label>
              <Input
                type="number"
                placeholder="1000"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <Button onClick={stakeInPool} disabled={loading || !selectedPool} className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Stake Funds
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {yieldPools.map((pool) => (
              <div key={pool.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{pool.name}</h4>
                  <Badge className={getRiskColor(pool.risk)}>
                    {pool.risk}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">APY:</span>
                    <span className="text-green-400 font-medium">{pool.apy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">TVL:</span>
                    <span className="text-white">${pool.tvl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Min Deposit:</span>
                    <span className="text-white">${pool.minimumDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Protocol:</span>
                    <span className="text-white">{pool.protocol}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liquidity Positions */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Liquidity Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {liquidityPositions.length > 0 ? (
            <div className="space-y-4">
              {liquidityPositions.map((position) => (
                <div key={position.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{position.pool}</h4>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {position.apy}% APY
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-white/70">Position</div>
                      <div className="text-white">{position.amount0} {position.token0}</div>
                      <div className="text-white">{position.amount1} {position.token1}</div>
                    </div>
                    <div>
                      <div className="text-white/70">24h Fees</div>
                      <div className="text-green-400">${position.fees24h}</div>
                    </div>
                    <div>
                      <div className="text-white/70">IL</div>
                      <div className="text-red-400">{position.impermanentLoss}</div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" className="border-white/20 text-white">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-white/70 mb-4">No liquidity positions found</div>
              <Button variant="outline" className="border-white/20 text-white">
                Add Liquidity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
