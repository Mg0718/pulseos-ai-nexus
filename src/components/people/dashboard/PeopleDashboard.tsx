
import { motion } from "framer-motion";
import { Users, Calendar, MessageSquare, Heart, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "../shared/StatsCard";
import { ActionButton } from "../shared/ActionButton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const stats = [
  { title: "Total Employees", value: "142", trend: "+12", icon: Users, color: "text-blue-400" },
  { title: "Pending Leaves", value: "8", trend: "+2", icon: Calendar, color: "text-yellow-400" },
  { title: "Feedback Given", value: "34", trend: "+5", icon: MessageSquare, color: "text-green-400" },
  { title: "Avg Morale", value: "8.2", trend: "+0.3", icon: Heart, color: "text-pink-400" },
];

const recentActivities = [
  {
    id: 1,
    user: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b056f02d?w=400",
    action: "submitted leave request",
    time: "2 hours ago",
    type: "leave"
  },
  {
    id: 2,
    user: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    action: "completed onboarding",
    time: "4 hours ago",
    type: "onboarding"
  },
  {
    id: 3,
    user: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    action: "gave feedback to team",
    time: "6 hours ago",
    type: "feedback"
  },
];

const alerts = [
  { id: 1, message: "3 employees have low morale scores", type: "warning" },
  { id: 2, message: "5 pending leave requests need approval", type: "info" },
  { id: 3, message: "Quarterly review cycle starts next week", type: "info" },
];

export const PeopleDashboard = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">People & TeamOps Dashboard</h1>
              <p className="text-white/70">Manage your team's wellbeing and performance</p>
            </div>
            <div className="flex gap-3">
              <ActionButton icon={Users} label="Add Employee" variant="ghost" />
              <ActionButton icon={Calendar} label="Schedule Review" />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={activity.avatar} />
                        <AvatarFallback className="bg-[#6F2DBD] text-white">
                          {activity.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.action}
                        </p>
                        <p className="text-white/60 text-xs">{activity.time}</p>
                      </div>
                      <Badge 
                        className={
                          activity.type === 'leave' ? 'bg-yellow-500/20 text-yellow-300' :
                          activity.type === 'onboarding' ? 'bg-green-500/20 text-green-300' :
                          'bg-blue-500/20 text-blue-300'
                        }
                      >
                        {activity.type}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alerts & Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        alert.type === 'warning' 
                          ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200' 
                          : 'bg-blue-500/20 border-blue-500/30 text-blue-200'
                      }`}
                    >
                      <p className="text-sm">{alert.message}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ActionButton icon={Users} label="Manage Teams" variant="ghost" className="h-20 flex-col" />
                <ActionButton icon={Calendar} label="Approve Leaves" variant="ghost" className="h-20 flex-col" />
                <ActionButton icon={MessageSquare} label="Review Feedback" variant="ghost" className="h-20 flex-col" />
                <ActionButton icon={Heart} label="Check Morale" variant="ghost" className="h-20 flex-col" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
