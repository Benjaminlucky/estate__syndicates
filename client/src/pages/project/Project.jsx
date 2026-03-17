import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import ProjectCard from "../../components/ProjectCard";
import { api } from "../../lib/api.js";

/* ─── Filter options ────────────────────────────────────────────── */
const STATUS_FILTERS = ["All", "Active", "Coming Soon", "Completed"];
const TYPE_FILTERS = ["All Types"];

/* ─── Skeleton card ─────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-black-700/60 border border-black-600 rounded-2xl overflow-hidden">
      <div className="h-56 bg-black-600" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-black-600 rounded w-3/4" />
        <div className="h-4 bg-black-600 rounded w-1/2" />
        <div className="h-3 bg-black-600 rounded w-full" />
        <div className="h-3 bg-black-600 rounded w-5/6" />
        <div className="h-10 bg-black-600 rounded mt-4" />
      </div>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────────────────── */
function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full border-2 border-golden-800 flex items-center justify-center mb-6">
        <FaFilter className="text-golden-600 text-2xl" />
      </div>
      <h3 className="font-bold text-xl mb-2">
        {hasFilters ? "No projects match your filters" : "No projects yet"}
      </h3>
      <p className="font-chivo text-black-400 mb-6 max-w-sm">
        {hasFilters
          ? "Try adjusting your search or status filter to see more results."
          : "Check back soon — new investment opportunities are added regularly."}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="font-bold uppercase text-sm border border-golden-500 text-golden-300 px-6 py-2 rounded-lg hover:bg-golden-500 hover:text-black-900 transition-colors duration-200"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* Fetch */
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public_projects"],
    queryFn: async () => (await api.get("/api/projects")).data?.projects ?? [],
    staleTime: 1000 * 60 * 5,
    onError: () => toast.error("Failed to load projects."),
  });

  /* Derive type options from live data */
  const typeOptions = useMemo(() => {
    const types = [
      ...new Set(projects.map((p) => p.developmentType).filter(Boolean)),
    ];
    return ["All Types", ...types];
  }, [projects]);

  /* Filter */
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

  const hasFilters = search !== "" || statusFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  /* Stats from live data */
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
    <>
      <Helmet>
        <title>Investment Projects | Estate Syndicates</title>
        <meta
          name="description"
          content="Browse premium Nigerian real estate investment projects on Estate Syndicates. Filter by status, search by location, and find your next opportunity."
        />
        <meta
          name="keywords"
          content="real estate investment Nigeria, property projects, fractional ownership, Estate Syndicates projects"
        />
        <meta
          property="og:title"
          content="Investment Projects | Estate Syndicates"
        />
        <meta
          property="og:url"
          content="https://www.estatesindicates.com/projects"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="w-full bg-black-900 text-white min-h-screen">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="w-full py-20 md:py-28">
          <div className="w-10/12 mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-chivo text-golden-300 uppercase tracking-widest text-sm mb-4"
            >
              Investment Opportunities
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-6xl font-bold uppercase leading-tight mb-5"
            >
              Our Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-chivo text-black-300 text-lg max-w-2xl mx-auto"
            >
              Each project is hand-selected, financially vetted, and managed
              in-house by our engineering team. Browse, filter, and invest in
              the opportunities that match your goals.
            </motion.p>
          </div>
        </section>

        {/* ── Live stats bar ───────────────────────────────── */}
        {!isLoading && projects.length > 0 && (
          <section className="w-full bg-golden-900 py-6 mb-4">
            <div className="w-10/12 mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: "Total Projects", value: stats.total },
                  { label: "Active", value: stats.active },
                  { label: "Coming Soon", value: stats.coming },
                  { label: "Completed", value: stats.completed },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-2xl md:text-3xl font-bold text-golden-300">
                      {s.value}
                    </p>
                    <p className="font-chivo text-black-400 text-sm uppercase tracking-wide">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Filters ──────────────────────────────────────── */}
        <section className="w-full py-6 sticky top-0 z-20 bg-black-900/95 backdrop-blur-sm border-b border-black-800">
          <div className="w-10/12 mx-auto flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black-500 text-sm" />
              <input
                type="text"
                placeholder="Search by name or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black-800 border border-black-700 rounded-lg pl-10 pr-4 py-3 font-chivo text-sm text-white placeholder-black-500 focus:outline-none focus:border-golden-500 transition-colors duration-200"
              />
            </div>

            {/* Status filter pills */}
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-lg font-chivo text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${
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
        </section>

        {/* ── Grid ─────────────────────────────────────────── */}
        <section className="w-full py-12 pb-24">
          <div className="w-10/12 mx-auto">
            {/* Result count */}
            {!isLoading && !isError && (
              <p className="font-chivo text-black-500 text-sm mb-6">
                {filtered.length === 0
                  ? "No results"
                  : `Showing ${filtered.length} project${filtered.length !== 1 ? "s" : ""}${hasFilters ? " (filtered)" : ""}`}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : isError ? (
                <div className="col-span-full py-24 text-center">
                  <p className="font-chivo text-black-400 mb-4">
                    Failed to load projects. Please try again.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="font-bold uppercase text-sm border border-golden-500 text-golden-300 px-6 py-2 rounded-lg hover:bg-golden-500 hover:text-black-900 transition-colors duration-200"
                  >
                    Retry
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
              ) : (
                filtered.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* ProjectCard already handles all display logic.
                        We wrap it in a Link to the detail page. */}
                    <Link to={`/projects/${project._id}`} className="block">
                      <ProjectCard project={project} />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        {!isLoading && projects.length > 0 && (
          <section className="w-full pb-24">
            <div className="w-10/12 mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-chivo text-black-400 mb-2 text-sm uppercase tracking-widest">
                  Don't have an account yet?
                </p>
                <h2 className="font-bold text-2xl md:text-3xl uppercase mb-6">
                  Sign Up to Invest in These Projects
                </h2>
                <Link
                  to="/signup"
                  className="inline-block py-4 px-12 bg-golden-500 hover:bg-golden-400 text-white font-bold uppercase rounded-lg transition-colors duration-200"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
