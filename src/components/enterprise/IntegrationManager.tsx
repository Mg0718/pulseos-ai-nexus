
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Settings, RefreshCw, CheckCircle, 
  AlertTriangle, Clock, Database, Globe,
  Zap, Shield, Activity, TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnterpriseIntegrationHub } from "@/lib/enterprise/integrationHub";

export const IntegrationManager = () => {
  const [integrationHub] = useState(() => new EnterpriseIntegrationHub());
  const [connectors, setConnectors] = useState<any[]>([]);
  const [syncOperations, setSyncOperations] = useState<any[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setConnectors(integrationHub.getConnectors());
    setSyncOperations(integrationHub.getSyncOperations());
  };

  const handleSync = async (connectorId: string) => {
    setLoading(prev => ({ ...prev, [connectorId]: true }));
    
    try {
      await integrationHub.syncConnector(connectorId);
      loadData();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setLoading(prev => ({ ...prev, [connectorId]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sap': return <Database className="w-5 h-5" />;
      case 'oracle': return <Database className="w-5 h-5" />;
      case 'quickbooks': return <TrendingUp className="w-5 h-5" />;
      case 'banking': return <Shield className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const connectorHealth = integrationHub.getConnectorHealth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Integration Manager</h2>
          <p className="text-white/70">Manage enterprise system connections</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Connections</p>
                <p className="text-2xl font-bold text-white">
                  {connectors.filter(c => c.status === 'connected').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Data Volume</p>
                <p className="text-2xl font-bold text-white">
                  {connectors.reduce((sum, c) => sum + c.dataVolume, 0).toLocaleString()}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white">
                  {((1 - connectors.reduce((sum, c) => sum + c.errorCount, 0) / connectors.length) * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Last Sync</p>
                <p className="text-2xl font-bold text-white">
                  {Math.min(...connectors.map(c => Date.now() - c.lastSync.getTime())) < 60000 ? 'Now' : '5m ago'}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connectors List */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Enterprise Connectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectors.map((connector, index) => (
              <motion.div
                key={connector.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    {getTypeIcon(connector.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{connector.name}</h3>
                      {getStatusIcon(connector.status)}
                    </div>
                    <p className="text-white/60 text-sm capitalize">{connector.type} • {connector.dataVolume.toLocaleString()} records</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-xs text-white/60">
                        Health: {(connectorHealth[connector.id] * 100).toFixed(0)}%
                      </div>
                      <Progress 
                        value={connectorHealth[connector.id] * 100} 
                        className="w-20 h-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={`${
                    connector.status === 'connected' ? 'bg-green-500/20 text-green-300' :
                    connector.status === 'syncing' ? 'bg-blue-500/20 text-blue-300' :
                    connector.status === 'error' ? 'bg-red-500/20 text-red-300' :
                    'bg-gray-500/20 text-gray-300'
                  } border-0`}>
                    {connector.status}
                  </Badge>
                  
                  <div className="text-right text-xs text-white/60">
                    <p>Last sync: {connector.lastSync.toLocaleTimeString()}</p>
                    <p>Errors: {connector.errorCount}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSync(connector.id)}
                      disabled={loading[connector.id] || connector.status === 'syncing'}
                      className="text-white hover:bg-white/10"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading[connector.id] ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sync Operations */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Sync Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncOperations.slice(-5).map((operation, index) => (
              <div key={operation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    operation.status === 'completed' ? 'bg-green-500' :
                    operation.status === 'running' ? 'bg-blue-500' :
                    operation.status === 'failed' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="text-white text-sm">
                      {connectors.find(c => c.id === operation.connectorId)?.name} • {operation.type}
                    </p>
                    <p className="text-white/60 text-xs">
                      {operation.recordsProcessed} records • {operation.startedAt.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge className={`text-xs ${
                  operation.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                  operation.status === 'running' ? 'bg-blue-500/20 text-blue-300' :
                  operation.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                  'bg-gray-500/20 text-gray-300'
                } border-0`}>
                  {operation.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
