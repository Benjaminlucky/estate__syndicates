import { Navigate, useLocation } from "react-router-dom";

/**
 * AdminRoute — protects admin dashboard routes
 *
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
 *
 * Reads "adminToken" from localStorage (set by AdminLogin.jsx on successful login).
 * Admin tokens expire in 1 hour — mirrors the 1h expiry set in admin.controller.js.
 */
export default function AdminRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } catch {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
