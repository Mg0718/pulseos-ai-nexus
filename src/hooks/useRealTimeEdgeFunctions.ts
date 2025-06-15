
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
        description: `Audit score: ${data?.compliance_score || 0}%. Found ${data?.audit_results?.length || 0} items.`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Audit Failed",
        description: error?.message || "Unknown error occurred",
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
        description: `Flow completed in ${data?.execution_time_ms || 0}ms`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Flow Execution Failed",
        description: error?.message || "Unknown error occurred",
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
        description: `Processed ${data?.records_processed || 0} records`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error?.message || "Unknown error occurred",
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
    } catch (error: any) {
      console.error('Presence update failed:', error);
      throw error;
    }
  }, []);

  // Set up real-time listeners
  useEffect(() => {
    let auditChannel: any;
    let tasksChannel: any;
    let presenceChannel: any;

    try {
      // Listen for audit events
      auditChannel = supabase
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
      tasksChannel = supabase
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
      presenceChannel = supabase
        .channel('presence_updates')
        .on('broadcast', { event: 'presence_change' }, (payload) => {
          console.log('Presence updated:', payload);
          // Update UI accordingly
        })
        .subscribe();
    } catch (error) {
      console.error('Error setting up real-time listeners:', error);
    }

    return () => {
      try {
        if (auditChannel) supabase.removeChannel(auditChannel);
        if (tasksChannel) supabase.removeChannel(tasksChannel);
        if (presenceChannel) supabase.removeChannel(presenceChannel);
      } catch (error) {
        console.error('Error cleaning up channels:', error);
      }
    };
  }, [toast]);

  return {
    runComplianceAudit,
    executeFlow,
    syncConnector,
    updatePresence
  };
};
