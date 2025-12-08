// src/components/TeamLogin.jsx
import { useState } from "react";
import { api } from "../../../lib/api";

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
      // Use the configured API instance instead of axios directly
      const res = await api.post("/api/auth/team/login", {
        email,
        password,
      });

      localStorage.setItem("team_token", res.data.token);
      window.location.href = "/team/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        <h2 className="text-3xl font-bold text-white text-center">
          Team Member Login
        </h2>

        {error && (
          <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium font-chivo text-black-200 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-3 font-chivo bg-black-700 border-2 border-golden-400 rounded-lg text-white placeholder-black-400 focus:outline-none focus:border-golden-300 focus:ring-2 focus:ring-golden-500 focus:ring-opacity-20 transition-all duration-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-chivo font-medium text-black-200 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-black-700 font-chivo border-2 border-golden-400 rounded-lg text-white placeholder-black-400 focus:outline-none focus:border-golden-300 focus:ring-2 focus:ring-golden-500 focus:ring-opacity-20 transition-all duration-200 pr-12"
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.976 9.976 0 011.59-4.254l-.794-.794a.5.5 0 010-.707l1.06-1.06a.5.5 0 01.707 0l1.246 1.246A10.015 10.015 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.976 9.976 0 01-1.59 4.254l.794.794a.5.5 0 010 .707l-1.06 1.06a.5.5 0 01-.707 0l-1.246-1.246zM12 15a3 3 0 100-6 3 3 0 000 6z"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-chivo font-semibold text-white transition-all duration-200 ${
              loading
                ? "bg-golden-400 opacity-60 cursor-not-allowed"
                : "bg-golden-500 hover:bg-golden-600 focus:outline-none focus:ring-2 focus:ring-golden-400 focus:ring-offset-2 focus:ring-offset-black-800"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center font-chivo pt-2">
          <a
            href="/team/changepassword"
            className="text-sm font-medium text-black-300 hover:text-golden-400 transition-colors duration-200 underline"
          >
            Change Password
          </a>
        </div>
      </div>
    </div>
  );
}
