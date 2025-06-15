
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, List, History, Plus } from 'lucide-react';
import NodeSidebar from './NodeSidebar';
import WorkflowBuilder from './WorkflowBuilder';
import WorkflowsList from './WorkflowsList';
import ExecutionHistory from './ExecutionHistory';

const EnhancedFlowCanvas = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingWorkflowId(null);
    setActiveTab('builder');
  };

  const handleEditWorkflow = (workflowId: string) => {
    setEditingWorkflowId(workflowId);
    setActiveTab('builder');
  };

  return (
    <div className="h-full flex">
      {/* Node Sidebar - Only show in builder mode */}
      {activeTab === 'builder' && (
        <NodeSidebar />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20 mx-6 mt-6">
            <TabsTrigger 
              value="list" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <List className="w-4 h-4 mr-2" />
              Workflows
            </TabsTrigger>
            <TabsTrigger 
              value="builder"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Builder
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <History className="w-4 h-4 mr-2" />
              Executions
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6">
            <TabsContent value="list" className="h-full m-0">
              <WorkflowsList 
                onCreateNew={handleCreateNew}
                onEditWorkflow={handleEditWorkflow}
              />
            </TabsContent>

            <TabsContent value="builder" className="h-full m-0">
              <WorkflowBuilder workflowId={editingWorkflowId || undefined} />
            </TabsContent>

            <TabsContent value="history" className="h-full m-0">
              <ExecutionHistory />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedFlowCanvas;
