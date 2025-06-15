
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, Shield, Zap, 
  DollarSign, AlertTriangle, CheckCircle, 
  BarChart3, PieChart, Activity, Target,
  Users, Globe, Cpu, Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnterpriseAnalyticsEngine } from "@/lib/enterprise/analyticsEngine";
import { MLCostIntelligence } from "@/lib/enterprise/costIntelligence";
import { EnterpriseIntegrationHub } from "@/lib/enterprise/integrationHub";

export const ExecutiveDashboard = () => {
  const [analyticsEngine] = useState(() => new EnterpriseAnalyticsEngine());
  const [costIntelligence] = useState(() => new MLCostIntelligence());
  const [integrationHub] = useState(() => new EnterpriseIntegrationHub());
  
  const [metrics, setMetrics] = useState<any[]>([]);
  const [threats, setThreats] = useState<any[]>([]);
  const [optimizations, setOptimizations] = useState<any[]>([]);
  const [connectors, setConnectors] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setMetrics(analyticsEngine.getMetrics().slice(-10));
    setThreats(analyticsEngine.getThreats().slice(-5));
    setOptimizations(costIntelligence.getOptimizations());
    setConnectors(integrationHub.getConnectors());
    
    // Generate predictions
    await costIntelligence.generateCostPredictions();
  };

  const kpiData = [
    {
      title: "Total Transaction Volume",
      value: "$2.4M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Cost Optimization Savings",
      value: "$48.2K",
      change: "+28.3%",
      trend: "up",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Security Score",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Shield,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "System Performance",
      value: "99.8%",
      change: "-0.1%",
      trend: "down",
      icon: Zap,
      color: "from-orange-500 to-amber-600"
    }
  ];

  const integrationStats = {
    connected: connectors.filter(c => c.status === 'connected').length,
    total: connectors.length,
    dataVolume: connectors.reduce((sum, c) => sum + c.dataVolume, 0),
    errorRate: connectors.reduce((sum, c) => sum + c.errorCount, 0) / connectors.length
  };

  const costBreakdown = costIntelligence.generateCostBreakdown();
  const benchmarks = costIntelligence.getBenchmarks();

  return (
    <div className="space-y-6">
      {/* Header KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${kpi.color} flex items-center justify-center`}>
                    <kpi.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm ${
                    kpi.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}>
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-1">{kpi.title}</h3>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Threats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {threats.slice(0, 3).map((threat, index) => (
                  <div key={threat.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        threat.severity === 'critical' ? 'bg-red-500' :
                        threat.severity === 'high' ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="text-white text-sm font-medium">{threat.description}</p>
                        <p className="text-white/60 text-xs">
                          Risk Score: {(threat.riskScore * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <Badge className={`${
                      threat.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                      threat.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    } border-0`}>
                      {threat.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cost Optimizations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Cost Optimizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimizations.slice(0, 3).map((opt, index) => (
                  <div key={opt.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white text-sm font-medium">{opt.description}</p>
                      <Badge className="bg-green-500/20 text-green-300 border-0">
                        ${opt.savings.toLocaleString()} saved
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">Confidence: {(opt.confidence * 100).toFixed(0)}%</span>
                      <span className="text-white/60">ROI: {opt.estimatedROI}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Integration Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Connected Systems</span>
                  <span className="text-white font-medium">
                    {integrationStats.connected}/{integrationStats.total}
                  </span>
                </div>
                <Progress 
                  value={(integrationStats.connected / integrationStats.total) * 100} 
                  className="h-2"
                />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Data Volume</span>
                    <span className="text-white">{integrationStats.dataVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Error Rate</span>
                    <span className="text-white">{integrationStats.errorRate.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.slice(-3).map((metric, index) => (
                  <div key={metric.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm">{metric.name}</p>
                      <p className="text-white/60 text-xs">{metric.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{metric.value.toFixed(1)}</p>
                      <div className={`flex items-center text-xs ${
                        metric.trend === 'up' ? 'text-green-400' : 
                        metric.trend === 'down' ? 'text-red-400' : 'text-white/60'
                      }`}>
                        {metric.trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                        {metric.trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                        {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Industry Benchmarks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {benchmarks.slice(0, 3).map((benchmark, index) => (
                  <div key={benchmark.metric} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">{benchmark.metric}</span>
                      <span className="text-white">{benchmark.percentile}th percentile</span>
                    </div>
                    <Progress value={benchmark.percentile} className="h-2" />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Your: {benchmark.yourValue}</span>
                      <span>Industry: {benchmark.industryAverage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
