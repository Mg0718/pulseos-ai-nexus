
import { motion } from "framer-motion";
import { 
  Calendar, 
  CreditCard, 
  Users, 
  TrendingUp, 
  DollarSign, 
  FileText,
  Bell,
  Activity,
  Clock,
  Target,
  Zap,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShellLayout from "@/components/layouts/ShellLayout";
import { Link } from "react-router-dom";

const quickStats = [
  { label: "Monthly Revenue", value: "$124,350", change: "+12.5%", icon: DollarSign, color: "text-green-400" },
  { label: "Active Employees", value: "147", change: "+3", icon: Users, color: "text-blue-400" },
  { label: "Pending Invoices", value: "23", change: "-5", icon: FileText, color: "text-orange-400" },
  { label: "Active Workflows", value: "12", change: "+2", icon: Zap, color: "text-purple-400" },
];

const modules = [
  {
    title: "People & TeamOps",
    description: "Manage your team, track performance, and handle HR operations",
    icon: Users,
    color: "from-blue-600 to-blue-800",
    path: "/people/dashboard",
    status: "Active",
    features: ["Employee Management", "Performance Tracking", "Leave Management", "Onboarding"]
  },
  {
    title: "Finance & PulsePay",
    description: "Complete financial management and payment processing",
    icon: CreditCard,
    color: "from-emerald-600 to-emerald-800",
    path: "/finance/dashboard",
    status: "Active",
    features: ["Invoice Management", "Payroll Processing", "Financial Analytics", "Payment Gateway"]
  },
  {
    title: "PulseFlow Automation",
    description: "Visual workflow automation and process management",
    icon: Zap,
    color: "from-purple-600 to-purple-800",
    path: "/pulseflow",
    status: "Active",
    features: ["Workflow Builder", "Automation Templates", "Process Analytics", "Integration Hub"]
  },
  {
    title: "Analytics & Insights",
    description: "Business intelligence and performance analytics",
    icon: BarChart3,
    color: "from-indigo-600 to-indigo-800",
    path: "/analytics",
    status: "Coming Soon",
    features: ["Real-time Dashboards", "Predictive Analytics", "Custom Reports", "KPI Tracking"]
  }
];

const recentActivities = [
  { type: "payment", message: "Payment received from Acme Corp", time: "2 minutes ago" },
  { type: "workflow", message: "Automated workflow completed successfully", time: "15 minutes ago" },
  { type: "employee", message: "New employee onboarding started", time: "1 hour ago" },
  { type: "invoice", message: "Invoice #INV-2024-001 generated", time: "2 hours ago" },
];

const Dashboard = () => {
  return (
    <ShellLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
              PulseOS Dashboard
            </h1>
            <p className="text-gray-300">Welcome back! Here's what's happening with your business.</p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-white/20 hover:bg-white/10 transition-all duration-300 hover-glow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {stat.change}
                        </p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Modules */}
            <div className="xl:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Business Modules</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card className="glass border-white/20 hover:bg-white/10 transition-all duration-300 hover-glow h-full group">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                              <module.icon className="w-6 h-6 text-white" />
                            </div>
                            <Badge 
                              className={module.status === 'Active' 
                                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                              }
                            >
                              {module.status}
                            </Badge>
                          </div>
                          <CardTitle className="text-white text-xl group-hover:text-purple-300 transition-colors">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {module.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-white/80 text-sm font-medium mb-2">Key Features:</p>
                            <ul className="space-y-1">
                              {module.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Link to={module.path} className="block">
                            <Button 
                              className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white transition-all duration-300 group-hover:shadow-lg`}
                              disabled={module.status !== 'Active'}
                            >
                              {module.status === 'Active' ? 'Open Module' : 'Coming Soon'}
                              {module.status === 'Active' && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Recent Activity */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg glass hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{activity.message}</p>
                          <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start glass border-white/20 text-white hover:bg-white/10">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button variant="ghost" className="w-full justify-start glass border-white/20 text-white hover:bg-white/10">
                      <FileText className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                    <Button variant="ghost" className="w-full justify-start glass border-white/20 text-white hover:bg-white/10">
                      <Users className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                    <Button variant="ghost" className="w-full justify-start glass border-white/20 text-white hover:bg-white/10">
                      <Zap className="w-4 h-4 mr-2" />
                      Create Workflow
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
};

export default Dashboard;
