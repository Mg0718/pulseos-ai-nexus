
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

    const { user_id, status = 'online' } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    console.log(`Updating presence for user: ${user_id} to ${status}`);

    // Update or insert presence status
    const { data: presence, error } = await supabaseClient
      .from('presence_status')
      .upsert({
        user_id,
        status,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Clean up stale presence entries (offline > 5 minutes)
    const staleThreshold = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    await supabaseClient
      .from('presence_status')
      .update({ status: 'offline' })
      .lt('last_seen', staleThreshold)
      .neq('status', 'offline');

    // Broadcast presence update via Supabase Realtime
    const channel = supabaseClient.channel('presence_updates');
    
    await channel.send({
      type: 'broadcast',
      event: 'presence_change',
      payload: {
        user_id,
        status,
        timestamp: new Date().toISOString()
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        presence,
        message: 'Presence updated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Presence update error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
