import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaMoneyBillWave,
  FaArrowDown,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";
import { api } from "../../../lib/api";
import { toast } from "react-toastify";

const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString("en-NG")}` : "₦0");

/* ─── All Nigerian banks ────────────────────────────────────────── */
const NIGERIAN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Lotus Bank",
  "Optimus Bank",
  "Parallex Bank",
  "Polaris Bank",
  "Premium Trust Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
  /* Microfinance & digital */
  "Carbon (One Finance)",
  "Fairmoney Microfinance Bank",
  "Kuda Bank",
  "Moniepoint Microfinance Bank",
  "Opay (OPay Digital Services)",
  "Palmpay",
  "VFD Microfinance Bank",
];

/* ─── Searchable bank dropdown ──────────────────────────────────── */
function BankSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = NIGERIAN_BANKS.filter((b) =>
    b.toLowerCase().includes(query.toLowerCase()),
  );

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Focus search input when dropdown opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const select = (bank) => {
    onChange(bank);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full bg-black-800 border border-black-700 rounded-lg px-4 py-2.5 font-chivo text-sm focus:outline-none focus:border-golden-500 flex items-center justify-between text-left transition-colors hover:border-black-600"
      >
        <span className={value ? "text-white" : "text-black-500"}>
          {value || "Select bank…"}
        </span>
        <FaChevronDown
          className={`text-black-500 text-xs flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1 bg-black-800 border border-black-700 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-black-700">
              <FaSearch className="text-black-500 text-xs flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search banks…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent font-chivo text-sm text-white placeholder-black-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-black-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* List */}
            <ul className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 font-chivo text-sm text-black-500 text-center">
                  No banks found
                </li>
              ) : (
                filtered.map((bank) => (
                  <li key={bank}>
                    <button
                      type="button"
                      onClick={() => select(bank)}
                      className={`w-full text-left px-4 py-2.5 font-chivo text-sm transition-colors hover:bg-black-700 ${
                        value === bank
                          ? "text-golden-300 font-bold bg-golden-900/20"
                          : "text-white"
                      }`}
                    >
                      {bank}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PayoutsWithdrawals() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () =>
      (
        await api.get("/api/investments/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data,
    staleTime: 1000 * 60 * 5,
  });

  const { data: investments = [] } = useQuery({
    queryKey: ["my-investments"],
    queryFn: async () =>
      (
        await api.get("/api/investments/my", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data?.investments ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const allPayouts = investments
    .flatMap((inv) =>
      inv.payoutHistory.map((p) => ({
        ...p,
        projectTitle: inv.project?.title,
      })),
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success(
      "Withdrawal request submitted. Our team will process it within 2 business days.",
    );
    setShowForm(false);
    setForm({
      amount: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      note: "",
    });
    setSubmitting(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold uppercase mb-1">
          Payouts & Withdrawals
        </h1>
        <p className="font-chivo text-black-400 text-sm">
          Track your earnings and request withdrawals
        </p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Payouts Received",
            value: fmt(portfolio?.totalPayouts),
            color: "text-green-400",
          },
          {
            label: "Projected Returns",
            value: fmt(portfolio?.projectedReturns),
            color: "text-golden-300",
          },
          {
            label: "Total Invested",
            value: fmt(portfolio?.totalInvested),
            color: "text-white",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-black-800 border border-black-700 rounded-xl p-5"
          >
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
              {label}
            </p>
            <p className={`font-bold text-xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Payout history */}
      <div className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-black-700 flex items-center justify-between">
          <p className="font-bold uppercase text-sm">Payout History</p>
          <button
            onClick={() => setShowForm((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-xs rounded-lg transition-colors"
          >
            <FaArrowDown className="text-xs" /> Request Withdrawal
          </button>
        </div>

        {showForm && (
          <div className="px-5 py-5 border-b border-black-700 bg-black-900">
            <p className="font-bold uppercase text-sm mb-4">
              Withdrawal Request
            </p>
            <form
              onSubmit={handleWithdraw}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Amount */}
              <label className="block">
                <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
                  Amount (₦)
                </p>
                <input
                  type="number"
                  placeholder="50000"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  required
                  className="w-full bg-black-800 border border-black-700 rounded-lg px-4 py-2.5 font-chivo text-sm focus:outline-none focus:border-golden-500"
                />
              </label>

              {/* Bank name — searchable dropdown */}
              <label className="block">
                <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
                  Bank Name
                </p>
                <BankSelect
                  value={form.bankName}
                  onChange={(val) => setForm((p) => ({ ...p, bankName: val }))}
                />
                <input type="hidden" value={form.bankName} required />
              </label>

              {/* Account number */}
              <label className="block">
                <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
                  Account Number
                </p>
                <input
                  type="text"
                  placeholder="0123456789"
                  value={form.accountNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, accountNumber: e.target.value }))
                  }
                  required
                  maxLength={10}
                  className="w-full bg-black-800 border border-black-700 rounded-lg px-4 py-2.5 font-chivo text-sm focus:outline-none focus:border-golden-500"
                />
              </label>

              {/* Account name */}
              <label className="block">
                <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
                  Account Name
                </p>
                <input
                  type="text"
                  placeholder="Chukwuma Nnebe"
                  value={form.accountName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, accountName: e.target.value }))
                  }
                  required
                  className="w-full bg-black-800 border border-black-700 rounded-lg px-4 py-2.5 font-chivo text-sm focus:outline-none focus:border-golden-500"
                />
              </label>
              <label className="block sm:col-span-2">
                <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
                  Note (optional)
                </p>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, note: e.target.value }))
                  }
                  className="w-full bg-black-800 border border-black-700 rounded-lg px-4 py-2.5 font-chivo text-sm focus:outline-none focus:border-golden-500 resize-none"
                />
              </label>
              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-black-600 text-black-300 font-bold uppercase text-sm rounded-lg hover:bg-black-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {allPayouts.length === 0 ? (
          <div className="py-16 text-center">
            <FaMoneyBillWave className="text-black-600 text-4xl mx-auto mb-3" />
            <p className="font-chivo text-black-500 text-sm">
              No payouts received yet.
            </p>
            <p className="font-chivo text-black-600 text-xs mt-1">
              Payouts are distributed when your projects hit milestones.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-black-900">
              <tr>
                {["Project", "Amount", "Reference", "Date", "Note"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-chivo text-black-400 text-xs uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black-800">
              {allPayouts.map((p, i) => (
                <tr key={i} className="hover:bg-black-700/30 transition-colors">
                  <td className="px-4 py-3 font-chivo">{p.projectTitle}</td>
                  <td className="px-4 py-3 font-bold text-green-400">
                    {fmt(p.amount)}
                  </td>
                  <td className="px-4 py-3 font-chivo text-black-400 text-xs">
                    {p.reference || "—"}
                  </td>
                  <td className="px-4 py-3 font-chivo text-black-500 text-xs">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-chivo text-black-500 text-xs">
                    {p.note || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
