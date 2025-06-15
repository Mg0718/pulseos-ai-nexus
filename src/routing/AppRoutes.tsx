
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import PremiumHomepage from "@/components/PremiumHomepage";
import PeopleLayout from "@/components/people/PeopleLayout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Teams from "@/pages/Teams";
import Analytics from "@/pages/Analytics";
import Finance from "@/pages/Finance";
import Leave from "@/pages/Leave";
import PulsePay from "@/pages/PulsePay";
import PulseFlow from "@/pages/PulseFlow";
import InnovationHub from "@/pages/InnovationHub";
import Settings from "@/pages/Settings";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/people/Dashboard";
import Onboarding from "@/pages/people/Onboarding";
import PeopleTeams from "@/pages/people/Teams";
import Leaves from "@/pages/people/Leaves";
import Feedback from "@/pages/people/Feedback";
import Morale from "@/pages/people/Morale";
import Profiles from "@/pages/people/Profiles";
import PeopleSettings from "@/pages/people/Settings";
import FinanceDashboard from "@/pages/finance/Dashboard";
import Payroll from "@/pages/finance/Payroll";
import Invoices from "@/pages/finance/Invoices";
import Transactions from "@/pages/finance/Transactions";
import BillingModels from "@/pages/finance/BillingModels";
import FinanceAnalytics from "@/pages/finance/FinanceAnalytics";
import FinanceSettings from "@/pages/finance/FinanceSettings";
import BlockchainFinance from "@/pages/finance/BlockchainFinance";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <PremiumHomepage />
          </PublicRoute>
        } />
        <Route path="/auth" element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/leave" element={
          <ProtectedRoute>
            <Leave />
          </ProtectedRoute>
        } />
        <Route path="/pulsepay" element={
          <ProtectedRoute>
            <PulsePay />
          </ProtectedRoute>
        } />
        <Route path="/pulseflow" element={
          <ProtectedRoute>
            <PulseFlow />
          </ProtectedRoute>
        } />
        <Route path="/innovation-hub" element={
          <ProtectedRoute>
            <InnovationHub />
          </ProtectedRoute>
        } />
        <Route path="/teams" element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/finance" element={
          <ProtectedRoute>
            <Finance />
          </ProtectedRoute>
        } />
        
        {/* Finance Module Routes */}
        <Route path="/finance/dashboard" element={
          <ProtectedRoute>
            <FinanceDashboard />
          </ProtectedRoute>
        } />
        <Route path="/finance/payroll" element={
          <ProtectedRoute>
            <Payroll />
          </ProtectedRoute>
        } />
        <Route path="/finance/invoices" element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        } />
        <Route path="/finance/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path="/finance/billing-models" element={
          <ProtectedRoute>
            <BillingModels />
          </ProtectedRoute>
        } />
        <Route path="/finance/analytics" element={
          <ProtectedRoute>
            <FinanceAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/finance/settings" element={
          <ProtectedRoute>
            <FinanceSettings />
          </ProtectedRoute>
        } />
        <Route path="/finance/blockchain" element={
          <ProtectedRoute>
            <BlockchainFinance />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        
        {/* People & TeamOps Module Routes */}
        <Route path="/people" element={
          <ProtectedRoute>
            <PeopleLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="teams" element={<PeopleTeams />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="morale" element={<Morale />} />
          <Route path="profiles" element={<Profiles />} />
          <Route path="settings" element={<PeopleSettings />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
