
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard, 
  Receipt,
  PieChart,
  ArrowLeft,
  Download,
  Calendar,
  Filter,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const monthlyFinancials = [
  { month: "Jan", revenue: 84200, expenses: 52000, profit: 32200 },
  { month: "Feb", revenue: 91500, expenses: 54000, profit: 37500 },
  { month: "Mar", revenue: 88700, expenses: 51000, profit: 37700 },
  { month: "Apr", revenue: 96300, expenses: 58000, profit: 38300 },
  { month: "May", revenue: 102000, expenses: 61000, profit: 41000 },
  { month: "Jun", revenue: 108500, expenses: 63000, profit: 45500 }
];

const expenseCategories = [
  { name: "Payroll", value: 45, amount: 28350, color: "#3B82F6" },
  { name: "Infrastructure", value: 20, amount: 12600, color: "#8B5CF6" },
  { name: "Marketing", value: 15, amount: 9450, color: "#EC4899" },
  { name: "Operations", value: 12, amount: 7560, color: "#10B981" },
  { name: "Other", value: 8, amount: 5040, color: "#F59E0B" }
];

const recentTransactions = [
  { id: 1, description: "Monthly Payroll - June", amount: -28350, date: "2024-06-01", type: "expense", category: "Payroll" },
  { id: 2, description: "Client Payment - TechCorp", amount: 15000, date: "2024-06-15", type: "income", category: "Revenue" },
  { id: 3, description: "AWS Infrastructure", amount: -3200, date: "2024-06-10", type: "expense", category: "Infrastructure" },
  { id: 4, description: "Marketing Campaign", amount: -2100, date: "2024-06-08", type: "expense", category: "Marketing" },
  { id: 5, description: "Subscription Revenue", amount: 8500, date: "2024-06-05", type: "income", category: "Revenue" }
];

const payrollData = [
  { department: "Engineering", employees: 12, totalPay: 18600, avgPay: 1550 },
  { department: "Product", employees: 8, totalPay: 12000, avgPay: 1500 },
  { department: "Design", employees: 6, totalPay: 8400, avgPay: 1400 },
  { department: "Marketing", employees: 5, totalPay: 6750, avgPay: 1350 },
  { department: "Sales", employees: 4, totalPay: 5200, avgPay: 1300 }
];

const Finance = () => {
  const [selectedView, setSelectedView] = useState<"overview" | "payroll" | "expenses">("overview");

  const totalRevenue = monthlyFinancials.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = monthlyFinancials.reduce((sum, month) => sum + month.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">FinanceOps Suite</h1>
                  <p className="text-emerald-300 text-sm">Payroll, billing & financial tracking</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <Calendar className="w-4 h-4 mr-2" />
                Period
              </Button>
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-2 mb-6">
            <Button 
              variant={selectedView === "overview" ? "default" : "outline"}
              onClick={() => setSelectedView("overview")}
              className="text-white border-white/20"
            >
              Overview
            </Button>
            <Button 
              variant={selectedView === "payroll" ? "default" : "outline"}
              onClick={() => setSelectedView("payroll")}
              className="text-white border-white/20"
            >
              Payroll
            </Button>
            <Button 
              variant={selectedView === "expenses" ? "default" : "outline"}
              onClick={() => setSelectedView("expenses")}
              className="text-white border-white/20"
            >
              Expenses
            </Button>
          </div>
        </motion.div>

        {/* Overview View */}
        {selectedView === "overview" && (
          <>
            {/* Key Financial Metrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                { 
                  label: "Total Revenue", 
                  value: `$${(totalRevenue / 1000).toFixed(1)}K`, 
                  trend: "+18%", 
                  icon: TrendingUp, 
                  color: "text-green-400",
                  bg: "bg-green-500/20"
                },
                { 
                  label: "Total Expenses", 
                  value: `$${(totalExpenses / 1000).toFixed(1)}K`, 
                  trend: "+12%", 
                  icon: TrendingDown, 
                  color: "text-red-400",
                  bg: "bg-red-500/20"
                },
                { 
                  label: "Net Profit", 
                  value: `$${(totalProfit / 1000).toFixed(1)}K`, 
                  trend: "+23%", 
                  icon: DollarSign, 
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/20"
                },
                { 
                  label: "Profit Margin", 
                  value: `${profitMargin}%`, 
                  trend: "+5%", 
                  icon: PieChart, 
                  color: "text-blue-400",
                  bg: "bg-blue-500/20"
                }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-300 text-sm mb-1">{metric.label}</p>
                          <p className="text-2xl font-bold text-white">{metric.value}</p>
                          <p className={`text-sm ${metric.color}`}>{metric.trend}</p>
                        </div>
                        <div className={`w-12 h-12 ${metric.bg} rounded-xl flex items-center justify-center`}>
                          <metric.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Financial Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue vs Expenses */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue vs Expenses</CardTitle>
                    <CardDescription className="text-gray-300">
                      Monthly financial performance over the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyFinancials}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white'
                          }} 
                        />
                        <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                        <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Expense Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Expense Breakdown</CardTitle>
                    <CardDescription className="text-gray-300">
                      Current month expense distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white'
                          }} 
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Recent Transactions</CardTitle>
                      <CardDescription className="text-gray-300">
                        Latest financial activities
                      </CardDescription>
                    </div>
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Transaction
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {transaction.type === 'income' ? 
                              <TrendingUp className="w-5 h-5 text-green-400" /> : 
                              <TrendingDown className="w-5 h-5 text-red-400" />
                            }
                          </div>
                          <div>
                            <p className="text-white font-medium">{transaction.description}</p>
                            <p className="text-gray-400 text-sm">{transaction.category} • {transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Payroll View */}
        {selectedView === "payroll" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Department Payroll Breakdown</CardTitle>
                <CardDescription className="text-gray-300">
                  Current month payroll distribution by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {payrollData.map((dept, index) => (
                    <motion.div
                      key={dept.department}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">{dept.department}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Employees</span>
                            <Badge variant="secondary">{dept.employees}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Total Pay</span>
                            <span className="text-white font-bold">${dept.totalPay.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Avg Pay</span>
                            <span className="text-emerald-400">${dept.avgPay.toLocaleString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Expenses View */}
        {selectedView === "expenses" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Expense Categories</CardTitle>
                <CardDescription className="text-gray-300">
                  Detailed breakdown of monthly expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {expenseCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Percentage</span>
                            <Badge variant="secondary">{category.value}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Amount</span>
                            <span className="text-white font-bold">${category.amount.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${category.value}%`,
                                backgroundColor: category.color
                              }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Finance;
