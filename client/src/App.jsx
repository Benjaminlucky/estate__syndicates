import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import "./App.css";
import Home from "./pages/Home/Home";
import Project from "./pages/project/Project";
import Howitworks from "./pages/howitworks/Howitworks";
import Reachus from "./pages/reach/Reach";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Company from "./pages/company/Company";
import Topheader from "./components/topHeader/Topheader";
import Footer from "./components/footer/Footer";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminLogin from "./pages/admin/AdminLogin";

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

function App() {
  const location = useLocation();

  // Define routes where header and footer should be hidden
  const hideHeaderFooterRoutes = [
    "/investor-dashboard",
    "/admin-dashboard",
    "/admin",
    "/dashboard",
    "/admin/login",
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideHeaderFooter && <Topheader />}
      <ToastContainer position="top-right" theme="dark" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/company" element={<Company />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/how-it-works" element={<Howitworks />} />
        <Route path="/reach-us" element={<Reachus />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Investor Dashboard Routes */}
        <Route path="/investor-dashboard/" element={<InvestorLayout />}>
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

        {/* Admin Dashboard Routes */}
        {/* Admin Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<Projects />} />
        </Route>
      </Routes>

      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
