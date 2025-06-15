
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Plus, 
  Play, 
  Settings,
  User,
  CheckCircle,
  Clock,
  Brain,
  Workflow,
  Users,
  Target,
  Zap,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FloatingSidebar from "@/components/FloatingSidebar";
import { supabase } from "@/integrations/supabase/client";

const OnboardingStudio = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkflows();
    fetchSessions();
  }, []);

  const fetchWorkflows = async () => {
    const { data } = await supabase
      .from('onboarding_workflows')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setWorkflows(data);
  };

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('onboarding_sessions')
      .select('*, onboarding_workflows(*)')
      .order('started_at', { ascending: false });
    
    if (data) setSessions(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300';
      case 'paused': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const defaultWorkflows = [
    {
      id: 'new-employee',
      name: 'New Employee Onboarding',
      description: 'Complete onboarding flow for new team members',
      steps: 8,
      completionRate: 92,
      aiFeatures: ['Smart document generation', 'Personalized welcome messages', 'Auto task assignment'],
      isActive: true
    },
    {
      id: 'manager-onboarding',
      name: 'Manager Onboarding',
      description: 'Leadership-focused onboarding with team management tools',
      steps: 12,
      completionRate: 89,
      aiFeatures: ['Team insights', 'Management recommendations', 'Goal setting assistance'],
      isActive: true
    },
    {
      id: 'intern-program',
      name: 'Intern Program',
      description: 'Structured program for interns and temporary workers',
      steps: 6,
      completionRate: 85,
      aiFeatures: ['Learning path recommendations', 'Mentor matching', 'Progress tracking'],
      isActive: false
    },
    {
      id: 'remote-worker',
      name: 'Remote Worker Setup',
      description: 'Specialized flow for remote team members',
      steps: 10,
      completionRate: 94,
      aiFeatures: ['Equipment recommendations', 'Virtual team integration', 'Home office setup'],
      isActive: true
    }
  ];

  const mockSessions = [
    { name: 'Sarah Chen', workflow: 'New Employee Onboarding', progress: 75, status: 'in_progress', startDate: '2024-01-15' },
    { name: 'Mike Johnson', workflow: 'Manager Onboarding', progress: 100, status: 'completed', startDate: '2024-01-10' },
    { name: 'Emma Wilson', workflow: 'Remote Worker Setup', progress: 45, status: 'in_progress', startDate: '2024-01-18' },
    { name: 'Alex Rodriguez', workflow: 'New Employee Onboarding', progress: 30, status: 'paused', startDate: '2024-01-20' }
  ];

  const stats = [
    { label: "Active Workflows", value: defaultWorkflows.filter(w => w.isActive).length, icon: Workflow, color: "bg-blue-500" },
    { label: "Completion Rate", value: "91%", icon: CheckCircle, color: "bg-green-500" },
    { label: "Active Sessions", value: mockSessions.filter(s => s.status === 'in_progress').length, icon: User, color: "bg-purple-500" },
    { label: "AI Automations", value: "24", icon: Brain, color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingSidebar />
      
      <div className="pl-24 pr-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Onboarding Studio</h1>
              <p className="text-gray-400">AI-powered setup wizard and onboarding workflows</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Brain className="w-4 h-4 mr-2" />
                AI Wizard
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflows */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Onboarding Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {defaultWorkflows.map((workflow, index) => (
                      <motion.div
                        key={workflow.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${workflow.isActive ? 'bg-green-500' : 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                              <Workflow className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{workflow.name}</h3>
                              <p className="text-gray-400 text-sm">{workflow.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${workflow.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'} border-0`}>
                              {workflow.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-gray-400 text-xs">Steps</p>
                            <p className="text-white font-medium">{workflow.steps}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Completion Rate</p>
                            <p className="text-white font-medium">{workflow.completionRate}%</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <Progress value={workflow.completionRate} className="h-2" />
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-400 text-xs mb-2">AI Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {workflow.aiFeatures.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-purple-400 text-purple-300">
                                <Brain className="w-3 h-3 mr-1" />
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-2" />
                            Start Session
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Wizard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Onboarding Wizard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Let our AI create a personalized onboarding workflow based on role, department, and company culture.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">Role Analysis</p>
                      <p className="text-gray-400 text-xs">AI analyzes job requirements</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">Auto Generation</p>
                      <p className="text-gray-400 text-xs">Creates custom workflow</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">Team Integration</p>
                      <p className="text-gray-400 text-xs">Connects with team members</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Brain className="w-4 h-4 mr-2" />
                    Start AI Wizard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Active Sessions */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSessions.map((session, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                              {session.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="text-white text-sm font-medium">{session.name}</h4>
                            <p className="text-gray-400 text-xs">{session.workflow}</p>
                          </div>
                          <Badge className={`${getStatusColor(session.status)} border-0 text-xs`}>
                            {session.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{session.progress}%</span>
                          </div>
                          <Progress value={session.progress} className="h-1.5" />
                          <p className="text-gray-400 text-xs">
                            Started: {new Date(session.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStudio;
