
-- Create a table for user profiles to store public data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- This trigger automatically creates a profile for new users upon signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view teams." ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team creators can insert new teams." ON public.teams FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Team creators can update their own teams." ON public.teams FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Team creators can delete their own teams." ON public.teams FOR DELETE USING (auth.uid() = created_by);

-- Create an ENUM type for roles within a team
CREATE TYPE public.team_role AS ENUM ('owner', 'admin', 'member');

-- Create team_members table to link users and teams
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
    role team_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(team_id, user_id)
);

-- Set up Row Level Security (RLS) for team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own team memberships." ON public.team_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Team members can view other members of their team." ON public.team_members FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.team_members AS m
        WHERE m.team_id = team_members.team_id AND m.user_id = auth.uid()
    )
);
CREATE POLICY "Admins can manage team members." ON public.team_members FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.team_members AS m
        WHERE m.team_id = team_members.team_id AND m.user_id = auth.uid() AND (m.role = 'admin' OR m.role = 'owner')
    )
);
CREATE POLICY "Members can leave a team." ON public.team_members FOR DELETE USING (auth.uid() = user_id);

-- Create notes table for PulseComms
CREATE TABLE public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security for notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notes." ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view team notes if they're team members." ON public.notes FOR SELECT USING (
    NOT is_private AND team_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_id = notes.team_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Users can create notes." ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes." ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes." ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- Create analytics data table
CREATE TABLE public.analytics_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security for analytics
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own analytics." ON public.analytics_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Team members can view team analytics." ON public.analytics_data FOR SELECT USING (
    team_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_id = analytics_data.team_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Users can create analytics data." ON public.analytics_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analytics." ON public.analytics_data FOR UPDATE USING (auth.uid() = user_id);

-- Create finance records table
CREATE TABLE public.finance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'payroll', 'billing')),
    amount NUMERIC(12,2) NOT NULL,
    description TEXT,
    category TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security for finance
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own finance records." ON public.finance_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Team admins can view team finance records." ON public.finance_records FOR SELECT USING (
    team_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_id = finance_records.team_id AND user_id = auth.uid() AND role IN ('admin', 'owner')
    )
);
CREATE POLICY "Users can create finance records." ON public.finance_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own finance records." ON public.finance_records FOR UPDATE USING (auth.uid() = user_id);

-- Create performance goals table (OKRs)
CREATE TABLE public.performance_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_value NUMERIC,
    current_value NUMERIC DEFAULT 0,
    deadline DATE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security for performance goals
ALTER TABLE public.performance_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own goals." ON public.performance_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Team members can view team goals." ON public.performance_goals FOR SELECT USING (
    team_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_id = performance_goals.team_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Users can create goals." ON public.performance_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals." ON public.performance_goals FOR UPDATE USING (auth.uid() = user_id);

-- Create innovation ideas table
CREATE TABLE public.innovation_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    votes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'approved', 'rejected', 'implemented')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security for innovation ideas
ALTER TABLE public.innovation_ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All authenticated users can view ideas." ON public.innovation_ideas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create ideas." ON public.innovation_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ideas." ON public.innovation_ideas FOR UPDATE USING (auth.uid() = user_id);

-- Create automations table for PulseFlow
CREATE TABLE public.automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    trigger_config JSONB NOT NULL,
    action_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security for automations
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own automations." ON public.automations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Team members can view team automations." ON public.automations FOR SELECT USING (
    team_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.team_members 
        WHERE team_id = automations.team_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Users can create automations." ON public.automations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own automations." ON public.automations FOR UPDATE USING (auth.uid() = user_id);
