
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

// Import pages
import PremiumHomepage from "@/components/PremiumHomepage";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Analytics from "@/pages/Analytics";
import PulseComms from "@/pages/PulseComms";
import Finance from "@/pages/Finance";
import PulseFlow from "@/pages/PulseFlow";
import InnovationHub from "@/pages/InnovationHub";
import Admin from "@/pages/Admin";
import Integrations from "@/pages/Integrations";
import PulseContracts from "@/pages/PulseContracts";
import FieldOps from "@/pages/FieldOps";
import Templates from "@/pages/Templates";
import OnboardingStudio from "@/pages/OnboardingStudio";
import Settings from "@/pages/Settings";
import Teams from "@/pages/Teams";
import NotFound from "@/pages/NotFound";

// Finance sub-pages
import FinanceDashboard from "@/pages/finance/Dashboard";
import FinanceInvoices from "@/pages/finance/Invoices";
import FinancePayroll from "@/pages/finance/Payroll";
import FinanceTransactions from "@/pages/finance/Transactions";
import FinanceAnalytics from "@/pages/finance/FinanceAnalytics";
import FinanceSettings from "@/pages/finance/FinanceSettings";
import BillingModels from "@/pages/finance/BillingModels";
import BlockchainFinance from "@/pages/finance/BlockchainFinance";
import PulsePay from "@/pages/PulsePay";

// People sub-pages
import PeopleDashboard from "@/pages/people/Dashboard";
import PeopleTeams from "@/pages/people/Teams";
import PeopleProfiles from "@/pages/people/Profiles";
import PeopleOnboarding from "@/pages/people/Onboarding";
import PeopleLeaves from "@/pages/people/Leaves";
import PeopleOKRs from "@/pages/people/OKRs";
import PeoplePerformance from "@/pages/people/Performance";
import PeopleFeedback from "@/pages/people/Feedback";
import PeopleMorale from "@/pages/people/Morale";
import PeopleTimeTracking from "@/pages/people/TimeTracking";
import PeopleDocuments from "@/pages/people/Documents";
import PeopleBenefits from "@/pages/people/Benefits";
import PeopleSettings from "@/pages/people/Settings";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BlockchainProvider>
          <Routes>
            {/* Public Routes - Homepage is now the default */}
            <Route path="/" element={<PremiumHomepage />} />
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/comms" element={<ProtectedRoute><PulseComms /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
            <Route path="/pulseflow" element={<ProtectedRoute><PulseFlow /></ProtectedRoute>} />
            <Route path="/innovation-hub" element={<ProtectedRoute><InnovationHub /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
            <Route path="/contracts" element={<ProtectedRoute><PulseContracts /></ProtectedRoute>} />
            <Route path="/fieldops" element={<ProtectedRoute><FieldOps /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingStudio /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />

            {/* Finance sub-routes */}
            <Route path="/finance/dashboard" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
            <Route path="/finance/invoices" element={<ProtectedRoute><FinanceInvoices /></ProtectedRoute>} />
            <Route path="/finance/payroll" element={<ProtectedRoute><FinancePayroll /></ProtectedRoute>} />
            <Route path="/finance/transactions" element={<ProtectedRoute><FinanceTransactions /></ProtectedRoute>} />
            <Route path="/finance/analytics" element={<ProtectedRoute><FinanceAnalytics /></ProtectedRoute>} />
            <Route path="/finance/settings" element={<ProtectedRoute><FinanceSettings /></ProtectedRoute>} />
            <Route path="/finance/billing" element={<ProtectedRoute><BillingModels /></ProtectedRoute>} />
            <Route path="/finance/blockchain" element={<ProtectedRoute><BlockchainFinance /></ProtectedRoute>} />
            <Route path="/pulsepay" element={<ProtectedRoute><PulsePay /></ProtectedRoute>} />

            {/* People sub-routes */}
            <Route path="/people/dashboard" element={<ProtectedRoute><PeopleDashboard /></ProtectedRoute>} />
            <Route path="/people/teams" element={<ProtectedRoute><PeopleTeams /></ProtectedRoute>} />
            <Route path="/people/profiles" element={<ProtectedRoute><PeopleProfiles /></ProtectedRoute>} />
            <Route path="/people/onboarding" element={<ProtectedRoute><PeopleOnboarding /></ProtectedRoute>} />
            <Route path="/people/leaves" element={<ProtectedRoute><PeopleLeaves /></ProtectedRoute>} />
            <Route path="/people/okrs" element={<ProtectedRoute><PeopleOKRs /></ProtectedRoute>} />
            <Route path="/people/performance" element={<ProtectedRoute><PeoplePerformance /></ProtectedRoute>} />
            <Route path="/people/feedback" element={<ProtectedRoute><PeopleFeedback /></ProtectedRoute>} />
            <Route path="/people/morale" element={<ProtectedRoute><PeopleMorale /></ProtectedRoute>} />
            <Route path="/people/time-tracking" element={<ProtectedRoute><PeopleTimeTracking /></ProtectedRoute>} />
            <Route path="/people/documents" element={<ProtectedRoute><PeopleDocuments /></ProtectedRoute>} />
            <Route path="/people/benefits" element={<ProtectedRoute><PeopleBenefits /></ProtectedRoute>} />
            <Route path="/people/settings" element={<ProtectedRoute><PeopleSettings /></ProtectedRoute>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BlockchainProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppRoutes;
