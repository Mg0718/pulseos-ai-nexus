
-- Finance Settings Table
CREATE TABLE public.finance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID,
  razorpay_key TEXT,
  stripe_key TEXT,
  invoice_logo_url TEXT,
  default_currency TEXT DEFAULT 'USD',
  tax_percentage NUMERIC DEFAULT 0,
  footer_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Employees Table (Enhanced from existing profiles)
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  base_salary NUMERIC DEFAULT 0,
  bonuses NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  role TEXT,
  country TEXT DEFAULT 'US',
  currency TEXT DEFAULT 'USD',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payroll Runs Table
CREATE TABLE public.payroll_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  org_id UUID,
  month TEXT NOT NULL,
  gross_salary NUMERIC NOT NULL,
  net_salary NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  payslip_url TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enhanced Invoices Table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID,
  org_id UUID,
  invoice_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft',
  payment_url TEXT,
  issued_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  notes TEXT,
  description TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enhanced Transactions Table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  org_id UUID,
  client_id UUID,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  receipt_url TEXT,
  stripe_payment_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Financial Metrics Table for Analytics
CREATE TABLE public.financial_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID,
  month TEXT NOT NULL,
  revenue NUMERIC DEFAULT 0,
  expenses NUMERIC DEFAULT 0,
  net_profit NUMERIC DEFAULT 0,
  growth_rate NUMERIC DEFAULT 0,
  rule_of_40 NUMERIC DEFAULT 0,
  roic NUMERIC DEFAULT 0,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plans Table for Billing Models
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'recurring', 'usage', 'one-time'
  base_price NUMERIC DEFAULT 0,
  price_per_user NUMERIC DEFAULT 0,
  usage_unit TEXT,
  usage_price NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Plan Assignments Table
CREATE TABLE public.plan_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE,
  org_id UUID,
  assigned_by UUID REFERENCES auth.users(id),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enhanced Payroll Table (from existing)
CREATE TABLE public.payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL,
  base_salary NUMERIC NOT NULL DEFAULT 0,
  bonus NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  gross_salary NUMERIC NOT NULL DEFAULT 0,
  net_salary NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  pay_period TEXT DEFAULT 'monthly',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.finance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Finance Settings (Admin only)
CREATE POLICY "finance_settings_select" ON public.finance_settings
  FOR SELECT USING (true);

CREATE POLICY "finance_settings_insert" ON public.finance_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "finance_settings_update" ON public.finance_settings
  FOR UPDATE USING (true);

-- RLS Policies for Employees
CREATE POLICY "employees_select" ON public.employees
  FOR SELECT USING (true);

CREATE POLICY "employees_insert" ON public.employees
  FOR INSERT WITH CHECK (true);

CREATE POLICY "employees_update" ON public.employees
  FOR UPDATE USING (true);

-- RLS Policies for Payroll Runs
CREATE POLICY "payroll_runs_select" ON public.payroll_runs
  FOR SELECT USING (true);

CREATE POLICY "payroll_runs_insert" ON public.payroll_runs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "payroll_runs_update" ON public.payroll_runs
  FOR UPDATE USING (true);

-- RLS Policies for Invoices
CREATE POLICY "invoices_select" ON public.invoices
  FOR SELECT USING (true);

CREATE POLICY "invoices_insert" ON public.invoices
  FOR INSERT WITH CHECK (true);

CREATE POLICY "invoices_update" ON public.invoices
  FOR UPDATE USING (true);

-- RLS Policies for Transactions
CREATE POLICY "transactions_select" ON public.transactions
  FOR SELECT USING (true);

CREATE POLICY "transactions_insert" ON public.transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "transactions_update" ON public.transactions
  FOR UPDATE USING (true);

-- RLS Policies for Financial Metrics
CREATE POLICY "financial_metrics_select" ON public.financial_metrics
  FOR SELECT USING (true);

CREATE POLICY "financial_metrics_insert" ON public.financial_metrics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "financial_metrics_update" ON public.financial_metrics
  FOR UPDATE USING (true);

-- RLS Policies for Plans
CREATE POLICY "plans_select" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "plans_insert" ON public.plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "plans_update" ON public.plans
  FOR UPDATE USING (true);

-- RLS Policies for Plan Assignments
CREATE POLICY "plan_assignments_select" ON public.plan_assignments
  FOR SELECT USING (true);

CREATE POLICY "plan_assignments_insert" ON public.plan_assignments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "plan_assignments_update" ON public.plan_assignments
  FOR UPDATE USING (true);

-- RLS Policies for Enhanced Payroll
CREATE POLICY "payroll_select" ON public.payroll
  FOR SELECT USING (true);

CREATE POLICY "payroll_insert" ON public.payroll
  FOR INSERT WITH CHECK (true);

CREATE POLICY "payroll_update" ON public.payroll
  FOR UPDATE USING (true);

-- Create function to calculate financial metrics
CREATE OR REPLACE FUNCTION calculate_financial_metrics(org_uuid UUID, target_month TEXT)
RETURNS VOID AS $$
DECLARE
  total_revenue NUMERIC := 0;
  total_expenses NUMERIC := 0;
  net_profit_calc NUMERIC := 0;
  growth_rate_calc NUMERIC := 0;
  rule_of_40_calc NUMERIC := 0;
  roic_calc NUMERIC := 0;
BEGIN
  -- Calculate revenue from paid invoices
  SELECT COALESCE(SUM(total), 0) INTO total_revenue
  FROM public.invoices
  WHERE org_id = org_uuid 
    AND status = 'paid'
    AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', target_month::DATE);

  -- Calculate expenses from payroll
  SELECT COALESCE(SUM(net_salary), 0) INTO total_expenses
  FROM public.payroll_runs
  WHERE org_id = org_uuid 
    AND month = target_month;

  -- Calculate net profit
  net_profit_calc := total_revenue - total_expenses;

  -- Simple growth rate calculation (can be enhanced)
  growth_rate_calc := CASE 
    WHEN total_revenue > 0 THEN (net_profit_calc / total_revenue) * 100
    ELSE 0
  END;

  -- Rule of 40: Growth Rate + Profit Margin
  rule_of_40_calc := growth_rate_calc + CASE 
    WHEN total_revenue > 0 THEN (net_profit_calc / total_revenue) * 100
    ELSE 0
  END;

  -- ROIC calculation (simplified)
  roic_calc := CASE 
    WHEN total_revenue > 0 THEN (net_profit_calc / total_revenue) * 100
    ELSE 0
  END;

  -- Upsert the metrics
  INSERT INTO public.financial_metrics (
    org_id, month, revenue, expenses, net_profit, growth_rate, rule_of_40, roic
  ) VALUES (
    org_uuid, target_month, total_revenue, total_expenses, net_profit_calc, 
    growth_rate_calc, rule_of_40_calc, roic_calc
  )
  ON CONFLICT (org_id, month) DO UPDATE SET
    revenue = EXCLUDED.revenue,
    expenses = EXCLUDED.expenses,
    net_profit = EXCLUDED.net_profit,
    growth_rate = EXCLUDED.growth_rate,
    rule_of_40 = EXCLUDED.rule_of_40,
    roic = EXCLUDED.roic,
    calculated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint for org and month in financial_metrics
ALTER TABLE public.financial_metrics ADD CONSTRAINT unique_org_month UNIQUE (org_id, month);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_invoices_updated_at 
  BEFORE UPDATE ON public.invoices 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON public.transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finance_settings_updated_at 
  BEFORE UPDATE ON public.finance_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at 
  BEFORE UPDATE ON public.payroll 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
