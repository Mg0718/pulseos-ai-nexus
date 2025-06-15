
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

// Page imports
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Analytics from "@/pages/Analytics";
import Admin from "@/pages/Admin";
import InnovationHub from "@/pages/InnovationHub";
import Settings from "@/pages/Settings";
import PulseFlow from "@/pages/PulseFlow";
import PulsePay from "@/pages/PulsePay";
import Teams from "@/pages/Teams";
import NotFound from "@/pages/NotFound";

// Finance pages
import Finance from "@/pages/Finance";
import FinanceDashboard from "@/pages/finance/Dashboard";
import Invoices from "@/pages/finance/Invoices";
import Payroll from "@/pages/finance/Payroll";
import Transactions from "@/pages/finance/Transactions";
import BillingModels from "@/pages/finance/BillingModels";
import FinanceAnalytics from "@/pages/finance/FinanceAnalytics";
import FinanceSettings from "@/pages/finance/FinanceSettings";
import BlockchainFinance from "@/pages/finance/BlockchainFinance";

// People pages
import PeopleDashboard from "@/pages/people/Dashboard";
import Profiles from "@/pages/people/Profiles";
import PeopleTeams from "@/pages/people/Teams";
import Onboarding from "@/pages/people/Onboarding";
import Performance from "@/pages/people/Performance";
import Feedback from "@/pages/people/Feedback";
import Benefits from "@/pages/people/Benefits";
import Documents from "@/pages/people/Documents";
import Leaves from "@/pages/people/Leaves";
import OKRs from "@/pages/people/OKRs";
import Morale from "@/pages/people/Morale";
import TimeTracking from "@/pages/people/TimeTracking";
import PeopleSettings from "@/pages/people/Settings";

// New module pages
import PulseComms from "@/pages/PulseComms";
import PulseContracts from "@/pages/PulseContracts";
import FieldOps from "@/pages/FieldOps";
import Integrations from "@/pages/Integrations";
import Templates from "@/pages/Templates";
import Compliance from "@/pages/Compliance";
import OnboardingStudio from "@/pages/OnboardingStudio";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/innovation-hub" element={<ProtectedRoute><InnovationHub /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/pulseflow" element={<ProtectedRoute><PulseFlow /></ProtectedRoute>} />
      <Route path="/pulse-pay" element={<ProtectedRoute><PulsePay /></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />

      {/* New Module Routes */}
      <Route path="/comms" element={<ProtectedRoute><PulseComms /></ProtectedRoute>} />
      <Route path="/contracts" element={<ProtectedRoute><PulseContracts /></ProtectedRoute>} />
      <Route path="/fieldops" element={<ProtectedRoute><FieldOps /></ProtectedRoute>} />
      <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingStudio /></ProtectedRoute>} />

      {/* Finance Routes */}
      <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
      <Route path="/finance/dashboard" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
      <Route path="/finance/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
      <Route path="/finance/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/finance/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/finance/billing" element={<ProtectedRoute><BillingModels /></ProtectedRoute>} />
      <Route path="/finance/analytics" element={<ProtectedRoute><FinanceAnalytics /></ProtectedRoute>} />
      <Route path="/finance/settings" element={<ProtectedRoute><FinanceSettings /></ProtectedRoute>} />
      <Route path="/finance/blockchain" element={<ProtectedRoute><BlockchainFinance /></ProtectedRoute>} />

      {/* People Routes */}
      <Route path="/people/dashboard" element={<ProtectedRoute><PeopleDashboard /></ProtectedRoute>} />
      <Route path="/people/profiles" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
      <Route path="/people/teams" element={<ProtectedRoute><PeopleTeams /></ProtectedRoute>} />
      <Route path="/people/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/people/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
      <Route path="/people/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      <Route path="/people/benefits" element={<ProtectedRoute><Benefits /></ProtectedRoute>} />
      <Route path="/people/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/people/leaves" element={<ProtectedRoute><Leaves /></ProtectedRoute>} />
      <Route path="/people/okrs" element={<ProtectedRoute><OKRs /></ProtectedRoute>} />
      <Route path="/people/morale" element={<ProtectedRoute><Morale /></ProtectedRoute>} />
      <Route path="/people/timetracking" element={<ProtectedRoute><TimeTracking /></ProtectedRoute>} />
      <Route path="/people/settings" element={<ProtectedRoute><PeopleSettings /></ProtectedRoute>} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
