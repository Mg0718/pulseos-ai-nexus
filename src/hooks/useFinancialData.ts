
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  invoice_id: string | null;
  org_id: string | null;
  client_id: string | null;
  amount: number;
  currency: string;
  payment_method: string | null;
  status: string;
  receipt_url: string | null;
  stripe_payment_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  total: number;
  currency: string;
  status: string;
  due_date: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface Employee {
  id: string;
  name: string;
  base_salary: number;
  bonuses: number;
  deductions: number;
  currency: string;
  active: boolean;
}

interface FinancialMetrics {
  revenue: number;
  expenses: number;
  net_profit: number;
  growth_rate: number;
  rule_of_40: number;
  roic: number;
}

interface Metrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalExpenses: number;
  netProfit: number;
  overdueInvoices: number;
  pendingPayments: number;
  ruleOf40: number;
  roic: number;
  burnRate: number;
}

interface ChartDataItem {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export const useFinancialData = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    overdueInvoices: 0,
    pendingPayments: 0,
    ruleOf40: 0,
    roic: 0,
    burnRate: 0
  });

  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Fetch transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch employees for payroll calculations
      const { data: employees } = await supabase
        .from('employees')
        .select('*')
        .eq('active', true);

      // Fetch financial metrics
      const { data: financialMetrics } = await supabase
        .from('financial_metrics')
        .select('*')
        .order('calculated_at', { ascending: false })
        .limit(1);

      if (transactions && invoices && employees) {
        calculateMetrics(transactions, invoices, employees, financialMetrics?.[0]);
        prepareChartData(transactions, invoices);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (
    transactions: Transaction[], 
    invoices: Invoice[], 
    employees: Employee[], 
    financialMetrics?: FinancialMetrics
  ) => {
    // Calculate revenue from successful transactions
    const revenue = transactions
      .filter(t => t.status === 'success' || t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate expenses from employee salaries
    const expenses = employees
      .reduce((sum, emp) => sum + Number(emp.base_salary) + Number(emp.bonuses || 0) - Number(emp.deductions || 0), 0);

    // Count overdue invoices
    const overdueCount = invoices.filter(i => {
      if (i.status === 'overdue') return true;
      if (i.status === 'sent' && i.due_date) {
        return new Date(i.due_date) < new Date();
      }
      return false;
    }).length;

    // Calculate pending payments
    const pendingAmount = transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Get current month revenue
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyRevenue = transactions
      .filter(t => (t.status === 'success' || t.status === 'completed') && 
                   t.created_at.startsWith(currentMonth))
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netProfit = revenue - expenses;
    const burnRate = expenses; // Simplified burn rate

    setMetrics({
      totalRevenue: revenue,
      monthlyRevenue,
      totalExpenses: expenses,
      netProfit,
      overdueInvoices: overdueCount,
      pendingPayments: pendingAmount,
      ruleOf40: financialMetrics?.rule_of_40 || 0,
      roic: financialMetrics?.roic || 0,
      burnRate
    });
  };

  const prepareChartData = (transactions: Transaction[], invoices: Invoice[]) => {
    const monthlyData: { [key: string]: ChartDataItem } = {};

    // Process transactions for income
    transactions.forEach(transaction => {
      if (transaction.status === 'success' || transaction.status === 'completed') {
        const month = new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (!monthlyData[month]) {
          monthlyData[month] = { month, income: 0, expenses: 0, profit: 0 };
        }
        monthlyData[month].income += Number(transaction.amount);
      }
    });

    // Calculate profit for each month
    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].profit = monthlyData[month].income - monthlyData[month].expenses;
    });

    setChartData(Object.values(monthlyData).slice(-6)); // Last 6 months
  };

  return {
    metrics,
    chartData,
    loading,
    refreshData: fetchFinancialData
  };
};
