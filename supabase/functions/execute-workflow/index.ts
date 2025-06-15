
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
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

    console.log('Executing workflow:', workflowId, 'with input:', inputData);

    // Get workflow definition
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (workflowError || !workflow) {
      console.error('Workflow not found:', workflowError);
      throw new Error('Workflow not found');
    }

    console.log('Found workflow:', workflow.name);

    // Create execution record
    const { data: execution, error: executionError } = await supabase
      .from('workflow_executions')
      .insert({
        workflow_id: workflowId,
        status: 'running',
        input_data: inputData || {},
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (executionError) {
      console.error('Failed to create execution record:', executionError);
      throw new Error('Failed to create execution record');
    }

    console.log('Created execution record:', execution.id);

    const startTime = Date.now();
    const nodes: WorkflowNode[] = workflow.flow_definition?.nodes || [];
    const edges: WorkflowEdge[] = workflow.flow_definition?.edges || [];

    console.log('Workflow has', nodes.length, 'nodes and', edges.length, 'edges');

    // Find trigger nodes to start execution
    const triggerNodes = nodes.filter(node => node.type === 'trigger');
    console.log('Found trigger nodes:', triggerNodes.length);

    const nodeExecutions = new Map();
    let hasError = false;
    let errorMessage = '';

    // Execute workflow nodes
    try {
      for (const triggerNode of triggerNodes) {
        console.log('Executing trigger node:', triggerNode.id);
        await executeNodeChain(triggerNode, nodes, edges, nodeExecutions, inputData);
      }
      console.log('Workflow execution completed successfully');
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

    console.log('Updated execution record with status:', hasError ? 'failed' : 'completed');

    return new Response(
      JSON.stringify({
        success: !hasError,
        executionId: execution.id,
        executionTime,
        nodeExecutions: Object.fromEntries(nodeExecutions),
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
  contextData: any
): Promise<any> {
  
  // Skip if already executed
  if (nodeExecutions.has(currentNode.id)) {
    return nodeExecutions.get(currentNode.id);
  }

  console.log('Executing node:', currentNode.id, 'type:', currentNode.type);

  let result;
  try {
    // Execute node based on type
    result = await executeNode(currentNode, contextData);
    nodeExecutions.set(currentNode.id, result);
    console.log('Node executed successfully:', currentNode.id, 'result:', result);
  } catch (error: any) {
    console.error(`Error executing node ${currentNode.id}:`, error);
    throw error;
  }

  // Find and execute next nodes
  const nextEdges = edges.filter(edge => edge.source === currentNode.id);
  console.log('Found', nextEdges.length, 'outgoing edges from node', currentNode.id);

  for (const edge of nextEdges) {
    const nextNode = allNodes.find(node => node.id === edge.target);
    if (nextNode) {
      console.log('Executing next node:', nextNode.id);
      await executeNodeChain(nextNode, allNodes, edges, nodeExecutions, result || contextData);
    }
  }

  return result;
}

async function executeNode(node: WorkflowNode, inputData: any): Promise<any> {
  const { type, data } = node;

  switch (type) {
    case 'trigger':
      console.log('Executing trigger node with data:', data);
      return inputData;

    case 'action':
      return await executeAction(data, inputData);

    case 'condition':
      return await executeCondition(data, inputData);

    case 'delay':
      return await executeDelay(data, inputData);

    default:
      console.log('Unknown node type:', type, 'passing through data');
      return inputData;
  }
}

async function executeAction(actionData: any, inputData: any): Promise<any> {
  console.log('Executing action with data:', actionData);

  const actionType = actionData.actionType || 'log_message';

  switch (actionType) {
    case 'send_email':
      console.log(`Simulating email send to: ${actionData.emailTo || 'user@example.com'}`);
      console.log(`Subject: ${actionData.emailSubject || 'Default Subject'}`);
      console.log(`Body: ${actionData.emailBody || 'Default Body'}`);
      return { 
        success: true, 
        message: `Email sent to ${actionData.emailTo || 'user@example.com'}`,
        timestamp: new Date().toISOString()
      };

    case 'create_record':
      console.log('Simulating record creation with data:', inputData);
      return { 
        success: true, 
        recordId: `record_${Date.now()}`,
        data: inputData 
      };

    case 'log_message':
      const message = actionData.message || 'Default log message';
      console.log('Action log message:', message);
      return {
        success: true,
        message: message,
        timestamp: new Date().toISOString(),
        inputData
      };

    default:
      console.log('Unknown action type:', actionType);
      return { 
        success: true, 
        message: `Action ${actionType} executed`,
        inputData 
      };
  }
}

async function executeCondition(conditionData: any, inputData: any): Promise<any> {
  console.log('Executing condition with data:', conditionData);

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
      result = true; // Default to true for unknown operators
  }

  console.log('Condition result:', result);

  return {
    condition_met: result,
    field_value: fieldValue,
    comparison_value: value,
    operator,
    inputData
  };
}

async function executeDelay(delayData: any, inputData: any): Promise<any> {
  const duration = delayData.duration || 1;
  const unit = delayData.unit || 'seconds';
  
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

  // For demo purposes, cap delay at 5 seconds
  delayMs = Math.min(delayMs, 5000);
  
  console.log(`Delaying for ${delayMs}ms`);
  await new Promise(resolve => setTimeout(resolve, delayMs));
  
  return {
    delayed_ms: delayMs,
    completed_at: new Date().toISOString(),
    inputData
  };
}
