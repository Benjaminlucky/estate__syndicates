import { useState } from "react";
import { api } from "../../../lib/api.js";

export default function TeamLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // FIXED: Added /api prefix to match backend route
      const res = await api.post("/api/team-members/login", {
        email,
        password,
      });

      console.log("Login response:", res);

      // Check if login was successful
      if (res.success && res.token) {
        localStorage.setItem("team_token", res.token);

        // Store member data if needed
        if (res.member) {
          localStorage.setItem("team_member", JSON.stringify(res.member));
        }

        // Redirect to dashboard
        window.location.href = "/team/dashboard";
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Better error handling
      let errorMessage = "Login failed. Please check your credentials.";

      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Cannot connect to server. Please try again.";
      } else {
        // Other errors
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-black-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black-800 rounded-xl shadow-2xl p-8 space-y-6 border border-black-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white font-cinzel">
            Team Member Login
          </h2>
          <p className="text-black-400 mt-2 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium font-chivo text-golden-200 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 font-chivo bg-black-900 border border-golden-900/30 rounded-lg text-golden-100 placeholder-black-400 focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-chivo font-medium text-golden-200 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-black-900 font-chivo border border-golden-900/30 rounded-lg text-golden-100 placeholder-black-400 focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent transition-all pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 font-chivo flex items-center text-black-300 hover:text-golden-400 transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.976 9.976 0 011.59-4.254m0 0l2.832 2.832m5.683-5.683a9.953 9.953 0 012.96-.83M4.914 7.914A9.953 9.953 0 012 12m12.707 6.707l-1.414 1.414m-6.828-6.828L4.05 11.88"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-chivo font-semibold text-black-900 transition-all duration-200 ${
              loading
                ? "bg-golden-400 opacity-60 cursor-not-allowed"
                : "bg-gradient-to-r from-golden-600 to-golden-500 hover:from-golden-700 hover:to-golden-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center font-chivo pt-2">
          <a
            href="/team/changepassword"
            className="text-sm font-medium text-golden-300 hover:text-golden-400 transition-colors duration-200 underline"
          >
            Change Password
          </a>
        </div>

        <div className="text-center pt-4 border-t border-black-700">
          <p className="text-xs text-black-400">
            Use the credentials sent to your email to log in
          </p>
        </div>
      </div>
    </div>
  );
}
