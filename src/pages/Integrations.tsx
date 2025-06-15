
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw, 
  Plus, 
  Search, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Database,
  Globe,
  Webhook,
  Key,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import FloatingSidebar from "@/components/FloatingSidebar";
import { supabase } from "@/integrations/supabase/client";

const Integrations = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchIntegrations();
    fetchSyncLogs();
  }, []);

  const fetchIntegrations = async () => {
    const { data } = await supabase
      .from('integration_configs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setIntegrations(data);
  };

  const fetchSyncLogs = async () => {
    const { data } = await supabase
      .from('sync_logs')
      .select('*, integration_configs(*)')
      .order('started_at', { ascending: false })
      .limit(10);
    
    if (data) setSyncLogs(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <RefreshCw className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'inactive': return 'bg-gray-500/20 text-gray-300';
      case 'error': return 'bg-red-500/20 text-red-300';
      default: return 'bg-blue-500/20 text-blue-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook': return <Webhook className="w-5 h-5" />;
      case 'api': return <Database className="w-5 h-5" />;
      case 'oauth': return <Key className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const availableIntegrations = [
    { name: "Slack", type: "webhook", description: "Team communication and notifications", icon: "💬", category: "Communication" },
    { name: "Google Workspace", type: "oauth", description: "Calendar, Drive, and Gmail integration", icon: "📧", category: "Productivity" },
    { name: "Microsoft 365", type: "oauth", description: "Office suite and Teams integration", icon: "📊", category: "Productivity" },
    { name: "Stripe", type: "api", description: "Payment processing and billing", icon: "💳", category: "Finance" },
    { name: "QuickBooks", type: "api", description: "Accounting and financial management", icon: "📈", category: "Finance" },
    { name: "Salesforce", type: "api", description: "CRM and sales management", icon: "🤝", category: "Sales" },
    { name: "HubSpot", type: "api", description: "Marketing and sales automation", icon: "🎯", category: "Marketing" },
    { name: "Jira", type: "api", description: "Project management and issue tracking", icon: "🎫", category: "Development" }
  ];

  const stats = [
    { label: "Active Integrations", value: integrations.filter(i => i.status === 'active').length, icon: CheckCircle, color: "bg-green-500" },
    { label: "Total Syncs", value: syncLogs.length, icon: RefreshCw, color: "bg-blue-500" },
    { label: "Success Rate", value: "98.5%", icon: Activity, color: "bg-purple-500" },
    { label: "Data Processed", value: `${syncLogs.reduce((sum, log) => sum + (log.records_processed || 0), 0)}`, icon: Database, color: "bg-orange-500" }
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
              <h1 className="text-3xl font-bold text-white mb-2">PulseSync</h1>
              <p className="text-gray-400">Integration middleware and data synchronization</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
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
          {/* Active Integrations */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Active Integrations</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search integrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrations.map((integration, index) => (
                      <motion.div
                        key={integration.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            {getTypeIcon(integration.service_type)}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{integration.service_name}</h3>
                            <p className="text-gray-400 text-sm capitalize">{integration.service_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={`${getStatusColor(integration.status)} border-0`}>
                            {integration.status}
                          </Badge>
                          <Switch checked={integration.status === 'active'} />
                          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Available Integrations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Available Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableIntegrations.map((integration, index) => (
                      <motion.div
                        key={integration.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <h3 className="text-white font-medium">{integration.name}</h3>
                            <Badge variant="outline" className="text-xs text-gray-400 border-gray-400">
                              {integration.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{integration.description}</p>
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sync Activity */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Sync Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {syncLogs.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          log.status === 'success' ? 'bg-green-500' : 
                          log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            {log.integration_configs?.service_name} sync
                          </p>
                          <p className="text-gray-400 text-xs">
                            {log.records_processed} records • {new Date(log.started_at).toLocaleString()}
                          </p>
                          {log.error_details && (
                            <p className="text-red-300 text-xs mt-1">{log.error_details}</p>
                          )}
                        </div>
                        <Badge className={`text-xs ${
                          log.status === 'success' ? 'bg-green-500/20 text-green-300' :
                          log.status === 'error' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        } border-0`}>
                          {log.status}
                        </Badge>
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

export default Integrations;
