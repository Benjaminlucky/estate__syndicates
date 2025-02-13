import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

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

const clerkPubKey = "your-clerk-public-key"; // Replace with actual Clerk public key

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Topheader />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/how-it-works" element={<Howitworks />} />
          <Route path="/reach-us" element={<Reachus />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminSignup />} />
          <Route path="/adminLogin" element={<AdminLogin />} />

          {/* Protected Investor Dashboard */}
          <Route path="/investor-dashboard" element={<SignedIn></SignedIn>} />
          <Route
            path="/investor-dashboard/*"
            element={<Navigate to="/login" />}
          />

          {/* Protected Admin Dashboard */}
          <Route path="/admin-dashboard" element={<SignedIn></SignedIn>} />
          <Route path="/admin-dashboard/*" element={<Navigate to="/login" />} />

          {/* Redirect if not signed in */}
          <Route
            path="/dashboard/*"
            element={
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </ClerkProvider>
  );
}

export default App;
