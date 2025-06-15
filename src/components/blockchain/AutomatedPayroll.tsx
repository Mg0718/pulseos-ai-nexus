
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, DollarSign, Calculator, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBlockchain } from "@/contexts/BlockchainContext";

interface PayrollContract {
  id: string;
  employeeId: string;
  employeeName: string;
  salary: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  performanceBonus: string;
  taxWithholding: string;
  nextPayment: Date;
  status: 'active' | 'paused' | 'completed';
  contractAddress: string;
}

export const AutomatedPayroll = () => {
  const { isWalletConnected, processBlockchainPayroll, loading } = useBlockchain();
  const [payrollContracts, setPayrollContracts] = useState<PayrollContract[]>([]);
  const [newContract, setNewContract] = useState({
    employeeName: '',
    employeeId: '',
    salary: '',
    frequency: 'monthly' as const,
    performanceBonus: ''
  });

  useEffect(() => {
    loadPayrollContracts();
  }, []);

  const loadPayrollContracts = () => {
    // Mock payroll contracts
    const mockContracts: PayrollContract[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        salary: '5000',
        frequency: 'monthly',
        performanceBonus: '500',
        taxWithholding: '1100',
        nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'active',
        contractAddress: '0xContract123...abc'
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        salary: '4500',
        frequency: 'biweekly',
        performanceBonus: '300',
        taxWithholding: '900',
        nextPayment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'active',
        contractAddress: '0xContract456...def'
      }
    ];
    setPayrollContracts(mockContracts);
  };

  const createPayrollContract = async () => {
    if (!newContract.employeeName || !newContract.salary) return;

    const contract: PayrollContract = {
      id: Date.now().toString(),
      employeeId: newContract.employeeId || `EMP${Date.now().toString().slice(-3)}`,
      employeeName: newContract.employeeName,
      salary: newContract.salary,
      frequency: newContract.frequency,
      performanceBonus: newContract.performanceBonus || '0',
      taxWithholding: (parseFloat(newContract.salary) * 0.22).toString(), // 22% tax rate
      nextPayment: getNextPaymentDate(newContract.frequency),
      status: 'active',
      contractAddress: `0x${Math.random().toString(16).substring(2, 42)}`
    };

    setPayrollContracts(prev => [contract, ...prev]);
    setNewContract({ employeeName: '', employeeId: '', salary: '', frequency: 'monthly', performanceBonus: '' });
  };

  const getNextPaymentDate = (frequency: string): Date => {
    const now = new Date();
    switch (frequency) {
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'biweekly':
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
      default:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  };

  const executePayroll = async () => {
    if (!isWalletConnected) return;

    const employees = payrollContracts
      .filter(contract => contract.status === 'active')
      .map(contract => ({
        employeeId: contract.employeeId,
        amount: (parseFloat(contract.salary) + parseFloat(contract.performanceBonus) - parseFloat(contract.taxWithholding)).toString(),
        currency: 'USD',
        metadata: {
          contractId: contract.id,
          grossSalary: contract.salary,
          bonus: contract.performanceBonus,
          taxWithholding: contract.taxWithholding
        }
      }));

    try {
      await processBlockchainPayroll(employees);
    } catch (error) {
      console.error('Payroll execution failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
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
              <Users className="w-5 h-5" />
              Automated Payroll Contracts
            </CardTitle>
            <p className="text-white/70 text-sm">
              Smart contract-based payroll with automated tax calculation and performance bonuses
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payroll Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">Active Contracts</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {payrollContracts.filter(c => c.status === 'active').length}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Monthly Total</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  ${payrollContracts.reduce((sum, c) => sum + parseFloat(c.salary), 0).toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">Tax Withheld</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  ${payrollContracts.reduce((sum, c) => sum + parseFloat(c.taxWithholding), 0).toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-medium">Next Run</span>
                </div>
                <p className="text-lg font-bold text-orange-400">3 days</p>
              </div>
            </div>

            {/* Create New Contract */}
            {isWalletConnected && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Create Payroll Contract</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName" className="text-white">Employee Name</Label>
                    <Input
                      id="employeeName"
                      placeholder="John Doe"
                      value={newContract.employeeName}
                      onChange={(e) => setNewContract(prev => ({ ...prev, employeeName: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-white">Employee ID (Optional)</Label>
                    <Input
                      id="employeeId"
                      placeholder="EMP001"
                      value={newContract.employeeId}
                      onChange={(e) => setNewContract(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary" className="text-white">Monthly Salary (USD)</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="5000"
                      value={newContract.salary}
                      onChange={(e) => setNewContract(prev => ({ ...prev, salary: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency" className="text-white">Payment Frequency</Label>
                    <Select value={newContract.frequency} onValueChange={(value: any) => setNewContract(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="performanceBonus" className="text-white">Performance Bonus (USD)</Label>
                    <Input
                      id="performanceBonus"
                      type="number"
                      placeholder="500"
                      value={newContract.performanceBonus}
                      onChange={(e) => setNewContract(prev => ({ ...prev, performanceBonus: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={createPayrollContract}
                    disabled={loading || !newContract.employeeName || !newContract.salary}
                    className="bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Create Contract
                  </Button>
                  
                  <Button
                    onClick={executePayroll}
                    disabled={loading || payrollContracts.filter(c => c.status === 'active').length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Execute Payroll
                  </Button>
                </div>
              </div>
            )}

            {/* Payroll Contracts List */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Active Contracts</h3>
              {payrollContracts.map((contract, index) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{contract.employeeName}</h4>
                      <p className="text-white/60 text-sm">ID: {contract.employeeId}</p>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">Salary:</span>
                      <p className="text-green-400 font-medium">${parseFloat(contract.salary).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Bonus:</span>
                      <p className="text-blue-400 font-medium">${parseFloat(contract.performanceBonus).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Tax Withheld:</span>
                      <p className="text-red-400 font-medium">${parseFloat(contract.taxWithholding).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Next Payment:</span>
                      <p className="text-white font-medium">{contract.nextPayment.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-white/70 text-xs">Contract: </span>
                    <span className="text-white/90 text-xs font-mono">{contract.contractAddress}</span>
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
