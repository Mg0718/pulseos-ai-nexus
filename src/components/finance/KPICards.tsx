
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardsProps {
  metrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalExpenses: number;
    netProfit: number;
    overdueInvoices: number;
    pendingPayments: number;
    ruleOf40: number;
    roic: number;
    burnRate: number;
  };
}

export const KPICards = ({ metrics }: KPICardsProps) => {
  const kpis = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: metrics.monthlyRevenue > 0 ? "up" : "down",
      trendValue: `+${((metrics.monthlyRevenue / (metrics.totalRevenue || 1)) * 100).toFixed(1)}%`,
      color: "from-[#6F2DBD] to-[#A663CC]"
    },
    {
      title: "Net Profit",
      value: `$${metrics.netProfit.toLocaleString()}`,
      icon: metrics.netProfit >= 0 ? TrendingUp : TrendingDown,
      trend: metrics.netProfit >= 0 ? "up" : "down",
      trendValue: `${metrics.netProfit >= 0 ? '+' : ''}${((metrics.netProfit / (metrics.totalRevenue || 1)) * 100).toFixed(1)}%`,
      color: metrics.netProfit >= 0 ? "from-[#10B981] to-[#34D399]" : "from-[#EF4444] to-[#F87171]"
    },
    {
      title: "Rule of 40",
      value: `${metrics.ruleOf40.toFixed(1)}%`,
      icon: TrendingUp,
      trend: metrics.ruleOf40 >= 40 ? "up" : "down",
      trendValue: metrics.ruleOf40 >= 40 ? "Healthy" : "Below Target",
      color: metrics.ruleOf40 >= 40 ? "from-[#10B981] to-[#34D399]" : "from-[#F59E0B] to-[#FBBF24]"
    },
    {
      title: "ROIC",
      value: `${metrics.roic.toFixed(1)}%`,
      icon: TrendingUp,
      trend: metrics.roic > 0 ? "up" : "down",
      trendValue: `${metrics.roic > 0 ? 'Positive' : 'Negative'} Returns`,
      color: "from-[#A663CC] to-[#B298DC]"
    },
    {
      title: "Burn Rate",
      value: `$${metrics.burnRate.toLocaleString()}/mo`,
      icon: TrendingDown,
      trend: "down",
      trendValue: "Monthly Expenses",
      color: "from-[#EF4444] to-[#F87171]"
    },
    {
      title: "Overdue Invoices",
      value: metrics.overdueInvoices.toString(),
      icon: AlertTriangle,
      trend: metrics.overdueInvoices > 0 ? "down" : "up",
      trendValue: metrics.overdueInvoices > 0 ? "Needs Attention" : "All Clear",
      color: metrics.overdueInvoices > 0 ? "from-[#EF4444] to-[#F87171]" : "from-[#10B981] to-[#34D399]"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm ${
                  kpi.trend === "up" ? "text-green-400" : "text-red-400"
                }`}>
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {kpi.trendValue}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/70 mb-1">{kpi.title}</h3>
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
