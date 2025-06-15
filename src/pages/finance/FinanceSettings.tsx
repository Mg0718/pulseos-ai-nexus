
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, CreditCard, Brain, Zap, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentIntegration } from "@/components/finance/PaymentIntegration";
import { FinancialInsights } from "@/components/finance/FinancialInsights";
import { PaymentProcessor } from "@/components/finance/PaymentProcessor";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FinanceSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Finance Settings</h1>
              <p className="text-white/70 text-lg">Configure payment integrations, AI insights, and financial automation</p>
            </div>
            <Button
              onClick={() => navigate('/finance/blockchain')}
              className="bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Blockchain Finance
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="integrations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl border-white/20">
              <TabsTrigger 
                value="integrations" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                <CreditCard className="w-4 h-4" />
                Payment Integration
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                <Brain className="w-4 h-4" />
                AI Insights
              </TabsTrigger>
              <TabsTrigger 
                value="processor" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
              >
                <Zap className="w-4 h-4" />
                Payment Processor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="integrations" className="space-y-6">
              <PaymentIntegration />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <FinancialInsights />
            </TabsContent>

            <TabsContent value="processor" className="space-y-6">
              <PaymentProcessor />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default FinanceSettings;
