import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaDownload, FaFileAlt, FaChartBar } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { api } from "../../../lib/api.js";
import { adminAuthHeader, fmtNaira } from "../../../hooks/useAdmin.js";

/* ─── CSV export helper ─────────────────────────────────────────── */
function downloadCSV(filename, headers, rows) {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Summary row ───────────────────────────────────────────────── */
function SummaryRow({ label, value, color = "text-white", border = false }) {
  return (
    <div
      className={`flex justify-between items-center py-3 font-chivo text-sm ${border ? "border-t border-black-700 mt-2 pt-4" : ""}`}
    >
      <span className="text-black-300">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function FinancialReports() {
  const [period, setPeriod] = useState("all");

  /* Fetch all data */
  const { data: investments = [], isLoading: invLoading } = useQuery({
    queryKey: ["admin_investments"],
    queryFn: async () =>
      (await api.get("/api/investments", { headers: adminAuthHeader() })).data
        ?.investments ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const { data: expenses = [], isLoading: expLoading } = useQuery({
    queryKey: ["admin_expenses_reports"],
    queryFn: async () =>
      (await api.get("/api/expenses", { headers: adminAuthHeader() })).data
        ?.expenses ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["admin_projects"],
    queryFn: async () => (await api.get("/api/projects")).data?.projects ?? [],
    staleTime: 1000 * 60 * 10,
  });

  const loading = invLoading || expLoading;

  /* ── Period filter ─────────────────────────────────────────────── */
  const filterByPeriod = (items, dateField = "createdAt") => {
    if (period === "all") return items;
    const now = new Date();
    const start = new Date();
    if (period === "month") start.setMonth(now.getMonth() - 1);
    if (period === "quarter") start.setMonth(now.getMonth() - 3);
    if (period === "year") start.setFullYear(now.getFullYear() - 1);
    return items.filter((i) => new Date(i[dateField]) >= start);
  };

  const filteredInv = useMemo(
    () => filterByPeriod(investments),
    [investments, period],
  );
  const filteredExp = useMemo(
    () => filterByPeriod(expenses),
    [expenses, period],
  );

  /* ── P&L calculations ──────────────────────────────────────────── */
  const pnl = useMemo(() => {
    const totalRaised = filteredInv
      .filter((i) => i.status !== "cancelled")
      .reduce((s, i) => s + i.amount, 0);
    const totalExpenses = filteredExp.reduce((s, e) => s + Number(e.amount), 0);
    const paidExpenses = filteredExp
      .filter((e) => e.paymentStatus === "Paid")
      .reduce((s, e) => s + Number(e.amount), 0);
    const unpaidExpenses = totalExpenses - paidExpenses;
    const totalPaidOut = filteredInv.reduce((s, i) => s + i.totalPaidOut, 0);
    const netPosition = totalRaised - totalExpenses - totalPaidOut;

    /* By category */
    const byCategory = {};
    for (const e of filteredExp) {
      byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
    }

    /* By project */
    const byProject = {};
    for (const e of filteredExp) {
      const key = e.project?.title ?? "Unassigned";
      byProject[key] = (byProject[key] || 0) + Number(e.amount);
    }

    const invByProject = {};
    for (const i of filteredInv) {
      if (i.status === "cancelled") continue;
      const key = i.project?.title ?? "Unassigned";
      invByProject[key] = (invByProject[key] || 0) + i.amount;
    }

    return {
      totalRaised,
      totalExpenses,
      paidExpenses,
      unpaidExpenses,
      totalPaidOut,
      netPosition,
      byCategory,
      byProject,
      invByProject,
    };
  }, [filteredInv, filteredExp]);

  /* ── CSV exports ───────────────────────────────────────────────── */
  const exportInvestments = () => {
    downloadCSV(
      `investments_${period}_${Date.now()}.csv`,
      ["Investor", "Email", "Project", "Units", "Amount (₦)", "Status", "Date"],
      filteredInv.map((i) => [
        `${i.investor?.firstName ?? ""} ${i.investor?.lastName ?? ""}`.trim(),
        i.investor?.emailAddress ?? "",
        i.project?.title ?? "",
        i.units,
        i.amount,
        i.status,
        new Date(i.createdAt).toLocaleDateString(),
      ]),
    );
  };

  const exportExpenses = () => {
    downloadCSV(
      `expenses_${period}_${Date.now()}.csv`,
      ["Title", "Project", "Category", "Amount (₦)", "Status", "Date"],
      filteredExp.map((e) => [
        e.title,
        e.project?.title ?? "",
        e.category,
        e.amount,
        e.paymentStatus,
        new Date(e.createdAt).toLocaleDateString(),
      ]),
    );
  };

  const exportPnL = () => {
    const rows = [
      ["Category", "Amount (₦)"],
      ["INCOME", ""],
      ["Capital Raised from Investors", pnl.totalRaised],
      ["", ""],
      ["EXPENSES", ""],
      ...Object.entries(pnl.byCategory).map(([k, v]) => [k, v]),
      ["Total Expenses", pnl.totalExpenses],
      ["", ""],
      ["DISBURSEMENTS", ""],
      ["Total Payouts to Investors", pnl.totalPaidOut],
      ["", ""],
      ["NET POSITION", pnl.netPosition],
    ];
    downloadCSV(`PnL_${period}_${Date.now()}.csv`, [], rows);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner color="warning" size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto font-chivo">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide font-cinzel text-golden-300">
            Financial Reports
          </h1>
          <p className="text-black-400 text-sm mt-1">
            P&amp;L summary and exportable data.
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportPnL}
            className="flex items-center gap-2 px-4 py-2 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-xs rounded-xl transition-colors"
          >
            <FaDownload className="text-[10px]" /> P&amp;L Report
          </button>
          <button
            onClick={exportInvestments}
            className="flex items-center gap-2 px-4 py-2 bg-black-700 hover:bg-black-600 border border-black-600 text-black-300 hover:text-white font-bold uppercase text-xs rounded-xl transition-colors"
          >
            <FaDownload className="text-[10px]" /> Investments CSV
          </button>
          <button
            onClick={exportExpenses}
            className="flex items-center gap-2 px-4 py-2 bg-black-700 hover:bg-black-600 border border-black-600 text-black-300 hover:text-white font-bold uppercase text-xs rounded-xl transition-colors"
          >
            <FaDownload className="text-[10px]" /> Expenses CSV
          </button>
        </div>
      </div>

      {/* Period filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "month", label: "Last Month" },
          { value: "quarter", label: "Last Quarter" },
          { value: "year", label: "Last Year" },
          { value: "all", label: "All Time" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-colors ${
              period === value
                ? "bg-golden-500 text-white border-golden-500"
                : "border-black-700 text-black-400 hover:border-golden-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Statement */}
        <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaChartBar className="text-golden-400" />
            <p className="font-bold uppercase text-sm text-golden-300">
              Profit &amp; Loss Statement
            </p>
          </div>

          <div className="space-y-1 divide-y divide-black-700/30">
            <div className="pb-3">
              <p className="font-chivo text-black-500 text-xs uppercase tracking-wider mb-2">
                Income
              </p>
              <SummaryRow
                label="Capital raised from investors"
                value={fmtNaira(pnl.totalRaised)}
                color="text-green-400"
              />
            </div>
            <div className="py-3">
              <p className="font-chivo text-black-500 text-xs uppercase tracking-wider mt-2 mb-2">
                Expenses
              </p>
              {Object.entries(pnl.byCategory).map(([cat, amt]) => (
                <SummaryRow
                  key={cat}
                  label={cat}
                  value={`(${fmtNaira(amt)})`}
                  color="text-red-400"
                />
              ))}
              <SummaryRow
                label="Total expenses"
                value={`(${fmtNaira(pnl.totalExpenses)})`}
                color="text-red-400"
              />
            </div>
            <div className="py-3">
              <p className="font-chivo text-black-500 text-xs uppercase tracking-wider mt-2 mb-2">
                Disbursements
              </p>
              <SummaryRow
                label="Investor payouts"
                value={`(${fmtNaira(pnl.totalPaidOut)})`}
                color="text-blue-400"
              />
            </div>
            <SummaryRow
              label="Net Position"
              value={fmtNaira(pnl.netPosition)}
              color={pnl.netPosition >= 0 ? "text-green-400" : "text-red-400"}
              border
            />
          </div>
        </div>

        {/* Expense breakdown by project */}
        <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <FaFileAlt className="text-golden-400" />
            <p className="font-bold uppercase text-sm text-golden-300">
              Expenses by Project
            </p>
          </div>

          {Object.keys(pnl.byProject).length === 0 ? (
            <p className="text-black-500 text-sm text-center py-8">
              No expense data for this period.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(pnl.byProject)
                .sort((a, b) => b[1] - a[1])
                .map(([proj, amt]) => {
                  const pct =
                    pnl.totalExpenses > 0 ? (amt / pnl.totalExpenses) * 100 : 0;
                  return (
                    <div key={proj} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-black-300 truncate pr-4">
                          {proj}
                        </span>
                        <span className="font-bold text-white flex-shrink-0">
                          {fmtNaira(amt)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-golden-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-black-600 text-xs text-right">
                        {pct.toFixed(1)}%
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Capital by project */}
        <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
          <p className="font-bold uppercase text-sm text-golden-300 mb-4">
            Capital Raised by Project
          </p>
          {Object.keys(pnl.invByProject).length === 0 ? (
            <p className="text-black-500 text-sm text-center py-8">
              No investment data for this period.
            </p>
          ) : (
            <div className="divide-y divide-black-700/50">
              {Object.entries(pnl.invByProject)
                .sort((a, b) => b[1] - a[1])
                .map(([proj, amt]) => (
                  <div
                    key={proj}
                    className="flex justify-between items-center py-3 text-sm"
                  >
                    <span className="text-black-300 truncate pr-4">{proj}</span>
                    <span className="font-bold text-golden-300 flex-shrink-0">
                      {fmtNaira(amt)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Outstanding payments */}
        <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
          <p className="font-bold uppercase text-sm text-golden-300 mb-4">
            Outstanding Payments
          </p>
          <div className="space-y-1 mb-4">
            <SummaryRow
              label="Total expenses incurred"
              value={fmtNaira(pnl.totalExpenses)}
            />
            <SummaryRow
              label="Paid"
              value={fmtNaira(pnl.paidExpenses)}
              color="text-green-400"
            />
            <SummaryRow
              label="Unpaid / outstanding"
              value={fmtNaira(pnl.unpaidExpenses)}
              color="text-red-400"
              border
            />
          </div>
          <p className="font-chivo text-black-600 text-xs">
            Manage individual payments in the Expense Breakdown section.
          </p>
        </div>
      </div>
    </div>
  );
}
