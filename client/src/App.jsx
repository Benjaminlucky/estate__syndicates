import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import Project from "./pages/project/Project"; // ← replaced with full implementation
import Howitworks from "./pages/howitworks/Howitworks"; // ← replaced with full implementation
import Reachus from "./pages/reach/Reach"; // ← replaced with full implementation
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Company from "./pages/company/Company";
import Topheader from "./components/topHeader/Topheader";
import Footer from "./components/footer/Footer";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminLogin from "./pages/admin/AdminLogin";

// Route guards
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// NEW pages
import ProjectDetail from "./pages/project/ProjectDetail"; // ← new individual project page
import PrivacyPolicy from "./pages/legal/PrivacyPolicy"; // ← new legal page
import TermsAndConditions from "./pages/legal/Terms"; // ← new legal page

// Dashboards
import InvestorDashboard from "./pages/investor/dashboard/InvestorDashboard";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import InvestorProjects from "./pages/investor/dashboard/investorProjects";
import InvestorLayout from "./components/investorDashboard/InvestorLayout";
import ExpenseBreakdown from "./pages/investor/dashboard/expenseBreakdown";
import PayoutsWithdrawals from "./pages/investor/dashboard/PayoutsWithdrawals";
import Documents from "./pages/investor/dashboard/Documents";
import InvestmentPreference from "./pages/investor/dashboard/InvestmentPreference";
import ProfileSettings from "./pages/investor/dashboard/ProfileSettings";
import SupportCommunity from "./pages/investor/dashboard/SupportCommunity";
import Projects from "./pages/admin/dashboard/Projects";
import DashboardLayout from "./pages/admin/dashboard/DashboardLayout";
import { ToastContainer } from "react-toastify";
import TeamMembers from "./pages/admin/dashboard/TeamMembers";
import TeamLogin from "./pages/team/login/TeamLogin";
import TeamChangePassword from "./pages/team/changepassword/TeamChangePassword";
import VendorManager from "./pages/admin/dashboard/VendorManager";
import Expenses from "./pages/admin/dashboard/Expenses";
import NotFound from "./pages/notfound/NotFound";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ResetPassword from "./pages/reset-password/ResetPassword";

function App() {
  const location = useLocation();

  const hideHeaderFooterRoutes = [
    "/investor-dashboard",
    "/admin-dashboard",
    "/admin",
    "/dashboard",
    "/admin/login",
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      {!shouldHideHeaderFooter && <Topheader />}
      <ToastContainer position="top-right" theme="dark" />

      <Routes>
        {/* ── Public Routes ─────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/company" element={<Company />} />

        {/* Projects — listing + individual detail */}
        <Route path="/projects" element={<Project />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />

        <Route path="/how-it-works" element={<Howitworks />} />
        <Route path="/reach-us" element={<Reachus />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Legal pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        {/* Admin auth */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Team auth */}
        <Route path="/team/login" element={<TeamLogin />} />
        <Route path="/team/changepassword" element={<TeamChangePassword />} />

        {/* Password reset */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ── Investor Dashboard — PROTECTED ────────────── */}
        <Route
          path="/investor-dashboard/"
          element={
            <PrivateRoute>
              <InvestorLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<InvestorDashboard />} />
          <Route path="active-projects" element={<InvestorProjects />} />
          <Route path="expense-breakdown" element={<ExpenseBreakdown />} />
          <Route path="payouts" element={<PayoutsWithdrawals />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile-settings" element={<ProfileSettings />} />
          <Route path="support-community" element={<SupportCommunity />} />
          <Route
            path="investmentPreference"
            element={<InvestmentPreference />}
          />
        </Route>

        {/* ── Admin Dashboard — PROTECTED ───────────────── */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="team" element={<TeamMembers />} />
          <Route path="vendors" element={<VendorManager />} />
        </Route>

        {/* ── 404 ───────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
