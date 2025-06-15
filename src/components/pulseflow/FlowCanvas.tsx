
import { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  Controls, 
  Background, 
  Connection, 
  Edge,
  Node,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Download, Upload, Settings } from "lucide-react";
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';
import NodeSidebar from './NodeSidebar';
import ConfigDrawer from './ConfigDrawer';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 100 },
    data: { label: 'Email Received' },
  },
];

const initialEdges: Edge[] = [];

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showNodeSidebar, setShowNodeSidebar] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowConfigDrawer(true);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes.length, setNodes]
  );

  const handleNodeUpdate = (updatedNode: Node) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  return (
    <div className="h-[600px] bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-xl border border-white/20 overflow-hidden">
      <div className="flex h-full">
        {/* Node Sidebar */}
        {showNodeSidebar && (
          <div className="w-64 glass border-r border-white/20">
            <NodeSidebar onClose={() => setShowNodeSidebar(false)} />
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 glass border-b border-white/20 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNodeSidebar(!showNodeSidebar)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Nodes
            </Button>
            <div className="h-4 w-px bg-white/20 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                {nodes.length} nodes
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {edges.length} connections
              </Badge>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Controls className="bg-white/10 border-white/20" />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1} 
                color="rgba(255, 255, 255, 0.1)" 
              />
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* Config Drawer */}
      <ConfigDrawer 
        isOpen={showConfigDrawer} 
        onClose={() => setShowConfigDrawer(false)}
        node={selectedNode}
        onUpdateNode={handleNodeUpdate}
      />
    </div>
  );
};

export default FlowCanvas;
