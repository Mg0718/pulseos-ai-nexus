
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, FileText, TrendingUp, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaxCalculation {
  id: string;
  transactionId: string;
  amount: string;
  type: 'income' | 'capital_gains' | 'payroll' | 'business_expense';
  taxRate: number;
  taxAmount: string;
  jurisdiction: string;
  status: 'calculated' | 'withheld' | 'filed' | 'pending';
  dueDate: Date;
  blockchainHash: string;
}

interface TaxJurisdiction {
  code: string;
  name: string;
  rates: {
    income: number;
    capitalGains: number;
    payroll: number;
  };
}

export const TaxIntegration = () => {
  const [taxCalculations, setTaxCalculations] = useState<TaxCalculation[]>([]);
  const [jurisdictions, setJurisdictions] = useState<TaxJurisdiction[]>([]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('US');
  const [taxSummary, setTaxSummary] = useState({
    totalWithheld: 0,
    quarterlyOwed: 0,
    annualProjection: 0,
    complianceScore: 98.5
  });

  useEffect(() => {
    loadTaxCalculations();
    loadJurisdictions();
    calculateTaxSummary();
  }, []);

  const loadTaxCalculations = () => {
    const mockCalculations: TaxCalculation[] = [
      {
        id: '1',
        transactionId: 'TX001',
        amount: '5000',
        type: 'payroll',
        taxRate: 0.22,
        taxAmount: '1100',
        jurisdiction: 'US',
        status: 'withheld',
        dueDate: new Date(2024, 3, 15), // April 15th
        blockchainHash: '0xTax123...abc'
      },
      {
        id: '2',
        transactionId: 'TX002',
        amount: '15000',
        type: 'income',
        taxRate: 0.24,
        taxAmount: '3600',
        jurisdiction: 'US',
        status: 'calculated',
        dueDate: new Date(2024, 3, 15),
        blockchainHash: '0xTax456...def'
      },
      {
        id: '3',
        transactionId: 'TX003',
        amount: '2500',
        type: 'capital_gains',
        taxRate: 0.15,
        taxAmount: '375',
        jurisdiction: 'US',
        status: 'pending',
        dueDate: new Date(2024, 3, 15),
        blockchainHash: '0xTax789...ghi'
      }
    ];
    setTaxCalculations(mockCalculations);
  };

  const loadJurisdictions = () => {
    const mockJurisdictions: TaxJurisdiction[] = [
      {
        code: 'US',
        name: 'United States',
        rates: { income: 0.22, capitalGains: 0.15, payroll: 0.1535 }
      },
      {
        code: 'UK',
        name: 'United Kingdom',
        rates: { income: 0.20, capitalGains: 0.20, payroll: 0.1325 }
      },
      {
        code: 'CA',
        name: 'Canada',
        rates: { income: 0.26, capitalGains: 0.13, payroll: 0.118 }
      },
      {
        code: 'DE',
        name: 'Germany',
        rates: { income: 0.42, capitalGains: 0.26, payroll: 0.195 }
      }
    ];
    setJurisdictions(mockJurisdictions);
  };

  const calculateTaxSummary = () => {
    // This would normally calculate from actual transaction data
    setTaxSummary({
      totalWithheld: 5075,
      quarterlyOwed: 12500,
      annualProjection: 50000,
      complianceScore: 98.5
    });
  };

  const calculateTax = async (amount: string, type: string) => {
    const jurisdiction = jurisdictions.find(j => j.code === selectedJurisdiction);
    if (!jurisdiction) return;

    let taxRate = 0;
    switch (type) {
      case 'income':
        taxRate = jurisdiction.rates.income;
        break;
      case 'capital_gains':
        taxRate = jurisdiction.rates.capitalGains;
        break;
      case 'payroll':
        taxRate = jurisdiction.rates.payroll;
        break;
      default:
        taxRate = 0;
    }

    const taxAmount = parseFloat(amount) * taxRate;
    
    const newCalculation: TaxCalculation = {
      id: Date.now().toString(),
      transactionId: `TX${Date.now().toString().slice(-6)}`,
      amount,
      type: type as any,
      taxRate,
      taxAmount: taxAmount.toString(),
      jurisdiction: selectedJurisdiction,
      status: 'calculated',
      dueDate: new Date(2024, 3, 15),
      blockchainHash: `0x${Math.random().toString(16).substring(2, 42)}`
    };

    setTaxCalculations(prev => [newCalculation, ...prev]);
  };

  const withholdTax = (calculationId: string) => {
    setTaxCalculations(prev => prev.map(calc => 
      calc.id === calculationId ? { ...calc, status: 'withheld' as const } : calc
    ));
  };

  const generateTaxReport = () => {
    const report = {
      period: 'Q1 2024',
      totalTransactions: taxCalculations.length,
      totalTaxWithheld: taxCalculations
        .filter(calc => calc.status === 'withheld')
        .reduce((sum, calc) => sum + parseFloat(calc.taxAmount), 0),
      pendingCalculations: taxCalculations.filter(calc => calc.status === 'pending').length,
      complianceStatus: 'Compliant',
      generatedAt: new Date().toISOString()
    };

    console.log('Tax Report Generated:', report);
    // This would normally generate and download a PDF report
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calculated': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'withheld': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'filed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-green-500/20 text-green-300';
      case 'capital_gains': return 'bg-blue-500/20 text-blue-300';
      case 'payroll': return 'bg-purple-500/20 text-purple-300';
      case 'business_expense': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
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
              Automated Tax Integration
            </CardTitle>
            <p className="text-white/70 text-sm">
              Blockchain-based tax calculation, withholding, and compliance automation
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tax Summary Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Total Withheld</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  ${taxSummary.totalWithheld.toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Quarterly Owed</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  ${taxSummary.quarterlyOwed.toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">Annual Projection</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  ${taxSummary.annualProjection.toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">Compliance Score</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {taxSummary.complianceScore}%
                </p>
              </div>
            </div>

            {/* Jurisdiction Selector */}
            <div className="flex items-center gap-4">
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
                    onClick={() => calculateTax('10000', 'income')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Test Calculation
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Tax Rates */}
            {selectedJurisdiction && (
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white font-semibold mb-3">
                  Current Tax Rates - {jurisdictions.find(j => j.code === selectedJurisdiction)?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {jurisdictions.find(j => j.code === selectedJurisdiction) && (
                    <>
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Income Tax</p>
                        <p className="text-green-400 font-bold text-lg">
                          {(jurisdictions.find(j => j.code === selectedJurisdiction)!.rates.income * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Capital Gains</p>
                        <p className="text-blue-400 font-bold text-lg">
                          {(jurisdictions.find(j => j.code === selectedJurisdiction)!.rates.capitalGains * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/70 text-sm">Payroll Tax</p>
                        <p className="text-purple-400 font-bold text-lg">
                          {(jurisdictions.find(j => j.code === selectedJurisdiction)!.rates.payroll * 100).toFixed(2)}%
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tax Calculations List */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Recent Tax Calculations</h3>
              {taxCalculations.map((calculation, index) => (
                <motion.div
                  key={calculation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{calculation.transactionId}</h4>
                      <p className="text-white/60 text-sm">{calculation.jurisdiction}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getTypeColor(calculation.type)}>
                        {calculation.type.replace('_', ' ')}
                      </Badge>
                      <Badge className={getStatusColor(calculation.status)}>
                        {calculation.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-white/70">Transaction Amount:</span>
                      <p className="text-blue-400 font-medium">${parseFloat(calculation.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Tax Rate:</span>
                      <p className="text-purple-400 font-medium">{(calculation.taxRate * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-white/70">Tax Amount:</span>
                      <p className="text-red-400 font-medium">${parseFloat(calculation.taxAmount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Due Date:</span>
                      <p className="text-white font-medium">{calculation.dueDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white/70 text-xs">Blockchain Hash: </span>
                      <span className="text-white/90 text-xs font-mono">{calculation.blockchainHash}</span>
                    </div>
                    
                    {calculation.status === 'calculated' && (
                      <Button
                        onClick={() => withholdTax(calculation.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Withhold Tax
                      </Button>
                    )}
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
