import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaFlag,
  FaPlus,
  FaTimes,
  FaEdit,
  FaList,
  FaStream,
} from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { api } from "../../../lib/api.js";
import {
  adminAuthHeader,
  useAdminRole,
  canWrite,
} from "../../../hooks/useAdmin.js";

/* ─── Status styling ────────────────────────────────────────────── */
const STATUS_STYLE = {
  pending: "text-black-400  bg-black-700",
  in_progress: "text-golden-300 bg-golden-900/30",
  completed: "text-green-400  bg-green-900/20",
  delayed: "text-red-400    bg-red-900/20",
};

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  delayed: "Delayed",
};

/* Gantt bar colours by status */
const GANTT_COLOR = {
  pending: "#404040",
  in_progress: "#B8860B",
  completed: "#16A34A",
  delayed: "#DC2626",
};

/* ─── Shared input class ────────────────────────────────────────── */
const inputCls =
  "w-full bg-black-900 border border-black-700 rounded-xl px-4 py-2.5 font-chivo text-sm focus:outline-none focus:border-golden-500 transition-colors";
const selectCls = inputCls + " appearance-none";

/* ─── Phase badge ───────────────────────────────────────────────── */
function PhaseBadge({ milestone }) {
  const label =
    milestone.phaseLabel ||
    (milestone.phaseStart && milestone.phaseEnd
      ? `Month ${milestone.phaseStart} – ${milestone.phaseEnd}`
      : null);
  if (!label) return null;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-golden-500/15 text-golden-300 border border-golden-700/40 flex-shrink-0">
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MILESTONE MODAL
═══════════════════════════════════════════════════════════════════ */
function MilestoneModal({ projects, editing, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    projectId: editing?.project?._id ?? editing?.project ?? "",
    title: editing?.title ?? "",
    description: editing?.description ?? "",
    targetDate: editing?.targetDate ? editing.targetDate.slice(0, 10) : "",
    status: editing?.status ?? "pending",
    progressPct: editing?.progressPct ?? 0,
    phaseStart: editing?.phaseStart ?? "",
    phaseEnd: editing?.phaseEnd ?? "",
    phaseLabel: editing?.phaseLabel ?? "",
  });

  const [phaseError, setPhaseError] = useState("");

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    /* Clear phase error whenever user is editing phase fields */
    if (k === "phaseStart" || k === "phaseEnd") setPhaseError("");
  };

  /* Live-derived phase preview */
  const phasePreview = useMemo(() => {
    const s = Number(form.phaseStart);
    const e = Number(form.phaseEnd);
    if (!s || !e) return null;
    if (e < s) return null;
    return form.phaseLabel || `Month ${s} – ${e}`;
  }, [form.phaseStart, form.phaseEnd, form.phaseLabel]);

  const validatePhase = () => {
    const s = Number(form.phaseStart);
    const e = Number(form.phaseEnd);
    if (form.phaseStart && form.phaseEnd) {
      if (e < s) {
        setPhaseError("'To Month' must be ≥ 'From Month'");
        return false;
      }
    }
    if (form.phaseStart && !form.phaseEnd) {
      setPhaseError("Please enter a 'To Month' or leave both blank");
      return false;
    }
    if (!form.phaseStart && form.phaseEnd) {
      setPhaseError("Please enter a 'From Month' or leave both blank");
      return false;
    }
    setPhaseError("");
    return true;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!validatePhase()) throw new Error("phase_validation");
      const payload = {
        ...form,
        phaseStart: form.phaseStart ? Number(form.phaseStart) : undefined,
        phaseEnd: form.phaseEnd ? Number(form.phaseEnd) : undefined,
        phaseLabel: form.phaseLabel || undefined,
      };
      if (editing) {
        return (
          await api.patch(`/api/milestones/${editing._id}`, payload, {
            headers: adminAuthHeader(),
          })
        ).data;
      }
      return (
        await api.post("/api/milestones", payload, {
          headers: adminAuthHeader(),
        })
      ).data;
    },
    onSuccess: () => {
      toast.success(editing ? "Milestone updated." : "Milestone added.");
      queryClient.invalidateQueries(["admin_milestones"]);
      onClose();
    },
    onError: (err) => {
      if (err.message === "phase_validation") return; // already shown inline
      toast.error(err?.response?.data?.message || "Failed");
    },
  });

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black-800 border border-black-700 rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold uppercase text-lg">
            {editing ? "Edit Milestone" : "Add Milestone"}
          </h2>
          <button onClick={onClose} className="text-black-500 hover:text-white">
            <FaTimes />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Project */}
          <label className="sm:col-span-2 block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
              Project *
            </p>
            <select
              value={form.projectId}
              onChange={(e) => update("projectId", e.target.value)}
              required
              className={selectCls}
            >
              <option value="">Select project…</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          {/* Title */}
          <label className="sm:col-span-2 block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
              Title *
            </p>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Foundation Complete"
              required
              className={inputCls}
            />
          </label>

          {/* Description */}
          <label className="sm:col-span-2 block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
              Description
            </p>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={2}
              className={inputCls + " resize-none"}
            />
          </label>

          {/* ── Phase / Period ─────────────────────────────────── */}
          <div className="sm:col-span-2">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-2">
              Phase / Period
              <span className="ml-1 normal-case text-black-600 font-normal">
                (optional — e.g. Month 1 – 3)
              </span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <p className="font-chivo text-black-500 text-xs mb-1">
                  From (Month)
                </p>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 1"
                  value={form.phaseStart}
                  onChange={(e) => update("phaseStart", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <p className="font-chivo text-black-500 text-xs mb-1">
                  To (Month)
                </p>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 3"
                  value={form.phaseEnd}
                  onChange={(e) => update("phaseEnd", e.target.value)}
                  className={inputCls}
                />
              </label>
            </div>

            {/* Phase error */}
            {phaseError && (
              <p className="mt-1.5 text-red-400 text-xs font-chivo">
                {phaseError}
              </p>
            )}

            {/* Live preview */}
            {phasePreview && !phaseError && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-black-500 text-xs font-chivo">
                  Preview:
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-golden-500/15 text-golden-300 border border-golden-700/40">
                  {phasePreview}
                </span>
              </div>
            )}

            {/* Optional custom label override */}
            {form.phaseStart && form.phaseEnd && !phaseError && (
              <label className="block mt-3">
                <p className="font-chivo text-black-500 text-xs mb-1">
                  Custom label{" "}
                  <span className="text-black-600 font-normal">
                    (overrides auto-generated)
                  </span>
                </p>
                <input
                  type="text"
                  placeholder={`Month ${form.phaseStart} – ${form.phaseEnd}`}
                  value={form.phaseLabel}
                  onChange={(e) => update("phaseLabel", e.target.value)}
                  className={inputCls}
                />
              </label>
            )}
          </div>

          {/* Target Date & Status */}
          <label className="block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
              Target Date
            </p>
            <input
              type="date"
              value={form.targetDate}
              onChange={(e) => update("targetDate", e.target.value)}
              className={inputCls}
            />
          </label>

          <label className="block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
              Status
            </p>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className={selectCls}
            >
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          {/* Progress slider */}
          <label className="sm:col-span-2 block">
            <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
              Progress — {form.progressPct}%
            </p>
            <input
              type="range"
              min={0}
              max={100}
              value={form.progressPct}
              onChange={(e) => update("progressPct", Number(e.target.value))}
              className="w-full accent-golden-400"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => mutation.mutate()}
            disabled={!form.projectId || !form.title || mutation.isPending}
            className="flex-1 py-3 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Spinner size="sm" />
            ) : editing ? (
              "Save Changes"
            ) : (
              "Add Milestone"
            )}
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

