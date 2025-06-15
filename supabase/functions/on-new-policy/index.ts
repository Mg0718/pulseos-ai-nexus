
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

    const { record } = await req.json();
    
    console.log('Processing new policy:', record);

    // Validate policy completeness
    const completeness = validatePolicyCompleteness(record);
    
    if (!completeness.isComplete) {
      // Create task for policy completion
      await supabaseClient.from('compliance_tasks').insert({
        org_id: record.org_id,
        title: `Complete policy: ${record.name}`,
        description: `Missing: ${completeness.missing.join(', ')}`,
        priority: 'medium',
        assigned_to: record.created_by,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    // Auto-link to affected teams based on category
    const affectedTeams = getAffectedTeams(record.category);
    
    // Create onboarding tasks for managers
    for (const teamId of affectedTeams) {
      await supabaseClient.from('compliance_tasks').insert({
        org_id: record.org_id,
        title: `Review new ${record.category} policy`,
        description: `New policy "${record.name}" requires team review and acknowledgment`,
        priority: 'medium',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    // Log audit event
    await supabaseClient.from('audit_events').insert({
      org_id: record.org_id,
      event_type: 'POLICY_CREATED',
      severity: 'low',
      description: `New ${record.category} policy created: ${record.name}`,
      metadata: { 
        policy_id: record.id, 
        category: record.category,
        completeness: completeness.score 
      }
    });

    return new Response(
      JSON.stringify({ success: true, completeness }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Policy processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function validatePolicyCompleteness(policy: any) {
  const required = ['name', 'content', 'category'];
  const missing = required.filter(field => !policy[field] || policy[field].trim() === '');
  
  const score = ((required.length - missing.length) / required.length) * 100;
  
  return {
    isComplete: missing.length === 0,
    missing,
    score
  };
}

function getAffectedTeams(category: string): string[] {
  // Simplified team mapping based on policy category
  const teamMapping: Record<string, string[]> = {
    'HR': ['hr-team', 'management'],
    'Security': ['security-team', 'it-team', 'management'],
    'Finance': ['finance-team', 'management'],
    'Operations': ['ops-team', 'management']
  };
  
  return teamMapping[category] || ['management'];
}
