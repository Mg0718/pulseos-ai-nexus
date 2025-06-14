
import { motion } from "framer-motion";
import { useFinancialData } from "@/hooks/useFinancialData";
import { KPICards } from "@/components/finance/KPICards";
import { RevenueChart } from "@/components/finance/RevenueChart";
import { FinancialHealth } from "@/components/finance/FinancialHealth";

const Dashboard = () => {
  const { metrics, chartData, loading } = useFinancialData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 flex items-center justify-center">
        <div className="text-white">Loading financial dashboard...</div>
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
          <h1 className="text-3xl font-bold text-white mb-2">Finance Dashboard</h1>
          <p className="text-white/70">Real-time financial insights and KPIs</p>
        </motion.div>

        {/* KPI Cards */}
        <KPICards metrics={metrics} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart data={chartData} />
          <FinancialHealth metrics={metrics} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
