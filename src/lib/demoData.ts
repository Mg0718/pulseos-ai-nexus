
import { supabase } from "@/integrations/supabase/client";

export const createDemoData = async (userId: string) => {
  try {
    console.log('Creating demo data for user:', userId);

    // Create demo teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .insert([
        {
          id: `${userId.slice(0, 8)}-team-0000-0000-000000000001`,
          name: 'Executive Leadership',
          description: 'Senior leadership team responsible for company strategy and direction',
          created_by: userId
        },
        {
          id: `${userId.slice(0, 8)}-team-0000-0000-000000000002`,
          name: 'Engineering',
          description: 'Software development and technical infrastructure',
          created_by: userId
        },
        {
          id: `${userId.slice(0, 8)}-team-0000-0000-000000000003`,
          name: 'Product',
          description: 'Product strategy, management, and roadmap planning',
          created_by: userId
        }
      ])
      .select();

    if (teamsError) {
      console.error('Error creating demo teams:', teamsError);
      return;
    }

    // Create demo benefits
    await supabase
      .from('benefits')
      .insert([
        {
          name: 'Premium Health Insurance',
          description: 'Comprehensive health coverage including medical, dental, and vision',
          category: 'health',
          provider: 'BlueCross BlueShield',
          cost: 800.00,
          employer_contribution_percent: 90,
          is_active: true
        },
        {
          name: 'Dental Insurance',
          description: 'Full dental coverage including preventive and major services',
          category: 'dental',
          provider: 'Delta Dental',
          cost: 120.00,
          employer_contribution_percent: 100,
          is_active: true
        },
        {
          name: '401(k) Retirement Plan',
          description: 'Company-matched retirement savings plan',
          category: 'retirement',
          provider: 'Fidelity',
          cost: 0.00,
          employer_contribution_percent: 50,
          is_active: true
        }
      ]);

    // Create demo OKRs
    if (teams && teams.length > 0) {
      await supabase
        .from('okrs')
        .insert([
          {
            user_id: userId,
            team_id: teams[0].id,
            title: 'Company Growth Q1 2024',
            description: 'Drive overall company growth and market expansion',
            objective: 'Achieve 50% revenue growth and expand market presence',
            key_results: [
              { title: "Increase ARR to $5M", target: 5000000, current: 3200000, unit: "USD" },
              { title: "Acquire 50 new enterprise clients", target: 50, current: 32, unit: "clients" },
              { title: "Expand to 3 new markets", target: 3, current: 1, unit: "markets" }
            ],
            quarter: '2024-Q1',
            progress_percentage: 64.0,
            status: 'active'
          },
          {
            user_id: userId,
            team_id: teams[1].id,
            title: 'Engineering Excellence Q1 2024',
            description: 'Improve engineering productivity and system reliability',
            objective: 'Build scalable and reliable engineering systems',
            key_results: [
              { title: "Achieve 99.9% uptime", target: 99.9, current: 99.7, unit: "percent" },
              { title: "Reduce deployment time to under 10 minutes", target: 10, current: 15, unit: "minutes" },
              { title: "Increase test coverage to 90%", target: 90, current: 78, unit: "percent" }
            ],
            quarter: '2024-Q1',
            progress_percentage: 75.0,
            status: 'active'
          }
        ]);
    }

    // Create demo innovation ideas
    if (teams && teams.length > 1) {
      await supabase
        .from('innovation_ideas')
        .insert([
          {
            user_id: userId,
            team_id: teams[1].id,
            title: 'AI-Powered Code Review Assistant',
            description: 'Implement an AI system that can automatically review code for best practices, security issues, and suggest improvements.',
            votes: 15,
            status: 'reviewing'
          },
          {
            user_id: userId,
            team_id: teams[2].id,
            title: 'Predictive User Behavior Analytics',
            description: 'Develop machine learning models to predict user behavior and suggest product improvements.',
            votes: 18,
            status: 'approved'
          }
        ]);
    }

    // Create demo invoices
    await supabase
      .from('invoices')
      .insert([
        {
          org_id: userId,
          invoice_number: 'INV-2024-001',
          client_name: 'TechCorp Solutions',
          client_email: 'billing@techcorp.com',
          items: [
            { description: "PulseOS Enterprise License", quantity: 100, rate: 50, amount: 5000 },
            { description: "Implementation Services", quantity: 40, rate: 150, amount: 6000 }
          ],
          subtotal: 11000.00,
          tax: 880.00,
          total: 11880.00,
          currency: 'USD',
          status: 'paid',
          issued_date: '2024-01-01',
          due_date: '2024-01-31',
          description: 'Monthly enterprise license and services',
          amount: 11880.00,
          created_by: userId
        }
      ]);

    // Create demo workflows
    await supabase
      .from('workflows')
      .insert([
        {
          user_id: userId,
          name: 'Employee Onboarding',
          description: 'Automated workflow for new employee onboarding process',
          flow_definition: {
            nodes: [
              { id: "start", type: "trigger", data: { label: "New Employee Added" } },
              { id: "setup", type: "action", data: { label: "Setup Accounts" } },
              { id: "welcome", type: "action", data: { label: "Send Welcome Email" } }
            ],
            edges: [
              { id: "e1", source: "start", target: "setup" },
              { id: "e2", source: "setup", target: "welcome" }
            ]
          },
          status: 'active'
        }
      ]);

    console.log('Demo data created successfully!');
  } catch (error) {
    console.error('Error creating demo data:', error);
  }
};
