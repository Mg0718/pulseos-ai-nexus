
import { motion } from "framer-motion";
import { useFinancialData } from "@/hooks/useFinancialData";
import { KPICards } from "@/components/finance/KPICards";
import { RevenueChart } from "@/components/finance/RevenueChart";
import { FinancialHealth } from "@/components/finance/FinancialHealth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, DollarSign } from "lucide-react";

const FinanceDashboard = () => {
  const { metrics, chartData, loading } = useFinancialData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Finance Dashboard</h1>
          <p className="text-white/70 text-lg">Real-time financial insights and performance metrics</p>
        </motion.div>

        {/* KPI Cards */}
        <KPICards metrics={metrics} />

        {/* Charts and Health Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart data={chartData} />
          <FinancialHealth metrics={metrics} />
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  Financial Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.overdueInvoices > 0 && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                      <span className="text-white text-sm">
                        {metrics.overdueInvoices} overdue invoice{metrics.overdueInvoices !== 1 ? 's' : ''} requiring attention
                      </span>
                    </div>
                  </div>
                )}
                {metrics.ruleOf40 < 40 && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                      <span className="text-white text-sm">
                        Rule of 40 below target ({metrics.ruleOf40.toFixed(1)}% vs 40%)
                      </span>
                    </div>
                  </div>
                )}
                {metrics.netProfit < 0 && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                      <span className="text-white text-sm">
                        Negative net profit: ${Math.abs(metrics.netProfit).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                {metrics.overdueInvoices === 0 && metrics.ruleOf40 >= 40 && metrics.netProfit >= 0 && (
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-white text-sm">
                        All financial metrics are healthy
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Monthly Revenue</span>
                  <span className="text-white font-bold">${metrics.monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Pending Payments</span>
                  <span className="text-white font-bold">${metrics.pendingPayments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Cash Runway</span>
                  <span className="text-white font-bold">
                    {metrics.burnRate > 0 ? Math.ceil(metrics.totalRevenue / metrics.burnRate) : '∞'} months
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Revenue Growth</span>
                  <span className="text-white font-bold">
                    {metrics.totalRevenue > 0 ? '+' : ''}{((metrics.monthlyRevenue / (metrics.totalRevenue || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
