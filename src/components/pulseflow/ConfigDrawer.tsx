import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Settings, Save, Zap } from "lucide-react";
import { Node } from '@xyflow/react';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onUpdateNode: (node: Node) => void;
}

const ConfigDrawer = ({ isOpen, onClose, node, onUpdateNode }: ConfigDrawerProps) => {
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (node) {
      setConfig(node.data || {});
    }
  }, [node]);

  const handleSave = () => {
    if (!node) return;
    
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        ...config,
        configured: true,
      }
    };
    
    onUpdateNode(updatedNode);
    onClose();
  };

  const renderConfigForm = () => {
    if (!node) return null;

    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Trigger Type</Label>
              <Input
                value={config.triggerType || ''}
                onChange={(e) => setConfig({ ...config, triggerType: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="e.g., employee_created"
              />
            </div>
            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Describe when this trigger should fire..."
              />
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Action Type</Label>
              <Input
                value={config.actionType || ''}
                onChange={(e) => setConfig({ ...config, actionType: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="e.g., send_email"
              />
            </div>
            <div>
              <Label className="text-white">Target</Label>
              <Input
                value={config.target || ''}
                onChange={(e) => setConfig({ ...config, target: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="e.g., user@example.com"
              />
            </div>
            <div>
              <Label className="text-white">Message Template</Label>
              <Textarea
                value={config.template || ''}
                onChange={(e) => setConfig({ ...config, template: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter your message template..."
              />
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Field to Check</Label>
              <Input
                value={config.field || ''}
                onChange={(e) => setConfig({ ...config, field: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="e.g., user.department"
              />
            </div>
            <div>
              <Label className="text-white">Operator</Label>
              <select
                value={config.operator || 'equals'}
                onChange={(e) => setConfig({ ...config, operator: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
              </select>
            </div>
            <div>
              <Label className="text-white">Value</Label>
              <Input
                value={config.value || ''}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter comparison value..."
              />
            </div>
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Delay Duration</Label>
              <Input
                type="number"
                value={config.duration || ''}
                onChange={(e) => setConfig({ ...config, duration: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter duration..."
              />
            </div>
            <div>
              <Label className="text-white">Time Unit</Label>
              <select
                value={config.unit || 'minutes'}
                onChange={(e) => setConfig({ ...config, unit: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-white/70">
            No configuration available for this node type.
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-slate-900 to-purple-900 border-l border-white/20 backdrop-blur-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Configure Node</h3>
                    <p className="text-white/70 text-sm">{String(node?.data?.label) || 'Node Configuration'}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Node Type Badge */}
              {node && (
                <div className="mb-6">
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                    {node.type?.charAt(0).toUpperCase() + node.type?.slice(1)} Node
                  </Badge>
                </div>
              )}

              {/* Configuration Form */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderConfigForm()}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfigDrawer;
