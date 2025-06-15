
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

    const { connector_id } = await req.json();
    
    console.log(`Starting sync for connector: ${connector_id}`);

    // Get connector details
    const { data: connector, error: connectorError } = await supabaseClient
      .from('connectors')
      .select('*')
      .eq('id', connector_id)
      .eq('status', 'active')
      .single();

    if (connectorError || !connector) {
      throw new Error('Connector not found or inactive');
    }

    // Create sync job
    const { data: syncJob, error: jobError } = await supabaseClient
      .from('sync_jobs')
      .insert({
        connector_id,
        status: 'running'
      })
      .select()
      .single();

    if (jobError) {
      throw new Error('Failed to create sync job');
    }

    try {
      const syncResult = await performSync(connector, supabaseClient);
      
      // Update sync job with success
      await supabaseClient
        .from('sync_jobs')
        .update({
          status: 'completed',
          records_processed: syncResult.recordsProcessed,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncJob.id);

      // Update connector last sync time
      await supabaseClient
        .from('connectors')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connector_id);

      return new Response(
        JSON.stringify({
          success: true,
          sync_job_id: syncJob.id,
          records_processed: syncResult.recordsProcessed,
          summary: syncResult.summary
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (syncError) {
      // Update sync job with failure
      await supabaseClient
        .from('sync_jobs')
        .update({
          status: 'failed',
          error_message: syncError.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncJob.id);

      throw syncError;
    }

  } catch (error) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

async function performSync(connector: any, supabaseClient: any) {
  const { provider_name, provider_type, config } = connector;
  
  console.log(`Syncing ${provider_name} (${provider_type})`);
  
  let recordsProcessed = 0;
  const summary: any = {};
  
  switch (provider_name.toLowerCase()) {
    case 'salesforce':
      return await syncSalesforce(config, supabaseClient);
      
    case 'hubspot':
      return await syncHubspot(config, supabaseClient);
      
    case 'stripe':
      return await syncStripe(config, supabaseClient);
      
    case 'slack':
      return await syncSlack(config, supabaseClient);
      
    default:
      // Generic sync for other providers
      return await genericSync(connector, supabaseClient);
  }
}

async function syncSalesforce(config: any, supabaseClient: any) {
  // Salesforce API integration
  console.log('Syncing Salesforce data...');
  
  // This would use actual Salesforce API
  const mockContacts = [
    { id: 'sf_1', name: 'John Doe', email: 'john@example.com', company: 'Acme Corp' },
    { id: 'sf_2', name: 'Jane Smith', email: 'jane@example.com', company: 'Tech Inc' }
  ];
  
  // Transform and store in PulseOS
  for (const contact of mockContacts) {
    await supabaseClient.from('profiles').upsert({
      id: contact.id,
      full_name: contact.name,
      email: contact.email,
      company: contact.company,
      source: 'salesforce'
    }, { onConflict: 'id' });
  }
  
  return {
    recordsProcessed: mockContacts.length,
    summary: { contacts_synced: mockContacts.length }
  };
}

async function syncHubspot(config: any, supabaseClient: any) {
  console.log('Syncing HubSpot data...');
  
  // Mock HubSpot contacts
  const mockContacts = [
    { id: 'hs_1', firstname: 'Alice', lastname: 'Johnson', email: 'alice@company.com' },
    { id: 'hs_2', firstname: 'Bob', lastname: 'Wilson', email: 'bob@startup.com' }
  ];
  
  for (const contact of mockContacts) {
    await supabaseClient.from('profiles').upsert({
      id: contact.id,
      full_name: `${contact.firstname} ${contact.lastname}`,
      email: contact.email,
      source: 'hubspot'
    }, { onConflict: 'id' });
  }
  
  return {
    recordsProcessed: mockContacts.length,
    summary: { contacts_synced: mockContacts.length }
  };
}

async function syncStripe(config: any, supabaseClient: any) {
  console.log('Syncing Stripe data...');
  
  // Mock Stripe transactions
  const mockTransactions = [
    { id: 'txn_1', amount: 5000, currency: 'usd', customer: 'cus_1', status: 'succeeded' },
    { id: 'txn_2', amount: 7500, currency: 'usd', customer: 'cus_2', status: 'succeeded' }
  ];
  
  for (const transaction of mockTransactions) {
    await supabaseClient.from('transactions').upsert({
      id: transaction.id,
      amount: transaction.amount / 100, // Convert from cents
      currency: transaction.currency.toUpperCase(),
      stripe_payment_id: transaction.id,
      status: transaction.status === 'succeeded' ? 'completed' : 'pending'
    }, { onConflict: 'stripe_payment_id' });
  }
  
  return {
    recordsProcessed: mockTransactions.length,
    summary: { transactions_synced: mockTransactions.length }
  };
}

async function syncSlack(config: any, supabaseClient: any) {
  console.log('Syncing Slack data...');
  
  // Mock Slack channels and messages
  const mockChannels = [
    { id: 'C123', name: 'general', purpose: 'General discussion' },
    { id: 'C456', name: 'engineering', purpose: 'Engineering team' }
  ];
  
  for (const channel of mockChannels) {
    await supabaseClient.from('channels').upsert({
      id: channel.id,
      name: channel.name,
      description: channel.purpose,
      type: 'public',
      source: 'slack'
    }, { onConflict: 'id' });
  }
  
  return {
    recordsProcessed: mockChannels.length,
    summary: { channels_synced: mockChannels.length }
  };
}

async function genericSync(connector: any, supabaseClient: any) {
  console.log(`Generic sync for ${connector.provider_name}`);
  
  // Placeholder for generic provider sync
  return {
    recordsProcessed: 0,
    summary: { message: 'Generic sync completed' }
  };
}
