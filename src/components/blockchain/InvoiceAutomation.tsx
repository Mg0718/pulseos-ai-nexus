
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Zap, CheckCircle2, Clock, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBlockchain } from "@/contexts/BlockchainContext";

interface AutomatedInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: string;
  dueDate: Date;
  approvalRule: 'auto' | 'manual' | 'threshold';
  threshold: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  contractAddress: string;
  createdAt: Date;
}

interface ApprovalRule {
  id: string;
  name: string;
  type: 'auto_approve' | 'amount_threshold' | 'client_whitelist';
  conditions: any;
  enabled: boolean;
}

export const InvoiceAutomation = () => {
  const { isWalletConnected, createPaymentContract, loading } = useBlockchain();
  const [invoices, setInvoices] = useState<AutomatedInvoice[]>([]);
  const [approvalRules, setApprovalRules] = useState<ApprovalRule[]>([]);
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    amount: '',
    approvalRule: 'auto' as const,
    threshold: ''
  });

  useEffect(() => {
    loadInvoices();
    loadApprovalRules();
  }, []);

  const loadInvoices = () => {
    // Mock automated invoices
    const mockInvoices: AutomatedInvoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        clientName: 'Tech Corp Inc.',
        amount: '15000',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        approvalRule: 'auto',
        threshold: '10000',
        status: 'approved',
        contractAddress: '0xInvoice123...abc',
        createdAt: new Date()
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        clientName: 'StartupXYZ',
        amount: '5000',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        approvalRule: 'threshold',
        threshold: '7500',
        status: 'pending',
        contractAddress: '0xInvoice456...def',
        createdAt: new Date()
      }
    ];
    setInvoices(mockInvoices);
  };

  const loadApprovalRules = () => {
    const mockRules: ApprovalRule[] = [
      {
        id: '1',
        name: 'Auto-approve under $10K',
        type: 'amount_threshold',
        conditions: { maxAmount: 10000 },
        enabled: true
      },
      {
        id: '2',
        name: 'Trusted client whitelist',
        type: 'client_whitelist',
        conditions: { clients: ['Tech Corp Inc.', 'Enterprise Solutions'] },
        enabled: true
      },
      {
        id: '3',
        name: 'Auto-approve all invoices',
        type: 'auto_approve',
        conditions: {},
        enabled: false
      }
    ];
    setApprovalRules(mockRules);
  };

  const createAutomatedInvoice = async () => {
    if (!newInvoice.clientName || !newInvoice.amount) return;

    const invoice: AutomatedInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: newInvoice.clientName,
      amount: newInvoice.amount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      approvalRule: newInvoice.approvalRule,
      threshold: newInvoice.threshold || '0',
      status: determineInitialStatus(newInvoice),
      contractAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      createdAt: new Date()
    };

    // Create smart contract for the invoice
    if (isWalletConnected && invoice.status === 'approved') {
      try {
        await createPaymentContract(
          '0xClient123...abc', // Mock client address
          invoice.amount,
          [{
            description: `Payment for ${invoice.invoiceNumber}`,
            amount: invoice.amount,
            dueDate: invoice.dueDate.getTime()
          }]
        );
      } catch (error) {
        console.error('Failed to create payment contract:', error);
      }
    }

    setInvoices(prev => [invoice, ...prev]);
    setNewInvoice({ clientName: '', amount: '', approvalRule: 'auto', threshold: '' });
  };

  const determineInitialStatus = (invoiceData: typeof newInvoice): 'pending' | 'approved' => {
    const amount = parseFloat(invoiceData.amount);
    
    // Check approval rules
    for (const rule of approvalRules) {
      if (!rule.enabled) continue;
      
      switch (rule.type) {
        case 'auto_approve':
          return 'approved';
        case 'amount_threshold':
          if (amount <= rule.conditions.maxAmount) return 'approved';
          break;
        case 'client_whitelist':
          if (rule.conditions.clients.includes(invoiceData.clientName)) return 'approved';
          break;
      }
    }
    
    return 'pending';
  };

  const approveInvoice = async (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'approved' as const } : inv
    ));
  };

  const processPayment = async (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'paid' as const } : inv
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'paid': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'auto_approve': return 'bg-green-500/20 text-green-300';
      case 'amount_threshold': return 'bg-blue-500/20 text-blue-300';
      case 'client_whitelist': return 'bg-purple-500/20 text-purple-300';
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
              <Zap className="w-5 h-5" />
              Invoice-to-Payment Automation
            </CardTitle>
            <p className="text-white/70 text-sm">
              Smart contract-based invoice processing with automatic approval workflows
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invoice Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">Total Invoices</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">{invoices.length}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Auto-Approved</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {invoices.filter(i => i.status === 'approved').length}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Pending</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {invoices.filter(i => i.status === 'pending').length}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">Total Value</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  ${invoices.reduce((sum, i) => sum + parseFloat(i.amount), 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Approval Rules */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Active Approval Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {approvalRules.map((rule) => (
                  <div key={rule.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{rule.name}</h4>
                      <Badge className={rule.enabled ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                    <Badge className={getRuleTypeColor(rule.type)}>
                      {rule.type.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Invoice */}
            {isWalletConnected && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Create Automated Invoice</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="text-white">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="Tech Corp Inc."
                      value={newInvoice.clientName}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="15000"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approvalRule" className="text-white">Approval Rule</Label>
                    <Select value={newInvoice.approvalRule} onValueChange={(value: any) => setNewInvoice(prev => ({ ...prev, approvalRule: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-approve</SelectItem>
                        <SelectItem value="threshold">Amount threshold</SelectItem>
                        <SelectItem value="manual">Manual approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold" className="text-white">Threshold (if applicable)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      placeholder="10000"
                      value={newInvoice.threshold}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, threshold: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={createAutomatedInvoice}
                  disabled={loading || !newInvoice.clientName || !newInvoice.amount}
                  className="bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Create Automated Invoice
                </Button>
              </div>
            )}

            {/* Invoices List */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Recent Invoices</h3>
              {invoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{invoice.invoiceNumber}</h4>
                      <p className="text-white/60 text-sm">{invoice.clientName}</p>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-white/70">Amount:</span>
                      <p className="text-green-400 font-medium">${parseFloat(invoice.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Due Date:</span>
                      <p className="text-white font-medium">{invoice.dueDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Rule:</span>
                      <p className="text-blue-400 font-medium">{invoice.approvalRule}</p>
                    </div>
                    <div>
                      <span className="text-white/70">Created:</span>
                      <p className="text-white font-medium">{invoice.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {invoice.status === 'pending' && (
                      <Button
                        onClick={() => approveInvoice(invoice.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    
                    {invoice.status === 'approved' && (
                      <Button
                        onClick={() => processPayment(invoice.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Process Payment
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-white/70 text-xs">Contract: </span>
                    <span className="text-white/90 text-xs font-mono">{invoice.contractAddress}</span>
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
