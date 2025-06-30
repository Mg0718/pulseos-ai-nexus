
import { useState, useCallback } from 'react';
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
}

export const useWorkflowExecution = () => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const executeWorkflow = useCallback(async (workflowId: string, inputData?: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('execute-workflow', {
        body: { workflowId, inputData }
      });

      if (error) throw error;

      toast({
        title: "Workflow execution started",
        description: `Execution ${data?.success ? 'completed successfully' : 'failed'}`,
        variant: data?.success ? "default" : "destructive",
      });

      // Refresh executions list
      await fetchExecutions();
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error executing workflow",
        description: error?.message || "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchExecutions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('workflow_executions' as any)
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      setExecutions((data as any[])?.map(item => item as WorkflowExecution) || []);
    } catch (error: any) {
      console.error('Error fetching executions:', error);
    }
  }, []);

  const cancelExecution = useCallback(async (executionId: string) => {
    try {
      const { error } = await supabase
        .from('workflow_executions' as any)
        .update({ status: 'cancelled' })
        .eq('id', executionId);

      if (error) throw error;

      toast({
        title: "Execution cancelled",
        description: "The workflow execution has been cancelled successfully.",
      });

      await fetchExecutions();
    } catch (error: any) {
      toast({
        title: "Error cancelling execution",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast, fetchExecutions]);

  return {
    executions,
    loading,
    executeWorkflow,
    fetchExecutions,
    cancelExecution,
  };
};
