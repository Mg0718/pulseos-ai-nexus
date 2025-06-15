
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DelayNodeProps {
  data: {
    label: string;
    duration?: string;
    unit?: string;
    configured?: boolean;
  };
}

const DelayNode = memo(({ data }: DelayNodeProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg border border-blue-500 shadow-lg min-w-[200px]">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium text-sm">Delay</span>
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
        {data.duration && data.unit && (
          <div className="text-blue-200 text-xs">{data.duration} {data.unit}</div>
        )}
        <div className="flex justify-end mt-2">
          <Settings className="w-3 h-3 text-white/60" />
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-400 border-2 border-white"
      />
    </div>
  );
});

DelayNode.displayName = 'DelayNode';

export default DelayNode;
