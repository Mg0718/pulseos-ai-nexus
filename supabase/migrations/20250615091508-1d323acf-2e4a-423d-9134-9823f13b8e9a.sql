
-- Create time_entries table for clock in/out and timesheet management
CREATE TABLE public.time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
  clock_out TIMESTAMP WITH TIME ZONE,
  break_duration INTEGER DEFAULT 0, -- in minutes
  overtime_hours NUMERIC(4,2) DEFAULT 0,
  total_hours NUMERIC(4,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'pending_approval')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create benefits table
CREATE TABLE public.benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('health', 'dental', 'vision', 'retirement', 'stipend', 'insurance', 'perk')),
  provider TEXT,
  cost NUMERIC(10,2),
  employer_contribution_percent NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_benefits table for benefit enrollments
CREATE TABLE public.user_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  benefit_id UUID REFERENCES benefits(id) NOT NULL,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'cancelled')),
  employee_contribution NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, benefit_id)
);

-- Create performance_reviews table
CREATE TABLE public.performance_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  overall_rating NUMERIC(3,2) CHECK (overall_rating >= 1 AND overall_rating <= 5),
  goals_achievement_rating NUMERIC(3,2) CHECK (goals_achievement_rating >= 1 AND goals_achievement_rating <= 5),
  competency_rating NUMERIC(3,2) CHECK (competency_rating >= 1 AND competency_rating <= 5),
  feedback TEXT,
  development_plan TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'completed', 'approved')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create okrs table (Objectives and Key Results)
CREATE TABLE public.okrs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  team_id UUID REFERENCES teams(id),
  title TEXT NOT NULL,
  description TEXT,
  objective TEXT NOT NULL,
  key_results JSONB NOT NULL, -- Array of key results with targets and progress
  quarter TEXT NOT NULL, -- e.g., "2024-Q1"
  progress_percentage NUMERIC(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'delayed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table for document management
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'policy', 'handbook', 'form', 'certificate', 'other')),
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_confidential BOOLEAN DEFAULT false,
  requires_acknowledgment BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document_acknowledgments table
CREATE TABLE public.document_acknowledgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  UNIQUE(document_id, user_id)
);

-- Create compensation_history table for compensation analysis
CREATE TABLE public.compensation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  salary NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  change_reason TEXT CHECK (change_reason IN ('promotion', 'merit_increase', 'market_adjustment', 'initial_hire', 'role_change')),
  effective_date DATE NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compensation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for time_entries
CREATE POLICY "Users can view their own time entries"
  ON public.time_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own time entries"
  ON public.time_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time entries"
  ON public.time_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for benefits (public read)
CREATE POLICY "All authenticated users can view benefits"
  ON public.benefits FOR SELECT
  TO authenticated USING (true);

-- RLS Policies for user_benefits
CREATE POLICY "Users can view their own benefit enrollments"
  ON public.user_benefits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own benefit enrollments"
  ON public.user_benefits FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for performance_reviews
CREATE POLICY "Users can view reviews they gave or received"
  ON public.performance_reviews FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can create reviews"
  ON public.performance_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update their reviews"
  ON public.performance_reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

-- RLS Policies for okrs
CREATE POLICY "Users can view their own OKRs"
  ON public.okrs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own OKRs"
  ON public.okrs FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for documents
CREATE POLICY "Users can view documents assigned to them"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id OR NOT is_confidential);

CREATE POLICY "HR can manage all documents"
  ON public.documents FOR ALL
  USING (auth.uid() = uploaded_by);

-- RLS Policies for document_acknowledgments
CREATE POLICY "Users can view their own acknowledgments"
  ON public.document_acknowledgments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own acknowledgments"
  ON public.document_acknowledgments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for compensation_history (restricted access)
CREATE POLICY "Users can view their own compensation history"
  ON public.compensation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "HR can manage compensation history"
  ON public.compensation_history FOR ALL
  USING (auth.uid() = created_by);
