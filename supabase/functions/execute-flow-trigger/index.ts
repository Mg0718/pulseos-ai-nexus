
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { flow_id, trigger_payload } = await req.json();
    const startTime = Date.now();
    
    console.log(`Executing flow: ${flow_id} with payload:`, trigger_payload);

    // Get flow definition
    const { data: flow, error: flowError } = await supabaseClient
      .from('flows')
      .select('*')
      .eq('id', flow_id)
      .eq('status', 'active')
      .single();

    if (flowError || !flow) {
      throw new Error('Flow not found or inactive');
    }

    // Create flow run record
    const { data: flowRun, error: runError } = await supabaseClient
      .from('flow_runs')
      .insert({
        flow_id,
        status: 'running',
        input_data: trigger_payload
      })
      .select()
      .single();

    if (runError) {
      throw new Error('Failed to create flow run');
    }

    try {
      // Parse and execute flow definition
      const result = await executeFlowNodes(flow.flow_definition, trigger_payload, supabaseClient);
      
      const executionTime = Date.now() - startTime;
      
      // Update flow run with success
      await supabaseClient
        .from('flow_runs')
        .update({
          status: 'completed',
          output_data: result,
          execution_time_ms: executionTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', flowRun.id);

      return new Response(
        JSON.stringify({
          success: true,
          flow_run_id: flowRun.id,
          result,
          execution_time_ms: executionTime
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (executionError) {
      // Update flow run with failure
      await supabaseClient
        .from('flow_runs')
        .update({
          status: 'failed',
          error_message: executionError.message,
          execution_time_ms: Date.now() - startTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', flowRun.id);

      throw executionError;
    }

  } catch (error) {
    console.error('Flow execution error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

async function executeFlowNodes(flowDefinition: any, payload: any, supabaseClient: any) {
  const { nodes, edges } = flowDefinition;
  
  console.log('Executing flow with nodes:', nodes.length);
  
  let currentData = payload;
  const results: any[] = [];
  
  // Find trigger node
  const triggerNode = nodes.find((node: any) => node.type === 'trigger');
  if (!triggerNode) {
    throw new Error('No trigger node found');
  }
  
  // Execute nodes in sequence based on edges
  let currentNodeId = triggerNode.id;
  
  while (currentNodeId) {
    const currentNode = nodes.find((node: any) => node.id === currentNodeId);
    if (!currentNode) break;
    
    console.log(`Executing node: ${currentNode.type}`);
    
    switch (currentNode.type) {
      case 'trigger':
        // Trigger node just passes data through
        results.push({ nodeId: currentNodeId, type: 'trigger', output: currentData });
        break;
        
      case 'condition':
        const conditionResult = evaluateCondition(currentNode.data, currentData);
        results.push({ nodeId: currentNodeId, type: 'condition', output: conditionResult });
        
        if (!conditionResult.passed) {
          console.log('Condition failed, stopping execution');
          return results;
        }
        break;
        
      case 'action':
        const actionResult = await executeAction(currentNode.data, currentData, supabaseClient);
        results.push({ nodeId: currentNodeId, type: 'action', output: actionResult });
        currentData = { ...currentData, ...actionResult };
        break;
        
      default:
        console.log(`Unknown node type: ${currentNode.type}`);
    }
    
    // Find next node
    const nextEdge = edges.find((edge: any) => edge.source === currentNodeId);
    currentNodeId = nextEdge ? nextEdge.target : null;
  }
  
  return results;
}

function evaluateCondition(conditionData: any, payload: any) {
  const { field, operator, value } = conditionData;
  const fieldValue = payload[field];
  
  let passed = false;
  
  switch (operator) {
    case 'equals':
      passed = fieldValue === value;
      break;
    case 'not_equals':
      passed = fieldValue !== value;
      break;
    case 'greater_than':
      passed = Number(fieldValue) > Number(value);
      break;
    case 'less_than':
      passed = Number(fieldValue) < Number(value);
      break;
    case 'contains':
      passed = String(fieldValue).includes(String(value));
      break;
    default:
      passed = false;
  }
  
  return { passed, field, operator, value, fieldValue };
}

async function executeAction(actionData: any, payload: any, supabaseClient: any) {
  const { actionType, config } = actionData;
  
  switch (actionType) {
    case 'create_task':
      const task = await supabaseClient
        .from('compliance_tasks')
        .insert({
          org_id: payload.org_id,
          title: config.title || 'Automated Task',
          description: config.description || 'Created by PulseFlow',
          priority: config.priority || 'medium'
        })
        .select()
        .single();
      
      return { task_created: task.data };
      
    case 'send_notification':
      // Placeholder for notification logic
      console.log('Sending notification:', config.message);
      return { notification_sent: true, message: config.message };
      
    case 'update_record':
      const updated = await supabaseClient
        .from(config.table)
        .update(config.updates)
        .eq('id', config.record_id)
        .select()
        .single();
      
      return { record_updated: updated.data };
      
    default:
      return { action: actionType, status: 'not_implemented' };
  }
}
