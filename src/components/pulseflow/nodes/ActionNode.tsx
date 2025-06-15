
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActionNodeProps {
  data: {
    label: string;
    actionType?: string;
    configured?: boolean;
  };
}

const ActionNode = memo(({ data }: ActionNodeProps) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg border border-green-500 shadow-lg min-w-[200px]">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium text-sm">Action</span>
          {data.configured ? (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
              Configured
            </Badge>
          ) : (
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
              Setup Required
            </Badge>
          )}
        </div>
        <div className="text-white text-sm font-medium mb-1">{data.label}</div>
        {data.actionType && (
          <div className="text-green-200 text-xs">{data.actionType}</div>
        )}
        <div className="flex justify-end mt-2">
          <Settings className="w-3 h-3 text-white/60" />
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-400 border-2 border-white"
      />
    </div>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
