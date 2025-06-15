import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  DollarSign, 
  Target, 
  Lightbulb, 
  Settings, 
  Zap, 
  RefreshCw, 
  FileText, 
  Wrench, 
  Building2, 
  Shield, 
  Sparkles,
  ChevronRight,
  Brain,
  TrendingUp,
  Calendar,
  Bell
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const modules = [
  {
    id: 1,
    title: "Authentication & Access",
    description: "Secure login, roles, Zero Trust policies",
    icon: Shield,
    color: "bg-red-500",
    route: "/auth",
    status: "Active"
  },
  {
    id: 2,
    title: "People & TeamOps",
    description: "Smart onboarding, org charts, leave tracking",
    icon: Users,
    color: "bg-blue-500",
    route: "/people/dashboard",
    status: "Active"
  },
  {
    id: 3,
    title: "PulseComms",
    description: "Chat, discussions, GPT-powered replies",
    icon: MessageSquare,
    color: "bg-green-500",
    route: "/comms",
    status: "Active"
  },
  {
    id: 4,
    title: "Analytics & Insights",
    description: "Role-based dashboards, drill-down visualizations",
    icon: BarChart3,
    color: "bg-purple-500",
    route: "/analytics",
    status: "Active"
  },
  {
    id: 5,
    title: "FinanceOps Suite",
    description: "Payroll, billing, Rule of 40 tracking",
    icon: DollarSign,
    color: "bg-emerald-500",
    route: "/finance/dashboard",
    status: "Active"
  },
  {
    id: 6,
    title: "Performance & Growth",
    description: "OKRs, AI nudges, progress tracking",
    icon: Target,
    color: "bg-orange-500",
    route: "/people/okrs",
    status: "Active"
  },
  {
    id: 7,
    title: "Innovation Hub",
    description: "Internal innovation, AI-voting, hackathons",
    icon: Lightbulb,
    color: "bg-yellow-500",
    route: "/innovation-hub",
    status: "Active"
  },
  {
    id: 8,
    title: "Admin & Subscription",
    description: "Manage users, billing, API settings",
    icon: Settings,
    color: "bg-gray-500",
    route: "/admin",
    status: "Active"
  },
  {
    id: 9,
    title: "PulseFlow",
    description: "No-code automation builder",
    icon: Zap,
    color: "bg-indigo-500",
    route: "/pulseflow",
    status: "Active"
  },
  {
    id: 10,
    title: "PulseSync",
    description: "Integration middleware, OAuth management",
    icon: RefreshCw,
    color: "bg-cyan-500",
    route: "/integrations",
    status: "Active"
  },
  {
    id: 11,
    title: "PulseContracts",
    description: "AI contract parsing, approval workflows",
    icon: FileText,
    color: "bg-pink-500",
    route: "/contracts",
    status: "Active"
  },
  {
    id: 12,
    title: "MSP & FieldOps",
    description: "Asset management, mobile dashboards",
    icon: Wrench,
    color: "bg-teal-500",
    route: "/fieldops",
    status: "Active"
  },
  {
    id: 13,
    title: "Industry Templates",
    description: "Vertical packs for different industries",
    icon: Building2,
    color: "bg-violet-500",
    route: "/templates",
    status: "Active"
  },
  {
    id: 14,
    title: "PulseCompliance",
    description: "GDPR/SOC2 readiness, risk alerts",
    icon: Shield,
    color: "bg-rose-500",
    route: "/compliance",
    status: "Active"
  },
  {
    id: 15,
    title: "Onboarding Studio",
    description: "AI setup wizard, GPT-powered config",
    icon: Sparkles,
    color: "bg-amber-500",
    route: "/onboarding",
    status: "Active"
  }
];

const quickStats = [
  { label: "Active Users", value: "1,247", trend: "+12%", icon: Users },
  { label: "Monthly Revenue", value: "$84.2K", trend: "+23%", icon: DollarSign },
  { label: "System Health", value: "99.8%", trend: "+0.2%", icon: TrendingUp },
  { label: "AI Automations", value: "156", trend: "+45%", icon: Brain }
];

const recentActivity = [
  { action: "New team member onboarded", user: "Sarah Chen", time: "2 minutes ago" },
  { action: "Payroll processed successfully", user: "System", time: "1 hour ago" },
  { action: "OKR milestone achieved", user: "Dev Team", time: "3 hours ago" },
  { action: "Contract renewal reminder", user: "AI Assistant", time: "5 hours ago" }
];

const PulseOS = () => {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">PulseOS</h1>
                  <p className="text-purple-300 text-sm">The OS for modern teams</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome back, <span className="text-purple-400">Alex</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Your AI-powered business operating system is ready. Let's build something amazing today.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
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
                        <p className="text-gray-300 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-green-400 text-sm">{stat.trend}</p>
                      </div>
                      <stat.icon className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">PulseOS Modules</h3>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Setup Wizard
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredModule(module.id)}
                onHoverEnd={() => setHoveredModule(null)}
              >
                <Card className="group bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center transition-transform duration-300 ${hoveredModule === module.id ? 'scale-110' : ''}`}>
                        <module.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge 
                        variant={module.status === 'Active' ? 'default' : module.status === 'Beta' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {module.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-300 mb-4">
                      {module.description}
                    </CardDescription>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 p-0 h-auto"
                      asChild
                    >
                      <Link to={module.route}>
                        Open Module
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">by {activity.user} • {activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PulseOS;
