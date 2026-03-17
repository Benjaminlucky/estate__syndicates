import { useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaChartLine,
  FaCalendarAlt,
  FaBuilding,
  FaMoneyBillWave,
  FaArrowLeft,
  FaCheckCircle,
  FaLayerGroup,
} from "react-icons/fa";
import { api } from "../../lib/api.js";

/* ─── Helpers ───────────────────────────────────────────────────── */
const fmt = (n) =>
  n !== undefined && n !== null && n !== ""
    ? Number(n).toLocaleString("en-NG")
    : "—";

const fmtCurrency = (n) =>
  n !== undefined && n !== null && n !== ""
    ? `₦${Number(n).toLocaleString("en-NG")}`
    : "—";

function safeImage(url) {
  if (!url) return "/assets/signupBg.jpg";
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

/* ─── Status badge colours (matches ProjectCard) ────────────────── */
const STATUS_STYLES = {
  Active: "bg-green-500 text-black",
  Completed: "bg-blue-600 text-white",
  "Coming Soon": "bg-golden-300 text-black",
};

/* ─── Skeleton ──────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="w-full min-h-screen bg-black-900 text-white">
      <div className="animate-pulse w-10/12 mx-auto py-24 space-y-8">
        <div className="h-8 bg-black-700 rounded w-1/3" />
        <div className="h-72 bg-black-700 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-black-700 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Stat tile ─────────────────────────────────────────────────── */
function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="bg-black-800 border border-black-700 rounded-xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full border border-golden-700 flex items-center justify-center flex-shrink-0">
        <Icon className="text-golden-300 text-sm" />
      </div>
      <div>
        <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="font-bold text-lg text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await api.get(`/api/projects/${id}`);
      return res.data?.project ?? null;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data) {
    return (
      <div className="w-full min-h-screen bg-black-900 text-white flex flex-col items-center justify-center gap-6">
        <p className="font-chivo text-black-400 text-lg">Project not found.</p>
        <Link
          to="/projects"
          className="flex items-center gap-2 border border-golden-500 text-golden-300 px-6 py-3 rounded-lg font-bold uppercase text-sm hover:bg-golden-500 hover:text-black-900 transition-colors duration-200"
        >
          <FaArrowLeft /> Back to Projects
        </Link>
      </div>
    );
  }

  const p = data;
  const formattedDate =
    p.completionDate &&
    new Date(p.completionDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    });

  const soldPct = Number(p.soldPercentage) || 0;
  const statusStyle = STATUS_STYLES[p.status] ?? "bg-black-700 text-white";

  return (
    <>
      <Helmet>
        <title>{`${p.title} | Estate Syndicates`}</title>
        <meta
          name="description"
          content={
            p.shortDescription ||
            `Invest in ${p.title} — a premium ${p.developmentType} development in ${p.location} with ${p.roi} ROI.`
          }
        />
        <meta property="og:title" content={`${p.title} | Estate Syndicates`} />
        <meta property="og:image" content={safeImage(p.image)} />
        <meta
          property="og:url"
          content={`https://www.estatesindicates.com/projects/${id}`}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="w-full bg-black-900 text-white min-h-screen">
        <div className="w-10/12 mx-auto py-12 md:py-20">
          {/* ── Back link ──────────────────────────────────── */}
          <motion.button
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-chivo text-black-400 hover:text-golden-300 transition-colors duration-200 mb-8 text-sm"
          >
            <FaArrowLeft className="text-xs" />
            Back to Projects
          </motion.button>

          {/* ── Header ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusStyle}`}
              >
                {p.status}
              </span>
              {p.developmentType && (
                <span className="px-3 py-1 bg-black-800 border border-black-700 rounded-full text-xs font-chivo text-black-300 uppercase">
                  {p.developmentType}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold uppercase leading-tight mb-3">
              {p.title}
            </h1>
            <p className="flex items-center gap-2 font-chivo text-black-300 text-lg">
              <FaMapMarkerAlt className="text-golden-300" />
              {p.location}
            </p>
          </motion.div>

          {/* ── Two-column layout ──────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Left: image + description + stats */}
            <div className="lg:col-span-3 space-y-8">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full rounded-2xl overflow-hidden aspect-video bg-black-800"
              >
                <img
                  src={safeImage(p.image)}
                  alt={p.title}
                  onError={(e) => (e.target.src = "/assets/signupBg.jpg")}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Description */}
              {p.shortDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="font-bold uppercase text-lg mb-3">
                    About This Project
                  </h2>
                  <p className="font-chivo text-black-300 leading-relaxed text-base">
                    {p.shortDescription}
                  </p>
                </motion.div>
              )}

              {/* Stats grid */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h2 className="font-bold uppercase text-lg mb-4">
                  Project Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatTile
                    icon={FaLayerGroup}
                    label="Total Units"
                    value={fmt(p.totalUnits)}
                  />
                  <StatTile
                    icon={FaMoneyBillWave}
                    label="Price Per Unit"
                    value={fmtCurrency(p.pricePerUnit)}
                  />
                  <StatTile
                    icon={FaBuilding}
                    label="Development Type"
                    value={p.developmentType || "—"}
                  />
                  <StatTile
                    icon={FaCalendarAlt}
                    label="Completion Date"
                    value={formattedDate || "TBD"}
                  />
                  <StatTile
                    icon={FaChartLine}
                    label="Projected ROI"
                    value={p.roi ? `${p.roi}%` : "—"}
                  />
                  <StatTile
                    icon={FaChartLine}
                    label="IRR"
                    value={p.irr ? `${p.irr}%` : "—"}
                  />
                </div>
              </motion.div>

              {/* Funding progress */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-black-800 border border-black-700 rounded-xl p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold uppercase text-sm">
                    Funding Progress
                  </h3>
                  <span className="font-bold text-golden-300">
                    {soldPct}% Sold
                  </span>
                </div>
                <div className="w-full h-3 bg-black-700 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${soldPct}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="h-full bg-golden-400 rounded-full"
                  />
                </div>
                <div className="flex justify-between font-chivo text-sm text-black-400">
                  <span>{soldPct}% committed</span>
                  <span>{100 - soldPct}% remaining</span>
                </div>
              </motion.div>
            </div>

            {/* Right: sticky invest panel */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky top-28 bg-black-800 border border-golden-800 rounded-2xl p-6 space-y-5"
              >
                {/* Budget */}
                <div className="pb-5 border-b border-black-700">
                  <p className="font-chivo text-black-400 text-xs uppercase tracking-wide mb-1">
                    Project Budget
                  </p>
                  <p className="text-3xl font-bold text-golden-300">
                    {fmtCurrency(p.budget)}
                  </p>
                </div>

                {/* Quick stats */}
                <div className="space-y-3">
                  {[
                    { label: "Units Available", value: fmt(p.totalUnits) },
                    {
                      label: "Price Per Unit",
                      value: fmtCurrency(p.pricePerUnit),
                    },
                    {
                      label: "Projected ROI",
                      value: p.roi ? `${p.roi}%` : "—",
                    },
                    { label: "Completion", value: formattedDate || "TBD" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center"
                    >
                      <span className="font-chivo text-black-400 text-sm">
                        {label}
                      </span>
                      <span className="font-bold text-sm">{value}</span>
                    </div>
                  ))}
                </div>

                {/* What you get */}
                <div className="bg-black-900 rounded-xl p-4 space-y-2">
                  <p className="font-bold text-xs uppercase tracking-wide text-golden-300 mb-3">
                    What Investors Receive
                  </p>
                  {[
                    "Pro-rata returns on your stake",
                    "Full expense transparency",
                    "Regular project updates",
                    "Legal ownership documentation",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <FaCheckCircle className="text-golden-500 text-xs flex-shrink-0" />
                      <span className="font-chivo text-black-300 text-xs">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to="/login"
                  state={{ intendedProject: id }}
                  className="block w-full text-center py-4 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-xl transition-colors duration-200 text-sm"
                >
                  Invest in This Project
                </Link>

                <p className="font-chivo text-black-500 text-xs text-center">
                  You will be asked to log in or create a free account to
                  invest.
                </p>
              </motion.div>
            </div>
          </div>

          {/* ── Bottom: related projects suggestion ────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20 text-center"
          >
            <p className="font-chivo text-black-400 mb-3 text-sm uppercase tracking-widest">
              Explore More
            </p>
            <h2 className="font-bold text-2xl uppercase mb-6">
              View All Available Projects
            </h2>
            <Link
              to="/projects"
              className="inline-block border-2 border-golden-300 hover:bg-golden-300 hover:text-black-900 font-bold uppercase px-10 py-3 rounded-xl transition-colors duration-200"
            >
              Browse Portfolio
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