/* ═══════════════════════════════════════════════════════════════════
   GANTT TIMELINE VIEW
   Renders horizontal bars per milestone, grouped by project.
   X-axis spans month 1 → maxMonth (derived from data).
═══════════════════════════════════════════════════════════════════ */
function GanttView({ grouped }) {
  /* Derive total month span */
  const allItems = Object.values(grouped).flat();
  const maxMonth = Math.max(
    12,
    ...allItems.map((m) => m.phaseEnd ?? m.phaseStart ?? 0),
  );
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);
  const pct = (m) => ((m - 1) / maxMonth) * 100;

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([projectName, items]) => (
        <div
          key={projectName}
          className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden"
        >
          {/* Project header */}
          <div className="px-5 py-4 border-b border-black-700 flex items-center justify-between">
            <p className="font-bold uppercase text-sm text-golden-300">
              {projectName}
            </p>
            <p className="font-chivo text-black-500 text-xs">
              {items.length} milestone{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Month ruler */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex border-b border-black-700/60 mb-3 pb-1">
              <div className="w-44 flex-shrink-0" />
              <div className="flex-1 flex">
                {months.map((m) => (
                  <div
                    key={m}
                    className="flex-1 text-center font-chivo text-[10px] text-black-600"
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone rows */}
            {items.map((m) => {
              const hasPhase = m.phaseStart && m.phaseEnd;
              const barLeft = hasPhase ? pct(m.phaseStart) : 0;
              const barWidth = hasPhase
                ? ((m.phaseEnd - m.phaseStart + 1) / maxMonth) * 100
                : 0;

              return (
                <div key={m._id} className="flex items-center mb-2.5 group">
                  {/* Label column */}
                  <div className="w-44 flex-shrink-0 pr-3">
                    <p className="font-bold text-xs text-white truncate leading-tight">
                      {m.title}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_STYLE[m.status] ?? ""}`}
                    >
                      {STATUS_LABELS[m.status]}
                    </span>
                  </div>

                  {/* Bar track */}
                  <div className="flex-1 relative h-7 bg-black-900/60 rounded-lg overflow-hidden">
                    {/* Month gridlines */}
                    {months.map((mn) => (
                      <div
                        key={mn}
                        className="absolute top-0 h-full w-px bg-black-700/40"
                        style={{ left: `${pct(mn)}%` }}
                      />
                    ))}

                    {/* Phase bar */}
                    {hasPhase ? (
                      <motion.div
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute top-1 bottom-1 rounded-md flex items-center px-2 overflow-hidden"
                        style={{
                          left: `${barLeft}%`,
                          width: `${barWidth}%`,
                          backgroundColor: GANTT_COLOR[m.status],
                          opacity: 0.85,
                        }}
                        title={`${m.title} · ${m.phaseLabel || `Month ${m.phaseStart}–${m.phaseEnd}`}`}
                      >
                        <span className="text-white text-[10px] font-bold truncate">
                          {m.phaseLabel || `M${m.phaseStart}–${m.phaseEnd}`}
                        </span>
                      </motion.div>
                    ) : (
                      /* No phase set — show a thin indicator at start */
                      <div className="absolute top-1 bottom-1 left-0 w-1.5 rounded-sm bg-black-600" />
                    )}

                    {/* Progress overlay */}
                    {hasPhase && m.progressPct > 0 && (
                      <div
                        className="absolute top-1 bottom-1 rounded-md bg-white/20"
                        style={{
                          left: `${barLeft}%`,
                          width: `${barWidth * (m.progressPct / 100)}%`,
                        }}
                      />
                    )}
                  </div>

                  {/* % label */}
                  <div className="w-10 flex-shrink-0 text-right font-chivo text-xs text-golden-300 pl-2">
                    {m.progressPct}%
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 pb-1">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: GANTT_COLOR[key] }}
                  />
                  <span className="font-chivo text-[10px] text-black-500 uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CARD VIEW (original, enhanced with phase badge)
═══════════════════════════════════════════════════════════════════ */
function CardView({ grouped, writer, openEdit, deleteMutation }) {
  return (
    <>
      {Object.entries(grouped).map(([projectName, items]) => (
        <div
          key={projectName}
          className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-black-700 flex items-center justify-between">
            <p className="font-bold uppercase text-sm text-golden-300">
              {projectName}
            </p>
            <p className="font-chivo text-black-500 text-xs">
              {items.length} milestone{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="divide-y divide-black-700/50">
            {items.map((m) => (
              <motion.div
                key={m._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-5 py-4 flex items-start gap-4 group hover:bg-black-900/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  {/* Phase badge + title row */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <PhaseBadge milestone={m} />
                    <p className="font-bold text-sm">{m.title}</p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[m.status] ?? ""}`}
                    >
                      {STATUS_LABELS[m.status]}
                    </span>
                  </div>

                  {m.description && (
                    <p className="text-black-400 text-xs mb-2">
                      {m.description}
                    </p>
                  )}

                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-black-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-golden-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${m.progressPct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-golden-300 text-xs font-bold flex-shrink-0">
                      {m.progressPct}%
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex gap-4 mt-2 font-chivo text-xs text-black-500 flex-wrap">
                    {m.targetDate && (
                      <span>
                        Target: {new Date(m.targetDate).toLocaleDateString()}
                      </span>
                    )}
                    {m.completedDate && (
                      <span className="text-green-400">
                        Completed:{" "}
                        {new Date(m.completedDate).toLocaleDateString()}
                      </span>
                    )}
                    {m.loggedBy && (
                      <span>
                        By: {m.loggedBy.firstName} {m.loggedBy.lastName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {writer && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => openEdit(m)}
                      className="p-1.5 rounded-lg bg-black-700 hover:bg-black-600 text-black-300 hover:text-white transition-colors"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this milestone?"))
                          deleteMutation.mutate(m._id);
                      }}
                      className="p-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function Milestones() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const [viewMode, setViewMode] = useState("card"); // "card" | "timeline"
  const role = useAdminRole();
  const writer = canWrite(role);
  const queryClient = useQueryClient();

  /* ── Data ────────────────────────────────────────────────────── */
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ["admin_milestones"],
    queryFn: async () =>
      (await api.get("/api/milestones", { headers: adminAuthHeader() })).data
        ?.milestones ?? [],
    staleTime: 1000 * 60 * 3,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["admin_projects"],
    queryFn: async () => (await api.get("/api/projects")).data?.projects ?? [],
    staleTime: 1000 * 60 * 10,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      (
        await api.delete(`/api/milestones/${id}`, {
          headers: adminAuthHeader(),
        })
      ).data,
    onSuccess: () => {
      toast.success("Deleted.");
      queryClient.invalidateQueries(["admin_milestones"]);
    },
    onError: () => toast.error("Delete failed"),
  });

  /* ── Filtering & grouping ────────────────────────────────────── */
  const displayed =
    projectFilter === "all"
      ? milestones
      : milestones.filter(
          (m) => (m.project?._id ?? m.project) === projectFilter,
        );

  const grouped = useMemo(() => {
    const acc = {};
    /* Sort by phaseStart within each project */
    const sorted = [...displayed].sort(
      (a, b) => (a.phaseStart ?? 999) - (b.phaseStart ?? 999),
    );
    for (const m of sorted) {
      const key = m.project?.title ?? "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
    }
    return acc;
  }, [displayed]);

  const openAdd = () => {
    setEditing(null);
    setShowModal(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setShowModal(true);
  };

  /* ── View toggle button ──────────────────────────────────────── */
  const ViewToggle = () => (
    <div className="flex items-center gap-1 bg-black-800 border border-black-700 rounded-xl p-1">
      <button
        onClick={() => setViewMode("card")}
        title="Card view"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
          viewMode === "card"
            ? "bg-golden-500 text-white"
            : "text-black-400 hover:text-white"
        }`}
      >
        <FaList className="text-[10px]" /> List
      </button>
      <button
        onClick={() => setViewMode("timeline")}
        title="Timeline / Gantt view"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
          viewMode === "timeline"
            ? "bg-golden-500 text-white"
            : "text-black-400 hover:text-white"
        }`}
      >
        <FaStream className="text-[10px]" /> Timeline
      </button>
    </div>
  );

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto font-chivo">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide font-cinzel text-golden-300">
            Project Milestones
          </h1>
          <p className="text-black-400 text-sm mt-1">
            Track construction and development progress.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ViewToggle />
          {writer && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-sm rounded-xl transition-colors"
            >
              <FaPlus className="text-xs" /> Add Milestone
            </button>
          )}
        </div>
      </div>

      {/* Project filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setProjectFilter("all")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase border transition-colors ${
            projectFilter === "all"
              ? "bg-golden-500 text-white border-golden-500"
              : "border-black-700 text-black-400 hover:border-golden-600"
          }`}
        >
          All Projects
        </button>
        {projects.map((p) => (
          <button
            key={p._id}
            onClick={() => setProjectFilter(p._id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase border transition-colors ${
              projectFilter === p._id
                ? "bg-golden-500 text-white border-golden-500"
                : "border-black-700 text-black-400 hover:border-golden-600"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner color="warning" size="xl" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 bg-black-800 border border-black-700 rounded-2xl">
          <FaFlag className="text-black-700 text-4xl mx-auto mb-3" />
          <p className="text-black-500 text-sm">No milestones yet.</p>
          {writer && (
            <button
              onClick={openAdd}
              className="mt-4 text-golden-400 text-xs uppercase font-bold hover:text-golden-300"
            >
              Add the first milestone →
            </button>
          )}
        </div>
      ) : viewMode === "timeline" ? (
        <GanttView grouped={grouped} />
      ) : (
        <CardView
          grouped={grouped}
          writer={writer}
          openEdit={openEdit}
          deleteMutation={deleteMutation}
        />
      )}

      <AnimatePresence>
        {showModal && (
          <MilestoneModal
            projects={projects}
            editing={editing}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
