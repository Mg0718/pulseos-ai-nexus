
import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Shield, CheckCircle, AlertTriangle, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PaymentConfig {
  provider: 'stripe' | 'razorpay';
  apiKey: string;
  secretKey: string;
  webhookSecret: string;
  enabled: boolean;
}

export const PaymentIntegration = () => {
  const [paymentConfigs, setPaymentConfigs] = useState<Record<string, PaymentConfig>>({
    stripe: {
      provider: 'stripe',
      apiKey: '',
      secretKey: '',
      webhookSecret: '',
      enabled: false
    },
    razorpay: {
      provider: 'razorpay',
      apiKey: '',
      secretKey: '',
      webhookSecret: '',
      enabled: false
    }
  });

  const [testMode, setTestMode] = useState(true);

  const handleConfigUpdate = (provider: string, field: string, value: string | boolean) => {
    setPaymentConfigs(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const testConnection = async (provider: string) => {
    const config = paymentConfigs[provider];
    if (!config.apiKey || !config.secretKey) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${provider} connection successful!`);
    } catch (error) {
      toast.error(`Failed to connect to ${provider}`);
    }
  };

  const saveConfiguration = () => {
    // Save to backend
    toast.success('Payment configuration saved successfully');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Payment Integration</h2>
          <p className="text-white/70">Configure payment gateways and processing</p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="test-mode" className="text-white">Test Mode</Label>
          <Switch
            id="test-mode"
            checked={testMode}
            onCheckedChange={setTestMode}
          />
        </div>
      </motion.div>

      {/* Stripe Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Stripe Configuration
              </div>
              <Badge variant={paymentConfigs.stripe.enabled ? "default" : "secondary"}>
                {paymentConfigs.stripe.enabled ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stripe-api-key" className="text-white">Publishable Key</Label>
                <Input
                  id="stripe-api-key"
                  type="text"
                  placeholder="pk_test_..."
                  value={paymentConfigs.stripe.apiKey}
                  onChange={(e) => handleConfigUpdate('stripe', 'apiKey', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripe-secret-key" className="text-white">Secret Key</Label>
                <Input
                  id="stripe-secret-key"
                  type="password"
                  placeholder="sk_test_..."
                  value={paymentConfigs.stripe.secretKey}
                  onChange={(e) => handleConfigUpdate('stripe', 'secretKey', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-webhook" className="text-white">Webhook Secret</Label>
              <Input
                id="stripe-webhook"
                type="password"
                placeholder="whsec_..."
                value={paymentConfigs.stripe.webhookSecret}
                onChange={(e) => handleConfigUpdate('stripe', 'webhookSecret', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={paymentConfigs.stripe.enabled}
                  onCheckedChange={(checked) => handleConfigUpdate('stripe', 'enabled', checked)}
                />
                <Label className="text-white">Enable Stripe</Label>
              </div>
              <Button
                variant="outline"
                onClick={() => testConnection('stripe')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Razorpay Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Razorpay Configuration
              </div>
              <Badge variant={paymentConfigs.razorpay.enabled ? "default" : "secondary"}>
                {paymentConfigs.razorpay.enabled ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="razorpay-key-id" className="text-white">Key ID</Label>
                <Input
                  id="razorpay-key-id"
                  type="text"
                  placeholder="rzp_test_..."
                  value={paymentConfigs.razorpay.apiKey}
                  onChange={(e) => handleConfigUpdate('razorpay', 'apiKey', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="razorpay-secret" className="text-white">Key Secret</Label>
                <Input
                  id="razorpay-secret"
                  type="password"
                  placeholder="..."
                  value={paymentConfigs.razorpay.secretKey}
                  onChange={(e) => handleConfigUpdate('razorpay', 'secretKey', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="razorpay-webhook" className="text-white">Webhook Secret</Label>
              <Input
                id="razorpay-webhook"
                type="password"
                placeholder="Webhook secret"
                value={paymentConfigs.razorpay.webhookSecret}
                onChange={(e) => handleConfigUpdate('razorpay', 'webhookSecret', e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={paymentConfigs.razorpay.enabled}
                  onCheckedChange={(checked) => handleConfigUpdate('razorpay', 'enabled', checked)}
                />
                <Label className="text-white">Enable Razorpay</Label>
              </div>
              <Button
                variant="outline"
                onClick={() => testConnection('razorpay')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Payment Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Automatic Invoicing</p>
                  <p className="text-white/60 text-sm">Generate invoices automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Payment Reminders</p>
                  <p className="text-white/60 text-sm">Send automated payment reminders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Multi-Currency</p>
                  <p className="text-white/60 text-sm">Support multiple currencies</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Subscription Billing</p>
                  <p className="text-white/60 text-sm">Recurring payment support</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-end">
        <Button 
          onClick={saveConfiguration}
          className="bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};
