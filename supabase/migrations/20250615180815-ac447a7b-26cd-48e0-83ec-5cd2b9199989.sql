
-- Create the workflows table and related tables for PulseFlow
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  flow_definition JSONB NOT NULL DEFAULT '{"nodes": [], "edges": []}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow executions table
CREATE TABLE IF NOT EXISTS public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.workflows(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workflows
CREATE POLICY "Users can view their own workflows" ON public.workflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workflows" ON public.workflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows" ON public.workflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows" ON public.workflows
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for workflow executions
CREATE POLICY "Users can view executions of their workflows" ON public.workflow_executions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workflows 
      WHERE workflows.id = workflow_executions.workflow_id 
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create executions for their workflows" ON public.workflow_executions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workflows 
      WHERE workflows.id = workflow_executions.workflow_id 
      AND workflows.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);

-- Create trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
