import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaChartLine,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { api } from "../../../lib/api.js";
import {
  useMyInvestments,
  authHeader,
  fmtNaira,
} from "../../../hooks/useInvestments";

/* ─── Helpers ───────────────────────────────────────────────────── */
function safeImg(url) {
  if (!url) return "/assets/heroBG1.png";
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

/* ─── Invest Modal ──────────────────────────────────────────────── */
function InvestModal({ project, onClose }) {
  const [units, setUnits] = useState(1);
  const queryClient = useQueryClient();

  const pricePerUnit = Number(project.pricePerUnit) || 0;
  const total = pricePerUnit * units;
  const maxUnits = project.totalUnits
    ? Math.floor(project.totalUnits * (1 - (project.soldPercentage || 0) / 100))
    : 999;

  const mutation = useMutation({
    mutationFn: async () =>
      (
        await api.post(
          "/api/investments",
          { projectId: project._id, units },
          { headers: authHeader() },
        )
      ).data,
    onSuccess: () => {
      toast.success("Investment submitted! We will confirm shortly.");
      queryClient.invalidateQueries(["my_investments"]);
      queryClient.invalidateQueries(["my_stats"]);
      onClose();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Investment failed"),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-black-800 border border-black-700 rounded-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black-700">
          <h2 className="font-bold uppercase tracking-wide">Invest Now</h2>
          <button
            onClick={onClose}
            className="p-1 hover:text-golden-300 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          {/* Project */}
          <div className="flex items-center gap-3 bg-black-900 rounded-xl p-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={safeImg(project.image)}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-sm">{project.title}</p>
              {project.location && (
                <p className="font-chivo text-xs text-black-400 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-golden-500 text-[10px]" />
                  {project.location}
                </p>
              )}
            </div>
          </div>

          {/* Unit price */}
          <div className="flex justify-between text-sm font-chivo">
            <span className="text-black-400">Price per unit</span>
            <span className="font-bold text-golden-300">
              {fmtNaira(pricePerUnit)}
            </span>
          </div>

          {/* Units selector */}
          <div>
            <label className="font-chivo text-xs uppercase tracking-wide text-black-400 block mb-2">
              Number of units
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUnits((u) => Math.max(1, u - 1))}
                className="w-10 h-10 rounded-lg bg-black-700 hover:bg-black-600 font-bold text-lg transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={maxUnits}
                value={units}
                onChange={(e) =>
                  setUnits(
                    Math.max(1, Math.min(maxUnits, Number(e.target.value))),
                  )
                }
                className="flex-1 bg-black-900 border border-black-700 rounded-lg px-4 py-2 text-center font-bold focus:outline-none focus:border-golden-500"
              />
              <button
                onClick={() => setUnits((u) => Math.min(maxUnits, u + 1))}
                className="w-10 h-10 rounded-lg bg-black-700 hover:bg-black-600 font-bold text-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-golden-900/30 border border-golden-800 rounded-xl px-5 py-4 flex justify-between items-center">
            <p className="font-chivo text-black-300 text-sm">
              Total Investment
            </p>
            <p className="text-xl font-bold text-golden-300">
              {fmtNaira(total)}
            </p>
          </div>

          {/* ROI hint */}
          {project.roi && (
            <div className="flex items-center gap-2 font-chivo text-xs text-black-400">
              <FaChartLine className="text-golden-600 text-xs" />
              Projected ROI:{" "}
              <span className="text-golden-300 font-bold">{project.roi}%</span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || pricePerUnit === 0}
            className="w-full py-4 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending
              ? "Submitting…"
              : `Confirm Investment — ${fmtNaira(total)}`}
          </button>
          <p className="font-chivo text-black-500 text-xs text-center">
            Your investment will be confirmed by our team within 24 hours.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Project card ──────────────────────────────────────────────── */
function ProjectCard({ project, myInvestment }) {
  const [showModal, setShowModal] = useState(false);
  const sold = Number(project.soldPercentage) || 0;

  const STATUS_COLOR =
    {
      Active: "text-green-400 bg-green-400/10",
      Completed: "text-blue-400 bg-blue-400/10",
      "Coming Soon": "text-golden-300 bg-golden-300/10",
    }[project.status] ?? "text-black-400 bg-black-700";

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <InvestModal project={project} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden group"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={safeImg(project.image)}
            alt={project.title}
            onError={(e) => (e.target.src = "/assets/heroBG1.png")}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`font-chivo text-xs font-bold px-3 py-1 rounded-full uppercase ${STATUS_COLOR}`}
            >
              {project.status}
            </span>
          </div>
          {myInvestment && (
            <div className="absolute top-3 right-3 bg-green-500/90 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <FaCheckCircle className="text-[10px]" /> Invested
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-base leading-tight">{project.title}</h3>
          {project.location && (
            <p className="font-chivo text-black-400 text-xs flex items-center gap-1">
              <FaMapMarkerAlt className="text-golden-500 text-[10px]" />{" "}
              {project.location}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs font-chivo">
            <div className="bg-black-900 rounded-lg px-3 py-2">
              <p className="text-black-500 uppercase tracking-wide mb-0.5">
                Price/unit
              </p>
              <p className="font-bold text-golden-300">
                {fmtNaira(project.pricePerUnit)}
              </p>
            </div>
            <div className="bg-black-900 rounded-lg px-3 py-2">
              <p className="text-black-500 uppercase tracking-wide mb-0.5">
                ROI
              </p>
              <p className="font-bold text-golden-300">
                {project.roi ? `${project.roi}%` : "—"}
              </p>
            </div>
          </div>

          {/* Progress */}
          {sold > 0 && (
            <div>
              <div className="flex justify-between font-chivo text-xs text-black-500 mb-1">
                <span>Funding</span>
                <span className="text-golden-300 font-bold">{sold}%</span>
              </div>
              <div className="w-full h-1.5 bg-black-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-golden-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${sold}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* My investment info */}
          {myInvestment && (
            <div className="bg-green-900/20 border border-green-800/40 rounded-xl px-3 py-2 font-chivo text-xs">
              <p className="text-green-400">
                Your investment:{" "}
                <span className="font-bold">
                  {fmtNaira(myInvestment.amount)}
                </span>
              </p>
              <p className="text-black-400">
                {myInvestment.units} unit{myInvestment.units !== 1 ? "s" : ""} ·{" "}
                {myInvestment.status}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Link
              to={`/projects/${project._id}`}
              className="flex-1 text-center py-2.5 border border-black-600 text-black-300 hover:border-golden-600 hover:text-golden-300 font-chivo font-bold uppercase text-xs rounded-xl transition-colors duration-200"
            >
              Details
            </Link>
            {project.status !== "Completed" && (
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 py-2.5 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase text-xs rounded-xl transition-colors duration-200"
              >
                {myInvestment ? "Invest More" : "Invest"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function InvestorProjects() {
  const { data: projects = [], isLoading: projLoading } = useQuery({
    queryKey: ["investor_projects"],
    queryFn: async () => (await api.get("/api/projects")).data?.projects ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const { data: myInvestments = [] } = useMyInvestments();

  /* Map project _id → my investment for quick lookup */
  const myMap = Object.fromEntries(
    myInvestments.map((inv) => [inv.project?._id ?? inv.project, inv]),
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          Investment Projects
        </h1>
        <p className="font-chivo text-black-400 text-sm mt-1">
          Browse available projects and manage your portfolio.
        </p>
      </div>

      {projLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-black-800 border border-black-700 rounded-2xl overflow-hidden"
            >
              <div className="h-48 bg-black-700" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-black-700 rounded w-3/4" />
                <div className="h-3 bg-black-700 rounded w-1/2" />
                <div className="h-10 bg-black-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-chivo text-black-500">
            No projects available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} myInvestment={myMap[p._id]} />
          ))}
        </div>
      )}
    </div>
  );
}
