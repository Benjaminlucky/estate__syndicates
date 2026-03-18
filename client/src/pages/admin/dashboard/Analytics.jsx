import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaProjectDiagram,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { api } from "../../../lib/api.js";
import { adminAuthHeader, fmtNaira } from "../../../hooks/useAdmin.js";

/* ─── Shared tooltip style ──────────────────────────────────────── */
const tooltipStyle = {
  backgroundColor: "#171717",
  border: "1px solid #262626",
  borderRadius: "8px",
  color: "#F1E2D0",
  fontSize: "12px",
  fontFamily: "Chivo, sans-serif",
};

const GOLDEN = ["#C99E75", "#94662A", "#784A20", "#5D3F1C", "#422C15"];
const STATUS_COLORS = {
  Active: "#4ade80",
  "Coming Soon": "#C99E75",
  Completed: "#60a5fa",
};

/* ─── Stat tile ─────────────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, sub, accent, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black-800 border border-black-700 rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}
        >
          <Icon className="text-white text-sm" />
        </div>
        {sub && (
          <span className="font-chivo text-xs text-black-500 uppercase tracking-wide">
            {sub}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-7 bg-black-700 rounded animate-pulse w-2/3" />
      ) : (
        <p className="text-2xl font-bold text-white">{value}</p>
      )}
      <p className="font-chivo text-black-400 text-xs uppercase tracking-wide">
        {label}
      </p>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function Analytics() {
  const { data: investments = [], isLoading: invLoading } = useQuery({
    queryKey: ["admin_investments"],
    queryFn: async () =>
      (await api.get("/api/investments", { headers: adminAuthHeader() })).data
        ?.investments ?? [],
    staleTime: 1000 * 60 * 3,
  });

  const { data: projects = [], isLoading: projLoading } = useQuery({
    queryKey: ["admin_projects"],
    queryFn: async () => (await api.get("/api/projects")).data?.projects ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const { data: expenses = [], isLoading: expLoading } = useQuery({
    queryKey: ["admin_expenses_analytics"],
    queryFn: async () =>
      (await api.get("/api/expenses", { headers: adminAuthHeader() })).data
        ?.expenses ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const loading = invLoading || projLoading || expLoading;

  /* ── Derived metrics ───────────────────────────────────────────── */
  const metrics = useMemo(() => {
    const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
    const totalPaidOut = investments.reduce((s, i) => s + i.totalPaidOut, 0);
    const uniqueInvestors = new Set(
      investments.map((i) => i.investor?._id ?? i.investor),
    ).size;
    const activeInvs = investments.filter((i) => i.status === "active").length;
    const pendingInvs = investments.filter(
      (i) => i.status === "pending",
    ).length;
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);

    return {
      totalInvested,
      totalPaidOut,
      uniqueInvestors,
      activeInvs,
      pendingInvs,
      totalExpenses,
    };
  }, [investments, expenses]);

  /* ── Investment by month (last 6 months) ───────────────────────── */
  const byMonth = useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      months[key] = { month: key, invested: 0, count: 0 };
    }
    for (const inv of investments) {
      const d = new Date(inv.createdAt);
      const key = d.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (months[key]) {
        months[key].invested += inv.amount;
        months[key].count += 1;
      }
    }
    return Object.values(months);
  }, [investments]);

  /* ── Projects by status ────────────────────────────────────────── */
  const projectsByStatus = useMemo(() => {
    const acc = {};
    for (const p of projects) {
      acc[p.status] = (acc[p.status] || 0) + 1;
    }
    return Object.entries(acc).map(([name, value]) => ({ name, value }));
  }, [projects]);

  /* ── Expenses by category ──────────────────────────────────────── */
  const expByCategory = useMemo(() => {
    const acc = {};
    for (const e of expenses) {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    }
    return Object.entries(acc)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [expenses]);

  /* ── Top investors ─────────────────────────────────────────────── */
  const topInvestors = useMemo(() => {
    const acc = {};
    for (const inv of investments) {
      const id = inv.investor?._id ?? inv.investor;
      const name = inv.investor
        ? `${inv.investor.firstName} ${inv.investor.lastName}`
        : id;
      if (!acc[id]) acc[id] = { name, total: 0, count: 0 };
      acc[id].total += inv.amount;
      acc[id].count += 1;
    }
    return Object.values(acc)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [investments]);

  /* ── Investment per project ────────────────────────────────────── */
  const invByProject = useMemo(() => {
    const acc = {};
    for (const inv of investments) {
      const key = inv.project?.title ?? "Unknown";
      acc[key] = (acc[key] || 0) + inv.amount;
    }
    return Object.entries(acc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({
        name: name.length > 20 ? name.slice(0, 20) + "…" : name,
        value,
      }));
  }, [investments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner color="warning" size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto font-chivo">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide font-cinzel text-golden-300">
          Analytics
        </h1>
        <p className="text-black-400 text-sm mt-1">
          Platform performance metrics and investment insights.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={FaMoneyBillWave}
          label="Total Capital Raised"
          value={fmtNaira(metrics.totalInvested)}
          accent="bg-golden-600"
        />
        <KpiCard
          icon={FaUsers}
          label="Unique Investors"
          value={metrics.uniqueInvestors}
          accent="bg-purple-700"
        />
        <KpiCard
          icon={FaProjectDiagram}
          label="Active Investments"
          value={metrics.activeInvs}
          sub={`${metrics.pendingInvs} pending`}
          accent="bg-green-700"
        />
        <KpiCard
          icon={FaChartLine}
          label="Total Paid Out"
          value={fmtNaira(metrics.totalPaidOut)}
          accent="bg-blue-700"
        />
      </div>

      {/* Charts row 1: investment over time + projects by status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investment over time */}
        <div className="lg:col-span-2 bg-black-800 border border-black-700 rounded-2xl p-6">
          <p className="font-bold uppercase text-sm text-golden-300 mb-4">
            Capital Raised — Last 6 Months
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={byMonth}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#737373", fontFamily: "Chivo" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#737373", fontFamily: "Chivo" }}
                tickFormatter={(v) =>
                  v >= 1000000
                    ? `₦${(v / 1000000).toFixed(1)}M`
                    : `₦${(v / 1000).toFixed(0)}K`
                }
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [fmtNaira(v), "Invested"]}
              />
              <Bar dataKey="invested" fill="#C99E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Projects by status */}
        <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
          <p className="font-bold uppercase text-sm text-golden-300 mb-4">
            Projects by Status
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={projectsByStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                paddingAngle={3}
              >
                {projectsByStatus.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      STATUS_COLORS[entry.name] ?? GOLDEN[i % GOLDEN.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {projectsByStatus.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs font-chivo"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background:
                        STATUS_COLORS[entry.name] ?? GOLDEN[i % GOLDEN.length],
                    }}
                  />
                  <span className="text-black-300">{entry.name}</span>
                </div>
                <span className="font-bold text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2: investment per project + expenses by category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment per project */}
        <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
          <p className="font-bold uppercase text-sm text-golden-300 mb-4">
            Capital by Project
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={invByProject}
              layout="vertical"
              margin={{ left: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#262626"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#737373" }}
                tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 10, fill: "#A3A3A3", fontFamily: "Chivo" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [fmtNaira(v), "Invested"]}
              />
              <Bar dataKey="value" fill="#94662A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses by category */}
        <div className="bg-black-800 border border-black-700 rounded-2xl p-6">
          <p className="font-bold uppercase text-sm text-golden-300 mb-4">
            Expenses by Category
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={expByCategory}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#737373" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#737373" }}
                tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [fmtNaira(v), "Total"]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {expByCategory.map((_, i) => (
                  <Cell key={i} fill={GOLDEN[i % GOLDEN.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top investors table */}
      <div className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-black-700">
          <p className="font-bold uppercase text-sm text-golden-300">
            Top Investors
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-black-900">
            <tr>
              {["#", "Investor", "Total Invested", "Investments"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left font-chivo text-golden-500 text-xs uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black-700/50">
            {topInvestors.map((inv, i) => (
              <tr key={i} className="hover:bg-black-900/50 transition-colors">
                <td className="px-5 py-3 font-bold text-black-500 text-xs">
                  #{i + 1}
                </td>
                <td className="px-5 py-3 font-bold">{inv.name}</td>
                <td className="px-5 py-3 font-bold text-golden-300">
                  {fmtNaira(inv.total)}
                </td>
                <td className="px-5 py-3 text-black-400">{inv.count}</td>
              </tr>
            ))}
            {topInvestors.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-black-500 text-sm"
                >
                  No investment data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
