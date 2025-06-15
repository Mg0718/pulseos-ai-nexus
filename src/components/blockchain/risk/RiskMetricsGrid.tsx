
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { RiskMetricCard } from "./RiskMetricCard";

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface RiskMetricsGridProps {
  riskMetrics: RiskMetric[];
}

export const RiskMetricsGrid = ({ riskMetrics }: RiskMetricsGridProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskMetrics.map((metric, index) => (
              <RiskMetricCard
                key={metric.id}
                metric={metric}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
