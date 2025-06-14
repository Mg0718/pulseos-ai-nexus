
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { InvoiceForm } from "@/components/finance/InvoiceForm";
import { InvoiceSummaryCards } from "@/components/finance/InvoiceSummaryCards";
import { InvoicesTable } from "@/components/finance/InvoicesTable";

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

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices' as any)
        .select('*')
        .order('created_at', { ascending: false }) as { data: Invoice[] | null, error: any };

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInvoice = async (invoice: Partial<Invoice>) => {
    try {
      if (editingInvoice) {
        const { error } = await supabase
          .from('invoices' as any)
          .update(invoice)
          .eq('id', editingInvoice.id);

        if (error) throw error;
        toast.success('Invoice updated successfully');
      } else {
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
        const { error } = await supabase
          .from('invoices' as any)
          .insert([{ 
            ...invoice, 
            invoice_number: invoiceNumber,
            created_by: user?.id 
          }]);

        if (error) throw error;
        toast.success('Invoice created successfully');
      }

      fetchInvoices();
      setEditingInvoice(null);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    }
  };

  const handleStatusUpdate = async (invoiceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('invoices' as any)
        .update({ status: newStatus })
        .eq('id', invoiceId);

      if (error) throw error;
      toast.success('Invoice status updated');
      fetchInvoices();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 flex items-center justify-center">
        <div className="text-white">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Invoice Management</h1>
              <p className="text-white/70">Create, track, and manage client invoices</p>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-white/20 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <InvoiceForm onSave={handleSaveInvoice} />
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <InvoiceSummaryCards invoices={invoices} />

        <InvoicesTable 
          invoices={invoices}
          onEdit={setEditingInvoice}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Edit Dialog */}
        {editingInvoice && (
          <Dialog open={!!editingInvoice} onOpenChange={() => setEditingInvoice(null)}>
            <DialogContent className="bg-gray-900 text-white border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Invoice</DialogTitle>
              </DialogHeader>
              <InvoiceForm invoice={editingInvoice} onSave={handleSaveInvoice} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Invoices;
