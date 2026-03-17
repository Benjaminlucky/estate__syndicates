import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { api } from "../../lib/api.js";
import "./Homeprojects.css";

/* ─── Helpers ───────────────────────────────────────────────────── */
function safeImage(url) {
  if (!url) return "/assets/heroBG1.png";
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

function formatCurrency(n) {
  if (!n) return "—";
  return "₦" + Number(n).toLocaleString("en-NG");
}

function formatDate(dateStr) {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
}

/* Status badge colours — matches ProjectCard convention */
const STATUS_STYLE = {
  Active: { dot: "bg-green-400", text: "text-green-400" },
  Completed: { dot: "bg-blue-400", text: "text-blue-400" },
  "Coming Soon": { dot: "bg-golden-300", text: "text-golden-300" },
};

/* ─── API shape normaliser ──────────────────────────────────────── */
function normalise(p) {
  return {
    _id: p._id,
    title: p.title,
    location: p.location || null,
    status: p.status || "Coming Soon",
    developmentType: p.developmentType || "—",
    roi: p.roi || "—",
    completionDate: p.completionDate || null,
    budget: p.budget || null,
    soldPercentage: Number(p.soldPercentage) || 0,
    image: p.image,
    link: `/projects/${p._id}`,
  };
}

/* ─── Skeleton slide ────────────────────────────────────────────── */
function SkeletonSlide() {
  return (
    <div className="project animate-pulse">
      <div
        className="projectimage overflow-hidden rounded-lg bg-black-700"
        style={{ height: 400 }}
      />
      <div className="pt-5 pb-4 space-y-3">
        <div className="h-5 bg-black-700 rounded w-3/4" />
        <div className="h-4 bg-black-700 rounded w-1/2" />
      </div>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="grid grid-cols-2 gap-5 mb-3">
          <div className="h-9 bg-black-700 rounded-lg" />
          <div className="h-9 bg-black-700 rounded-lg" />
        </div>
      ))}
      <div className="py-8">
        <div className="h-11 bg-black-700 rounded-full" />
      </div>
    </div>
  );
}

