import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaChartLine,
  FaWallet,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "../../../lib/api";

const token = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString("en-NG")}` : "₦0");

/* ─── Stat card ─────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-black-800 border border-black-700 rounded-2xl p-5 flex items-start gap-4 hover:border-golden-700 transition-colors duration-300"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
      >
        <Icon className="text-lg text-white" />
      </div>
      <div className="min-w-0">
        <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="font-bold text-xl text-white leading-tight">{value}</p>
        {sub && <p className="font-chivo text-black-500 text-xs mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

/* ─── Sparkline chart ───────────────────────────────────────────── */
function Sparkline({ data }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="v"
          stroke="#C99E75"
          strokeWidth={2}
          dot={false}
        />
        <Tooltip
          contentStyle={{
            background: "#171717",
            border: "1px solid #404040",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v) => [`₦${Number(v).toLocaleString()}`, ""]}
          labelFormatter={() => ""}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─── Investment row ────────────────────────────────────────────── */
function InvestmentRow({ inv, index }) {
  const statusColor =
    {
      active: "text-green-400 bg-green-900/30",
      completed: "text-blue-400 bg-blue-900/30",
      pending: "text-golden-300 bg-golden-900/30",
      refunded: "text-red-400 bg-red-900/30",
    }[inv.status] ?? "text-black-400 bg-black-700";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex items-center gap-4 py-3 border-b border-black-800 last:border-0 hover:bg-black-800/50 px-2 rounded-lg transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-black-700 overflow-hidden flex-shrink-0">
        {inv.project?.image ? (
          <img
            src={inv.project.image.replace(
              "/upload/",
              "/upload/f_auto,q_auto,w_80/",
            )}
            alt={inv.project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-golden-900/30 flex items-center justify-center">
            <FaProjectDiagram className="text-golden-600 text-xs" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">
          {inv.project?.title || "—"}
        </p>
        <p className="font-chivo text-black-500 text-xs">
          {inv.units} unit{inv.units !== 1 ? "s" : ""} ·{" "}
          {new Date(inv.createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-sm text-golden-300">{fmt(inv.amount)}</p>
        <span
          className={`font-chivo text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColor}`}
        >
          {inv.status}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function InvestorDashboard() {
  const investor = JSON.parse(localStorage.getItem("investor") || "{}");

  const { data: portfolio, isLoading: loadingPortfolio } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () =>
      (await api.get("/api/investments/portfolio", { headers: authHeader() }))
        .data,
    staleTime: 1000 * 60 * 5,
  });

  const { data: invData, isLoading: loadingInv } = useQuery({
    queryKey: ["my-investments"],
    queryFn: async () =>
      (await api.get("/api/investments/my", { headers: authHeader() })).data
        ?.investments ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const { data: projectsData } = useQuery({
    queryKey: ["public_projects"],
    queryFn: async () => (await api.get("/api/projects")).data?.projects ?? [],
    staleTime: 1000 * 60 * 10,
  });

  const investments = invData ?? [];
  const projects = projectsData ?? [];
  const activeProjects = projects
    .filter((p) => p.status === "Active")
    .slice(0, 3);

  // Build a simple sparkline from monthly investment totals
  const sparkData = useMemo(() => {
    if (!investments.length)
      return Array.from({ length: 6 }, (_, i) => ({ v: 0, i }));
    const monthly = {};
    investments.forEach((inv) => {
      const key = new Date(inv.createdAt).toLocaleDateString("en", {
        month: "short",
        year: "2-digit",
      });
      monthly[key] = (monthly[key] || 0) + inv.amount;
    });
    return Object.entries(monthly)
      .slice(-6)
      .map(([k, v]) => ({ label: k, v }));
  }, [investments]);

  return (
    <div className="w-full p-6 md:p-8 space-y-8">
      {/* ── Portfolio stat cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={FaWallet}
          label="Total Invested"
          value={loadingPortfolio ? "—" : fmt(portfolio?.totalInvested)}
          sub="Across all projects"
          accent="bg-golden-600"
          delay={0}
        />
        <StatCard
          icon={FaChartLine}
          label="Projected Value"
          value={loadingPortfolio ? "—" : fmt(portfolio?.projectedValue)}
          sub={`+${fmt(portfolio?.projectedReturns ?? 0)} projected returns`}
          accent="bg-green-700"
          delay={0.08}
        />
        <StatCard
          icon={FaProjectDiagram}
          label="Active Investments"
          value={loadingPortfolio ? "—" : (portfolio?.activeInvestments ?? 0)}
          sub={`${portfolio?.completedInvestments ?? 0} completed`}
          accent="bg-blue-700"
          delay={0.16}
        />
        <StatCard
          icon={FaMoneyBillWave}
          label="Total Payouts"
          value={loadingPortfolio ? "—" : fmt(portfolio?.totalPayouts)}
          sub="Received to date"
          accent="bg-purple-700"
          delay={0.24}
        />
      </div>

      {/* ── Portfolio growth + recent investments ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Growth sparkline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-black-800 border border-black-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold uppercase text-sm tracking-wide">
              Portfolio Growth
            </p>
          </div>
          {investments.length > 0 ? (
            <Sparkline data={sparkData} />
          ) : (
            <div className="h-12 flex items-center">
              <p className="font-chivo text-black-500 text-sm">
                No investment data yet
              </p>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-black-700 grid grid-cols-2 gap-3">
            <div>
              <p className="font-chivo text-black-500 text-xs uppercase">
                Invested
              </p>
              <p className="font-bold text-golden-300">
                {fmt(portfolio?.totalInvested)}
              </p>
            </div>
            <div>
              <p className="font-chivo text-black-500 text-xs uppercase">
                Returns
              </p>
              <p className="font-bold text-green-400">
                +{fmt(portfolio?.projectedReturns)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent investments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="lg:col-span-3 bg-black-800 border border-black-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold uppercase text-sm tracking-wide">
              Recent Investments
            </p>
            <Link
              to="/investor-dashboard/active-projects"
              className="font-chivo text-golden-300 text-xs flex items-center gap-1 hover:text-golden-200"
            >
              View all <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          {loadingInv ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3 py-3">
                  <div className="w-10 h-10 bg-black-700 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-black-700 rounded w-3/4" />
                    <div className="h-2 bg-black-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : investments.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-chivo text-black-500 text-sm mb-4">
                You haven't invested yet.
              </p>
              <Link
                to="/projects"
                className="inline-block border border-golden-500 text-golden-300 text-sm font-bold uppercase px-5 py-2 rounded-lg hover:bg-golden-500 hover:text-black-900 transition-colors duration-200"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            investments
              .slice(0, 5)
              .map((inv, i) => (
                <InvestmentRow key={inv._id} inv={inv} index={i} />
              ))
          )}
        </motion.div>
      </div>

      {/* ── Available projects ─── */}
      {activeProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-black-800 border border-black-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="font-bold uppercase text-sm tracking-wide">
              Active Projects
            </p>
            <Link
              to="/projects"
              className="font-chivo text-golden-300 text-xs flex items-center gap-1 hover:text-golden-200"
            >
              View all <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProjects.map((project, i) => (
              <Link key={project._id} to={`/projects/${project._id}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-black-900 border border-black-700 rounded-xl overflow-hidden hover:border-golden-700 transition-colors duration-200 group"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={
                        project.image?.replace(
                          "/upload/",
                          "/upload/f_auto,q_auto,w_400/",
                        ) || "/assets/signupBg.jpg"
                      }
                      alt={project.title}
                      onError={(e) => {
                        e.target.src = "/assets/signupBg.jpg";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-sm truncate mb-1">
                      {project.title}
                    </p>
                    <p className="flex items-center gap-1 font-chivo text-black-400 text-xs mb-3">
                      <FaMapMarkerAlt className="text-golden-500 text-[10px]" />{" "}
                      {project.location}
                    </p>
                    <div className="flex items-center justify-between text-xs font-chivo">
                      <span className="text-black-400">ROI</span>
                      <span className="font-bold text-golden-300">
                        {project.roi || "—"}
                      </span>
                    </div>
                    <div className="mt-2 w-full h-1.5 bg-black-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-golden-400 rounded-full"
                        style={{ width: `${project.soldPercentage || 0}%` }}
                      />
                    </div>
                    <p className="font-chivo text-black-500 text-[10px] mt-1 text-right">
                      {project.soldPercentage || 0}% sold
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Quick nav tiles ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Expense Breakdown",
            link: "/investor-dashboard/expense-breakdown",
            bg: "bg-golden-900/40 hover:bg-golden-900/60 border-golden-800",
          },
          {
            label: "Payouts & Withdrawals",
            link: "/investor-dashboard/payouts",
            bg: "bg-black-800 hover:bg-black-700 border-black-700",
          },
          {
            label: "Documents",
            link: "/investor-dashboard/documents",
            bg: "bg-black-800 hover:bg-black-700 border-black-700",
          },
          {
            label: "Profile Settings",
            link: "/investor-dashboard/profile-settings",
            bg: "bg-black-800 hover:bg-black-700 border-black-700",
          },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.link}
            className={`border rounded-xl py-6 px-4 text-center font-chivo font-bold text-sm uppercase tracking-wide transition-colors duration-200 ${item.bg}`}
          >
            {item.label}
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
