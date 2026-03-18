import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaFlag, FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { api } from "../../../lib/api.js";
import {
  adminAuthHeader,
  useAdminRole,
  canWrite,
} from "../../../hooks/useAdmin.js";

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

const inputCls =
  "w-full bg-black-900 border border-black-700 rounded-xl px-4 py-2.5 font-chivo text-sm focus:outline-none focus:border-golden-500 transition-colors";
const selectCls = inputCls + " appearance-none";

/* ─── Milestone form modal ──────────────────────────────────────── */
function MilestoneModal({ projects, editing, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    projectId: editing?.project?._id ?? editing?.project ?? "",
    title: editing?.title ?? "",
    description: editing?.description ?? "",
    targetDate: editing?.targetDate ? editing.targetDate.slice(0, 10) : "",
    status: editing?.status ?? "pending",
    progressPct: editing?.progressPct ?? 0,
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const mutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return (
          await api.patch(`/api/milestones/${editing._id}`, form, {
            headers: adminAuthHeader(),
          })
        ).data;
      }
      return (
        await api.post("/api/milestones", form, { headers: adminAuthHeader() })
      ).data;
    },
    onSuccess: () => {
      toast.success(editing ? "Milestone updated." : "Milestone added.");
      queryClient.invalidateQueries(["admin_milestones"]);
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
        className="bg-black-800 border border-black-700 rounded-2xl w-full max-w-lg p-6 space-y-4"
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

/* ─── Page ──────────────────────────────────────────────────────── */
export default function Milestones() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [projectFilter, setProjectFilter] = useState("all");
  const role = useAdminRole();
  const writer = canWrite(role);
  const queryClient = useQueryClient();

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

  const displayed =
    projectFilter === "all"
      ? milestones
      : milestones.filter(
          (m) => (m.project?._id ?? m.project) === projectFilter,
        );

  /* Group by project for display */
  const grouped = useMemo(() => {
    const acc = {};
    for (const m of displayed) {
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

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto font-chivo">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide font-cinzel text-golden-300">
            Project Milestones
          </h1>
          <p className="text-black-400 text-sm mt-1">
            Track construction and development progress.
          </p>
        </div>
        {writer && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-sm rounded-xl transition-colors"
          >
            <FaPlus className="text-xs" /> Add Milestone
          </button>
        )}
      </div>

      {/* Project filter */}
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

      {/* Milestone groups */}
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
      ) : (
        Object.entries(grouped).map(([projectName, items]) => (
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
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
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

                    <div className="flex gap-4 mt-2 font-chivo text-xs text-black-500">
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
        ))
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
