
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Filter, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConditionNodeProps {
  data: {
    label: string;
    field?: string;
    operator?: string;
    configured?: boolean;
  };
}

const ConditionNode = memo(({ data }: ConditionNodeProps) => {
  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg border border-orange-500 shadow-lg min-w-[200px]">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium text-sm">Condition</span>
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
        {data.field && data.operator && (
          <div className="text-orange-200 text-xs">{data.field} {data.operator}</div>
        )}
        <div className="flex justify-end mt-2">
          <Settings className="w-3 h-3 text-white/60" />
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-400 border-2 border-white"
        id="true"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-orange-400 border-2 border-white"
        id="false"
      />
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;
