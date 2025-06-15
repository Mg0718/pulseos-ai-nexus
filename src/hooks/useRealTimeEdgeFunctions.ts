
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeEdgeFunctions = () => {
  const { toast } = useToast();

  // Function to call compliance audit
  const runComplianceAudit = useCallback(async (orgId: string, regions: string[] = ['GDPR', 'SOC2']) => {
    try {
      const { data, error } = await supabase.functions.invoke('run-compliance-audit', {
        body: { org_id: orgId, regions }
      });

      if (error) throw error;

      toast({
        title: "Compliance Audit Complete",
        description: `Audit score: ${data.compliance_score}%. Found ${data.audit_results.length} items.`,
      });

      return data;
    } catch (error) {
      toast({
        title: "Audit Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Function to execute flow
  const executeFlow = useCallback(async (flowId: string, payload: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('execute-flow-trigger', {
        body: { flow_id: flowId, trigger_payload: payload }
      });

      if (error) throw error;

      toast({
        title: "Flow Executed",
        description: `Flow completed in ${data.execution_time_ms}ms`,
      });

      return data;
    } catch (error) {
      toast({
        title: "Flow Execution Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Function to sync connector data
  const syncConnector = useCallback(async (connectorId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sync-connector-data', {
        body: { connector_id: connectorId }
      });

      if (error) throw error;

      toast({
        title: "Sync Complete",
        description: `Processed ${data.records_processed} records`,
      });

      return data;
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Function to update presence
  const updatePresence = useCallback(async (userId: string, status: 'online' | 'away' | 'busy' | 'offline') => {
    try {
      const { data, error } = await supabase.functions.invoke('update-presence-status', {
        body: { user_id: userId, status }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Presence update failed:', error);
      throw error;
    }
  }, []);

  // Set up real-time listeners
  useEffect(() => {
    // Listen for audit events
    const auditChannel = supabase
      .channel('audit_events')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'audit_events' },
        (payload) => {
          const event = payload.new;
          if (event.severity === 'high' || event.severity === 'critical') {
            toast({
              title: "Critical Compliance Issue",
              description: event.description,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    // Listen for compliance tasks
    const tasksChannel = supabase
      .channel('compliance_tasks')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'compliance_tasks' },
        (payload) => {
          const task = payload.new;
          if (task.priority === 'urgent' || task.priority === 'high') {
            toast({
              title: "New High Priority Task",
              description: task.title,
            });
          }
        }
      )
      .subscribe();

    // Listen for presence updates
    const presenceChannel = supabase
      .channel('presence_updates')
      .on('broadcast', { event: 'presence_change' }, (payload) => {
        console.log('Presence updated:', payload);
        // Update UI accordingly
      })
      .subscribe();

    return () => {
      supabase.removeChannel(auditChannel);
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [toast]);

  return {
    runComplianceAudit,
    executeFlow,
    syncConnector,
    updatePresence
  };
};
