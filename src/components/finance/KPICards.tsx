
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Calculator } from "lucide-react";

interface Metrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalExpenses: number;
  netProfit: number;
  overdueInvoices: number;
  pendingPayments: number;
}

interface KPICardsProps {
  metrics: Metrics;
}

export const KPICards = ({ metrics }: KPICardsProps) => {
  const ruleOf40 = ((metrics.monthlyRevenue * 12 - metrics.totalRevenue) / metrics.totalRevenue * 100) + 
                   (metrics.netProfit / metrics.totalRevenue * 100);
  
  const roic = metrics.totalRevenue > 0 ? (metrics.netProfit / metrics.totalRevenue * 100) : 0;

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      trend: "+12.5%",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Net Profit",
      value: `$${metrics.netProfit.toLocaleString()}`,
      trend: "+8.2%",
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      title: "Rule of 40",
      value: `${ruleOf40.toFixed(1)}%`,
      trend: "Healthy",
      icon: Calculator,
      color: "text-purple-400"
    },
    {
      title: "ROIC",
      value: `${roic.toFixed(1)}%`,
      trend: "+2.1%",
      icon: TrendingDown,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                <Badge variant="outline" className="text-white border-white/20">
                  {kpi.trend}
                </Badge>
              </div>
              <p className="text-white/70 text-sm">{kpi.title}</p>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
