
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Check, 
  X, 
  Filter,
  Download,
  Users,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShellLayout from "@/components/layouts/ShellLayout";

const leaveRequests = [
  {
    id: 1,
    employee: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b056f02",
    type: "Annual Leave",
    dates: "Dec 25-29, 2024",
    days: 5,
    status: "pending",
    reason: "Holiday vacation with family",
    applied: "2 days ago"
  },
  {
    id: 2,
    employee: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    type: "Sick Leave",
    dates: "Dec 15, 2024",
    days: 1,
    status: "approved",
    reason: "Medical appointment",
    applied: "1 week ago"
  },
  {
    id: 3,
    employee: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    type: "Personal Leave",
    dates: "Dec 20-22, 2024",
    days: 3,
    status: "rejected",
    reason: "Personal matter",
    applied: "3 days ago"
  },
];

const stats = [
  { label: "Pending Requests", value: "12", trend: "+4", icon: Clock, color: "text-yellow-400" },
  { label: "Approved This Month", value: "28", trend: "+8", icon: Check, color: "text-green-400" },
  { label: "Team Utilization", value: "87%", trend: "+2%", icon: Users, color: "text-blue-400" },
  { label: "Leave Days Used", value: "156", trend: "+12", icon: TrendingUp, color: "text-purple-400" },
];

const Leave = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "rejected":
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
              <h1 className="text-3xl font-bold text-white mb-2">Leave Management</h1>
              <p className="text-white/70">Manage team leave requests and track utilization</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                <Plus className="w-4 h-4 mr-2" />
                New Request
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
                      <p className="text-green-400 text-sm">{stat.trend}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Leave Requests
              </CardTitle>
              <CardDescription className="text-white/70">
                Manage and approve team leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback className="bg-[#6F2DBD] text-white">
                        {request.employee.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white font-medium">{request.employee}</h4>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm mb-1">
                        {request.type} • {request.dates} • {request.days} days
                      </p>
                      <p className="text-white/60 text-sm">{request.reason}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white/60 text-sm mb-2">{request.applied}</p>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/20">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ShellLayout>
  );
};

export default Leave;
