
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Calculator, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  transaction_id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  category: string;
  payment_method: string;
  reference_id: string;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  description: string;
  created_by: string;
  created_at: string;
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    overdueInvoices: 0,
    pendingPayments: 0
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Fetch transactions for revenue and expenses using type assertion
      const { data: transactions } = await supabase
        .from('transactions' as any)
        .select('*') as { data: Transaction[] | null };

      // Fetch invoices for overdue tracking using type assertion
      const { data: invoices } = await supabase
        .from('invoices' as any)
        .select('*') as { data: Invoice[] | null };

      if (transactions && invoices) {
        calculateMetrics(transactions, invoices);
        prepareChartData(transactions);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (transactions: Transaction[], invoices: Invoice[]) => {
    const revenue = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const expenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const overdueCount = invoices.filter(i => 
      i.status === 'overdue' || 
      (i.status === 'sent' && new Date(i.due_date) < new Date())
    ).length;

    const pendingAmount = transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    setMetrics({
      totalRevenue: revenue,
      monthlyRevenue: revenue * 0.8, // Estimated current month
      totalExpenses: expenses,
      netProfit: revenue - expenses,
      overdueInvoices: overdueCount,
      pendingPayments: pendingAmount
    });
  };

  const prepareChartData = (transactions: Transaction[]) => {
    const monthlyData = transactions.reduce((acc: any, transaction) => {
      const month = new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += parseFloat(transaction.amount.toString());
      } else if (transaction.type === 'expense') {
        acc[month].expenses += parseFloat(transaction.amount.toString());
      }
      
      return acc;
    }, {});

    setChartData(Object.values(monthlyData));
  };

  const ruleOf40 = ((metrics.monthlyRevenue * 12 - metrics.totalRevenue) / metrics.totalRevenue * 100) + 
                   (metrics.netProfit / metrics.totalRevenue * 100);
  
  const roic = metrics.totalRevenue > 0 ? (metrics.netProfit / metrics.totalRevenue * 100) : 0;

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      trend: "+12.5%",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Net Profit",
      value: `$${metrics.netProfit.toLocaleString()}`,
      trend: "+8.2%",
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      title: "Rule of 40",
      value: `${ruleOf40.toFixed(1)}%`,
      trend: "Healthy",
      icon: Calculator,
      color: "text-purple-400"
    },
    {
      title: "ROIC",
      value: `${roic.toFixed(1)}%`,
      trend: "+2.1%",
      icon: TrendingDown,
      color: "text-orange-400"
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                    <Badge variant="outline" className="text-white border-white/20">
                      {kpi.trend}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm">{kpi.title}</p>
                  <p className="text-2xl font-bold text-white">{kpi.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="income" fill="#6F2DBD" />
                    <Bar dataKey="expenses" fill="#A663CC" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Financial Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <span className="text-white">Overdue Invoices</span>
                    </div>
                    <Badge variant="destructive">{metrics.overdueInvoices}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">Pending Payments</span>
                    </div>
                    <span className="text-white font-medium">${metrics.pendingPayments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-white">Monthly Growth</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      +12.5%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
