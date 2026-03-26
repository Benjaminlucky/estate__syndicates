import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaDownload } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { api } from "../../../lib/api";

const COLORS = [
  "#C99E75",
  "#94662A",
  "#785223",
  "#5D3F1C",
  "#422C15",
  "#28190C",
];
const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString("en-NG")}` : "₦0");

/* ─────────────────────────────────────────────────────────────────
   Invoice PDF download — uses investor token
─────────────────────────────────────────────────────────────────── */
async function downloadInvoice(expenseId, expenseTitle) {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get(`/api/expenses/${expenseId}/invoice`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    });
    const url = URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${expenseTitle.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded");
  } catch {
    toast.error("Failed to download invoice");
  }
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
─────────────────────────────────────────────────────────────────── */
export default function ExpenseBreakdown() {
  const [selectedProject, setSelectedProject] = useState("all");
  const [downloadingId, setDownloadingId] = useState(null);

  /* ── Data ────────────────────────────────────────────────────── */
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["investor-expenses"],
    queryFn: async () => (await api.get("/api/expenses")).data?.expenses ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const { data: investments = [] } = useQuery({
    queryKey: ["my-investments"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/investments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.investments ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  /* ── Filter to only this investor's projects ─────────────────── */
  const investedProjectIds = useMemo(
    () => new Set(investments.map((inv) => inv.project?._id).filter(Boolean)),
    [investments],
  );

  const relevantExpenses = useMemo(
    () =>
      expenses.filter((ex) =>
        investedProjectIds.has(ex.project?._id ?? ex.project),
      ),
    [expenses, investedProjectIds],
  );

  const filtered =
    selectedProject === "all"
      ? relevantExpenses
      : relevantExpenses.filter(
          (ex) => (ex.project?._id ?? ex.project) === selectedProject,
        );

  /* ── Chart data ──────────────────────────────────────────────── */
  const byCategory = useMemo(() => {
    const map = {};
    filtered.forEach((ex) => {
      map[ex.category] = (map[ex.category] || 0) + Number(ex.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const byMonth = useMemo(() => {
    const map = {};
    filtered.forEach((ex) => {
      const key = new Date(ex.createdAt).toLocaleDateString("en", {
        month: "short",
        year: "2-digit",
      });
      map[key] = (map[key] || 0) + Number(ex.amount);
    });
    return Object.entries(map)
      .slice(-6)
      .map(([name, amount]) => ({ name, amount }));
  }, [filtered]);

  const totalExpenses = filtered.reduce((s, ex) => s + Number(ex.amount), 0);
  const totalPaid = filtered.reduce(
    (s, ex) => s + Number(ex.amountPaid || 0),
    0,
  );
  const totalOutstanding = totalExpenses - totalPaid;

  const investedProjects = investments
    .map((inv) => inv.project)
    .filter(Boolean);

  /* ── Invoice download handler ────────────────────────────────── */
  const handleDownload = async (ex) => {
    setDownloadingId(ex._id);
    await downloadInvoice(ex._id, ex.title);
    setDownloadingId(null);
  };

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold uppercase mb-1">Expense Breakdown</h1>
        <p className="font-chivo text-black-400 text-sm">
          Expenditure tracking for your invested projects
        </p>
      </motion.div>

      {/* Project filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedProject("all")}
          className={`px-4 py-2 rounded-lg font-chivo text-sm font-bold uppercase transition-colors ${
            selectedProject === "all"
              ? "bg-golden-500 text-white"
              : "bg-black-800 border border-black-700 text-black-300 hover:border-golden-600"
          }`}
        >
          All Projects
        </button>
        {investedProjects.map((p) => (
          <button
            key={p._id}
            onClick={() => setSelectedProject(p._id)}
            className={`px-4 py-2 rounded-lg font-chivo text-sm font-bold uppercase transition-colors ${
              selectedProject === p._id
                ? "bg-golden-500 text-white"
                : "bg-black-800 border border-black-700 text-black-300 hover:border-golden-600"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse h-64 bg-black-800 rounded-2xl"
            />
          ))}
        </div>
      ) : investments.length === 0 ? (
        <div className="bg-black-800 border border-black-700 rounded-2xl p-12 text-center">
          <p className="font-chivo text-black-400">
            You have no investments yet. Invest in a project to see expense
            data.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-black-800 border border-black-700 rounded-2xl p-12 text-center">
          <p className="font-chivo text-black-400">
            No expense records found for this project yet.
          </p>
        </div>
      ) : (
        <>
          {/* Summary cards — now shows paid + outstanding */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Total Expenses",
                value: fmt(totalExpenses),
                color: "text-golden-300",
              },
              {
                label: "Amount Paid",
                value: fmt(totalPaid),
                color: "text-green-400",
              },
              {
                label: "Outstanding",
                value: fmt(totalOutstanding),
                color: "text-red-400",
              },
              {
                label: "No. of Records",
                value: filtered.length,
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
              <p className="font-bold uppercase text-sm mb-4">By Category</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmt(v)}
                    contentStyle={{
                      background: "#171717",
                      border: "1px solid #404040",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
              <p className="font-bold uppercase text-sm mb-4">Monthly Spend</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#A3A3A3" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#A3A3A3" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v) => fmt(v)}
                    contentStyle={{
                      background: "#171717",
                      border: "1px solid #404040",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="amount" fill="#C99E75" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense records table */}
          <div className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-black-700">
              <p className="font-bold uppercase text-sm">Expense Records</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black-900">
                  <tr>
                    {[
                      "Title",
                      "Category",
                      "Total",
                      "Paid",
                      "Outstanding",
                      "Status",
                      "Date",
                      "Invoice",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-chivo text-black-400 text-xs uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black-800">
                  {filtered.map((ex) => {
                    const outstanding =
                      Number(ex.amount) - Number(ex.amountPaid || 0);
                    const isDownloading = downloadingId === ex._id;
                    return (
                      <tr
                        key={ex._id}
                        className="hover:bg-black-700/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-chivo">{ex.title}</td>
                        <td className="px-4 py-3 font-chivo text-black-400">
                          {ex.category}
                        </td>
                        <td className="px-4 py-3 font-bold text-golden-300">
                          {fmt(ex.amount)}
                        </td>
                        <td className="px-4 py-3 font-chivo text-green-400">
                          {ex.paymentStatus === "Unpaid" ? (
                            <span className="text-black-600">—</span>
                          ) : (
                            fmt(ex.amountPaid || ex.amount)
                          )}
                        </td>
                        <td className="px-4 py-3 font-chivo">
                          {outstanding > 0 ? (
                            <span className="text-red-400">
                              {fmt(outstanding)}
                            </span>
                          ) : (
                            <span className="text-black-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ex.paymentStatus === "Paid"
                                ? "bg-green-900/40 text-green-400"
                                : ex.paymentStatus === "Unpaid"
                                  ? "bg-red-900/40 text-red-400"
                                  : "bg-golden-900/40 text-golden-300"
                            }`}
                          >
                            {ex.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-chivo text-black-500 text-xs">
                          {new Date(ex.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDownload(ex)}
                            disabled={isDownloading}
                            title="Download invoice PDF"
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-golden-900/20 hover:bg-golden-500/20 text-golden-400 hover:text-golden-300 transition-colors disabled:opacity-50"
                          >
                            {isDownloading ? (
                              <Spinner size="xs" />
                            ) : (
                              <FaDownload className="text-[10px]" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
