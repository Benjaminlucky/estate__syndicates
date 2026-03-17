import { Navigate, useLocation } from "react-router-dom";

/**
 * PrivateRoute — protects investor dashboard routes
 *
 * Usage in App.jsx:
 *   <Route path="/investor-dashboard/" element={<PrivateRoute><InvestorLayout /></PrivateRoute>}>
 *
 * What it does:
 *  1. Reads the JWT from localStorage ("token")
 *  2. Decodes the payload (no library needed — just base64)
 *  3. Checks expiry against current time
 *  4. If valid → renders children
 *  5. If missing or expired → redirects to /login, preserving the attempted URL
 */
export default function PrivateRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // No token at all — send to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    // Decode JWT payload (middle segment, base64url encoded)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      // Clean up the stale token
      localStorage.removeItem("token");
      localStorage.removeItem("investor");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } catch {
    // Malformed token — clear and redirect
    localStorage.removeItem("token");
    localStorage.removeItem("investor");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
