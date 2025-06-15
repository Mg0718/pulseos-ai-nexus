
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, DollarSign } from "lucide-react";

interface FinancialHealthProps {
  metrics: {
    ruleOf40: number;
    roic: number;
    netProfit: number;
    totalRevenue: number;
  };
}

export const FinancialHealth = ({ metrics }: FinancialHealthProps) => {
  const profitMargin = metrics.totalRevenue > 0 ? (metrics.netProfit / metrics.totalRevenue) * 100 : 0;
  
  const healthMetrics = [
    {
      title: "Rule of 40",
      value: metrics.ruleOf40,
      target: 40,
      unit: "%",
      description: "Growth Rate + Profit Margin",
      icon: Target,
      color: metrics.ruleOf40 >= 40 ? "#10B981" : "#F59E0B"
    },
    {
      title: "ROIC",
      value: metrics.roic,
      target: 15,
      unit: "%",
      description: "Return on Invested Capital",
      icon: TrendingUp,
      color: metrics.roic >= 15 ? "#10B981" : "#F59E0B"
    },
    {
      title: "Profit Margin",
      value: profitMargin,
      target: 20,
      unit: "%",
      description: "Net Profit / Total Revenue",
      icon: DollarSign,
      color: profitMargin >= 20 ? "#10B981" : "#F59E0B"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {healthMetrics.map((metric, index) => (
            <div key={metric.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <metric.icon className="w-4 h-4 mr-2 text-white/70" />
                  <span className="text-white font-medium">{metric.title}</span>
                </div>
                <span className="text-white font-bold">
                  {metric.value.toFixed(1)}{metric.unit}
                </span>
              </div>
              <Progress 
                value={Math.min((metric.value / metric.target) * 100, 100)} 
                className="h-2"
                style={{
                  background: 'rgba(255,255,255,0.1)'
                }}
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>{metric.description}</span>
                <span>Target: {metric.target}{metric.unit}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};
