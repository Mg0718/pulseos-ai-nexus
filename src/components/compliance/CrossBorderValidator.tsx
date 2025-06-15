
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, AlertCircle, CheckCircle, FileText, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RegulatoryEngine } from "@/lib/compliance/regulatoryEngine";

export const CrossBorderValidator = () => {
  const [regulatoryEngine] = useState(() => new RegulatoryEngine());
  const [fromJurisdiction, setFromJurisdiction] = useState('');
  const [toJurisdiction, setToJurisdiction] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const jurisdictions = [
    { code: 'US', name: 'United States' },
    { code: 'EU', name: 'European Union' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'SG', name: 'Singapore' },
    { code: 'JP', name: 'Japan' }
  ];

  const transactionTypes = [
    { value: 'payment', label: 'Payment' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'invoice', label: 'Invoice Payment' },
    { value: 'transfer', label: 'Fund Transfer' },
    { value: 'investment', label: 'Investment' }
  ];

  const validateTransaction = async () => {
    if (!fromJurisdiction || !toJurisdiction || !amount || !transactionType) {
      return;
    }

    setIsValidating(true);
    
    try {
      const result = await regulatoryEngine.validateCrossBorderTransaction(
        fromJurisdiction,
        toJurisdiction,
        parseFloat(amount),
        transactionType
      );
      
      setValidationResult(result);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
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
              <Globe className="w-5 h-5" />
              Cross-Border Transaction Validator
            </CardTitle>
            <p className="text-white/70 text-sm">
              Validate international transactions against regulatory requirements
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white font-medium">From Jurisdiction:</label>
                <Select value={fromJurisdiction} onValueChange={setFromJurisdiction}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select origin" />
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
                <label className="text-white font-medium">To Jurisdiction:</label>
                <Select value={toJurisdiction} onValueChange={setToJurisdiction}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select destination" />
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
                <label className="text-white font-medium">Transaction Type:</label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium">Amount (USD):</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <Button
              onClick={validateTransaction}
              disabled={isValidating || !fromJurisdiction || !toJurisdiction || !amount || !transactionType}
              className="w-full bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
            >
              {isValidating ? 'Validating...' : 'Validate Transaction'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {validationResult.allowed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                Validation Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={validationResult.allowed ? 
                  'bg-green-500/20 text-green-300 border-green-500/30' : 
                  'bg-red-500/20 text-red-300 border-red-500/30'
                }>
                  {validationResult.allowed ? 'Transaction Allowed' : 'Transaction Blocked'}
                </Badge>
              </div>

              {validationResult.requirements.length > 0 && (
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Required Documentation
                  </h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    {validationResult.requirements.map((req: string, index: number) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <h4 className="text-yellow-300 font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Warnings
                  </h4>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    {validationResult.warnings.map((warning: string, index: number) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(validationResult.taxImplications).length > 0 && (
                <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <h4 className="text-purple-300 font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Tax Implications
                  </h4>
                  <div className="text-purple-200 text-sm space-y-2">
                    {validationResult.taxImplications.withholding !== undefined && (
                      <div>Withholding Tax: {validationResult.taxImplications.withholding * 100}%</div>
                    )}
                    {validationResult.taxImplications.reporting && (
                      <div>Reporting Required: Yes</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
