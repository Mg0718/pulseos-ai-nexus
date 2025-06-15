
import { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  GitBranch, 
  Filter, 
  Clock, 
  Plus,
  Mail,
  Database,
  Webhook,
  MessageSquare,
  FileText,
  Calendar
} from "lucide-react";

const nodeCategories = [
  {
    name: "Triggers",
    icon: Zap,
    color: "text-purple-400",
    nodes: [
      { type: "trigger", name: "Webhook", icon: Webhook, description: "HTTP webhook trigger" },
      { type: "trigger", name: "Schedule", icon: Calendar, description: "Time-based trigger" },
      { type: "trigger", name: "Email", icon: Mail, description: "Email received trigger" },
      { type: "trigger", name: "Database", icon: Database, description: "Database change trigger" },
    ]
  },
  {
    name: "Actions",
    icon: GitBranch,
    color: "text-green-400",
    nodes: [
      { type: "action", name: "Send Email", icon: Mail, description: "Send email message" },
      { type: "action", name: "Create Record", icon: Database, description: "Create database record" },
      { type: "action", name: "Send Message", icon: MessageSquare, description: "Send chat message" },
      { type: "action", name: "Generate Document", icon: FileText, description: "Create document" },
    ]
  },
  {
    name: "Logic",
    icon: Filter,
    color: "text-orange-400",
    nodes: [
      { type: "condition", name: "If/Then", icon: Filter, description: "Conditional logic" },
      { type: "delay", name: "Wait", icon: Clock, description: "Delay execution" },
    ]
  }
];

const NodeSidebar = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Triggers");

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeName: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('nodeName', nodeName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/20 p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-white font-semibold text-lg mb-2">Node Library</h3>
        <p className="text-white/60 text-sm">Drag nodes to the canvas to build your workflow</p>
      </div>

      <div className="space-y-4">
        {nodeCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-0 h-auto text-white hover:bg-white/10"
                  onClick={() => setExpandedCategory(
                    expandedCategory === category.name ? null : category.name
                  )}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                    <CardTitle className="text-white text-base">{category.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/60">
                    {category.nodes.length}
                  </Badge>
                </Button>
              </CardHeader>
              
              {expandedCategory === category.name && (
                <CardContent className="pt-0">
                  <Separator className="mb-3 bg-white/10" />
                  <div className="space-y-2">
                    {category.nodes.map((node, nodeIndex) => (
                      <motion.div
                        key={`${node.type}-${node.name}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: nodeIndex * 0.05 }}
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type, node.name)}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-grab active:cursor-grabbing border border-white/10 hover:border-white/20"
                      >
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                          node.type === 'trigger' ? 'bg-purple-600/20' :
                          node.type === 'action' ? 'bg-green-600/20' :
                          'bg-orange-600/20'
                        }`}>
                          <node.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{node.name}</p>
                          <p className="text-white/60 text-xs">{node.description}</p>
                        </div>
                        <Plus className="w-4 h-4 text-white/40" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-purple-600/20 border border-purple-500/30">
        <h4 className="text-white font-medium mb-2">Quick Tip</h4>
        <p className="text-purple-200 text-sm">
          Drag any node from above onto the canvas to add it to your workflow. Connect nodes by dragging from the connection points.
        </p>
      </div>
    </div>
  );
};

export default NodeSidebar;
