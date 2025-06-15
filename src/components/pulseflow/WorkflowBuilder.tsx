
import { useState, useCallback, useRef } from 'react';
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
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Play, Pause, Copy, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkflows, WorkflowNode, WorkflowEdge } from '@/hooks/useWorkflows';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';
import ConfigDrawer from './ConfigDrawer';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

interface WorkflowBuilderProps {
  workflowId?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

const WorkflowBuilder = ({ 
  workflowId, 
  initialNodes = [], 
  initialEdges = [],
  onSave 
}: WorkflowBuilderProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { createWorkflow, updateWorkflow, executeWorkflow } = useWorkflows();

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsConfigOpen(true);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const type = event.dataTransfer.getData('application/reactflow');
      const nodeName = event.dataTransfer.getData('nodeName');

      if (!type || !nodeName) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: nodeName,
          configured: false,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleSave = async () => {
    try {
      // Convert ReactFlow nodes/edges to our workflow format
      const workflowNodes: WorkflowNode[] = nodes.map(node => ({
        id: node.id,
        type: node.type || 'default',
        position: node.position,
        data: node.data,
      }));

      const workflowEdges: WorkflowEdge[] = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || undefined,
        targetHandle: edge.targetHandle || undefined,
      }));

      const workflowData = {
        name: workflowName,
        flow_definition: { nodes: workflowNodes, edges: workflowEdges },
        status: 'draft' as const,
        version: 1,
      };

      if (workflowId) {
        await updateWorkflow(workflowId, workflowData);
      } else {
        await createWorkflow(workflowData);
      }

      if (onSave) {
        onSave(nodes, edges);
      }

      toast({
        title: "Workflow saved",
        description: "Your workflow has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const handleExecute = async () => {
    if (!workflowId) {
      toast({
        title: "Save first",
        description: "Please save the workflow before executing it.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      await executeWorkflow(workflowId);
    } catch (error) {
      console.error('Error executing workflow:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleNodeUpdate = (updatedNode: Node) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  const exportWorkflow = () => {
    const workflowData = {
      name: workflowName,
      nodes,
      edges,
    };
    
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflowName.replace(/\s+/g, '_')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const workflowData = JSON.parse(result);
        
        setWorkflowName(workflowData.name || 'Imported Workflow');
        setNodes(workflowData.nodes || []);
        setEdges(workflowData.edges || []);
        
        toast({
          title: "Workflow imported",
          description: "Your workflow has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import workflow. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-16 bg-gray-900/50 backdrop-blur-xl border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white w-64"
            placeholder="Workflow name"
          />
          <Badge variant="outline" className="border-gray-600 text-gray-400">
            {nodes.length} nodes, {edges.length} connections
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".json"
            onChange={importWorkflow}
            className="hidden"
            id="import-workflow"
          />
          <label htmlFor="import-workflow">
            <Button variant="ghost" size="sm" className="text-gray-300 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </label>
          
          <Button variant="ghost" size="sm" onClick={exportWorkflow} className="text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="ghost" size="sm" className="text-gray-300">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExecute}
            disabled={isExecuting}
            className="text-green-400 hover:bg-green-500/20"
          >
            {isExecuting ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isExecuting ? 'Running...' : 'Execute'}
          </Button>
          
          <Button onClick={handleSave} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
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
          className="bg-gray-950"
          fitView
        >
          <Controls className="bg-gray-800 border-gray-700" />
          <MiniMap 
            className="bg-gray-800 border-gray-700"
            nodeColor={(node) => {
              switch (node.type) {
                case 'trigger': return '#8b5cf6';
                case 'action': return '#10b981';
                case 'condition': return '#f59e0b';
                case 'delay': return '#3b82f6';
                default: return '#6b7280';
              }
            }}
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="#374151"
          />
        </ReactFlow>
      </div>

      {/* Configuration Drawer */}
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        node={selectedNode}
        onUpdateNode={handleNodeUpdate}
      />
    </div>
  );
};

const WorkflowBuilderWrapper = (props: WorkflowBuilderProps) => (
  <ReactFlowProvider>
    <WorkflowBuilder {...props} />
  </ReactFlowProvider>
);

export default WorkflowBuilderWrapper;
