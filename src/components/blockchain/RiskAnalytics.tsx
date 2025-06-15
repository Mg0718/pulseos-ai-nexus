
import { useState, useEffect } from "react";
import { RiskMetricsOverview } from "./risk/RiskMetricsOverview";
import { RiskMetricsGrid } from "./risk/RiskMetricsGrid";
import { FraudAlertsSection } from "./risk/FraudAlertsSection";

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

  const resolveAlert = (alertId: string) => {
    setFraudAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const activeAlerts = fraudAlerts.filter(alert => !alert.resolved).length;

  return (
    <div className="space-y-6">
      <RiskMetricsOverview 
        complianceScore={complianceScore}
        activeAlerts={activeAlerts}
      />
      
      <RiskMetricsGrid riskMetrics={riskMetrics} />
      
      <FraudAlertsSection 
        fraudAlerts={fraudAlerts}
        onResolveAlert={resolveAlert}
      />
    </div>
  );
};
