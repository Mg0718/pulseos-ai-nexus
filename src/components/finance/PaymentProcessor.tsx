
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Shield, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  provider: 'stripe' | 'razorpay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  paymentMethodId?: string;
}

export const PaymentProcessor = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'card',
      provider: 'stripe',
      last4: '4242',
      brand: 'visa',
      isDefault: true
    }
  ]);

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    amount: 0,
    currency: 'USD',
    description: '',
    customerEmail: ''
  });

  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' }
  ];

  const processPayment = async () => {
    if (!paymentRequest.amount || !paymentRequest.customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate random success/failure
      const success = Math.random() > 0.2;
      
      if (success) {
        setPaymentStatus('success');
        toast.success('Payment processed successfully!');
      } else {
        setPaymentStatus('failed');
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast.error('Payment processing error');
    } finally {
      setProcessing(false);
      setTimeout(() => setPaymentStatus('idle'), 3000);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing': return Clock;
      case 'success': return CheckCircle2;
      case 'failed': return AlertCircle;
      default: return CreditCard;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'processing': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Payment Processor</h2>
        <p className="text-white/70">Process payments securely through multiple gateways</p>
      </motion.div>

      {/* Payment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <StatusIcon className={`w-5 h-5 mr-2 ${getStatusColor()}`} />
              Payment Details
              {paymentStatus !== 'idle' && (
                <Badge className="ml-2" variant={paymentStatus === 'success' ? 'default' : paymentStatus === 'failed' ? 'destructive' : 'secondary'}>
                  {paymentStatus}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={paymentRequest.amount || ''}
                  onChange={(e) => setPaymentRequest(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="bg-white/10 border-white/20 text-white"
                  disabled={processing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-white">Currency</Label>
                <Select 
                  value={paymentRequest.currency} 
                  onValueChange={(value) => setPaymentRequest(prev => ({ ...prev, currency: value }))}
                  disabled={processing}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-email" className="text-white">Customer Email *</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="customer@example.com"
                value={paymentRequest.customerEmail}
                onChange={(e) => setPaymentRequest(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                disabled={processing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Input
                id="description"
                placeholder="Payment description"
                value={paymentRequest.description}
                onChange={(e) => setPaymentRequest(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
                disabled={processing}
              />
            </div>

            <Button
              onClick={processPayment}
              disabled={processing || !paymentRequest.amount || !paymentRequest.customerEmail}
              className="w-full bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
            >
              {processing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Process Payment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Supported Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-white text-sm">Credit Cards</p>
                <p className="text-white/60 text-xs">Visa, Mastercard</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 mx-auto mb-2 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">UPI</span>
                </div>
                <p className="text-white text-sm">UPI</p>
                <p className="text-white/60 text-xs">Google Pay, PhonePe</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 mx-auto mb-2 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">NB</span>
                </div>
                <p className="text-white text-sm">Net Banking</p>
                <p className="text-white/60 text-xs">All major banks</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 mx-auto mb-2 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                <p className="text-white text-sm">Wallets</p>
                <p className="text-white/60 text-xs">PayPal, Paytm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
