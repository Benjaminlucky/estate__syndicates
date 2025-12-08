// src/components/TeamChangePassword.jsx
import { useState } from "react";
import { api } from "../../../lib/api";

export default function TeamChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNew) {
      return setError("New passwords do not match");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("team_token");

      // Use the configured API instance instead of axios directly
      const res = await api.post(
        "/api/team/team/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNew("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900 p-6">
      <div className="w-full max-w-md bg-black-800 rounded-xl shadow-2xl p-8 border border-black-700">
        <h2 className="text-2xl font-bold font-cinzel text-center text-golden-400 mb-6">
          Change Password
        </h2>

        {error && (
          <p className="bg-red-900 text-red-300 border border-red-700 p-3 rounded-lg mb-4 text-center text-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-900 text-green-300 border border-green-700 p-3 rounded-lg mb-4 text-center text-sm">
            {success}
          </p>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5 font-chivo">
          <div>
            <label className="block font-semibold text-black-300 mb-1">
              Old Password
            </label>
            <input
              type="password"
              placeholder="Enter your current password"
              className="w-full p-3 rounded-lg border border-golden-400 bg-black-700 text-white focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-golden-500 transition duration-150"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-black-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter a new password"
              className="w-full p-3 rounded-lg border border-golden-400 bg-black-700 text-white focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-golden-500 transition duration-150"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-black-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Re-enter the new password"
              className="w-full p-3 rounded-lg border border-golden-400 bg-black-700 text-white focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-golden-500 transition duration-150"
              value={confirmNew}
              onChange={(e) => setConfirmNew(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-center py-3 rounded-lg font-semibold text-white transition duration-150 ease-in-out
              ${
                loading
                  ? "bg-golden-500 opacity-75 cursor-not-allowed"
                  : "bg-golden-500 hover:bg-golden-600 focus:outline-none focus:ring-2 focus:ring-golden-500 focus:ring-offset-2 focus:ring-offset-black-800"
              }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
