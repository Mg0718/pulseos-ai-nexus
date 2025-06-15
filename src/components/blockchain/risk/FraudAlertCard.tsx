
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FraudAlert {
  id: string;
  type: 'suspicious_pattern' | 'anomaly_detected' | 'velocity_breach' | 'geo_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

interface FraudAlertCardProps {
  alert: FraudAlert;
  index: number;
  onResolve: (alertId: string) => void;
}

export const FraudAlertCard = ({ alert, index, onResolve }: FraudAlertCardProps) => {
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border ${
        alert.resolved ? 'bg-white/5 border-white/10 opacity-60' : 'bg-white/10 border-white/20'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-white/70" />
          <Badge className={getAlertColor(alert.severity)}>
            {alert.severity}
          </Badge>
          {alert.resolved && (
            <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
              Resolved
            </Badge>
          )}
        </div>
        <span className="text-white/60 text-sm">
          {alert.timestamp.toLocaleTimeString()}
        </span>
      </div>
      
      <p className="text-white/80 text-sm mb-3">{alert.description}</p>
      
      {!alert.resolved && (
        <Button
          onClick={() => onResolve(alert.id)}
          size="sm"
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          Mark as Resolved
        </Button>
      )}
    </motion.div>
  );
};
