
import { motion } from "framer-motion";
import { TrendingUp, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface RiskMetricCardProps {
  metric: RiskMetric;
  index: number;
}

export const RiskMetricCard = ({ metric, index }: RiskMetricCardProps) => {
  const getMetricColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAlertColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-green-400 rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 bg-white/5 rounded-lg border border-white/10"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-medium">{metric.name}</h4>
        <div className="flex items-center gap-2">
          {getTrendIcon(metric.trend)}
          <Badge className={getAlertColor(metric.status)}>
            {metric.status}
          </Badge>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white/70">Current</span>
          <span className={`font-medium ${getMetricColor(metric.status)}`}>
            {metric.value.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              metric.status === 'low' ? 'bg-green-400' :
              metric.status === 'medium' ? 'bg-yellow-400' :
              metric.status === 'high' ? 'bg-orange-400' : 'bg-red-400'
            }`}
            style={{ width: `${(metric.value / 100) * 100}%` }}
          />
        </div>
      </div>
      
      <p className="text-white/60 text-xs">{metric.description}</p>
    </motion.div>
  );
};
