import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FaProjectDiagram,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaFlag,
} from "react-icons/fa";
import { api } from "../../../lib/api.js";

/* ─── Auth helper ───────────────────────────────────────────────── */
const adminAuth = () => {
  const t = localStorage.getItem("adminToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

/* ─── Formatters ────────────────────────────────────────────────── */
const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString("en-NG")}` : "₦0");

/* ─── Tooltip style ─────────────────────────────────────────────── */
const ttStyle = {
  backgroundColor: "#171717",
  border: "1px solid #262626",
  borderRadius: "10px",
  color: "#F1E2D0",
  fontSize: "12px",
  fontFamily: "Chivo, sans-serif",
};

/* ════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════════════════════════════════ */

/* ─── KPI card ──────────────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, sub, color, delay, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="relative bg-black-800 border border-black-700 rounded-2xl p-6 overflow-hidden group hover:border-golden-700 transition-colors duration-300"
    >
      {/* Corner accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity ${color}`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="font-chivo text-black-400 text-xs uppercase tracking-widest mb-3">
            {label}
          </p>
          {loading ? (
            <div className="h-8 w-32 bg-black-700 rounded-lg animate-pulse" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
          )}
          {sub && !loading && (
            <p className="font-chivo text-black-500 text-xs mt-2">{sub}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color} bg-opacity-20`}
        >
          <Icon className="text-xl text-white" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Section header ────────────────────────────────────────────── */
function SectionHeader({ title, linkTo, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-bold uppercase text-sm tracking-widest text-golden-300">
        {title}
      </h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="font-chivo text-xs text-black-400 hover:text-golden-300 flex items-center gap-1 transition-colors"
        >
          {linkLabel} <FaArrowRight className="text-[10px]" />
        </Link>
      )}
    </div>
  );
}

/* ─── Status badge ──────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    pending: "text-golden-300 bg-golden-900/30 border-golden-800",
    active: "text-green-400  bg-green-900/20  border-green-800",
    completed: "text-blue-400   bg-blue-900/20   border-blue-800",
    cancelled: "text-red-400    bg-red-900/20    border-red-800",
    Active: "text-green-400  bg-green-900/20  border-green-800",
    "Coming Soon": "text-golden-300 bg-golden-900/30 border-golden-800",
    Completed: "text-blue-400   bg-blue-900/20   border-blue-800",
  };
  return (
    <span
      className={`font-chivo text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${map[status] ?? "text-black-400 bg-black-700 border-black-600"}`}
    >
      {status}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  /* ── Fetch all data ─────────────────────────────────────────────── */
  const { data: projects = [], isLoading: projLoading } = useQuery({
    queryKey: ["admin_projects"],
    queryFn: async () => (await api.get("/api/projects")).data?.projects ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const { data: investments = [], isLoading: invLoading } = useQuery({
    queryKey: ["admin_investments"],
    queryFn: async () =>
      (await api.get("/api/investments", { headers: adminAuth() })).data
        ?.investments ?? [],
    staleTime: 1000 * 60 * 2,
  });

  const { data: expenses = [], isLoading: expLoading } = useQuery({
    queryKey: ["admin_expenses_dash"],
    queryFn: async () =>
      (await api.get("/api/expenses", { headers: adminAuth() })).data
        ?.expenses ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => (await api.get("/api/vendors")).data?.vendors ?? [],
    staleTime: 1000 * 60 * 10,
  });

  const loading = projLoading || invLoading || expLoading;

  /* ── Derived KPIs ───────────────────────────────────────────────── */
  const kpi = useMemo(() => {
    const totalRaised = investments
      .filter((i) => i.status !== "cancelled")
      .reduce((s, i) => s + i.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const pendingInv = investments.filter((i) => i.status === "pending").length;
    const activeInv = investments.filter((i) => i.status === "active").length;
    const uniqueInvestors = new Set(
      investments.map((i) => i.investor?._id ?? i.investor),
    ).size;
    const unpaidExpenses = expenses
      .filter((e) => e.paymentStatus !== "Paid")
      .reduce((s, e) => s + Number(e.amount), 0);

    return {
      totalRaised,
      totalExpenses,
      pendingInv,
      activeInv,
      uniqueInvestors,
      unpaidExpenses,
    };
  }, [investments, expenses]);

  /* ── Monthly capital chart (last 6 months) ──────────────────────── */
  const monthlyData = useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = d.toLocaleString("default", { month: "short" });
      months[k] = { month: k, raised: 0, expenses: 0 };
    }
    investments.forEach((inv) => {
      const k = new Date(inv.createdAt).toLocaleString("default", {
        month: "short",
      });
      if (months[k]) months[k].raised += inv.amount;
    });
    expenses.forEach((exp) => {
      const k = new Date(exp.createdAt).toLocaleString("default", {
        month: "short",
      });
      if (months[k]) months[k].expenses += Number(exp.amount);
    });
    return Object.values(months);
  }, [investments, expenses]);

  /* ── Expense by category ────────────────────────────────────────── */
  const expByCategory = useMemo(() => {
    const acc = {};
    expenses.forEach((e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(acc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [expenses]);

  /* ── Recent investments ─────────────────────────────────────────── */
  const recentInv = investments.slice(0, 6);

  /* ── Project health ─────────────────────────────────────────────── */
  const projectHealth = useMemo(
    () => ({
      active: projects.filter((p) => p.status === "Active").length,
      coming: projects.filter((p) => p.status === "Coming Soon").length,
      completed: projects.filter((p) => p.status === "Completed").length,
    }),
    [projects],
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto font-chivo">
      {/* ── KPI row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={FaMoneyBillWave}
          label="Capital Raised"
          value={fmt(kpi.totalRaised)}
          sub={`${kpi.activeInv} active investment${kpi.activeInv !== 1 ? "s" : ""}`}
          color="bg-golden-500"
          delay={0}
          loading={loading}
        />
        <KpiCard
          icon={FaUsers}
          label="Unique Investors"
          value={kpi.uniqueInvestors}
          sub={`${kpi.pendingInv} pending approval`}
          color="bg-purple-600"
          delay={0.07}
          loading={loading}
        />
        <KpiCard
          icon={FaProjectDiagram}
          label="Total Projects"
          value={projects.length}
          sub={`${projectHealth.active} active · ${projectHealth.coming} coming soon`}
          color="bg-blue-600"
          delay={0.14}
          loading={loading}
        />
        <KpiCard
          icon={FaChartLine}
          label="Total Expenses"
          value={fmt(kpi.totalExpenses)}
          sub={`${fmt(kpi.unpaidExpenses)} outstanding`}
          color="bg-red-700"
          delay={0.21}
          loading={loading}
        />
      </div>

      {/* ── Alert banner for pending investments ────────────────── */}
      {kpi.pendingInv > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-golden-900/30 border border-golden-700 rounded-xl px-5 py-3"
        >
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-golden-400 flex-shrink-0" />
            <p className="font-chivo text-sm text-golden-200">
              <span className="font-bold">
                {kpi.pendingInv} investment{kpi.pendingInv !== 1 ? "s" : ""}
              </span>{" "}
              waiting for your approval.
            </p>
          </div>
          <Link
            to="/dashboard/investments"
            className="font-bold uppercase text-xs border border-golden-500 text-golden-300 px-4 py-1.5 rounded-lg hover:bg-golden-500 hover:text-black transition-colors duration-200 flex-shrink-0"
          >
            Review Now
          </Link>
        </motion.div>
      )}

      {/* ── Charts row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capital vs Expenses — Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="lg:col-span-2 bg-black-800 border border-black-700 rounded-2xl p-6"
        >
          <SectionHeader title="Capital vs Expenses — Last 6 Months" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={monthlyData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gRaised" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C99E75" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#C99E75" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#737373" }} />
              <YAxis
                tick={{ fontSize: 10, fill: "#737373" }}
                tickFormatter={(v) =>
                  v >= 1000000
                    ? `₦${(v / 1000000).toFixed(1)}M`
                    : `₦${(v / 1000).toFixed(0)}K`
                }
              />
              <Tooltip
                contentStyle={ttStyle}
                formatter={(v, n) => [
                  fmt(v),
                  n === "raised" ? "Capital" : "Expenses",
                ]}
              />
              <Area
                type="monotone"
                dataKey="raised"
                stroke="#C99E75"
                strokeWidth={2}
                fill="url(#gRaised)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#gExp)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-3 font-chivo text-xs text-black-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-golden-400 inline-block rounded" />{" "}
              Capital raised
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-red-500 inline-block rounded" />{" "}
              Expenses
            </span>
          </div>
        </motion.div>

        {/* Expense by category — Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-black-800 border border-black-700 rounded-2xl p-6"
        >
          <SectionHeader
            title="Expenses by Category"
            linkTo="/dashboard/expenses"
            linkLabel="View all"
          />
          {expByCategory.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="font-chivo text-black-600 text-sm">
                No expense data yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={expByCategory}
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
                  tick={{ fontSize: 9, fill: "#737373" }}
                  tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  tick={{ fontSize: 10, fill: "#A3A3A3" }}
                />
                <Tooltip
                  contentStyle={ttStyle}
                  formatter={(v) => [fmt(v), "Total"]}
                />
                <Bar dataKey="value" fill="#94662A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* ── Recent investments + project snapshot ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent investments table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="lg:col-span-3 bg-black-800 border border-black-700 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-black-700">
            <SectionHeader
              title="Recent Investments"
              linkTo="/dashboard/investments"
              linkLabel="Manage"
            />
          </div>
          {invLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse flex gap-3">
                  <div className="w-10 h-10 bg-black-700 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-black-700 rounded w-3/4" />
                    <div className="h-2 bg-black-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentInv.length === 0 ? (
            <div className="py-16 text-center">
              <FaFileInvoiceDollar className="text-black-700 text-4xl mx-auto mb-3" />
              <p className="font-chivo text-black-500 text-sm">
                No investments yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black-700/50">
              {recentInv.map((inv, i) => (
                <motion.div
                  key={inv._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-black-700/30 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-golden-900/30 flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-golden-600 text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">
                      {inv.investor?.firstName} {inv.investor?.lastName}
                    </p>
                    <p className="font-chivo text-black-500 text-xs truncate">
                      {inv.project?.title ?? "—"} · {inv.units} unit
                      {inv.units !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <p className="font-bold text-sm text-golden-300">
                      {fmt(inv.amount)}
                    </p>
                    <StatusBadge status={inv.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right column: project health + quick actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Project health */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-black-800 border border-black-700 rounded-2xl p-6"
          >
            <SectionHeader
              title="Project Status"
              linkTo="/dashboard/projects"
              linkLabel="All projects"
            />
            <div className="space-y-3">
              {[
                {
                  label: "Active",
                  count: projectHealth.active,
                  color: "bg-green-500",
                  text: "text-green-400",
                },
                {
                  label: "Coming Soon",
                  count: projectHealth.coming,
                  color: "bg-golden-400",
                  text: "text-golden-300",
                },
                {
                  label: "Completed",
                  count: projectHealth.completed,
                  color: "bg-blue-500",
                  text: "text-blue-400",
                },
              ].map(({ label, count, color, text }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`}
                  />
                  <p className="font-chivo text-sm text-black-300 flex-1">
                    {label}
                  </p>
                  <span className={`font-bold text-sm ${text}`}>{count}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-black-700 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-black-600" />
                <p className="font-chivo text-sm text-black-400 flex-1">
                  Total
                </p>
                <span className="font-bold text-sm text-white">
                  {projects.length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-black-800 border border-black-700 rounded-2xl p-6"
          >
            <p className="font-bold uppercase text-sm tracking-widest text-golden-300 mb-4">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "Investments",
                  to: "/dashboard/investments",
                  Icon: FaFileInvoiceDollar,
                },
                {
                  label: "Analytics",
                  to: "/dashboard/analytics",
                  Icon: FaChartLine,
                },
                {
                  label: "Milestones",
                  to: "/dashboard/milestones",
                  Icon: FaFlag,
                },
                {
                  label: "Reports",
                  to: "/dashboard/reports",
                  Icon: FaMoneyBillWave,
                },
              ].map(({ label, to, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center justify-center gap-2 bg-black-900 border border-black-700 hover:border-golden-700 rounded-xl py-4 transition-colors duration-200 group"
                >
                  <Icon className="text-golden-600 group-hover:text-golden-300 text-base transition-colors" />
                  <span className="font-chivo text-xs text-black-400 group-hover:text-white uppercase tracking-wide transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Vendor count */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-golden-900/20 border border-golden-800 rounded-2xl px-6 py-4 flex items-center justify-between"
          >
            <div>
              <p className="font-chivo text-black-400 text-xs uppercase tracking-wide">
                Active Vendors
              </p>
              <p className="font-bold text-xl text-golden-300 mt-0.5">
                {vendors.filter((v) => v.isActive).length}
                <span className="font-chivo text-black-500 text-xs font-normal ml-1">
                  / {vendors.length} total
                </span>
              </p>
            </div>
            <Link
              to="/dashboard/vendors"
              className="font-chivo text-xs text-golden-400 hover:text-golden-300 uppercase tracking-wide flex items-center gap-1"
            >
              Manage <FaArrowRight className="text-[10px]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
