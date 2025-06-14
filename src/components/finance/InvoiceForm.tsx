
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  description: string;
  created_at: string;
  created_by?: string;
}

interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSave: (invoice: Partial<Invoice>) => void;
}

export const InvoiceForm = ({ invoice, onSave }: InvoiceFormProps) => {
  const [formData, setFormData] = useState({
    client_name: invoice?.client_name || '',
    client_email: invoice?.client_email || '',
    amount: invoice?.amount || 0,
    currency: invoice?.currency || 'USD',
    due_date: invoice?.due_date || '',
    description: invoice?.description || '',
    status: invoice?.status || 'draft'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Client Name</label>
          <Input
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Client Email</label>
          <Input
            type="email"
            value={formData.client_email}
            onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Amount</label>
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Due Date</label>
          <Input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
        {invoice ? 'Update' : 'Create'} Invoice
      </Button>
    </form>
  );
};
