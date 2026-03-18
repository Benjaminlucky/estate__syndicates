import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaCheckCircle, FaClock } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { useAllInvestments, fmtNaira } from "../../../hooks/useAdmin.js";

export default function AdminPayouts() {
  const { data: investments = [], isLoading } = useAllInvestments();

  /* Flatten all payout events */
  const allPayouts = useMemo(() => {
    const events = [];
    for (const inv of investments) {
      for (const p of inv.payoutHistory ?? []) {
        events.push({
          ...p,
          investorName:
            `${inv.investor?.firstName ?? ""} ${inv.investor?.lastName ?? ""}`.trim(),
          investorEmail: inv.investor?.emailAddress,
          projectTitle: inv.project?.title ?? "—",
          investmentId: inv._id,
        });
      }
    }
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [investments]);

  const totalPaidOut = allPayouts.reduce((s, p) => s + p.amount, 0);
  const activeInvs = investments.filter((i) => i.status === "active");
  const pendingAmount = activeInvs.reduce((s, i) => {
    const roi = parseFloat(i.project?.roi) || 0;
    return s + i.amount * (roi / 100);
  }, 0);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-chivo">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide font-cinzel text-golden-300">
          Payout Management
        </h1>
        <p className="text-black-400 text-sm mt-1">
          Full payout history across all investors. Use the Investments page to
          record new payouts.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-black-800 border border-black-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-700/30 flex items-center justify-center">
              <FaCheckCircle className="text-green-400" />
            </div>
            <p className="text-black-400 text-xs uppercase tracking-wide">
              Total Paid Out
            </p>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {fmtNaira(totalPaidOut)}
          </p>
        </div>
        <div className="bg-black-800 border border-black-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-golden-700/30 flex items-center justify-center">
              <FaClock className="text-golden-300" />
            </div>
            <p className="text-black-400 text-xs uppercase tracking-wide">
              Projected Pending
            </p>
          </div>
          <p className="text-2xl font-bold text-golden-300">
            {fmtNaira(pendingAmount)}
          </p>
        </div>
        <div className="bg-black-800 border border-black-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-black-700 flex items-center justify-center">
              <FaMoneyBillWave className="text-black-400" />
            </div>
            <p className="text-black-400 text-xs uppercase tracking-wide">
              Total Payouts
            </p>
          </div>
          <p className="text-2xl font-bold text-white">{allPayouts.length}</p>
        </div>
      </div>

      {/* Payout table */}
      <div className="bg-black-900 border border-black-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-black-700">
          <p className="font-bold uppercase text-sm text-golden-300">
            Payout History
          </p>
          <p className="font-chivo text-black-500 text-xs mt-0.5">
            To record a new payout, go to Investments and click the payout icon
            on an active investment.
          </p>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Spinner color="warning" />
            </div>
          ) : allPayouts.length === 0 ? (
            <div className="py-16 text-center">
              <FaMoneyBillWave className="text-black-700 text-4xl mx-auto mb-3" />
              <p className="text-black-500 text-sm">No payouts recorded yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-black-800 border-b border-black-700">
                <tr>
                  {[
                    "Investor",
                    "Project",
                    "Amount",
                    "Reference",
                    "Note",
                    "Date",
                  ].map((h) => (
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
                {allPayouts.map((p, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-black-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-sm">{p.investorName}</p>
                      <p className="text-black-500 text-xs">
                        {p.investorEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-black-300">
                      {p.projectTitle}
                    </td>
                    <td className="px-4 py-3 font-bold text-green-400">
                      {fmtNaira(p.amount)}
                    </td>
                    <td className="px-4 py-3 text-black-400 text-xs font-mono">
                      {p.reference ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-black-500 text-xs">
                      {p.note ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-black-500 text-xs">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
