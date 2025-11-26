import React, { useEffect, useRef, useState } from "react";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";

// 🌟 Format Numbers with commas
const formatNumber = (num) =>
  num !== undefined && num !== null ? Number(num).toLocaleString("en-US") : "—";

// 🌟 Format Currency (₦)
const formatCurrency = (num) =>
  num !== undefined && num !== null
    ? `₦${Number(num).toLocaleString("en-US")}`
    : "—";

// 🌟 Safe Image URL with Cloudinary optimization
function safeImageUrl(url) {
  if (!url) return "/placeholder.jpg"; // fallback image
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

export default function ProjectCard({ project }) {
  const {
    title,
    location,
    developmentType,
    totalUnits,
    pricePerUnit,
    budget,
    image,
    soldPercentage = 0,
    status = "Coming Soon",
    roi,
    irr,
    completionDate,
  } = project;

  const [fav, setFav] = useState(false);
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    if (progressRef.current) {
      requestAnimationFrame(
        () => (progressRef.current.style.width = `${soldPercentage}%`)
      );
    }
  }, [soldPercentage]);

  const statusColor = {
    Active: "bg-green-500 text-black",
    Completed: "bg-blue-600 text-white",
    "Coming Soon": "bg-golden-300 text-black",
  }[status];

  const formattedDate =
    completionDate &&
    new Date(completionDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
    });

  return (
    <article
      className={`relative bg-black-700/60 border border-black-600 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      }`}
    >
      {/* IMAGE */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={safeImageUrl(image)}
          alt={title}
          onError={(e) => (e.target.src = "/placeholder.jpg")}
          className="w-full h-full object-cover"
        />

        {/* Status */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {status}
          </span>

          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
            <strong>{soldPercentage}%</strong> Sold
          </div>
        </div>

        {/* Favorite */}
        <button
          onClick={() => setFav(!fav)}
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full"
        >
          {fav ? <FaHeart className="text-golden-300" /> : <FaRegHeart />}
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>

        <p className="flex items-center gap-2 text-gray-400 text-sm mt-1">
          <FaMapMarkerAlt className="text-golden-300" /> {location}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-300">
          <SmallInfo label="Units" value={formatNumber(totalUnits)} />
          <SmallInfo
            label="Price / Unit"
            value={formatCurrency(pricePerUnit)}
          />
          <SmallInfo
            className="col-span-2"
            label="Development Type"
            value={developmentType}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
          <span className="flex items-center gap-2">
            <FaChartLine /> {roi || "—"} ROI
          </span>
          <span className="flex items-center gap-2">
            <FaCalendarAlt /> {formattedDate || "TBD"}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-golden-300 transition-all duration-700 ease-out"
            ></div>
          </div>
        </div>

        {/* Budget */}
        <div className="mt-4 bg-black rounded-lg px-4 py-2 border border-gray-700">
          <div className="text-lg font-bold text-golden-300">
            {formatCurrency(budget)}
          </div>
          <div className="text-[10px] text-gray-400">Project Budget</div>
        </div>

        <button className="mt-5 w-full bg-golden-400 py-2 rounded-md hover:bg-golden-500 transition">
          View Details
        </button>
      </div>
    </article>
  );
}

function SmallInfo({ label, value, className }) {
  return (
    <div className={className}>
      <p className="text-gray-500 uppercase text-[11px] tracking-wide">
        {label}
      </p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
