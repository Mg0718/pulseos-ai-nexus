
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FraudAlertCard } from "./FraudAlertCard";

interface FraudAlert {
  id: string;
  type: 'suspicious_pattern' | 'anomaly_detected' | 'velocity_breach' | 'geo_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

interface FraudAlertsSectionProps {
  fraudAlerts: FraudAlert[];
  onResolveAlert: (alertId: string) => void;
}

export const FraudAlertsSection = ({ fraudAlerts, onResolveAlert }: FraudAlertsSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Fraud Detection Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fraudAlerts.map((alert, index) => (
              <FraudAlertCard
                key={alert.id}
                alert={alert}
                index={index}
                onResolve={onResolveAlert}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
