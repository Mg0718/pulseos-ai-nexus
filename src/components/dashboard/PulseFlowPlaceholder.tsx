
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  GitBranch, 
  Play, 
  Plus, 
  ArrowRight,
  Sparkles,
  Activity,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const mockWorkflows = [
  {
    id: 1,
    name: "Employee Onboarding",
    status: "active",
    triggers: 12,
    lastRun: "2 hours ago"
  },
  {
    id: 2,
    name: "Invoice Processing",
    status: "active", 
    triggers: 45,
    lastRun: "15 minutes ago"
  },
  {
    id: 3,
    name: "Leave Approval",
    status: "paused",
    triggers: 8,
    lastRun: "1 day ago"
  }
];

const PulseFlowPlaceholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-2xl">PulseFlow</CardTitle>
                <p className="text-purple-200">Visual workflow automation</p>
              </div>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/pulseflow">
                Open Builder
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">3 Active</p>
              <p className="text-purple-200 text-sm">Workflows</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <GitBranch className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium">65 Total</p>
              <p className="text-purple-200 text-sm">Executions</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-white font-medium">2.3K</p>
              <p className="text-purple-200 text-sm">Hours Saved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Active Workflows</CardTitle>
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockWorkflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <div>
                    <h4 className="text-white font-medium">{workflow.name}</h4>
                    <p className="text-white/60 text-sm">
                      {workflow.triggers} triggers • Last run {workflow.lastRun}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    className={
                      workflow.status === 'active' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }
                  >
                    {workflow.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Quick Start Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
              className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
            >
              <h4 className="text-white font-medium mb-2">Employee Onboarding</h4>
              <p className="text-blue-200 text-sm mb-3">Automate welcome emails, account setup, and document collection</p>
              <Badge className="bg-blue-500/20 text-blue-300">Popular</Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 hover:border-green-400/50 transition-colors cursor-pointer"
            >
              <h4 className="text-white font-medium mb-2">Invoice Processing</h4>
              <p className="text-green-200 text-sm mb-3">Smart approval workflows and payment automation</p>
              <Badge className="bg-green-500/20 text-green-300">Trending</Badge>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PulseFlowPlaceholder;
