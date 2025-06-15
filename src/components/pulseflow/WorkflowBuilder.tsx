import { useState, useCallback, useRef, useEffect } from 'react';
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
import { Save, Play, Pause, Copy, Download, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';
import ConfigDrawer from './ConfigDrawer';
import { getTemplateById } from './WorkflowTemplates';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

// Initial sample nodes to show the canvas is working
const initialNodes: Node[] = [
  {
    id: 'sample-trigger',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Sample Trigger',
      configured: false,
    },
  },
];

const initialEdges: Edge[] = [];

interface WorkflowBuilderProps {
  workflowId?: string;
  templateId?: string;
}

const WorkflowBuilderInner = ({ workflowId, templateId }: WorkflowBuilderProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | undefined>(workflowId);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { createWorkflow, updateWorkflow, workflows } = useWorkflows();
  const { executeWorkflow, loading: executionLoading } = useWorkflowExecution();

  // Load workflow if workflowId is provided
  useEffect(() => {
    if (workflowId && workflows.length > 0) {
      const workflow = workflows.find(w => w.id === workflowId);
      if (workflow) {
        setWorkflowName(workflow.name);
        setNodes(workflow.flow_definition.nodes || []);
        setEdges(workflow.flow_definition.edges || []);
        setCurrentWorkflowId(workflowId);
      }
    }
  }, [workflowId, workflows, setNodes, setEdges]);

  // Load template if templateId is provided
  useEffect(() => {
    if (templateId && !workflowId) {
      const template = getTemplateById(templateId);
      if (template) {
        setWorkflowName(template.name);
        setNodes(template.nodes);
        setEdges(template.edges);
        setCurrentWorkflowId(undefined);
        toast({
          title: "Template loaded",
          description: `"${template.name}" template has been loaded successfully.`,
        });
      }
    }
  }, [templateId, workflowId, setNodes, setEdges, toast]);

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
        x: event.clientX - reactFlowBounds.left - 150,
        y: event.clientY - reactFlowBounds.top - 50,
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
      const workflowNodes = nodes.map(node => ({
        id: node.id,
        type: node.type || 'default',
        position: node.position,
        data: node.data,
      }));

      const workflowEdges = edges.map(edge => ({
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

      if (currentWorkflowId) {
        const updatedWorkflow = await updateWorkflow(currentWorkflowId, workflowData);
        setCurrentWorkflowId(updatedWorkflow.id);
      } else {
        const newWorkflow = await createWorkflow(workflowData);
        setCurrentWorkflowId(newWorkflow.id);
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
    if (!currentWorkflowId && nodes.length === 0) {
      toast({
        title: "No workflow to execute",
        description: "Please save the workflow first or add some nodes.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentWorkflowId) {
        await executeWorkflow(currentWorkflowId, { 
          test: true, 
          timestamp: new Date().toISOString() 
        });
      } else {
        toast({
          title: "Save workflow first",
          description: "Please save the workflow before executing it.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  };

  const handleNodeUpdate = (updatedNode: Node) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This will remove all nodes and connections.')) {
      setNodes([]);
      setEdges([]);
      setWorkflowName('Untitled Workflow');
      setCurrentWorkflowId(undefined);
      toast({
        title: "Canvas cleared",
        description: "All nodes and connections have been removed.",
      });
    }
  };

  const handleDuplicate = async () => {
    if (!currentWorkflowId) {
      toast({
        title: "Save workflow first",
        description: "Please save the workflow before duplicating it.",
        variant: "destructive",
      });
      return;
    }

    try {
      const workflowNodes = nodes.map(node => ({
        id: `${node.id}-copy`,
        type: node.type || 'default',
        position: { x: node.position.x + 50, y: node.position.y + 50 },
        data: node.data,
      }));

      const workflowEdges = edges.map(edge => ({
        id: `${edge.id}-copy`,
        source: `${edge.source}-copy`,
        target: `${edge.target}-copy`,
        sourceHandle: edge.sourceHandle || undefined,
        targetHandle: edge.targetHandle || undefined,
      }));

      const duplicatedWorkflow = {
        name: `${workflowName} (Copy)`,
        flow_definition: { nodes: workflowNodes, edges: workflowEdges },
        status: 'draft' as const,
        version: 1,
      };

      const newWorkflow = await createWorkflow(duplicatedWorkflow);
      toast({
        title: "Workflow duplicated",
        description: `Created a copy of "${workflowName}".`,
      });
    } catch (error) {
      console.error('Error duplicating workflow:', error);
    }
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
        setCurrentWorkflowId(undefined);
        
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
    <div className="h-full flex flex-col bg-gray-950">
      {/* Updated Toolbar with new functionality */}
      <div className="h-16 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700 flex items-center justify-between px-6 relative z-10">
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
          {currentWorkflowId && (
            <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
              Saved
            </Badge>
          )}
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
          
          <Button variant="ghost" size="sm" onClick={handleDuplicate} className="text-gray-300">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>

          <Button variant="ghost" size="sm" onClick={handleClear} className="text-red-400 hover:bg-red-500/20">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExecute}
            disabled={executionLoading}
            className="text-green-400 hover:bg-green-500/20 disabled:opacity-50"
          >
            {executionLoading ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {executionLoading ? 'Running...' : 'Execute'}
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
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Controls 
            className="bg-gray-800 border-gray-700 [&>button]:bg-gray-800 [&>button]:border-gray-700 [&>button]:text-white [&>button:hover]:bg-gray-700" 
          />
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
            maskColor="rgb(17, 24, 39, 0.8)"
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="#374151"
            className="bg-gray-950"
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

const WorkflowBuilder = (props: WorkflowBuilderProps) => (
  <ReactFlowProvider>
    <WorkflowBuilderInner {...props} />
  </ReactFlowProvider>
);

export default WorkflowBuilder;
