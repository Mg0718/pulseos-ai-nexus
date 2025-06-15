
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkflowNode {
  id: string;
  type: string;
  data: any;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { workflowId, inputData } = await req.json();

    // Get workflow definition
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (workflowError || !workflow) {
      throw new Error('Workflow not found');
    }

    // Create execution record
    const { data: execution, error: executionError } = await supabase
      .from('workflow_executions')
      .insert({
        workflow_id: workflowId,
        status: 'running',
        input_data: inputData,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (executionError) {
      throw new Error('Failed to create execution record');
    }

    const startTime = Date.now();
    const nodes: WorkflowNode[] = workflow.flow_definition.nodes || [];
    const edges: WorkflowEdge[] = workflow.flow_definition.edges || [];

    // Find trigger nodes to start execution
    const triggerNodes = nodes.filter(node => node.type === 'trigger');
    const nodeExecutions = new Map();
    let hasError = false;
    let errorMessage = '';

    // Execute workflow nodes
    try {
      for (const triggerNode of triggerNodes) {
        await executeNodeChain(triggerNode, nodes, edges, nodeExecutions, supabase, execution.id, inputData);
      }
    } catch (error: any) {
      hasError = true;
      errorMessage = error.message;
      console.error('Workflow execution error:', error);
    }

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    // Update execution record
    await supabase
      .from('workflow_executions')
      .update({
        status: hasError ? 'failed' : 'completed',
        completed_at: new Date().toISOString(),
        execution_time_ms: executionTime,
        error_message: hasError ? errorMessage : null,
        output_data: { nodeExecutions: Object.fromEntries(nodeExecutions) }
      })
      .eq('id', execution.id);

    return new Response(
      JSON.stringify({
        success: !hasError,
        executionId: execution.id,
        executionTime,
        error: hasError ? errorMessage : null
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: hasError ? 500 : 200,
      }
    );

  } catch (error: any) {
    console.error('Error in execute-workflow function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function executeNodeChain(
  currentNode: WorkflowNode,
  allNodes: WorkflowNode[],
  edges: WorkflowEdge[],
  nodeExecutions: Map<string, any>,
  supabase: any,
  executionId: string,
  contextData: any
): Promise<any> {
  
  // Skip if already executed
  if (nodeExecutions.has(currentNode.id)) {
    return nodeExecutions.get(currentNode.id);
  }

  const nodeStartTime = Date.now();
  
  // Create node execution record
  const { data: nodeExecution } = await supabase
    .from('node_executions')
    .insert({
      workflow_execution_id: executionId,
      node_id: currentNode.id,
      node_type: currentNode.type,
      status: 'running',
      input_data: contextData,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  let result;
  let hasError = false;
  let errorMessage = '';

  try {
    // Execute node based on type
    result = await executeNode(currentNode, contextData);
    nodeExecutions.set(currentNode.id, result);
  } catch (error: any) {
    hasError = true;
    errorMessage = error.message;
    console.error(`Error executing node ${currentNode.id}:`, error);
  }

  const nodeEndTime = Date.now();

  // Update node execution record
  if (nodeExecution) {
    await supabase
      .from('node_executions')
      .update({
        status: hasError ? 'failed' : 'completed',
        completed_at: new Date().toISOString(),
        execution_time_ms: nodeEndTime - nodeStartTime,
        output_data: hasError ? null : result,
        error_message: hasError ? errorMessage : null,
      })
      .eq('id', nodeExecution.id);
  }

  if (hasError) {
    throw new Error(errorMessage);
  }

  // Find and execute next nodes
  const nextEdges = edges.filter(edge => edge.source === currentNode.id);
  for (const edge of nextEdges) {
    const nextNode = allNodes.find(node => node.id === edge.target);
    if (nextNode) {
      await executeNodeChain(nextNode, allNodes, edges, nodeExecutions, supabase, executionId, result || contextData);
    }
  }

  return result;
}

async function executeNode(node: WorkflowNode, inputData: any): Promise<any> {
  const { type, data } = node;

  switch (type) {
    case 'trigger':
      // Triggers just pass through the input data
      return inputData;

    case 'action':
      return await executeAction(data, inputData);

    case 'condition':
      return await executeCondition(data, inputData);

    case 'delay':
      return await executeDelay(data, inputData);

    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

async function executeAction(actionData: any, inputData: any): Promise<any> {
  const { actionType } = actionData;

  switch (actionType) {
    case 'send_email':
      // Simulate email sending
      console.log(`Sending email to: ${actionData.emailTo}`);
      console.log(`Subject: ${actionData.emailSubject}`);
      console.log(`Body: ${actionData.emailBody}`);
      return { 
        success: true, 
        message: `Email sent to ${actionData.emailTo}`,
        timestamp: new Date().toISOString()
      };

    case 'create_record':
      // Simulate record creation
      console.log('Creating record with data:', inputData);
      return { 
        success: true, 
        recordId: `record_${Date.now()}`,
        data: inputData 
      };

    case 'api_call':
      // Simulate API call
      console.log(`Making API call to: ${actionData.url}`);
      return { 
        success: true, 
        response: { status: 200, data: { processed: true } }
      };

    default:
      throw new Error(`Unknown action type: ${actionType}`);
  }
}

async function executeCondition(conditionData: any, inputData: any): Promise<any> {
  const { field, operator, value } = conditionData;
  
  let fieldValue = inputData;
  if (field && typeof inputData === 'object') {
    fieldValue = inputData[field];
  }

  let result = false;

  switch (operator) {
    case 'equals':
      result = fieldValue == value;
      break;
    case 'contains':
      result = String(fieldValue).includes(value);
      break;
    case 'greater_than':
      result = Number(fieldValue) > Number(value);
      break;
    case 'less_than':
      result = Number(fieldValue) < Number(value);
      break;
    default:
      result = false;
  }

  return {
    condition_met: result,
    field_value: fieldValue,
    comparison_value: value,
    operator,
  };
}

async function executeDelay(delayData: any, inputData: any): Promise<any> {
  const { duration, unit } = delayData;
  
  let delayMs = 0;
  switch (unit) {
    case 'seconds':
      delayMs = duration * 1000;
      break;
    case 'minutes':
      delayMs = duration * 60 * 1000;
      break;
    case 'hours':
      delayMs = duration * 60 * 60 * 1000;
      break;
    default:
      delayMs = duration * 1000;
  }

  // For demo purposes, cap delay at 10 seconds
  delayMs = Math.min(delayMs, 10000);
  
  await new Promise(resolve => setTimeout(resolve, delayMs));
  
  return {
    delayed_ms: delayMs,
    completed_at: new Date().toISOString(),
    data: inputData
  };
}
