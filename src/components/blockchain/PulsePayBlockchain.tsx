import React, { useState } from 'react';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { PaymentContract } from '@/lib/blockchain/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';

const PulsePayBlockchain = () => {
  const { createPaymentContract } = useBlockchain();
  const [payeeAddress, setPayeeAddress] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [contracts, setContracts] = useState<PaymentContract[]>([]);

  const handleCreateContract = async () => {
    try {
      const milestones = [
        {
          name: "Project Milestone 1",
          description: "Initial project phase completion",
          amount: "2500",
          dueDate: Date.now() + (14 * 24 * 60 * 60 * 1000) // 14 days
        },
        {
          name: "Project Milestone 2", 
          description: "Final project delivery",
          amount: "2500",
          dueDate: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        }
      ];
      
      const contract = await createPaymentContract(payeeAddress, totalAmount, milestones);
      setContracts(prev => [...prev, contract]);
      
      // Reset form
      setPayeeAddress('');
      setTotalAmount('');
    } catch (error) {
      console.error('Failed to create contract:', error);
    }
  };

  return (
    <div>
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Create Payment Contract</CardTitle>
          <CardDescription className="text-white/70">
            Define contract details and milestones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-white/70 text-sm block mb-2">Payee Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={payeeAddress}
              onChange={(e) => setPayeeAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white/70 text-sm block mb-2">Total Amount</label>
            <Input
              type="text"
              placeholder="Amount in USD"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateContract}>Create Contract</Button>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Existing Contracts</h2>
        {contracts.length > 0 ? (
          <ul>
            {contracts.map((contract) => (
              <li key={contract.id} className="text-white/70">
                Contract ID: {contract.id}, Payee: {contract.payee}, Amount: {contract.totalAmount}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/70">No contracts created yet.</p>
        )}
      </div>
    </div>
  );
};

export default PulsePayBlockchain;
