
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    console.log('Running scheduled compliance audit...');

    // Get all active organizations
    const { data: orgs } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('employment_status', 'active')
      .limit(100); // Process in batches

    if (orgs) {
      for (const org of orgs) {
        // Call the compliance audit function for each org
        const auditResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/run-compliance-audit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          body: JSON.stringify({
            org_id: org.id,
            regions: ['GDPR', 'SOC2', 'US_LABOR']
          })
        });

        if (auditResponse.ok) {
          console.log(`Audit completed for org: ${org.id}`);
        } else {
          console.error(`Audit failed for org: ${org.id}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Scheduled compliance audit completed',
        orgs_processed: orgs?.length || 0 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scheduled audit error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
