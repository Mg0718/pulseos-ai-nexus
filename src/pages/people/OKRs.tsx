
import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Brain, TrendingUp, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PeopleLayout from "@/components/people/PeopleLayout";
import OKRManagement from "@/components/people/okrs/OKRManagement";
import OKRNudges from "@/components/people/okrs/OKRNudges";
import { useAuth } from "@/contexts/AuthContext";

const OKRs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-okrs");

  const stats = [
    { label: "Active OKRs", value: "12", icon: Target, color: "bg-blue-500", trend: "+2" },
    { label: "Completion Rate", value: "78%", icon: TrendingUp, color: "bg-green-500", trend: "+5%" },
    { label: "Team OKRs", value: "8", icon: Users, color: "bg-purple-500", trend: "+1" },
    { label: "This Quarter", value: "Q1 2024", icon: Calendar, color: "bg-orange-500", trend: "" }
  ];

  const tabs = [
    { id: "my-okrs", label: "My OKRs", icon: Target },
    { id: "team-okrs", label: "Team OKRs", icon: Users },
    { id: "ai-insights", label: "AI Insights", icon: Brain }
  ];

  return (
    <PeopleLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">OKRs & Performance</h1>
              <p className="text-gray-400">Objectives and Key Results with AI-powered insights</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Brain className="w-4 h-4 mr-2" />
                AI Suggestions
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New OKR
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        {stat.trend && (
                          <p className="text-green-400 text-sm">{stat.trend}</p>
                        )}
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "my-okrs" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <OKRManagement />
              </motion.div>
            )}
            
            {activeTab === "team-okrs" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Team OKRs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Team OKR management coming soon...</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "ai-insights" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      AI Performance Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                        <h3 className="text-white font-medium mb-2">Performance Trends</h3>
                        <p className="text-purple-200 text-sm">
                          Your completion rate has improved by 15% this quarter. Focus on breaking down 
                          larger objectives into smaller, measurable key results for better tracking.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                        <h3 className="text-white font-medium mb-2">Success Patterns</h3>
                        <p className="text-green-200 text-sm">
                          You perform best with weekly check-ins and clear milestone deadlines. 
                          Consider applying this pattern to your current objectives.
                        </p>
                      </div>

                      <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                        <h3 className="text-white font-medium mb-2">Recommendations</h3>
                        <ul className="text-yellow-200 text-sm space-y-1">
                          <li>• Schedule more frequent progress reviews</li>
                          <li>• Connect with team members working on related goals</li>
                          <li>• Break down "Launch new feature" into smaller key results</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar - AI Nudges */}
          <div>
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <OKRNudges userId={user.id} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PeopleLayout>
  );
};

export default OKRs;
