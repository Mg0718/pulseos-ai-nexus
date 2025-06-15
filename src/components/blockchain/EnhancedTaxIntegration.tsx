
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, FileText, TrendingUp, AlertCircle, DollarSign, Calendar, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CryptoTaxCalculator, TaxEvent, TaxOptimizationSuggestion } from "@/lib/blockchain/cryptoTaxCalculator";

export const EnhancedTaxIntegration = () => {
  const [cryptoTaxCalculator] = useState(() => new CryptoTaxCalculator());
  const [taxEvents, setTaxEvents] = useState<TaxEvent[]>([]);
  const [optimizations, setOptimizations] = useState<TaxOptimizationSuggestion[]>([]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('US');
  const [taxYear, setTaxYear] = useState(2024);
  const [isCalculating, setIsCalculating] = useState(false);

  const jurisdictions = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'AU', name: 'Australia' }
  ];

  useEffect(() => {
    calculateCryptoTax();
  }, [selectedJurisdiction, taxYear]);

  const calculateCryptoTax = async () => {
    setIsCalculating(true);
    try {
      // Import transactions from connected wallet
      const transactions = await cryptoTaxCalculator.importTransactions(
        '0x742d35Cc6635C0532925a3b8D8Cf1234567890Ab', // Mock wallet address
        [1, 137, 56] // Ethereum, Polygon, BSC
      );

      // Calculate tax events
      const events = await cryptoTaxCalculator.calculateTaxEvents(
        transactions,
        selectedJurisdiction,
        taxYear
      );

      // Generate optimizations
      const opts = await cryptoTaxCalculator.generateTaxOptimizations(
        transactions,
        selectedJurisdiction
      );

      setTaxEvents(events);
      setOptimizations(opts);
    } catch (error) {
      console.error('Crypto tax calculation failed:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const generateTaxReport = async () => {
    const report = await cryptoTaxCalculator.generateTaxReport(taxYear, selectedJurisdiction);
    console.log('Crypto Tax Report Generated:', report);
    // In a real implementation, this would generate and download a comprehensive tax report
  };

  const getTotalTaxOwed = () => {
    return taxEvents.reduce((sum, event) => sum + parseFloat(event.taxOwed), 0);
  };

  const getTotalGainsLosses = () => {
    return taxEvents.reduce((sum, event) => sum + parseFloat(event.gainLoss), 0);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Enhanced Crypto Tax Integration
            </CardTitle>
            <p className="text-white/70 text-sm">
              Advanced crypto tax calculation with cross-border optimization and DeFi support
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tax Summary Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-red-400" />
                  <span className="text-white font-medium">Total Tax Owed</span>
                </div>
                <p className="text-2xl font-bold text-red-400">
                  ${getTotalTaxOwed().toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Net Gains/Losses</span>
                </div>
                <p className={`text-2xl font-bold ${getTotalGainsLosses() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {getTotalGainsLosses() >= 0 ? '+' : ''}${getTotalGainsLosses().toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">Tax Events</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {taxEvents.length}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">Optimizations</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {optimizations.length}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="space-y-2">
                <label className="text-white font-medium">Tax Jurisdiction:</label>
                <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map((jurisdiction) => (
                      <SelectItem key={jurisdiction.code} value={jurisdiction.code}>
                        {jurisdiction.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-white font-medium">Tax Year:</label>
                <Select value={taxYear.toString()} onValueChange={(value) => setTaxYear(parseInt(value))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-white font-medium">Actions:</label>
                <div className="flex gap-2">
                  <Button
                    onClick={generateTaxReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button
                    onClick={calculateCryptoTax}
                    disabled={isCalculating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    {isCalculating ? 'Calculating...' : 'Recalculate'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tax Optimization Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tax Optimization Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizations.map((optimization, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium capitalize">
                        {optimization.type.replace('_', ' ')}
                      </h4>
                      <p className="text-white/70 text-sm">{optimization.description}</p>
                    </div>
                    <Badge className={getRiskColor(optimization.riskLevel)}>
                      {optimization.riskLevel} risk
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-green-400 font-bold text-lg">
                      Potential Savings: {optimization.potentialSavings}
                    </span>
                  </div>
                  
                  <div>
                    <h5 className="text-white font-medium text-sm mb-2">Implementation Steps:</h5>
                    <ul className="text-white/70 text-sm space-y-1">
                      {optimization.implementationSteps.map((step, i) => (
                        <li key={i}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tax Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Tax Events ({taxYear})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {taxEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium capitalize">
                      {event.eventType.replace('_', ' ')}
                    </h4>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {event.holdingPeriod} days
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">Transaction Amount:</span>
                      <p className="text-blue-400 font-medium">${parseFloat(event.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Cost Basis:</span>
                      <p className="text-purple-400 font-medium">${parseFloat(event.costBasis).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Gain/Loss:</span>
                      <p className={`font-medium ${parseFloat(event.gainLoss) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {parseFloat(event.gainLoss) >= 0 ? '+' : ''}${parseFloat(event.gainLoss).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-white/70">Tax Owed:</span>
                      <p className="text-red-400 font-medium">${parseFloat(event.taxOwed).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center text-xs">
                    <span className="text-white/70">Tax Rate: {(event.taxRate * 100).toFixed(1)}%</span>
                    <span className="text-white/70">Jurisdiction: {event.jurisdiction}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
