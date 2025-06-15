
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Copy,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useWorkflows } from '@/hooks/useWorkflows';
import { useToast } from '@/hooks/use-toast';

interface WorkflowsListProps {
  onCreateNew: () => void;
  onEditWorkflow: (workflowId: string) => void;
}

const WorkflowsList = ({ onCreateNew, onEditWorkflow }: WorkflowsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'paused' | 'archived'>('all');
  const { workflows, loading, deleteWorkflow, executeWorkflow, updateWorkflow } = useWorkflows();
  const { toast } = useToast();

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (workflowId: string, newStatus: 'active' | 'paused') => {
    try {
      await updateWorkflow(workflowId, { status: newStatus });
      toast({
        title: `Workflow ${newStatus}`,
        description: `Workflow has been ${newStatus === 'active' ? 'activated' : 'paused'}.`,
      });
    } catch (error) {
      console.error('Error updating workflow status:', error);
    }
  };

  const handleDelete = async (workflowId: string, workflowName: string) => {
    if (window.confirm(`Are you sure you want to delete "${workflowName}"?`)) {
      await deleteWorkflow(workflowId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'archived': return <XCircle className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-orange-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Workflows</h2>
          <p className="text-white/70">Manage and monitor your automation workflows</p>
        </div>
        <Button onClick={onCreateNew} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'draft', 'active', 'paused', 'archived'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status as any)}
                  className={statusFilter === status 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Activity className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No workflows found</h3>
          <p className="text-white/60 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria or filters' 
              : 'Get started by creating your first automation workflow'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button onClick={onCreateNew} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Workflow
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(workflow.status)}
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditWorkflow(workflow.id!)}
                        className="h-8 w-8 p-0 text-white/60 hover:text-white"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(workflow.id!, workflow.name)}
                        className="h-8 w-8 p-0 text-white/60 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                    {workflow.name}
                  </CardTitle>
                  
                  {workflow.description && (
                    <CardDescription className="text-white/70">
                      {workflow.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-white/60">
                      <Activity className="w-3 h-3" />
                      {workflow.flow_definition.nodes?.length || 0} nodes
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <Clock className="w-3 h-3" />
                      v{workflow.version}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {workflow.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(workflow.id!, 'paused')}
                        className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(workflow.id!, 'active')}
                        className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={() => executeWorkflow(workflow.id!)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Run
                    </Button>
                  </div>

                  {/* Last updated */}
                  <div className="text-xs text-white/50 pt-2 border-t border-white/10">
                    Updated {new Date(workflow.updated_at!).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowsList;
