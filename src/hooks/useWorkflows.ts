import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  flow_definition: {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  };
  status: 'draft' | 'active' | 'paused' | 'archived';
  version: number;
  created_at?: string;
  updated_at?: string;
}

export const useWorkflows = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('workflows' as any)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setWorkflows((data as any[])?.map(item => item as Workflow) || []);
    } catch (error: any) {
      toast({
        title: "Error fetching workflows",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workflows' as any)
        .insert([{
          ...workflow,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newWorkflow = data as any as Workflow;
      setWorkflows(prev => [newWorkflow, ...prev]);
      toast({
        title: "Workflow created",
        description: "Your workflow has been created successfully.",
      });
      
      return newWorkflow;
    } catch (error: any) {
      toast({
        title: "Error creating workflow",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<Workflow>) => {
    try {
      const { data, error } = await supabase
        .from('workflows' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedWorkflow = data as any as Workflow;
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    } catch (error: any) {
      toast({
        title: "Error updating workflow",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workflows' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setWorkflows(prev => prev.filter(w => w.id !== id));
      toast({
        title: "Workflow deleted",
        description: "Your workflow has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting workflow",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const executeWorkflow = async (id: string, inputData?: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('execute-workflow', {
        body: { workflowId: id, inputData }
      });

      if (error) throw error;

      toast({
        title: "Workflow execution started",
        description: `Execution completed in ${data?.executionTime || 0}ms`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error executing workflow",
        description: error?.message || "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  return {
    workflows,
    loading,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow,
    refetch: fetchWorkflows,
  };
};
