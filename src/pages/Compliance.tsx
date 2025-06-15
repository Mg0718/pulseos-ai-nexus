
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Eye,
  Search,
  Filter,
  Plus,
  Settings,
  Activity,
  Users,
  Lock,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FloatingSidebar from "@/components/FloatingSidebar";
import { supabase } from "@/integrations/supabase/client";

const Compliance = () => {
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [complianceTasks, setComplianceTasks] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  useEffect(() => {
    fetchAuditEvents();
    fetchComplianceTasks();
    fetchPolicies();
  }, []);

  const fetchAuditEvents = async () => {
    const { data } = await supabase
      .from('audit_events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAuditEvents(data);
  };

  const fetchComplianceTasks = async () => {
    const { data } = await supabase
      .from('compliance_tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setComplianceTasks(data);
  };

  const fetchPolicies = async () => {
    const { data } = await supabase
      .from('policies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPolicies(data);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300';
      case 'high': return 'bg-orange-500/20 text-orange-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300';
      case 'cancelled': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const complianceFrameworks = [
    { name: "GDPR", description: "General Data Protection Regulation", coverage: 85, status: "compliant" },
    { name: "SOC 2", description: "Service Organization Control 2", coverage: 78, status: "in-progress" },
    { name: "ISO 27001", description: "Information Security Management", coverage: 92, status: "compliant" },
    { name: "HIPAA", description: "Health Insurance Portability", coverage: 45, status: "needs-attention" }
  ];

  const stats = [
    { label: "Compliance Score", value: "87%", icon: Shield, color: "bg-green-500" },
    { label: "Open Audit Events", value: auditEvents.filter(e => e.status === 'open').length, icon: AlertTriangle, color: "bg-red-500" },
    { label: "Active Policies", value: policies.filter(p => p.status === 'active').length, icon: FileText, color: "bg-blue-500" },
    { label: "Pending Tasks", value: complianceTasks.filter(t => t.status === 'open').length, icon: Clock, color: "bg-yellow-500" }
  ];

  const filteredEvents = auditEvents.filter(event => {
    const matchesSearch = event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || event.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

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
              <h1 className="text-3xl font-bold text-white mb-2">PulseCompliance</h1>
              <p className="text-gray-400">GDPR/SOC2 readiness and risk management</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Activity className="w-4 h-4 mr-2" />
                Run Audit
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Policy
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compliance Frameworks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Compliance Frameworks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceFrameworks.map((framework, index) => (
                      <motion.div
                        key={framework.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-white font-medium">{framework.name}</h3>
                            <p className="text-gray-400 text-sm">{framework.description}</p>
                          </div>
                          <Badge className={`${
                            framework.status === 'compliant' ? 'bg-green-500/20 text-green-300' :
                            framework.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-red-500/20 text-red-300'
                          } border-0`}>
                            {framework.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Coverage</span>
                            <span className="text-white">{framework.coverage}%</span>
                          </div>
                          <Progress value={framework.coverage} className="h-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Audit Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Audit Events</CardTitle>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search events..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-48 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <select
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm"
                      >
                        <option value="all" className="bg-slate-800">All Severity</option>
                        <option value="critical" className="bg-slate-800">Critical</option>
                        <option value="high" className="bg-slate-800">High</option>
                        <option value="medium" className="bg-slate-800">Medium</option>
                        <option value="low" className="bg-slate-800">Low</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredEvents.slice(0, 6).map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        {getSeverityIcon(event.severity)}
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{event.description}</h4>
                          <p className="text-gray-400 text-xs">{event.event_type} • {new Date(event.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getSeverityColor(event.severity)} border-0 text-xs`}>
                            {event.severity}
                          </Badge>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-6 w-6 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compliance Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Compliance Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {complianceTasks.slice(0, 5).map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white text-sm font-medium">{task.title}</h4>
                          <Badge className={`${getTaskStatusColor(task.status)} border-0 text-xs`}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs mb-2">{task.description}</p>
                        {task.due_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400 text-xs">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Policies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Active Policies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {policies.filter(p => p.status === 'active').slice(0, 4).map((policy, index) => (
                      <motion.div
                        key={policy.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <h4 className="text-white text-sm font-medium mb-1">{policy.name}</h4>
                        <p className="text-gray-400 text-xs mb-2 capitalize">{policy.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs">v{policy.version}</span>
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-6 w-6 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      Schedule Audit
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Create Policy
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Assign Task
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure Alerts
                    </Button>
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

export default Compliance;
