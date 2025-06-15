
import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface RiskMetricsOverviewProps {
  complianceScore: number;
  activeAlerts: number;
}

export const RiskMetricsOverview = ({ complianceScore, activeAlerts }: RiskMetricsOverviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            ML-Powered Risk Analytics
          </CardTitle>
          <p className="text-white/70 text-sm">
            Real-time fraud detection and compliance monitoring
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-green-400">{complianceScore}%</div>
              <div className="text-white/70 text-sm">Compliance Score</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{activeAlerts}</div>
              <div className="text-white/70 text-sm">Active Alerts</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-purple-400">847</div>
              <div className="text-white/70 text-sm">Transactions Analyzed</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-orange-400">0.03%</div>
              <div className="text-white/70 text-sm">False Positive Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
