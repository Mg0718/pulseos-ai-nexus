
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  transaction_id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  category: string;
  payment_method: string;
  reference_id: string;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  description: string;
  created_by: string;
  created_at: string;
}

interface Metrics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalExpenses: number;
  netProfit: number;
  overdueInvoices: number;
  pendingPayments: number;
}

interface ChartDataItem {
  month: string;
  income: number;
  expenses: number;
}

export const useFinancialData = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    overdueInvoices: 0,
    pendingPayments: 0
  });

  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      // Fetch transactions for revenue and expenses using type assertion
      const { data: transactions } = await supabase
        .from('transactions' as any)
        .select('*') as { data: Transaction[] | null };

      // Fetch invoices for overdue tracking using type assertion
      const { data: invoices } = await supabase
        .from('invoices' as any)
        .select('*') as { data: Invoice[] | null };

      if (transactions && invoices) {
        calculateMetrics(transactions, invoices);
        prepareChartData(transactions);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (transactions: Transaction[], invoices: Invoice[]) => {
    const revenue = transactions
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const expenses = transactions
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const overdueCount = invoices.filter(i => 
      i.status === 'overdue' || 
      (i.status === 'sent' && new Date(i.due_date) < new Date())
    ).length;

    const pendingAmount = transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    setMetrics({
      totalRevenue: revenue,
      monthlyRevenue: revenue * 0.8, // Estimated current month
      totalExpenses: expenses,
      netProfit: revenue - expenses,
      overdueInvoices: overdueCount,
      pendingPayments: pendingAmount
    });
  };

  const prepareChartData = (transactions: Transaction[]) => {
    const monthlyData = transactions.reduce((acc: any, transaction) => {
      const month = new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += parseFloat(transaction.amount.toString());
      } else if (transaction.type === 'expense') {
        acc[month].expenses += parseFloat(transaction.amount.toString());
      }
      
      return acc;
    }, {});

    setChartData(Object.values(monthlyData));
  };

  return {
    metrics,
    chartData,
    loading
  };
};
