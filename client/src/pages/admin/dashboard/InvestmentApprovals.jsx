import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { api } from "../../../lib/api.js";
import {
  useAllInvestments,
  useAdminRole,
  canWrite,
  adminAuthHeader,
  fmtNaira,
} from "../../../hooks/useAdmin.js";

const STATUS_STYLE = {
  pending: "bg-golden-300/10 text-golden-300 border-golden-700",
  active: "bg-green-400/10  text-green-400  border-green-700",
  completed: "bg-blue-400/10   text-blue-400   border-blue-700",
  cancelled: "bg-red-400/10    text-red-400    border-red-700",
};

/* ─── Payout modal ──────────────────────────────────────────────── */
function PayoutModal({ investment, onClose }) {
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () =>
      (
        await api.patch(
          `/api/investments/${investment._id}/payout`,
          { amount: Number(amount), reference, note },
          { headers: adminAuthHeader() },
        )
      ).data,
    onSuccess: () => {
      toast.success("Payout recorded.");
      queryClient.invalidateQueries(["admin_investments"]);
      onClose();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black-800 border border-black-700 rounded-2xl w-full max-w-md p-6 space-y-4"
      >
        <h2 className="font-bold uppercase text-lg">Record Payout</h2>
        <p className="font-chivo text-black-400 text-sm">
          {investment.investor?.firstName} {investment.investor?.lastName} ·{" "}
          {investment.project?.title}
        </p>

        {[
          {
            label: "Amount (₦)",
            value: amount,
            set: setAmount,
            type: "number",
            placeholder: "e.g. 150000",
          },
          {
            label: "Reference",
            value: reference,
            set: setReference,
            placeholder: "e.g. TXN-001",
          },
          {
            label: "Note",
            value: note,
            set: setNote,
            placeholder: "Optional note",
          },
        ].map(({ label, value, set, type = "text", placeholder }) => (
          <label key={label} className="block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
              {label}
            </p>
            <input
              type={type}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-black-900 border border-black-700 rounded-xl px-4 py-2.5 font-chivo text-sm focus:outline-none focus:border-golden-500"
            />
          </label>
        ))}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => mutation.mutate()}
            disabled={!amount || mutation.isPending}
            className="flex-1 py-3 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? <Spinner size="sm" /> : "Confirm Payout"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-black-600 text-black-300 font-bold uppercase text-sm rounded-xl hover:bg-black-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function InvestmentApprovals() {
  const [filter, setFilter] = useState("all");
  const [payoutModal, setPayoutModal] = useState(null);
  const role = useAdminRole();
  const writer = canWrite(role);
  const queryClient = useQueryClient();

  const { data: investments = [], isLoading } = useAllInvestments();

  const displayed =
    filter === "all"
      ? investments
      : investments.filter((i) => i.status === filter);

  const approveMutation = useMutation({
    mutationFn: async (id) =>
      (
        await api.patch(
          `/api/investments/${id}/approve`,
          {},
          { headers: adminAuthHeader() },
        )
      ).data,
    onSuccess: () => {
      toast.success("Investment approved.");
      queryClient.invalidateQueries(["admin_investments"]);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) =>
      (
        await api.patch(
          `/api/investments/${id}/reject`,
          {},
          { headers: adminAuthHeader() },
        )
      ).data,
    onSuccess: () => {
      toast.success("Investment rejected.");
      queryClient.invalidateQueries(["admin_investments"]);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  /* Summary counts */
  const counts = investments.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});
  const totalCommitted = investments
    .filter((i) => i.status !== "cancelled")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-chivo">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide font-cinzel text-golden-300">
          Investment Approvals
        </h1>
        <p className="text-black-400 text-sm mt-1">
          Review and manage investor commitments.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Committed",
            value: fmtNaira(totalCommitted),
            color: "text-white",
          },
          {
            label: "Pending",
            value: counts.pending ?? 0,
            color: "text-golden-300",
          },
          {
            label: "Active",
            value: counts.active ?? 0,
            color: "text-green-400",
          },
          {
            label: "Cancelled",
            value: counts.cancelled ?? 0,
            color: "text-red-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-black-800 border border-black-700 rounded-2xl p-5"
          >
            <p className="text-black-400 text-xs uppercase tracking-wide mb-1">
              {s.label}
            </p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "active", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg font-chivo text-xs font-bold uppercase tracking-wide border transition-colors ${
              filter === f
                ? "bg-golden-500 text-white border-golden-500"
                : "border-black-700 text-black-400 hover:border-golden-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-black-900 border border-black-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black-800 border-b border-black-700">
              <tr>
                {[
                  "Investor",
                  "Project",
                  "Amount",
                  "Units",
                  "Status",
                  "Date",
                  writer && "Actions",
                ]
                  .filter(Boolean)
                  .map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-chivo text-golden-500 text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Spinner color="warning" />
                  </td>
                </tr>
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-black-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                displayed.map((inv) => (
                  <tr
                    key={inv._id}
                    className="hover:bg-black-800/50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-sm">
                        {inv.investor?.firstName} {inv.investor?.lastName}
                      </p>
                      <p className="text-black-500 text-xs">
                        {inv.investor?.emailAddress}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-black-300">
                      {inv.project?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-bold text-golden-300">
                      {fmtNaira(inv.amount)}
                    </td>
                    <td className="px-4 py-3 text-black-300">{inv.units}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLE[inv.status] ?? ""}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black-500 text-xs">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    {writer && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {inv.status === "pending" && (
                            <>
                              <button
                                onClick={() => approveMutation.mutate(inv._id)}
                                disabled={approveMutation.isPending}
                                title="Approve"
                                className="p-1.5 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-900/60 transition-colors"
                              >
                                <FaCheckCircle />
                              </button>
                              <button
                                onClick={() => rejectMutation.mutate(inv._id)}
                                disabled={rejectMutation.isPending}
                                title="Reject"
                                className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/60 transition-colors"
                              >
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                          {inv.status === "active" && (
                            <button
                              onClick={() => setPayoutModal(inv)}
                              title="Record Payout"
                              className="p-1.5 rounded-lg bg-golden-900/30 text-golden-300 hover:bg-golden-900/60 transition-colors"
                            >
                              <FaMoneyBillWave />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {payoutModal && (
        <PayoutModal
          investment={payoutModal}
          onClose={() => setPayoutModal(null)}
        />
      )}
    </div>
  );
}
