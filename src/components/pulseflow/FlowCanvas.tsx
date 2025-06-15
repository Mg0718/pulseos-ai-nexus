
import { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Settings, Zap, GitBranch, Clock, Filter } from "lucide-react";
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
    id: 'start',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Trigger: New Employee',
      triggerType: 'employee_created',
      configured: true
    },
  },
  {
    id: 'action1',
    type: 'action',
    position: { x: 400, y: 100 },
    data: { 
      label: 'Send Welcome Email',
      actionType: 'send_email',
      configured: false
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'start-action1',
    source: 'start',
    target: 'action1',
    type: 'smoothstep',
    animated: true,
  },
];

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
  }, []);

  const saveFlow = async () => {
    console.log('Saving flow...', { nodes, edges });
    // TODO: Save to Supabase
  };

  const runFlow = async () => {
    setIsRunning(true);
    console.log('Running flow...', { nodes, edges });
    // TODO: Execute via Edge Function
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <div className="flex h-[600px] bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm overflow-hidden">
      {/* Node Sidebar */}
      <NodeSidebar />
      
      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-white"
        >
          <Controls className="bg-white/10 border-white/20" />
          <MiniMap 
            className="bg-white/10 border-white/20" 
            nodeColor="#8B5CF6"
            maskColor="rgba(255, 255, 255, 0.1)"
          />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          
          {/* Floating Toolbar */}
          <Panel position="top-right" className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={saveFlow}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              onClick={runFlow}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isRunning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                </motion.div>
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'Running...' : 'Test Flow'}
            </Button>
          </Panel>

          {/* Flow Stats Panel */}
          <Panel position="top-left">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm">Flow Active</span>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {nodes.length} Nodes
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white">
                    {edges.length} Connections
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Panel>
        </ReactFlow>
      </div>

      {/* Configuration Drawer */}
      <ConfigDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        node={selectedNode}
        onUpdateNode={(updatedNode) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === updatedNode.id ? updatedNode : node
            )
          );
        }}
      />
    </div>
  );
};

export default FlowCanvas;
