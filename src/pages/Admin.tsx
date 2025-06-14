
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Users, 
  Settings, 
  Activity,
  AlertTriangle,
  Database,
  Server,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShellLayout from "@/components/layouts/ShellLayout";

const systemStats = [
  { label: "Active Users", value: "1,247", trend: "+12%", icon: Users, color: "text-blue-400" },
  { label: "System Health", value: "99.8%", trend: "+0.2%", icon: Server, color: "text-green-400" },
  { label: "API Requests", value: "2.4M", trend: "+8%", icon: Activity, color: "text-purple-400" },
  { label: "Storage Used", value: "847GB", trend: "+156GB", icon: Database, color: "text-yellow-400" },
];

const recentActivity = [
  {
    id: 1,
    action: "User sarah.chen@company.com created",
    timestamp: "2 minutes ago",
    type: "user",
    severity: "info"
  },
  {
    id: 2,
    action: "Failed login attempt detected",
    timestamp: "15 minutes ago",
    type: "security",
    severity: "warning"
  },
  {
    id: 3,
    action: "Database backup completed",
    timestamp: "1 hour ago",
    type: "system",
    severity: "success"
  },
  {
    id: 4,
    action: "API rate limit exceeded for user",
    timestamp: "2 hours ago",
    type: "api",
    severity: "error"
  }
];

const adminUsers = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex@pulseos.com",
    role: "Super Admin",
    lastActive: "Online now",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@pulseos.com",
    role: "Admin",
    lastActive: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b056f02"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    email: "marcus@pulseos.com",
    role: "Moderator",
    lastActive: "1 day ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  }
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-green-500/20";
      case "warning":
        return "bg-yellow-500/20";
      case "error":
        return "bg-red-500/20";
      default:
        return "bg-blue-500/20";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Admin":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "Moderator":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-white/70">System administration and management</p>
          
          <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-300 text-sm">
              You have administrative privileges. Use these tools carefully.
            </p>
          </div>
        </motion.div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
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
                      <p className="text-green-400 text-sm">{stat.trend}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-white/70">
                  System events and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className={`w-3 h-3 rounded-full ${getSeverityBg(activity.severity)}`}>
                        <div className={`w-full h-full rounded-full ${getSeverityColor(activity.severity)}`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-white/60 text-xs">{activity.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Admin Users
                </CardTitle>
                <CardDescription className="text-white/70">
                  Users with administrative privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-[#6F2DBD] text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{user.name}</h4>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm">{user.email}</p>
                        <p className="text-white/60 text-xs">{user.lastActive}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-white/70">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="ghost" className="h-auto p-4 flex flex-col gap-2 text-white border border-white/20 hover:bg-white/10">
                  <Users className="w-6 h-6" />
                  <span>Manage Users</span>
                </Button>
                <Button variant="ghost" className="h-auto p-4 flex flex-col gap-2 text-white border border-white/20 hover:bg-white/10">
                  <BarChart3 className="w-6 h-6" />
                  <span>View Analytics</span>
                </Button>
                <Button variant="ghost" className="h-auto p-4 flex flex-col gap-2 text-white border border-white/20 hover:bg-white/10">
                  <Database className="w-6 h-6" />
                  <span>System Backup</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ShellLayout>
  );
};

export default Admin;
