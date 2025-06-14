
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, TrendingUp } from "lucide-react";

interface Metrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalExpenses: number;
  netProfit: number;
  overdueInvoices: number;
  pendingPayments: number;
}

interface FinancialHealthProps {
  metrics: Metrics;
}

export const FinancialHealth = ({ metrics }: FinancialHealthProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Financial Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <span className="text-white">Overdue Invoices</span>
              </div>
              <Badge variant="destructive">{metrics.overdueInvoices}</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-white">Pending Payments</span>
              </div>
              <span className="text-white font-medium">${metrics.pendingPayments.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white">Monthly Growth</span>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                +12.5%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
