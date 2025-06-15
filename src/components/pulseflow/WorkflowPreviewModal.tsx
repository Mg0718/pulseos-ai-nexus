
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  ArrowRight, 
  CheckCircle, 
  Database,
  Timer,
  GitBranch
} from 'lucide-react';
import { WorkflowTemplate } from './WorkflowTemplates';

interface WorkflowPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WorkflowTemplate | null;
  onUseTemplate: (template: WorkflowTemplate) => void;
}

const WorkflowPreviewModal = ({ isOpen, onClose, template, onUseTemplate }: WorkflowPreviewModalProps) => {
  if (!template) return null;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Play className="w-4 h-4 text-purple-400" />;
      case 'action': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'condition': return <GitBranch className="w-4 h-4 text-orange-400" />;
      case 'delay': return <Timer className="w-4 h-4 text-blue-400" />;
      default: return <Database className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'action': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'condition': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'delay': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const remainingNodesCount = template.nodes.length - 3;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {template.name}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Template Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Category:</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {template.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Nodes:</span>
                  <span className="text-white">{template.nodes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Connections:</span>
                  <span className="text-white">{template.edges.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Complexity:</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {template.nodes.length <= 3 ? 'Simple' : template.nodes.length <= 6 ? 'Medium' : 'Advanced'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => onUseTemplate(template)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Use This Template
              </Button>
            </div>
          </div>

          {/* Workflow Flow */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-3">Workflow Flow</h3>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {template.nodes.map((node, index) => {
                  const nextNode = template.edges.find(edge => edge.source === node.id);
                  
                  return (
                    <div key={node.id} className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        {getNodeIcon(node.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{node.data.label}</span>
                            <Badge className={getNodeTypeColor(node.type)}>
                              {node.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            {node.type === 'trigger' && 'Starts the workflow when triggered'}
                            {node.type === 'action' && 'Performs an action or operation'}
                            {node.type === 'condition' && 'Makes a decision based on criteria'}
                            {node.type === 'delay' && 'Waits for a specified duration'}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          Step {index + 1}
                        </div>
                      </div>
                      
                      {nextNode && index < template.nodes.length - 1 && (
                        <div className="flex justify-center">
                          <ArrowRight className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
                {template.nodes.length > 3 && (
                  <p className="text-purple-300 text-xs">+{remainingNodesCount.toString()} more steps</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowPreviewModal;
