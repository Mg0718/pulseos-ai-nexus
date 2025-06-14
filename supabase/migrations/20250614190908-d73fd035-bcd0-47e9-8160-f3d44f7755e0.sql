
-- Create feedback_entries table
CREATE TABLE public.feedback_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES profiles(id) NOT NULL,
  to_user_id UUID REFERENCES profiles(id) NOT NULL,
  feedback_type TEXT NOT NULL DEFAULT 'peer',
  visibility TEXT NOT NULL DEFAULT 'open',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sentiment_score TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create morale_entries table
CREATE TABLE public.morale_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  team_id UUID REFERENCES teams(id),
  morale_score INTEGER NOT NULL CHECK (morale_score >= 1 AND morale_score <= 10),
  sentiment TEXT NOT NULL,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hire_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS workspace_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

-- Enable RLS on new tables
ALTER TABLE public.feedback_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morale_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for feedback_entries
CREATE POLICY "Users can view feedback they gave or received"
  ON public.feedback_entries
  FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create feedback entries"
  ON public.feedback_entries
  FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- Create RLS policies for morale_entries
CREATE POLICY "Users can view their own morale entries"
  ON public.morale_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own morale entries"
  ON public.morale_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