/* ─── Single project slide card ─────────────────────────────────── */
function ProjectSlide({ project }) {
  const statusStyle =
    STATUS_STYLE[project.status] ?? STATUS_STYLE["Coming Soon"];
  const sold = project.soldPercentage;
  const progressRef = useRef(null);

  return (
    <motion.div
      className="project"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image */}
      <div className="projectimage overflow-hidden rounded-lg relative">
        <img
          src={safeImage(project.image)}
          alt={project.title}
          onError={(e) => {
            e.target.src = "/assets/heroBG1.png";
          }}
          className="w-full transition-transform duration-500 hover:scale-105"
        />

        {/* Status badge overlaid on image */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black-700">
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`}
          />
          <span
            className={`font-chivo text-xs font-bold uppercase tracking-wide ${statusStyle.text}`}
          >
            {project.status}
          </span>
        </div>

        {/* Sold % badge — only show if > 0 */}
        {sold > 0 && (
          <div className="absolute top-4 right-4 bg-black-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black-700">
            <span className="font-chivo text-xs font-bold text-golden-300">
              {sold}% Sold
            </span>
          </div>
        )}
      </div>

      {/* Title + location */}
      <div className="pt-5 pb-3">
        <div className="project__title text-lg font-bold uppercase mb-1">
          {project.title}
        </div>
        {project.location && (
          <div className="flex items-center gap-1.5 font-chivo text-black-400 text-sm">
            <FaMapMarkerAlt className="text-golden-400 text-xs flex-shrink-0" />
            {project.location}
          </div>
        )}
      </div>

      {/* Label / value rows — same grid convention as original */}
      <div className="project__status grid grid-cols-2 gap-5 items-center mb-3">
        <div className="status bg-golden-200 rounded-lg px-4 py-2 font-chivo uppercase text-golden-700 text-sm">
          Status
        </div>
        <div
          className={`stat font-chivo font-bold text-sm ${statusStyle.text}`}
        >
          {project.status}
        </div>
      </div>

      <div className="project__purpose grid grid-cols-2 gap-5 items-center mb-3">
        <div className="purpose bg-golden-300 rounded-lg px-4 py-2 font-chivo uppercase text-golden-800 text-sm">
          Type
        </div>
        <div className="pur font-chivo text-golden-300 font-bold text-sm">
          {project.developmentType}
        </div>
      </div>

      <div className="project__return grid grid-cols-2 gap-5 items-center mb-3">
        <div className="return bg-golden-400 rounded-lg px-4 py-2 font-chivo uppercase text-golden-900 text-sm">
          ROI
        </div>
        <div className="ret font-chivo text-golden-300 font-bold text-sm">
          {project.roi}
        </div>
      </div>

      <div className="project__duration grid grid-cols-2 gap-5 items-center mb-3">
        <div className="duration bg-black-200 rounded-lg px-4 py-2 font-chivo uppercase text-golden-900 text-sm">
          Completion
        </div>
        <div className="dur font-chivo font-bold text-sm">
          {formatDate(project.completionDate)}
        </div>
      </div>

      {/* Budget row */}
      {project.budget && (
        <div className="grid grid-cols-2 gap-5 items-center mb-3">
          <div className="bg-black-600 rounded-lg px-4 py-2 font-chivo uppercase text-black-200 text-sm">
            Budget
          </div>
          <div className="font-chivo text-golden-300 font-bold text-sm">
            {formatCurrency(project.budget)}
          </div>
        </div>
      )}

      {/* Funding progress bar */}
      {sold > 0 && (
        <div className="mt-4 mb-2">
          <div className="flex justify-between font-chivo text-xs text-black-400 mb-1.5">
            <span>Funding progress</span>
            <span className="text-golden-300 font-bold">{sold}%</span>
          </div>
          <div className="w-full h-1.5 bg-black-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-golden-300 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${sold}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* CTA — same style as original */}
      <div className="project__link py-8 w-full">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to={project.link}
            className="border border-2 font-bold font-chivo uppercase border-golden-300 px-8 py-3 rounded-full w-full hover:border-transparent hover:bg-golden-300 hover:text-black-900 transition-colors duration-200 block text-center"
          >
            View Details
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────────────── */
function Homeprojects() {
  const containerVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2 },
    },
  };

  /* ── Fetch live projects ── */
  const {
    data: apiProjects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["home_projects"],
    queryFn: async () => {
      const res = await api.get("/api/projects");
      return res.data?.projects ?? [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes — homepage doesn't need real-time
    retry: 1, // one retry on fail, then fall back to static
  });

  /*
    Priority order: Active first, then Coming Soon, then Completed.
    Cap at 6 — keeps the carousel snappy on the home page.
  */
  const projects = isLoading
    ? []
    : [...apiProjects]
        .sort((a, b) => {
          const priority = { Active: 0, "Coming Soon": 1, Completed: 2 };
          return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
        })
        .slice(0, 6)
        .map((p) => normalise(p));

  return (
    <div className="projects__section w-full md:mt-48 mb-16">
      <div className="project__wrapper w-full mx-auto">
        <motion.div
          className="project__content w-full flex flex-col justify-center"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Title */}
          <div className="ptitle__section py-16 text-center">
            <div className="project__title text-2xl md:text-4xl uppercase font-bold">
              <h3>Featured Projects</h3>
            </div>
            <div className="project__subtitle w-full md:w-2/5 mx-auto font-chivo text-black-300">
              <p>
                Explore some of our standout real estate investment
                opportunities, each designed to deliver exceptional returns
                while meeting diverse investment goals.
              </p>
            </div>
          </div>

          {/* Carousel */}
          <div className="project__highlights w-full">
            <div className="phighlights__wrapper w-full">
              <motion.div
                className="phighlights__content w-full"
                variants={containerVariant}
              >
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  spaceBetween={30}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    1024: { slidesPerView: 2 },
                  }}
                >
                  {isLoading
                    ? /* Skeleton placeholders while fetching */
                      Array.from({ length: 2 }).map((_, i) => (
                        <SwiperSlide key={`sk-${i}`}>
                          <SkeletonSlide />
                        </SwiperSlide>
                      ))
                    : projects.map((project, index) => (
                        <SwiperSlide key={project._id ?? index}>
                          <ProjectSlide project={project} />
                        </SwiperSlide>
                      ))}
                </Swiper>
              </motion.div>
            </div>
          </div>

          {/* "View all" link — only show when we have live data */}
          {!isLoading && apiProjects.length > 0 && (
            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/projects"
                className="font-chivo font-bold uppercase text-sm border border-black-500 text-black-300 px-8 py-3 rounded-full hover:border-golden-300 hover:text-golden-300 transition-colors duration-200"
              >
                View All Projects →
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Homeprojects;
