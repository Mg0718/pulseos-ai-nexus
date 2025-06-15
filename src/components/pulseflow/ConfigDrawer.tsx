
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Save, 
  Test, 
  Settings, 
  Zap, 
  GitBranch, 
  Filter, 
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Node } from '@xyflow/react';
import { useToast } from "@/hooks/use-toast";

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onUpdateNode: (node: Node) => void;
}

const ConfigDrawer = ({ isOpen, onClose, node, onUpdateNode }: ConfigDrawerProps) => {
  const [config, setConfig] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (node) {
      setConfig(node.data || {});
    }
  }, [node]);

  const handleSave = async () => {
    if (!node) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedNode = {
      ...node,
      data: {
        ...config,
        configured: true
      }
    };
    
    onUpdateNode(updatedNode);
    setIsLoading(false);
    
    toast({
      title: "Configuration Saved",
      description: "Node configuration has been updated successfully.",
    });
  };

  const handleTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    // Simulate test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // 70% success rate
    setTestResult(success ? 'success' : 'error');
    setIsLoading(false);
    
    toast({
      title: success ? "Test Successful" : "Test Failed",
      description: success 
        ? "The node configuration is working correctly." 
        : "There was an issue with the configuration. Please check your settings.",
      variant: success ? "default" : "destructive",
    });
  };

  const renderNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'trigger': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'action': return <GitBranch className="w-5 h-5 text-green-400" />;
      case 'condition': return <Filter className="w-5 h-5 text-orange-400" />;
      case 'delay': return <Clock className="w-5 h-5 text-blue-400" />;
      default: return <Settings className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderConfigForm = () => {
    if (!node) return null;

    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="triggerType" className="text-white">Trigger Type</Label>
              <Select value={config.triggerType || ''} onValueChange={(value) => setConfig({...config, triggerType: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="database">Database Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {config.triggerType === 'webhook' && (
              <div>
                <Label htmlFor="webhookUrl" className="text-white">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={config.webhookUrl || ''}
                  onChange={(e) => setConfig({...config, webhookUrl: e.target.value})}
                  placeholder="https://api.example.com/webhook"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            )}
            
            {config.triggerType === 'schedule' && (
              <div>
                <Label htmlFor="schedule" className="text-white">Schedule</Label>
                <Input
                  id="schedule"
                  value={config.schedule || ''}
                  onChange={(e) => setConfig({...config, schedule: e.target.value})}
                  placeholder="0 9 * * *"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <p className="text-white/60 text-sm mt-1">Cron expression format</p>
              </div>
            )}
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="actionType" className="text-white">Action Type</Label>
              <Select value={config.actionType || ''} onValueChange={(value) => setConfig({...config, actionType: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="create_record">Create Record</SelectItem>
                  <SelectItem value="send_message">Send Message</SelectItem>
                  <SelectItem value="api_call">API Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.actionType === 'send_email' && (
              <>
                <div>
                  <Label htmlFor="emailTo" className="text-white">To Email</Label>
                  <Input
                    id="emailTo"
                    value={config.emailTo || ''}
                    onChange={(e) => setConfig({...config, emailTo: e.target.value})}
                    placeholder="user@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <Label htmlFor="emailSubject" className="text-white">Subject</Label>
                  <Input
                    id="emailSubject"
                    value={config.emailSubject || ''}
                    onChange={(e) => setConfig({...config, emailSubject: e.target.value})}
                    placeholder="Email subject"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <Label htmlFor="emailBody" className="text-white">Message</Label>
                  <Textarea
                    id="emailBody"
                    value={config.emailBody || ''}
                    onChange={(e) => setConfig({...config, emailBody: e.target.value})}
                    placeholder="Email message content"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="field" className="text-white">Field to Check</Label>
              <Input
                id="field"
                value={config.field || ''}
                onChange={(e) => setConfig({...config, field: e.target.value})}
                placeholder="email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label htmlFor="operator" className="text-white">Operator</Label>
              <Select value={config.operator || ''} onValueChange={(value) => setConfig({...config, operator: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value" className="text-white">Value</Label>
              <Input
                id="value"
                value={config.value || ''}
                onChange={(e) => setConfig({...config, value: e.target.value})}
                placeholder="comparison value"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration" className="text-white">Duration</Label>
              <Input
                id="duration"
                type="number"
                value={config.duration || ''}
                onChange={(e) => setConfig({...config, duration: e.target.value})}
                placeholder="5"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div>
              <Label htmlFor="unit" className="text-white">Unit</Label>
              <Select value={config.unit || ''} onValueChange={(value) => setConfig({...config, unit: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select time unit" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return <p className="text-white/60">No configuration available for this node type.</p>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-96 bg-black/30 backdrop-blur-xl border-l border-white/20 z-50 overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {node && renderNodeIcon(node.type)}
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {node?.data?.label || 'Configure Node'}
                  </h3>
                  <p className="text-white/60 text-sm capitalize">{node?.type} Configuration</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Status */}
            {node && (
              <div className="mb-6">
                <Badge 
                  className={
                    node.data?.configured 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                  }
                >
                  {node.data?.configured ? 'Configured' : 'Setup Required'}
                </Badge>
              </div>
            )}

            <Separator className="mb-6 bg-white/10" />

            {/* Configuration Form */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="text-white text-base">Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                {renderConfigForm()}
              </CardContent>
            </Card>

            {/* Test Result */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg mb-6 flex items-center gap-3 ${
                  testResult === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-red-500/20 border border-red-500/30'
                }`}
              >
                {testResult === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={testResult === 'success' ? 'text-green-300' : 'text-red-300'}>
                  {testResult === 'success' ? 'Test passed successfully' : 'Test failed - check configuration'}
                </span>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleTest}
                disabled={isLoading}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Test className="w-4 h-4 mr-2" />
                {isLoading ? 'Testing...' : 'Test'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>

            {/* Advanced Settings */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white text-base">Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enabled" className="text-white">Enabled</Label>
                  <Switch
                    id="enabled"
                    checked={config.enabled !== false}
                    onCheckedChange={(checked) => setConfig({...config, enabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="retryOnFailure" className="text-white">Retry on Failure</Label>
                  <Switch
                    id="retryOnFailure"
                    checked={config.retryOnFailure || false}
                    onCheckedChange={(checked) => setConfig({...config, retryOnFailure: checked})}
                  />
                </div>
                {config.retryOnFailure && (
                  <div>
                    <Label htmlFor="maxRetries" className="text-white">Max Retries</Label>
                    <Input
                      id="maxRetries"
                      type="number"
                      value={config.maxRetries || '3'}
                      onChange={(e) => setConfig({...config, maxRetries: e.target.value})}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfigDrawer;
