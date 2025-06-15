
-- Compliance Engine Tables
CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES auth.users,
  event_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  status text DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  resolved_by uuid REFERENCES auth.users
);

CREATE TABLE IF NOT EXISTS public.policies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES auth.users,
  name text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  version text DEFAULT '1.0',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users
);

CREATE TABLE IF NOT EXISTS public.compliance_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES auth.users,
  title text NOT NULL,
  description text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  assigned_to uuid REFERENCES auth.users,
  due_date date,
  audit_event_id uuid REFERENCES public.audit_events,
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- PulseFlow Tables
CREATE TABLE IF NOT EXISTS public.flows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES auth.users,
  name text NOT NULL,
  description text,
  flow_definition jsonb NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users
);

CREATE TABLE IF NOT EXISTS public.flow_runs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id uuid REFERENCES public.flows NOT NULL,
  status text DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  input_data jsonb DEFAULT '{}',
  output_data jsonb DEFAULT '{}',
  error_message text,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  execution_time_ms integer
);

-- PulseSync Tables
CREATE TABLE IF NOT EXISTS public.connectors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES auth.users,
  provider_name text NOT NULL,
  provider_type text NOT NULL,
  config jsonb DEFAULT '{}',
  status text DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
  created_at timestamp with time zone DEFAULT now(),
  last_sync_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.sync_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  connector_id uuid REFERENCES public.connectors NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  records_processed integer DEFAULT 0,
  error_message text,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- PulseComms Tables
CREATE TABLE IF NOT EXISTS public.channels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES auth.users,
  name text NOT NULL,
  description text,
  type text DEFAULT 'public' CHECK (type IN ('public', 'private', 'dm')),
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id uuid REFERENCES public.channels NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  metadata jsonb DEFAULT '{}',
  thread_id uuid REFERENCES public.messages,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.presence_status (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  status text DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  last_seen timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presence_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can manage their org audit events" ON public.audit_events
  FOR ALL USING (auth.uid() = org_id);

CREATE POLICY "Users can manage their org policies" ON public.policies
  FOR ALL USING (auth.uid() = org_id);

CREATE POLICY "Users can manage their org compliance tasks" ON public.compliance_tasks
  FOR ALL USING (auth.uid() = org_id);

CREATE POLICY "Users can manage their org flows" ON public.flows
  FOR ALL USING (auth.uid() = org_id);

CREATE POLICY "Users can view flow runs for their flows" ON public.flow_runs
  FOR ALL USING (EXISTS (SELECT 1 FROM public.flows WHERE flows.id = flow_runs.flow_id AND flows.org_id = auth.uid()));

CREATE POLICY "Users can manage their org connectors" ON public.connectors
  FOR ALL USING (auth.uid() = org_id);

CREATE POLICY "Users can view sync jobs for their connectors" ON public.sync_jobs
  FOR ALL USING (EXISTS (SELECT 1 FROM public.connectors WHERE connectors.id = sync_jobs.connector_id AND connectors.org_id = auth.uid()));

CREATE POLICY "Users can manage their org channels" ON public.channels
  FOR ALL USING (auth.uid() = org_id);

CREATE POLICY "Users can view messages in accessible channels" ON public.messages
  FOR ALL USING (EXISTS (SELECT 1 FROM public.channels WHERE channels.id = messages.channel_id AND channels.org_id = auth.uid()));

CREATE POLICY "Users can manage their own presence" ON public.presence_status
  FOR ALL USING (auth.uid() = user_id);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.presence_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.compliance_tasks;
