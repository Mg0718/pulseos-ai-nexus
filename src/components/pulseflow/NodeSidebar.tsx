
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Zap, 
  Play, 
  GitBranch, 
  Clock, 
  Search, 
  X,
  Settings,
  Activity,
  Database,
  Filter
} from 'lucide-react';

const nodeTypes = [
  {
    type: 'trigger',
    name: 'Email Trigger',
    icon: Zap,
    color: 'bg-purple-600',
    description: 'Triggers when an email is received'
  },
  {
    type: 'action',
    name: 'Send Email',
    icon: Play,
    color: 'bg-green-600',
    description: 'Send an automated email'
  },
  {
    type: 'condition',
    name: 'If/Then',
    icon: GitBranch,
    color: 'bg-yellow-600',
    description: 'Conditional logic branch'
  },
  {
    type: 'delay',
    name: 'Wait',
    icon: Clock,
    color: 'bg-blue-600',
    description: 'Add a time delay'
  },
  {
    type: 'action',
    name: 'Database Action',
    icon: Database,
    color: 'bg-red-600',
    description: 'Create or update records'
  },
  {
    type: 'action',
    name: 'Webhook',
    icon: Activity,
    color: 'bg-indigo-600',
    description: 'Send HTTP request'
  }
];

interface NodeSidebarProps {
  onClose?: () => void;
}

const NodeSidebar = ({ onClose }: NodeSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = nodeTypes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeName: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('nodeName', nodeName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">Node Library</h3>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Node Categories */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredNodes.map((node, index) => (
            <Card
              key={index}
              className="glass border-white/20 hover:bg-white/10 transition-all duration-300 cursor-move"
              draggable
              onDragStart={(e) => onDragStart(e, node.type, node.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${node.color} rounded-lg flex items-center justify-center`}>
                    <node.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{node.name}</h4>
                    <p className="text-gray-400 text-xs">{node.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-center">
          <Badge variant="outline" className="border-purple-500/30 text-purple-300">
            {filteredNodes.length} nodes available
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default NodeSidebar;
