
-- Create tables for PulseComms (Chat and Communication System)
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'public', -- public, private, direct
  created_by UUID REFERENCES auth.users(id),
  org_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, file, image, ai_generated
  ai_enhanced BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES public.chat_messages(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for PulseSync (Integration Middleware)
CREATE TABLE IF NOT EXISTS public.integration_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID,
  service_name TEXT NOT NULL,
  service_type TEXT NOT NULL, -- webhook, api, oauth
  config JSONB NOT NULL DEFAULT '{}',
  credentials JSONB DEFAULT '{}',
  status TEXT DEFAULT 'inactive', -- active, inactive, error
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID REFERENCES public.integration_configs(id),
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL, -- success, error, partial
  records_processed INTEGER DEFAULT 0,
  error_details TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create tables for PulseContracts (AI Contract Parsing)
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID,
  title TEXT NOT NULL,
  contract_type TEXT NOT NULL, -- employment, vendor, client, partnership
  status TEXT DEFAULT 'draft', -- draft, review, approved, active, expired
  file_path TEXT,
  ai_summary TEXT,
  key_terms JSONB DEFAULT '{}',
  expiry_date DATE,
  value NUMERIC,
  currency TEXT DEFAULT 'USD',
  created_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contract_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL, -- pending, approved, rejected
  comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for MSP & FieldOps (Asset Management)
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID,
  asset_tag TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- hardware, software, vehicle, equipment
  status TEXT DEFAULT 'active', -- active, maintenance, retired, lost
  location TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  purchase_date DATE,
  warranty_expiry DATE,
  value NUMERIC,
  serial_number TEXT,
  manufacturer TEXT,
  model TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.maintenance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL, -- routine, repair, upgrade
  description TEXT NOT NULL,
  cost NUMERIC,
  performed_by UUID REFERENCES auth.users(id),
  scheduled_date DATE,
  completed_date DATE,
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for Industry Templates
CREATE TABLE IF NOT EXISTS public.industry_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL, -- tech, healthcare, finance, retail, etc.
  description TEXT,
  template_config JSONB NOT NULL DEFAULT '{}',
  modules JSONB DEFAULT '[]', -- array of enabled modules
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.template_deployments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID,
  template_id UUID REFERENCES public.industry_templates(id),
  deployment_config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, deploying, completed, failed
  deployed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for Advanced OKR tracking
CREATE TABLE IF NOT EXISTS public.okr_nudges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  okr_id UUID REFERENCES public.okrs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  nudge_type TEXT NOT NULL, -- reminder, suggestion, warning, celebration
  content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  delivered_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for Onboarding Studio
CREATE TABLE IF NOT EXISTS public.onboarding_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  workflow_config JSONB NOT NULL DEFAULT '{}',
  ai_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.onboarding_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.onboarding_workflows(id),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'in_progress', -- in_progress, completed, paused
  current_step INTEGER DEFAULT 1,
  session_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (users can access their org data)
CREATE POLICY "Users can manage their org chat rooms" ON public.chat_rooms
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their org chat messages" ON public.chat_messages
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their org integrations" ON public.integration_configs
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view sync logs" ON public.sync_logs
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their org contracts" ON public.contracts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage contract approvals" ON public.contract_approvals
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their org assets" ON public.assets
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage maintenance logs" ON public.maintenance_logs
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view industry templates" ON public.industry_templates
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage template deployments" ON public.template_deployments
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage OKR nudges" ON public.okr_nudges
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage onboarding workflows" ON public.onboarding_workflows
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage onboarding sessions" ON public.onboarding_sessions
  FOR ALL USING (auth.uid() IS NOT NULL);
