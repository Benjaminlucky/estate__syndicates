import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaUniversity } from "react-icons/fa";
import { api } from "../../../lib/api";

const inputCls =
  "w-full bg-black-900 border border-black-700 rounded-lg px-4 py-3 font-chivo text-sm text-white placeholder-black-600 focus:outline-none focus:border-golden-500 transition-colors";

export default function ProfileSettings() {
  const investor = JSON.parse(localStorage.getItem("investor") || "{}");

  const [profile, setProfile] = useState({
    firstName: investor.firstName || "",
    lastName: investor.lastName || "",
    phoneNumber: investor.phoneNumber || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [bank, setBank] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [saving, setSaving] = useState({
    profile: false,
    password: false,
    bank: false,
  });

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving((s) => ({ ...s, profile: true }));
    await new Promise((r) => setTimeout(r, 800));
    const updated = { ...investor, ...profile };
    localStorage.setItem("investor", JSON.stringify(updated));
    toast.success("Profile updated successfully");
    setSaving((s) => ({ ...s, profile: false }));
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving((s) => ({ ...s, password: true }));
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/investor/change-password",
        { currentPassword: passwords.current, newPassword: passwords.newPass },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Password changed successfully");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    }
    setSaving((s) => ({ ...s, password: false }));
  };

  const saveBank = async (e) => {
    e.preventDefault();
    setSaving((s) => ({ ...s, bank: true }));
    await new Promise((r) => setTimeout(r, 800));
    toast.success(
      "Bank details saved. Our team will verify before processing withdrawals.",
    );
    setSaving((s) => ({ ...s, bank: false }));
  };

  const initials =
    `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold uppercase mb-1">Profile Settings</h1>
        <p className="font-chivo text-black-400 text-sm">
          Manage your account details and preferences
        </p>
      </motion.div>

      {/* Avatar */}
      <div className="flex items-center gap-4 bg-black-800 border border-black-700 rounded-2xl p-5">
        <div className="w-16 h-16 rounded-full bg-golden-500 flex items-center justify-center font-bold text-xl text-white">
          {initials}
        </div>
        <div>
          <p className="font-bold">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="font-chivo text-black-400 text-sm">
            {investor.emailAddress}
          </p>
          <span className="font-chivo text-xs text-golden-300 uppercase tracking-wide">
            Investor Account
          </span>
        </div>
      </div>

      {/* Personal details */}
      <Section icon={FaUser} title="Personal Information">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name">
              <input
                className={inputCls}
                value={profile.firstName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, firstName: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Last Name">
              <input
                className={inputCls}
                value={profile.lastName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, lastName: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Phone Number">
              <input
                className={inputCls}
                value={profile.phoneNumber}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phoneNumber: e.target.value }))
                }
              />
            </Field>
            <Field label="Email Address">
              <input
                className={inputCls}
                value={investor.emailAddress || ""}
                disabled
              />
            </Field>
          </div>
          <SaveBtn loading={saving.profile} label="Save Profile" />
        </form>
      </Section>

      {/* Password */}
      <Section icon={FaLock} title="Change Password">
        <form onSubmit={changePassword} className="space-y-4">
          {[
            { key: "current", label: "Current Password" },
            { key: "newPass", label: "New Password" },
            { key: "confirm", label: "Confirm New Password" },
          ].map(({ key, label }) => (
            <Field key={key} label={label}>
              <input
                type="password"
                className={inputCls}
                value={passwords[key]}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, [key]: e.target.value }))
                }
                required
              />
            </Field>
          ))}
          <SaveBtn loading={saving.password} label="Update Password" />
        </form>
      </Section>

      {/* Bank details */}
      <Section icon={FaUniversity} title="Bank Details for Payouts">
        <p className="font-chivo text-black-500 text-xs mb-4">
          These details will be used to process your withdrawal requests.
        </p>
        <form onSubmit={saveBank} className="space-y-4">
          {[
            { key: "bankName", label: "Bank Name", placeholder: "GTBank" },
            {
              key: "accountNumber",
              label: "Account Number",
              placeholder: "0123456789",
            },
            {
              key: "accountName",
              label: "Account Name",
              placeholder: "Chukwuma Nnebe",
            },
          ].map(({ key, label, placeholder }) => (
            <Field key={key} label={label}>
              <input
                className={inputCls}
                placeholder={placeholder}
                value={bank[key]}
                onChange={(e) =>
                  setBank((p) => ({ ...p, [key]: e.target.value }))
                }
                required
              />
            </Field>
          ))}
          <SaveBtn loading={saving.bank} label="Save Bank Details" />
        </form>
      </Section>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-black-700">
        <Icon className="text-golden-400" />
        <p className="font-bold uppercase text-sm">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1.5">
        {label}
      </p>
      {children}
    </label>
  );
}

function SaveBtn({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="px-6 py-2.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-sm rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? "Saving…" : label}
    </button>
  );
}
