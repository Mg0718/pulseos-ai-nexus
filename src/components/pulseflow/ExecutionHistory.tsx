
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  PlayCircle,
  Eye,
  Filter,
  Calendar,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  input_data?: any;
  output_data?: any;
  error_message?: string;
  execution_time_ms?: number;
  started_at: string;
  completed_at?: string;
  workflows?: {
    name: string;
  };
}

const ExecutionHistory = () => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'completed' | 'failed' | 'cancelled'>('all');
  const { toast } = useToast();

  const fetchExecutions = async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_executions')
        .select(`
          *,
          workflows:workflow_id (name)
        `)
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setExecutions(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching executions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, []);

  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = execution.workflows?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || execution.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running': return <PlayCircle className="w-4 h-4 text-blue-400" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'running': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'cancelled': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
          <h2 className="text-2xl font-bold text-white mb-2">Execution History</h2>
          <p className="text-white/70">Monitor workflow execution results and performance</p>
        </div>
        <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 w-fit">
          {filteredExecutions.length} Executions
        </Badge>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Search by workflow name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'running', 'completed', 'failed', 'cancelled'].map((status) => (
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
                  <Filter className="w-3 h-3 mr-1" />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executions List */}
      {filteredExecutions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Activity className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No executions found</h3>
          <p className="text-white/60">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria or filters' 
              : 'No workflow executions have been recorded yet'
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredExecutions.map((execution, index) => (
            <motion.div
              key={execution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(execution.status)}
                      <div>
                        <h3 className="text-white font-medium">
                          {execution.workflows?.name || 'Unknown Workflow'}
                        </h3>
                        <p className="text-white/60 text-sm">
                          Started {formatDateTime(execution.started_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                        <p className="text-white/60 text-xs mt-1">
                          Duration: {formatDuration(execution.execution_time_ms)}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {execution.error_message && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-300 text-sm font-medium">Error:</p>
                      <p className="text-red-200 text-sm">{execution.error_message}</p>
                    </div>
                  )}

                  {execution.completed_at && (
                    <div className="mt-3 text-white/50 text-xs">
                      Completed {formatDateTime(execution.completed_at)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExecutionHistory;
