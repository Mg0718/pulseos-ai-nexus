
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, List, History } from 'lucide-react';
import NodeSidebar from './NodeSidebar';
import WorkflowBuilder from './WorkflowBuilder';
import WorkflowsList from './WorkflowsList';
import ExecutionHistory from './ExecutionHistory';

const EnhancedFlowCanvas = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingWorkflowId(null);
    setSelectedTemplateId(null);
    setActiveTab('builder');
  };

  const handleEditWorkflow = (workflowId: string) => {
    setEditingWorkflowId(workflowId);
    setSelectedTemplateId(null);
    setActiveTab('builder');
  };

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setEditingWorkflowId(null);
    setActiveTab('builder');
  };

  return (
    <div className="h-full flex bg-gray-950">
      {/* Node Sidebar - Only show in builder mode */}
      {activeTab === 'builder' && (
        <NodeSidebar />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-shrink-0 px-6 pt-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
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
          </div>

          <div className="flex-1 min-h-0">
            <TabsContent value="list" className="h-full m-0 p-6">
              <div className="space-y-6">
                <WorkflowsList 
                  onCreateNew={handleCreateNew}
                  onEditWorkflow={handleEditWorkflow}
                />
                
                <div className="border-t border-white/20 pt-6">
                  <h3 className="text-white text-lg font-semibold mb-4">Or start with a template:</h3>
                  <FlowTemplates onUseTemplate={handleUseTemplate} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="builder" className="h-full m-0">
              <WorkflowBuilder 
                workflowId={editingWorkflowId || undefined} 
                templateId={selectedTemplateId || undefined}
              />
            </TabsContent>

            <TabsContent value="history" className="h-full m-0 p-6">
              <ExecutionHistory />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// Add import for FlowTemplates
import FlowTemplates from './FlowTemplates';
