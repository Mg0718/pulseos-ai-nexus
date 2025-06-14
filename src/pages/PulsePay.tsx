
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Receipt,
  PieChart,
  Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShellLayout from "@/components/layouts/ShellLayout";

const transactions = [
  {
    id: 1,
    type: "income",
    description: "Client Payment - Project Alpha",
    amount: 15000,
    date: "Dec 14, 2024",
    category: "Revenue",
    status: "completed"
  },
  {
    id: 2,
    type: "expense",
    description: "Office Rent - December",
    amount: 3500,
    date: "Dec 12, 2024",
    category: "Operations",
    status: "completed"
  },
  {
    id: 3,
    type: "expense",
    description: "Software Subscriptions",
    amount: 850,
    date: "Dec 10, 2024",
    category: "Technology",
    status: "pending"
  },
];

const stats = [
  { 
    label: "Monthly Revenue", 
    value: "$84,260", 
    trend: "+12.5%", 
    isPositive: true, 
    icon: TrendingUp,
    color: "text-green-400"
  },
  { 
    label: "Monthly Expenses", 
    value: "$28,450", 
    trend: "-8.2%", 
    isPositive: true, 
    icon: TrendingDown,
    color: "text-blue-400"
  },
  { 
    label: "Net Profit", 
    value: "$55,810", 
    trend: "+18.7%", 
    isPositive: true, 
    icon: DollarSign,
    color: "text-emerald-400"
  },
  { 
    label: "Pending Invoices", 
    value: "12", 
    trend: "+3", 
    isPositive: false, 
    icon: Receipt,
    color: "text-yellow-400"
  },
];

const PulsePay = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransactionColor = (type: string) => {
    return type === "income" 
      ? "text-green-400" 
      : "text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <ShellLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">PulsePay</h1>
              <p className="text-white/70">Manage finances, invoices, and payments</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <PieChart className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className={`text-sm ${stat.isPositive ? "text-green-400" : "text-red-400"}`}>
                        {stat.trend}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-white/70">
                  Latest financial activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-white font-medium">{transaction.description}</h4>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm">{transaction.category} • {transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financial Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Financial Overview
                </CardTitle>
                <CardDescription className="text-white/70">
                  Monthly breakdown and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <h3 className="text-white text-lg font-medium mb-2">Monthly Profit</h3>
                    <p className="text-3xl font-bold text-green-400">$55,810</p>
                    <p className="text-green-300 text-sm">+18.7% from last month</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Revenue</span>
                      <span className="text-white font-medium">$84,260</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Expenses</span>
                      <span className="text-white font-medium">$28,450</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ShellLayout>
  );
};

export default PulsePay;
