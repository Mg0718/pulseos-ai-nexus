
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Filter, Clock, GitBranch } from "lucide-react";

const nodeCategories = [
  {
    title: "Triggers",
    icon: Zap,
    color: "bg-purple-500",
    nodes: [
      { id: "employee_created", label: "New Employee", description: "When a new employee is added" },
      { id: "invoice_due", label: "Invoice Due", description: "When an invoice is due" },
      { id: "schedule", label: "Schedule", description: "Run on a schedule" },
      { id: "webhook", label: "Webhook", description: "External trigger" },
    ]
  },
  {
    title: "Actions",
    icon: GitBranch,
    color: "bg-green-500",
    nodes: [
      { id: "send_email", label: "Send Email", description: "Send notification email" },
      { id: "create_task", label: "Create Task", description: "Create a new task" },
      { id: "update_record", label: "Update Record", description: "Update database record" },
      { id: "slack_message", label: "Slack Message", description: "Send Slack notification" },
    ]
  },
  {
    title: "Conditions",
    icon: Filter,
    color: "bg-orange-500",
    nodes: [
      { id: "if_condition", label: "If/Else", description: "Conditional logic" },
      { id: "filter", label: "Filter", description: "Filter data" },
      { id: "compare", label: "Compare", description: "Compare values" },
    ]
  },
  {
    title: "Utilities",
    icon: Clock,
    color: "bg-blue-500",
    nodes: [
      { id: "delay", label: "Delay", description: "Wait for a period" },
      { id: "transform", label: "Transform", description: "Transform data" },
      { id: "loop", label: "Loop", description: "Repeat actions" },
    ]
  },
];

const NodeSidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodedata', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-white/10 border-r border-white/20 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-white font-semibold text-lg mb-2">Flow Components</h3>
        <p className="text-white/70 text-sm">Drag components to build your workflow</p>
      </div>

      <div className="space-y-6">
        {nodeCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 ${category.color} rounded-md flex items-center justify-center`}>
                <category.icon className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-medium">{category.title}</h4>
            </div>
            
            <div className="space-y-2">
              {category.nodes.map((node, nodeIndex) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (categoryIndex * 0.1) + (nodeIndex * 0.05) }}
                  draggable
                  onDragStart={(e) => onDragStart(e, category.title.toLowerCase().slice(0, -1), node)}
                  className="group"
                >
                  <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 cursor-grab active:cursor-grabbing">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <category.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white font-medium text-sm">{node.label}</h5>
                          <p className="text-white/60 text-xs truncate">{node.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NodeSidebar;
