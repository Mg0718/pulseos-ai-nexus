import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/contexts/BlockchainContext';

interface Invoice {
  id: string;
  client_name: string;
  client_email: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
}

const InvoiceAutomation = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { createPaymentContract } = useBlockchain();

  useEffect(() => {
    // Mock invoices for demonstration
    const mockInvoices: Invoice[] = [
      {
        id: "INV-2024-001",
        client_name: "Acme Corp",
        client_email: "billing@acmecorp.com",
        amount: 5000,
        due_date: "2024-07-30",
        status: "pending"
      },
      {
        id: "INV-2024-002",
        client_name: "Beta Co",
        client_email: "finance@betaco.com",
        amount: 7500,
        due_date: "2024-08-15",
        status: "pending"
      }
    ];
    setInvoices(mockInvoices);
  }, []);

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCreateContract = async () => {
    if (!selectedInvoice) return;
    
    try {
      const milestones = [
        {
          name: "Invoice Payment",
          description: `Payment for invoice ${selectedInvoice.id}`,
          amount: selectedInvoice.amount.toString(),
          dueDate: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      ];
      
      await createPaymentContract(selectedInvoice.client_email, selectedInvoice.amount.toString(), milestones);
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Failed to create payment contract:', error);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Invoice Automation</CardTitle>
        <CardDescription className="text-white/70">
          Automate invoice payments using blockchain-based smart contracts.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="invoice">Select Invoice</Label>
          <select
            id="invoice"
            className="bg-white/10 border-white/20 rounded px-4 py-2 text-white"
            onChange={(e) => {
              const invoiceId = e.target.value;
              const invoice = invoices.find((inv) => inv.id === invoiceId);
              if (invoice) {
                handleInvoiceSelect(invoice);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select an invoice
            </option>
            {invoices.map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.id} - {invoice.client_name}
              </option>
            ))}
          </select>
        </div>

        {selectedInvoice && (
          <div className="border p-4 rounded-md border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">
              Invoice Details
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-white/70">Client Name</Label>
                <Input
                  type="text"
                  value={selectedInvoice.client_name}
                  readOnly
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white/70">Client Email</Label>
                <Input
                  type="email"
                  value={selectedInvoice.client_email}
                  readOnly
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white/70">Amount</Label>
                <Input
                  type="number"
                  value={selectedInvoice.amount}
                  readOnly
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white/70">Due Date</Label>
                <Input
                  type="date"
                  value={selectedInvoice.due_date}
                  readOnly
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={handleCreateContract}>
              Create Payment Contract
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceAutomation;
