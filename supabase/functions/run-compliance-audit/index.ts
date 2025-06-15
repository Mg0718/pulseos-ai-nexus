
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

    const { org_id, regions = ['GDPR', 'SOC2'] } = await req.json();

    console.log(`Running compliance audit for org: ${org_id}`);

    const auditResults = [];
    let complianceScore = 100;

    // GDPR Compliance Checks
    if (regions.includes('GDPR')) {
      // Check for old user data (GDPR data retention)
      const { data: oldProfiles } = await supabaseClient
        .from('profiles')
        .select('id, created_at')
        .lt('created_at', new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000).toISOString());

      if (oldProfiles && oldProfiles.length > 0) {
        const auditEvent = {
          org_id,
          event_type: 'GDPR_DATA_RETENTION',
          severity: 'high',
          description: `Found ${oldProfiles.length} user profiles older than 3 years`,
          metadata: { affected_profiles: oldProfiles.length, regulation: 'GDPR' }
        };

        await supabaseClient.from('audit_events').insert(auditEvent);
        
        // Create compliance task
        await supabaseClient.from('compliance_tasks').insert({
          org_id,
          title: 'Review old user data for GDPR compliance',
          description: 'Review and potentially purge user data older than 3 years',
          priority: 'high',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        complianceScore -= 15;
        auditResults.push(auditEvent);
      }
    }

    // SOC 2 Compliance Checks
    if (regions.includes('SOC2')) {
      // Check for access by inactive users
      const { data: inactiveUsers } = await supabaseClient
        .from('profiles')
        .select('id, employment_status')
        .eq('employment_status', 'inactive');

      if (inactiveUsers && inactiveUsers.length > 0) {
        // Check if any inactive users have recent login activity
        // This would require auth logs which we'll simulate
        const auditEvent = {
          org_id,
          event_type: 'SOC2_ACCESS_CONTROL',
          severity: 'medium',
          description: `Found ${inactiveUsers.length} inactive users with potential access`,
          metadata: { inactive_users: inactiveUsers.length, regulation: 'SOC2' }
        };

        await supabaseClient.from('audit_events').insert(auditEvent);
        
        await supabaseClient.from('compliance_tasks').insert({
          org_id,
          title: 'Review access for inactive users',
          description: 'Revoke access for users with inactive employment status',
          priority: 'medium',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        complianceScore -= 10;
        auditResults.push(auditEvent);
      }
    }

    // Labor Law Compliance (Example: Leave balance checks)
    const { data: employees } = await supabaseClient
      .from('profiles')
      .select('id, hire_date, location')
      .eq('employment_status', 'active');

    if (employees) {
      for (const employee of employees) {
        const hireDate = new Date(employee.hire_date);
        const yearsEmployed = (Date.now() - hireDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
        
        // US: Minimum 2 weeks vacation after 1 year
        if (employee.location === 'US' && yearsEmployed >= 1) {
          // This would check against actual leave records
          const minVacationDays = Math.floor(yearsEmployed) * 10; // Simplified calculation
          
          const auditEvent = {
            org_id,
            event_type: 'LABOR_LAW_LEAVE',
            severity: 'low',
            description: `Employee ${employee.id} may need leave balance review`,
            metadata: { employee_id: employee.id, required_days: minVacationDays, regulation: 'US_LABOR' }
          };

          auditResults.push(auditEvent);
        }
      }
    }

    console.log(`Compliance audit completed. Score: ${complianceScore}`);

    return new Response(
      JSON.stringify({
        success: true,
        compliance_score: complianceScore,
        audit_results: auditResults,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Compliance audit error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
