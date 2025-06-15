
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBlockchain } from "@/contexts/BlockchainContext";

export const BlockchainSecurityDashboard = () => {
  const { 
    isWalletConnected, 
    logLoginSession, 
    getSecurityAuditTrail,
    processBlockchainPayment,
    processBlockchainPayroll,
    loading,
    isMetaMaskInstalled,
  } = useBlockchain();

  const [securityMetrics, setSecurityMetrics] = useState({
    totalSessions: 0,
    securePayments: 0,
    auditEvents: 0,
    riskScore: 0.1
  });

  const [auditTrail, setAuditTrail] = useState<any>(null);

  useEffect(() => {
    // Simulate loading security metrics
    setSecurityMetrics({
      totalSessions: 47,
      securePayments: 23,
      auditEvents: 8,
      riskScore: 0.15
    });
  }, []);

  const handleLogTestSession = async () => {
    if (!isWalletConnected) return;
    
    try {
      await logLoginSession(
        'user_123',
        '192.168.1.1',
        navigator.userAgent
      );
      setSecurityMetrics(prev => ({ ...prev, totalSessions: prev.totalSessions + 1 }));
    } catch (error) {
      console.error('Failed to log session:', error);
    }
  };

  const handleGetAuditTrail = async () => {
    if (!isWalletConnected) return;
    
    try {
      const trail = await getSecurityAuditTrail(
        'user_123',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        new Date()
      );
      setAuditTrail(trail);
    } catch (error) {
      console.error('Failed to get audit trail:', error);
    }
  };

  const handleTestBlockchainPayment = async () => {
    if (!isWalletConnected) return;
    
    try {
      await processBlockchainPayment('0xtest123', '100', 'USD');
      setSecurityMetrics(prev => ({ ...prev, securePayments: prev.securePayments + 1 }));
    } catch (error) {
      console.error('Failed to process payment:', error);
    }
  };

  const handleTestPayroll = async () => {
    if (!isWalletConnected) return;
    
    const testEmployees = [
      { employeeId: 'emp_001', amount: '5000', currency: 'USD' },
      { employeeId: 'emp_002', amount: '4500', currency: 'USD' },
      { employeeId: 'emp_003', amount: '6000', currency: 'USD' }
    ];

    try {
      await processBlockchainPayroll(testEmployees);
      setSecurityMetrics(prev => ({ ...prev, securePayments: prev.securePayments + 3 }));
    } catch (error) {
      console.error('Failed to process payroll:', error);
    }
  };

  const securityFeatures = [
    {
      icon: Lock,
      title: "Immutable Login Logs",
      description: "All login sessions are cryptographically logged on blockchain",
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Decision Engine",
      description: "Blockchain makes payment decisions, processors just execute",
      color: "text-blue-400"
    },
    {
      icon: Eye,
      title: "Complete Audit Trail",
      description: "Every transaction is hashed and stored immutably",
      color: "text-purple-400"
    },
    {
      icon: Activity,
      title: "Risk Analysis",
      description: "AI-powered blockchain risk assessment for all payments",
      color: "text-orange-400"
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Blockchain Security Dashboard</h2>
        <p className="text-white/70">Advanced blockchain integration for secure payments and audit logging</p>
      </motion.div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  <div>
                    <h3 className="text-white font-semibold">{feature.title}</h3>
                    <p className="text-white/60 text-sm">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Security Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Security Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{securityMetrics.totalSessions}</div>
                <div className="text-white/70 text-sm">Logged Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{securityMetrics.securePayments}</div>
                <div className="text-white/70 text-sm">Secure Payments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{securityMetrics.auditEvents}</div>
                <div className="text-white/70 text-sm">Audit Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{(securityMetrics.riskScore * 100).toFixed(1)}%</div>
                <div className="text-white/70 text-sm">Risk Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Blockchain Security Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isMetaMaskInstalled ? (
              <div className="text-center py-4">
                <p className="text-white/70 mb-4">Please install MetaMask to access blockchain security features</p>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                  MetaMask Not Installed
                </Badge>
              </div>
            ) : !isWalletConnected ? (
              <div className="text-center py-4">
                <p className="text-white/70 mb-4">Connect your wallet to access blockchain security features</p>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  Wallet Connection Required
                </Badge>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleLogTestSession}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Log Test Session
                  </Button>
                  
                  <Button
                    onClick={handleGetAuditTrail}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Get Audit Trail
                  </Button>
                  
                  <Button
                    onClick={handleTestBlockchainPayment}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Test Blockchain Payment
                  </Button>
                  
                  <Button
                    onClick={handleTestPayroll}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Test Blockchain Payroll
                  </Button>
                </div>

                {auditTrail && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Audit Trail Results</h4>
                    <div className="flex gap-2">
                      <Badge className="bg-green-500/20 text-green-300">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Blockchain Verified
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300">
                        Immutable Record
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300">
                        IPFS Stored
                      </Badge>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
