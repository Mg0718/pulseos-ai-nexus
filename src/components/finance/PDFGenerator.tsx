
import { motion } from "framer-motion";
import { Download, FileText, Mail, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  status: string;
  due_date: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

interface PDFGeneratorProps {
  invoice: Invoice;
}

export const PDFGenerator = ({ invoice }: PDFGeneratorProps) => {
  const generatePDF = async () => {
    try {
      // Simulate PDF generation
      toast.success('PDF generated successfully!');
      
      // Create a mock download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const sendByEmail = async () => {
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Invoice sent to ${invoice.client_email}`);
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Invoice Actions
            </div>
            <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
              {invoice.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={generatePDF}
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            
            <Button
              onClick={sendByEmail}
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send by Email
            </Button>
            
            <Button
              onClick={printInvoice}
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>

          {/* Invoice Preview */}
          <div className="mt-6 p-6 bg-white rounded-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                <p className="text-gray-600">#{invoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Due Date</p>
                <p className="font-semibold text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                <p className="text-gray-900 font-medium">{invoice.client_name}</p>
                <p className="text-gray-600">{invoice.client_email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
                <p className="text-gray-900 font-medium">Your Company</p>
                <p className="text-gray-600">company@example.com</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-900">Description</th>
                    <th className="text-right py-2 text-gray-900">Qty</th>
                    <th className="text-right py-2 text-gray-900">Rate</th>
                    <th className="text-right py-2 text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-gray-900">{item.description}</td>
                      <td className="text-right py-2 text-gray-900">{item.quantity}</td>
                      <td className="text-right py-2 text-gray-900">${item.rate}</td>
                      <td className="text-right py-2 text-gray-900">${item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    Total: ${invoice.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
