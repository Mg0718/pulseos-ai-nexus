
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Plus, 
  Play, 
  Pause,
  Settings,
  GitBranch,
  Activity,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShellLayout from "@/components/layouts/ShellLayout";

const workflows = [
  {
    id: 1,
    name: "Employee Onboarding",
    description: "Automated workflow for new employee setup",
    status: "active",
    triggers: 3,
    actions: 8,
    lastRun: "2 hours ago",
    executions: 24
  },
  {
    id: 2,
    name: "Invoice Processing",
    description: "Auto-process and send invoices to clients",
    status: "paused",
    triggers: 2,
    actions: 6,
    lastRun: "1 day ago",
    executions: 156
  },
  {
    id: 3,
    name: "Leave Approval Chain",
    description: "Multi-step leave request approval process",
    status: "active",
    triggers: 1,
    actions: 4,
    lastRun: "30 minutes ago",
    executions: 89
  },
];

const stats = [
  { label: "Active Workflows", value: "12", trend: "+3", icon: Zap, color: "text-blue-400" },
  { label: "Total Executions", value: "1,247", trend: "+156", icon: Activity, color: "text-green-400" },
  { label: "Time Saved", value: "2.3K hrs", trend: "+89", icon: Clock, color: "text-purple-400" },
  { label: "Success Rate", value: "98.5%", trend: "+1.2%", icon: GitBranch, color: "text-emerald-400" },
];

const PulseFlow = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "paused":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "error":
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
              <h1 className="text-3xl font-bold text-white mb-2">PulseFlow</h1>
              <p className="text-white/70">Build and manage automated workflows</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <Activity className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
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

        {/* Workflow Builder Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Workflow Builder
              </CardTitle>
              <CardDescription className="text-white/70">
                Visual workflow designer coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 rounded-xl bg-white/5 border border-white/10 border-dashed">
                <div className="text-center">
                  <GitBranch className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Drag & Drop Workflow Builder</p>
                  <p className="text-white/40 text-sm">Visual automation designer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Active Workflows
              </CardTitle>
              <CardDescription className="text-white/70">
                Manage your automated processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow, index) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-white font-medium">{workflow.name}</h4>
                        <Badge className={getStatusColor(workflow.status)}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{workflow.description}</p>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span>{workflow.triggers} triggers</span>
                        <span>{workflow.actions} actions</span>
                        <span>{workflow.executions} executions</span>
                        <span>Last run: {workflow.lastRun}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {workflow.status === "active" ? (
                        <Button size="sm" variant="ghost" className="text-yellow-400 hover:bg-yellow-500/20">
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-500/20">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-white/70 hover:bg-white/10">
                        <Settings className="w-4 h-4" />
                      </Button>
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

export default PulseFlow;
