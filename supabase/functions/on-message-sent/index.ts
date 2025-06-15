
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
    
    console.log('Processing new message:', record);

    const results = [];

    // Process @mentions
    const mentions = extractMentions(record.content);
    
    for (const mention of mentions) {
      // Get mentioned user details
      const { data: mentionedUser } = await supabaseClient
        .from('profiles')
        .select('id, full_name')
        .eq('id', mention.user_id)
        .single();

      if (mentionedUser) {
        // Create notification (this could be expanded to send push/email)
        console.log(`Sending mention notification to ${mentionedUser.full_name}`);
        
        results.push({
          type: 'mention_notification',
          user_id: mention.user_id,
          message_id: record.id,
          sent: true
        });
      }
    }

    // Check for PulseFlow triggers in message content
    const flowTriggers = extractFlowTriggers(record.content);
    
    for (const trigger of flowTriggers) {
      switch (trigger.action) {
        case 'create_task':
          // Trigger PulseFlow to create a task
          const flowPayload = {
            trigger_type: 'message_command',
            message_id: record.id,
            user_id: record.user_id,
            channel_id: record.channel_id,
            task_title: trigger.parameters.title || 'Task from message',
            task_description: trigger.parameters.description || record.content
          };

          // This would call the execute-flow-trigger function
          console.log('Triggering task creation flow:', flowPayload);
          
          results.push({
            type: 'flow_triggered',
            action: 'create_task',
            payload: flowPayload
          });
          break;

        case 'start_meeting':
          // Trigger meeting creation
          console.log('Triggering meeting creation');
          
          results.push({
            type: 'meeting_triggered',
            action: 'start_meeting',
            channel_id: record.channel_id
          });
          break;

        case 'create_reminder':
          // Trigger reminder creation
          console.log('Triggering reminder creation');
          
          results.push({
            type: 'reminder_triggered',
            action: 'create_reminder',
            reminder_time: trigger.parameters.time,
            message: trigger.parameters.message
          });
          break;
      }
    }

    // Broadcast message via Supabase Realtime
    const channel = supabaseClient.channel(`channel_${record.channel_id}`);
    
    await channel.send({
      type: 'broadcast',
      event: 'new_message',
      payload: record
    });

    return new Response(
      JSON.stringify({
        success: true,
        processed_items: results,
        mentions_count: mentions.length,
        triggers_count: flowTriggers.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Message processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function extractMentions(content: string) {
  const mentionRegex = /@([a-zA-Z0-9-_]+)/g;
  const mentions = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      username: match[1],
      user_id: match[1] // In a real app, you'd resolve username to user_id
    });
  }

  return mentions;
}

function extractFlowTriggers(content: string) {
  const triggers = [];

  // Check for slash commands
  const taskRegex = /\/task\s+(.+)/i;
  const meetingRegex = /\/meeting\s*(.+)?/i;
  const reminderRegex = /\/remind\s+(.+)\s+in\s+(\d+)\s*(minutes?|hours?|days?)/i;

  const taskMatch = content.match(taskRegex);
  if (taskMatch) {
    triggers.push({
      action: 'create_task',
      parameters: {
        title: taskMatch[1].trim(),
        description: taskMatch[1].trim()
      }
    });
  }

  const meetingMatch = content.match(meetingRegex);
  if (meetingMatch) {
    triggers.push({
      action: 'start_meeting',
      parameters: {
        topic: meetingMatch[1] ? meetingMatch[1].trim() : 'Quick Meeting'
      }
    });
  }

  const reminderMatch = content.match(reminderRegex);
  if (reminderMatch) {
    const [, message, amount, unit] = reminderMatch;
    triggers.push({
      action: 'create_reminder',
      parameters: {
        message: message.trim(),
        time: `${amount} ${unit}`
      }
    });
  }

  return triggers;
}
