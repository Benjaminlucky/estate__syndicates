import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaTimes,
  FaChartLine,
  FaLayerGroup,
  FaCheckCircle,
  FaExclamationCircle,
  FaSearch,
  FaBuilding,
  FaPercentage,
} from "react-icons/fa";
import { api } from "../../../lib/api.js";

/* ─── auth helper ───────────────────────────────────────────────── */
const token = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

/* ─── formatters ────────────────────────────────────────────────── */
const fmt = (n) => (n != null ? `₦${Number(n).toLocaleString("en-NG")}` : "₦0");

/* ─── Status badge ──────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    Active: "bg-green-900/30 text-green-400 border-green-800",
    "Coming Soon": "bg-golden-900/30 text-golden-300 border-golden-800",
    Completed: "bg-blue-900/20 text-blue-400 border-blue-800",
  };
  return (
    <span
      className={`font-chivo text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${map[status] ?? "bg-black-700 text-black-400 border-black-600"}`}
    >
      {status}
    </span>
  );
}

/* ─── Progress bar ──────────────────────────────────────────────── */
function ProgressBar({ pct, colorClass = "bg-golden-400" }) {
  return (
    <div className="w-full h-1.5 bg-black-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${Math.min(100, pct || 0)}%` }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   INVEST MODAL
════════════════════════════════════════════════════════════════════ */
function InvestModal({ project, onClose }) {
  const qc = useQueryClient();
  const [units, setUnits] = useState(1);
  const [done, setDone] = useState(false);

  /* live availability */
  const { data: avail, isLoading: availLoading } = useQuery({
    queryKey: ["avail", project._id],
    queryFn: async () =>
      (await api.get(`/api/investments/project/${project._id}/availability`))
        .data,
    staleTime: 30_000,
    retry: 1,
  });

  const pricePerUnit = avail?.pricePerUnit ?? project.pricePerUnit ?? 0;
  const availableUnits =
    avail?.availableUnits ??
    project.totalUnits - (project.soldPercentage / 100) * project.totalUnits ??
    999;
  const totalAmount = units * pricePerUnit;

  /* ROI preview */
  const roiPct = parseFloat(project.roi) || 0;
  const projected = roiPct > 0 ? totalAmount * (roiPct / 100) : 0;

  const canInvest = availableUnits > 0 && project.status === "Active";

  /* invest mutation */
  const { mutate: invest, isPending } = useMutation({
    mutationFn: () =>
      api.post(
        "/api/investments",
        { projectId: project._id, units },
        { headers: authHeader() },
      ),
    onSuccess: () => {
      setDone(true);
      // Invalidate all relevant caches
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      qc.invalidateQueries({ queryKey: ["my-investments"] });
      qc.invalidateQueries({ queryKey: ["public_projects"] });
      qc.invalidateQueries({ queryKey: ["avail", project._id] });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ?? "Investment failed — please try again";
      toast.error(msg);
    },
  });

  const handleSubmit = () => {
    if (!canInvest) return;
    if (units < 1 || units > availableUnits) {
      toast.error(`Enter between 1 and ${availableUnits} units`);
      return;
    }
    invest();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-black-800 border border-black-700 rounded-2xl w-full max-w-md shadow-2xl z-10 overflow-hidden"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Project image header */}
          <div className="relative h-32 overflow-hidden">
            <img
              src={
                project.image?.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto,w_500/",
                ) ?? "/assets/signupBg.jpg"
              }
              alt={project.title}
              onError={(e) => {
                e.target.src = "/assets/signupBg.jpg";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black-800 via-black/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors text-white"
            >
              <FaTimes className="text-xs" />
            </button>
            <div className="absolute bottom-3 left-4">
              <p className="font-bold text-white text-sm truncate max-w-[280px]">
                {project.title}
              </p>
              <p className="font-chivo text-black-300 text-xs flex items-center gap-1">
                <FaMapMarkerAlt className="text-golden-400 text-[9px]" />{" "}
                {project.location}
              </p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {done ? (
              /* ── Success state ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-6 gap-3"
              >
                <FaCheckCircle className="text-green-400 text-5xl" />
                <h3 className="font-bold text-lg uppercase">
                  Investment Recorded!
                </h3>
                <p className="font-chivo text-black-300 text-sm max-w-xs">
                  Your investment of {fmt(totalAmount)} in{" "}
                  <strong>{project.title}</strong> has been recorded. The admin
                  will confirm your investment shortly.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 font-bold uppercase text-xs border border-golden-500 text-golden-300 px-6 py-2 rounded-lg hover:bg-golden-500 hover:text-black-900 transition-colors duration-200"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                {/* ── Key stats row ── */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Price/Unit", value: fmt(pricePerUnit) },
                    { label: "ROI", value: roiPct > 0 ? `${roiPct}%` : "—" },
                    {
                      label: "Available",
                      value: availLoading ? "…" : availableUnits,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-black-900 rounded-xl py-2.5 px-1"
                    >
                      <p className="font-chivo text-black-400 text-[10px] uppercase tracking-wide">
                        {label}
                      </p>
                      <p className="font-bold text-sm text-white mt-0.5">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ── Unit selector ── */}
                {!canInvest ? (
                  <div className="flex items-center gap-2 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
                    <FaExclamationCircle className="text-red-400 flex-shrink-0" />
                    <p className="font-chivo text-sm text-red-300">
                      {project.status !== "Active"
                        ? "This project is not currently accepting investments."
                        : "All units have been sold for this project."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="font-chivo text-black-300 text-xs uppercase tracking-wide block mb-2">
                        Number of Units
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setUnits((u) => Math.max(1, u - 1))}
                          className="w-10 h-10 rounded-xl bg-black-700 hover:bg-black-600 font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={availableUnits}
                          value={units}
                          onChange={(e) => {
                            const v = Math.max(
                              1,
                              Math.min(
                                availableUnits,
                                parseInt(e.target.value) || 1,
                              ),
                            );
                            setUnits(v);
                          }}
                          className="flex-1 bg-black-900 border border-black-600 rounded-xl px-4 py-2.5 text-center font-bold text-white focus:outline-none focus:border-golden-500 transition-colors"
                        />
                        <button
                          onClick={() =>
                            setUnits((u) => Math.min(availableUnits, u + 1))
                          }
                          className="w-10 h-10 rounded-xl bg-black-700 hover:bg-black-600 font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* ── Cost breakdown ── */}
                    <div className="bg-black-900 border border-black-700 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-chivo text-black-400">
                          Cost ({units} × {fmt(pricePerUnit)})
                        </span>
                        <span className="font-bold">{fmt(totalAmount)}</span>
                      </div>
                      {roiPct > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="font-chivo text-black-400">
                            Projected return ({roiPct}% ROI)
                          </span>
                          <span className="font-bold text-green-400">
                            +{fmt(projected)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-black-700 pt-2 flex justify-between">
                        <span className="font-bold uppercase text-xs tracking-wide text-black-300">
                          Projected Total
                        </span>
                        <span className="font-bold text-golden-300">
                          {fmt(totalAmount + projected)}
                        </span>
                      </div>
                    </div>

                    {/* ── Availability bar ── */}
                    <div>
                      <div className="flex justify-between font-chivo text-xs text-black-500 mb-1">
                        <span>{avail?.soldPercentage ?? 0}% sold</span>
                        <span>{availableUnits} units left</span>
                      </div>
                      <ProgressBar
                        pct={avail?.soldPercentage ?? project.soldPercentage}
                        colorClass={
                          avail?.soldPercentage >= 80
                            ? "bg-red-500"
                            : "bg-golden-400"
                        }
                      />
                    </div>

                    {/* ── Submit ── */}
                    <button
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="w-full py-3.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Processing…" : `Invest ${fmt(totalAmount)}`}
                    </button>

                    <p className="font-chivo text-black-500 text-xs text-center">
                      Your investment will be confirmed by the admin after
                      payment is verified.
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PROJECT CARD
════════════════════════════════════════════════════════════════════ */
function ProjectCard({ project, onInvest, isInvested }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden hover:border-golden-700 transition-colors duration-300 group flex flex-col"
    >
      {/* Image */}
      <div className="h-44 overflow-hidden relative">
        <img
          src={
            project.image?.replace(
              "/upload/",
              "/upload/f_auto,q_auto,w_500/",
            ) ?? "/assets/signupBg.jpg"
          }
          alt={project.title}
          onError={(e) => {
            e.target.src = "/assets/signupBg.jpg";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={project.status} />
        </div>
        {isInvested && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
            Invested
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="font-bold text-sm mb-1 truncate">{project.title}</p>
        <p className="font-chivo text-black-400 text-xs flex items-center gap-1 mb-3">
          <FaMapMarkerAlt className="text-golden-500 text-[9px]" />{" "}
          {project.location}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            {
              label: "Price / Unit",
              value: fmt(project.pricePerUnit),
              Icon: FaBuilding,
            },
            {
              label: "ROI",
              value: project.roi ? `${project.roi}%` : "—",
              Icon: FaPercentage,
            },
            {
              label: "Total Units",
              value: project.totalUnits ?? "—",
              Icon: FaLayerGroup,
            },
            { label: "IRR", value: project.irr ?? "—", Icon: FaChartLine },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="bg-black-900 rounded-lg p-2.5">
              <p className="font-chivo text-black-500 text-[9px] uppercase tracking-wide flex items-center gap-1">
                <Icon className="text-golden-700" /> {label}
              </p>
              <p className="font-bold text-xs text-white mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between font-chivo text-xs text-black-500 mb-1">
            <span>{project.soldPercentage ?? 0}% sold</span>
          </div>
          <ProgressBar
            pct={project.soldPercentage}
            colorClass={
              (project.soldPercentage ?? 0) >= 80
                ? "bg-red-500"
                : "bg-golden-400"
            }
          />
        </div>

        {/* CTA */}
        <div className="mt-auto">
          {project.status === "Active" ? (
            <button
              onClick={() => onInvest(project)}
              className="w-full py-2.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-xs rounded-xl transition-colors duration-200"
            >
              {isInvested ? "Invest More" : "Invest Now"}
            </button>
          ) : (
            <div className="w-full py-2.5 bg-black-700 text-black-500 font-bold uppercase text-xs rounded-xl text-center">
              {project.status === "Completed" ? "Closed" : "Coming Soon"}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════════ */
export default function InvestorProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* fetch all public projects */
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public_projects"],
    queryFn: async () => (await api.get("/api/projects")).data?.projects ?? [],
    staleTime: 1000 * 60 * 5,
  });

  /* fetch investor's own investments to mark "Invested" badge */
  const { data: myInvData } = useQuery({
    queryKey: ["my-investments"],
    queryFn: async () =>
      (await api.get("/api/investments/my", { headers: authHeader() })).data
        ?.investments ?? [],
    staleTime: 1000 * 60 * 2,
    enabled: !!token(),
  });

  const investedProjectIds = useMemo(
    () =>
      new Set((myInvData ?? []).map((inv) => inv.project?._id ?? inv.project)),
    [myInvData],
  );

  /* filter */
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  /* stats */
  const stats = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((p) => p.status === "Active").length,
      coming: projects.filter((p) => p.status === "Coming Soon").length,
      completed: projects.filter((p) => p.status === "Completed").length,
    }),
    [projects],
  );

  return (
    <div className="w-full space-y-6 font-chivo">
      {/* ── Page header ─────────────────────────────────────── */}
      <div>
        <h1 className="font-bold text-xl uppercase tracking-wide">
          Investment Projects
        </h1>
        <p className="text-black-400 text-sm mt-1">
          Browse available projects and invest in the opportunities that match
          your goals.
        </p>
      </div>

      {/* ── Stats row ───────────────────────────────────────── */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Active", value: stats.active, color: "text-green-400" },
            { label: "Coming", value: stats.coming, color: "text-golden-300" },
            {
              label: "Completed",
              value: stats.completed,
              color: "text-blue-400",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-black-800 border border-black-700 rounded-xl px-4 py-3 text-center"
            >
              <p className={`font-bold text-xl ${color}`}>{value}</p>
              <p className="text-black-400 text-xs uppercase tracking-wide">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black-500 text-xs" />
          <input
            type="text"
            placeholder="Search by name or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black-800 border border-black-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-black-500 focus:outline-none focus:border-golden-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {["All", "Active", "Coming Soon", "Completed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
                statusFilter === s
                  ? "bg-golden-500 text-white"
                  : "bg-black-800 border border-black-700 text-black-300 hover:border-golden-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-black-800 border border-black-700 rounded-2xl overflow-hidden"
            >
              <div className="h-44 bg-black-700" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-black-700 rounded w-3/4" />
                <div className="h-3 bg-black-700 rounded w-1/2" />
                <div className="h-10 bg-black-700 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-16 text-center">
          <p className="text-black-400 mb-4">Failed to load projects.</p>
          <button
            onClick={() => window.location.reload()}
            className="font-bold uppercase text-xs border border-golden-500 text-golden-300 px-6 py-2 rounded-lg hover:bg-golden-500 hover:text-black-900 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-black-500">No projects match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onInvest={setSelectedProject}
              isInvested={investedProjectIds.has(project._id)}
            />
          ))}
        </div>
      )}

      {/* ── Invest modal ────────────────────────────────────── */}
      {selectedProject && (
        <InvestModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
