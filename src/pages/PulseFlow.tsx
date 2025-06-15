
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
  Clock,
  History,
  Template
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShellLayout from "@/components/layouts/ShellLayout";
import FlowCanvas from "@/components/pulseflow/FlowCanvas";
import FlowTemplates from "@/components/pulseflow/FlowTemplates";
import FlowHistory from "@/components/pulseflow/FlowHistory";

const stats = [
  { label: "Active Workflows", value: "12", trend: "+3", icon: Zap, color: "text-blue-400" },
  { label: "Total Executions", value: "1,247", trend: "+156", icon: Activity, color: "text-green-400" },
  { label: "Time Saved", value: "2.3K hrs", trend: "+89", icon: Clock, color: "text-purple-400" },
  { label: "Success Rate", value: "98.5%", trend: "+1.2%", icon: GitBranch, color: "text-emerald-400" },
];

const PulseFlow = () => {
  const [activeTab, setActiveTab] = useState("builder");

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
              <p className="text-white/70">Visual workflow automation builder</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="text-white border border-white/20 hover:bg-white/10">
                <Activity className="w-4 h-4 mr-2" />
                Analytics
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

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
              <TabsTrigger 
                value="builder" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Flow Builder
              </TabsTrigger>
              <TabsTrigger 
                value="templates"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Template className="w-4 h-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="mt-6">
              <FlowCanvas />
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <FlowTemplates />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <FlowHistory />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </ShellLayout>
  );
};

export default PulseFlow;
