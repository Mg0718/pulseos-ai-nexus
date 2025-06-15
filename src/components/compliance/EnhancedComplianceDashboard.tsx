
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  FileText,
  Globe,
  Eye,
  Target,
  Activity,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RegulatoryEngine, ComplianceFramework, RegulatoryAlert } from "@/lib/compliance/regulatoryEngine";

export const EnhancedComplianceDashboard = () => {
  const [regulatoryEngine] = useState(() => new RegulatoryEngine());
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    loadComplianceData();
    startRealTimeMonitoring();
  }, []);

  const loadComplianceData = async () => {
    const frameworkData = regulatoryEngine.getFrameworks();
    const alertData = regulatoryEngine.getAlerts();
    const score = await regulatoryEngine.getComplianceScore();

    setFrameworks(frameworkData);
    setAlerts(alertData);
    setOverallScore(score);
  };

  const startRealTimeMonitoring = async () => {
    setIsMonitoring(true);
    
    // Simulate real-time monitoring
    const interval = setInterval(async () => {
      const newAlerts = await regulatoryEngine.performRealTimeMonitoring();
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  };

  const resolveAlert = async (alertId: string) => {
    await regulatoryEngine.resolveAlert(alertId);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const generateComplianceReport = async () => {
    const report = await regulatoryEngine.generateComplianceReport();
    console.log('Compliance Report Generated:', report);
    // In a real implementation, this would download a PDF or open a new window
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'at_risk': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'non_compliant': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Monitoring Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Enhanced Regulatory Compliance Dashboard
              {isMonitoring && (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm">Live Monitoring</span>
                </div>
              )}
            </CardTitle>
            <p className="text-white/70 text-sm">
              Real-time GDPR, SOC2, PCI-DSS monitoring with AI-powered threat detection
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-green-400">{overallScore}%</div>
                <div className="text-white/70 text-sm">Overall Compliance</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-blue-400">
                  {frameworks.filter(f => f.status === 'compliant').length}
                </div>
                <div className="text-white/70 text-sm">Compliant Frameworks</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-red-400">
                  {alerts.filter(a => a.severity === 'critical').length}
                </div>
                <div className="text-white/70 text-sm">Critical Alerts</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-purple-400">
                  {frameworks.reduce((sum, f) => sum + f.requirements.length, 0)}
                </div>
                <div className="text-white/70 text-sm">Total Requirements</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={generateComplianceReport}
                className="bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compliance Frameworks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Regulatory Frameworks Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frameworks.map((framework, index) => (
                <motion.div
                  key={framework.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{framework.name}</h4>
                    <Badge className={getStatusColor(framework.status)}>
                      {framework.status === 'compliant' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {framework.status === 'at_risk' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {framework.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Compliance Score</span>
                      <span className="text-white font-medium">{framework.complianceScore}%</span>
                    </div>
                    <Progress value={framework.complianceScore} className="h-2" />
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Requirements:</span>
                      <span className="text-white">{framework.requirements.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Critical Issues:</span>
                      <span className="text-red-400">
                        {framework.requirements.filter(r => r.severity === 'critical' && r.status !== 'met').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Jurisdiction:</span>
                      <span className="text-blue-400">{framework.jurisdiction}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/60 text-xs">
                    Last assessed: {framework.lastAssessment.toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real-time Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Regulatory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 8).map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {alert.alertType === 'violation' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {alert.alertType === 'deadline' && <Clock className="w-4 h-4 text-yellow-400" />}
                      {alert.alertType === 'update' && <TrendingUp className="w-4 h-4 text-blue-400" />}
                      <span className="text-white font-medium">{alert.framework}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`bg-${getSeverityColor(alert.severity).split('-')[1]}-500/20 text-${getSeverityColor(alert.severity).split('-')[1]}-300 border-${getSeverityColor(alert.severity).split('-')[1]}-500/30`}>
                        {alert.severity}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => resolveAlert(alert.id)}
                        className="text-white hover:bg-white/10 h-6 w-16 text-xs"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                  
                  <h4 className="text-white text-sm font-medium mb-1">{alert.requirement}</h4>
                  <p className="text-white/70 text-sm mb-2">{alert.message}</p>
                  
                  {alert.actionRequired.length > 0 && (
                    <div className="text-xs">
                      <span className="text-white/70">Actions required:</span>
                      <ul className="text-blue-300 ml-2">
                        {alert.actionRequired.slice(0, 2).map((action, i) => (
                          <li key={i}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <p className="text-white/60 text-xs mt-2">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
