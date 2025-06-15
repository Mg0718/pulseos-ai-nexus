
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Shield, AlertTriangle, Eye, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface FraudAlert {
  id: string;
  type: 'suspicious_pattern' | 'anomaly_detected' | 'velocity_breach' | 'geo_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export const RiskAnalytics = () => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [complianceScore, setComplianceScore] = useState(92);

  useEffect(() => {
    loadRiskMetrics();
    loadFraudAlerts();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateRiskMetrics();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadRiskMetrics = () => {
    const metrics: RiskMetric[] = [
      {
        id: '1',
        name: 'Transaction Velocity',
        value: 85,
        threshold: 90,
        status: 'medium',
        trend: 'up',
        description: 'Rate of transaction processing vs historical baseline'
      },
      {
        id: '2',
        name: 'Anomaly Detection',
        value: 12,
        threshold: 20,
        status: 'low',
        trend: 'stable',
        description: 'ML-detected unusual transaction patterns'
      },
      {
        id: '3',
        name: 'Geographic Risk',
        value: 25,
        threshold: 30,
        status: 'medium',
        trend: 'down',
        description: 'Risk based on transaction geographic distribution'
      },
      {
        id: '4',
        name: 'Behavioral Analysis',
        value: 95,
        threshold: 80,
        status: 'high',
        trend: 'up',
        description: 'User behavior deviation from established patterns'
      }
    ];
    setRiskMetrics(metrics);
  };

  const loadFraudAlerts = () => {
    const alerts: FraudAlert[] = [
      {
        id: '1',
        type: 'velocity_breach',
        severity: 'high',
        description: 'Unusual payment velocity detected: 15 transactions in 2 minutes',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        resolved: false
      },
      {
        id: '2',
        type: 'geo_anomaly',
        severity: 'medium',
        description: 'Payment initiated from new geographic location: Singapore',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        resolved: false
      },
      {
        id: '3',
        type: 'suspicious_pattern',
        severity: 'low',
        description: 'Recurring small payments to new recipient detected',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resolved: true
      }
    ];
    setFraudAlerts(alerts);
  };

  const updateRiskMetrics = () => {
    setRiskMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10))
    })));
    
    setComplianceScore(prev => Math.max(85, Math.min(100, prev + (Math.random() - 0.5) * 2)));
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
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

  const resolveAlert = (alertId: string) => {
    setFraudAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="space-y-6">
      {/* ML Risk Analytics Header */}
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
                <div className="text-2xl font-bold text-blue-400">
                  {fraudAlerts.filter(a => !a.resolved).length}
                </div>
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

      {/* Risk Metrics */}
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
                <motion.div
                  key={metric.id}
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
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fraud Alerts */}
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
                <motion.div
                  key={alert.id}
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
                      onClick={() => resolveAlert(alert.id)}
                      size="sm"
                      variant="outline"
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      Mark as Resolved
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
