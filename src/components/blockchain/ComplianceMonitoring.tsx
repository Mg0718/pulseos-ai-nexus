
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileCheck, Globe, Shield, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ComplianceCheck {
  id: string;
  regulation: string;
  status: 'compliant' | 'warning' | 'non_compliant';
  score: number;
  lastChecked: Date;
  issues: string[];
  recommendations: string[];
}

interface AuditTrail {
  id: string;
  event: string;
  timestamp: Date;
  user: string;
  compliance_impact: 'low' | 'medium' | 'high';
  blockchain_hash: string;
}

export const ComplianceMonitoring = () => {
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditTrail[]>([]);
  const [overallScore, setOverallScore] = useState(94);

  useEffect(() => {
    loadComplianceData();
    loadAuditTrail();
  }, []);

  const loadComplianceData = () => {
    const checks: ComplianceCheck[] = [
      {
        id: '1',
        regulation: 'GDPR',
        status: 'compliant',
        score: 96,
        lastChecked: new Date(),
        issues: [],
        recommendations: ['Consider implementing automated data retention policies']
      },
      {
        id: '2',
        regulation: 'SOC 2',
        status: 'compliant',
        score: 94,
        lastChecked: new Date(Date.now() - 60 * 60 * 1000),
        issues: [],
        recommendations: ['Update access control documentation', 'Enhance monitoring alerts']
      },
      {
        id: '3',
        regulation: 'PCI DSS',
        status: 'warning',
        score: 87,
        lastChecked: new Date(Date.now() - 2 * 60 * 60 * 1000),
        issues: ['Encryption key rotation overdue'],
        recommendations: ['Implement automated key rotation', 'Update cardholder data handling procedures']
      },
      {
        id: '4',
        regulation: 'ISO 27001',
        status: 'compliant',
        score: 91,
        lastChecked: new Date(Date.now() - 30 * 60 * 1000),
        issues: [],
        recommendations: ['Document incident response procedures', 'Conduct security awareness training']
      }
    ];
    setComplianceChecks(checks);
  };

  const loadAuditTrail = () => {
    const trail: AuditTrail[] = [
      {
        id: '1',
        event: 'Payment processed with blockchain verification',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: 'system@blockchain',
        compliance_impact: 'low',
        blockchain_hash: '0xa1b2c3d4e5f6...'
      },
      {
        id: '2',
        event: 'Multi-signature transaction approved',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: 'admin@company.com',
        compliance_impact: 'medium',
        blockchain_hash: '0xb2c3d4e5f6a1...'
      },
      {
        id: '3',
        event: 'Risk threshold updated',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        user: 'compliance@company.com',
        compliance_impact: 'high',
        blockchain_hash: '0xc3d4e5f6a1b2...'
      },
      {
        id: '4',
        event: 'Automated compliance check completed',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        user: 'system@compliance',
        compliance_impact: 'low',
        blockchain_hash: '0xd4e5f6a1b2c3...'
      }
    ];
    setAuditTrail(trail);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'non_compliant': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const runComplianceAudit = async () => {
    // Simulate running compliance audit
    setComplianceChecks(prev => prev.map(check => ({
      ...check,
      lastChecked: new Date(),
      score: Math.max(85, Math.min(100, check.score + (Math.random() - 0.5) * 10))
    })));
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Real-time Compliance Monitoring
            </CardTitle>
            <p className="text-white/70 text-sm">
              Automated GDPR, SOC2, PCI-DSS compliance with blockchain verification
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-green-400">{overallScore}%</div>
                <div className="text-white/70 text-sm">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-blue-400">
                  {complianceChecks.filter(c => c.status === 'compliant').length}
                </div>
                <div className="text-white/70 text-sm">Compliant</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-yellow-400">
                  {complianceChecks.filter(c => c.status === 'warning').length}
                </div>
                <div className="text-white/70 text-sm">Warnings</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-purple-400">
                  {auditTrail.length}
                </div>
                <div className="text-white/70 text-sm">Audit Events</div>
              </div>
            </div>

            <Button
              onClick={runComplianceAudit}
              className="w-full bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Run Full Compliance Audit
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Compliance Checks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Regulatory Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceChecks.map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{check.regulation}</h4>
                    <Badge className={getStatusColor(check.status)}>
                      {check.status === 'compliant' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {check.status === 'warning' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {check.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Compliance Score</span>
                      <span className="text-white font-medium">{check.score}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          check.score >= 95 ? 'bg-green-400' :
                          check.score >= 90 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${check.score}%` }}
                      />
                    </div>
                  </div>

                  {check.issues.length > 0 && (
                    <div className="mb-2">
                      <p className="text-white/70 text-xs mb-1">Issues:</p>
                      {check.issues.map((issue, i) => (
                        <p key={i} className="text-red-300 text-xs">• {issue}</p>
                      ))}
                    </div>
                  )}

                  <div>
                    <p className="text-white/70 text-xs mb-1">Recommendations:</p>
                    {check.recommendations.slice(0, 2).map((rec, i) => (
                      <p key={i} className="text-blue-300 text-xs">• {rec}</p>
                    ))}
                  </div>
                  
                  <p className="text-white/60 text-xs mt-2">
                    Last checked: {check.lastChecked.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Audit Trail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Blockchain Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditTrail.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">{entry.event}</span>
                    </div>
                    <Badge className={`bg-${getImpactColor(entry.compliance_impact).split('-')[1]}-500/20 text-${getImpactColor(entry.compliance_impact).split('-')[1]}-300 border-${getImpactColor(entry.compliance_impact).split('-')[1]}-500/30`}>
                      {entry.compliance_impact} impact
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-white/70">User: </span>
                      <span className="text-white">{entry.user}</span>
                    </div>
                    <div>
                      <span className="text-white/70">Time: </span>
                      <span className="text-white">{entry.timestamp.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-white/70">Hash: </span>
                      <span className="text-blue-300 font-mono text-xs">{entry.blockchain_hash}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
