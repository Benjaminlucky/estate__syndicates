// src/pages/admin/dashboard/Projects.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaEllipsisV,
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaEye,
  FaTrash,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";
import { projectsData } from "../../../../data.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";
import "flowbite";
import { api } from "../../../lib/api.js";

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function Projects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        const res = await api.get("/api/projects");

        // Debug log (helps find backend issues)
        console.log("Loaded projects:", res.data);

        // Safely extract projects
        const projects = res?.data?.projects ?? [];

        setProjects(projects);
      } catch (err) {
        console.error("Error loading projects:", err);
        toast.error("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const updateField = (name, value) =>
    setForm((p) => ({ ...p, [name]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      updateField("image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (form) => {
    const e = {};
    if (!form.title?.trim()) e.title = "Title is required";
    if (!form.location?.trim()) e.location = "Location is required";
    if (!form.developmentType?.trim())
      e.developmentType = "Development type is required";
    if (form.totalUnits && isNaN(Number(form.totalUnits)))
      e.totalUnits = "Must be a number";
    if (form.pricePerUnit && isNaN(Number(form.pricePerUnit)))
      e.pricePerUnit = "Must be a number";
    // add other validations as needed
    return e;
  };

  const submitProject = async (e) => {
    e.preventDefault();

    if (submitting) return; // ⛔ Prevent double clicks
    setSubmitting(true);

    const validation = validateForm(form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      setSubmitting(false);
      return;
    }

    try {
      setErrors({});

      const res = await api.post("/api/projects", form);
      const created = res.data;

      // Add to UI
      setProjects((prev) => [created, ...prev]);

      // Reset
      setForm(defaultForm());
      setPreviewImage("");
      setShowModal(false);

      // OPTIONAL: toast
      toast.success("Project Created Successfully!");
    } catch (err) {
      console.error("Create project error:", err);
      setErrors({
        _global: err.response?.data?.message || "Failed to create project",
      });
    }

    setSubmitting(false);
  };

  return (
    <div className="w-full font-chivo">
      {/* Add Project Modal */}
      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          onSubmit={submitProject}
          form={form}
          updateField={updateField}
          previewImage={previewImage}
          handleImageUpload={handleImageUpload}
          errors={errors}
          submitting={submitting}
        />
      )}

      {/* Add Project Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-golden-300 text-black font-semibold rounded-md hover:bg-[#c48f1e] transition"
        >
          Add Project
        </button>

        <input
          className="hidden sm:block bg-black-600 !border !border-gray-200 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-golden-800"
          placeholder="Search projects..."
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   DEFAULT FORM                             */
/* -------------------------------------------------------------------------- */

function defaultForm() {
  return {
    title: "",
    location: "",
    developmentType: "",
    totalUnits: "",
    pricePerUnit: "",
    budget: "",
    soldPercentage: "",
    status: "Coming Soon",
    roi: "",
    irr: "",
    completionDate: "",
    shortDescription: "",
    image: "",
  };
}

/* -------------------------------------------------------------------------- */
/*                               ADD PROJECT MODAL                             */
/* -------------------------------------------------------------------------- */

function AddProjectModal({
  onClose,
  onSubmit,
  form,
  updateField,
  previewImage,
  handleImageUpload,
  errors = {},
  submitting,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-black-800 text-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-fadeIn">
        {/* HEADER */}
        <div className="sticky top-0 bg-black-900/80 backdrop-blur-md p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-golden-300">
            Add New Project
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-md text-red-400 transition"
          >
            Close
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={onSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto space-y-6"
        >
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-golden-200">Basic Details</h3>

            <Input
              label="Project Title"
              name="title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              error={errors.title}
              className="!border-white"
            />

            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              error={errors.location}
            />

            <Input
              label="Development Type"
              name="developmentType"
              value={form.developmentType}
              onChange={(e) => updateField("developmentType", e.target.value)}
            />

            <Textarea
              label="Short Description"
              name="shortDescription"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              error={errors.shortDescription}
            />
          </div>

          {/* UNITS & PRICING */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-bold text-golden-200">
              Units & Pricing
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Total Units"
                name="totalUnits"
                type="number"
                value={form.totalUnits}
                onChange={(e) => updateField("totalUnits", e.target.value)}
              />

              <Input
                label="Price Per Unit"
                name="pricePerUnit"
                value={form.pricePerUnit}
                onChange={(e) => updateField("pricePerUnit", e.target.value)}
              />
            </div>

            <Input
              label="Project Budget"
              name="budget"
              value={form.budget}
              onChange={(e) => updateField("budget", e.target.value)}
            />
          </div>

          {/* STATUS & KPIs */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-bold text-golden-200">
              Status & Performance
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Status"
                name="status"
                options={["Coming Soon", "Active", "Completed"]}
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              />

              <Input
                label="Sold Percentage"
                name="soldPercentage"
                type="number"
                value={form.soldPercentage}
                onChange={(e) => updateField("soldPercentage", e.target.value)}
              />

              <Input
                label="Completion Date"
                name="completionDate"
                type="date"
                value={form.completionDate}
                onChange={(e) => updateField("completionDate", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ROI (%)"
                name="roi"
                value={form.roi}
                onChange={(e) => updateField("roi", e.target.value)}
              />
              <Input
                label="IRR (%)"
                name="irr"
                value={form.irr}
                onChange={(e) => updateField("irr", e.target.value)}
              />
            </div>
          </div>

          {/* MEDIA TAB — OPTION 3 */}
          <div className="space-y-4 pt-4 border-t border-gray-700 pb-6">
            <h3 className="text-lg font-bold text-golden-200">Project Image</h3>

            {/* Square Thumbnail Preview */}
            <div className="flex flex-col items-start gap-4">
              <div className="w-40 h-40 rounded-lg border border-gray-600 overflow-hidden flex items-center justify-center bg-black-700">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-400 text-xs">No Image</p>
                )}
              </div>

              <label className="px-4 py-2 bg-golden-300 text-black rounded-md cursor-pointer hover:bg-golden-400 transition font-medium">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 bg-black-900/80 backdrop-blur-md p-5 border-t border-gray-700 flex justify-end gap-3">
            {errors._global && (
              <p className="text-xs text-red-400 mr-auto self-center">
                {errors._global}
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 bg-golden-400 text-black font-semibold rounded-md 
    transition shadow-lg flex items-center gap-2 justify-center 
    ${submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-golden-500"}`}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" />
                  Saving...
                </>
              ) : (
                "Save Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               REUSABLE INPUTS                               */
/* -------------------------------------------------------------------------- */

// Shared wrapper base classes for normal / focus / error states
const WRAPPER_BASE = "group/field w-full rounded-md bg-black-700 transition";

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  className = "",
  error, // string | undefined
  placeholder = "",
}) {
  const wrapperBorderClass = error
    ? "border border-red-400"
    : "border border-gray-200";
  const focusClasses = error
    ? "focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-300"
    : "focus-within:border-golden-300 focus-within:ring-2 focus-within:ring-golden-300";

  return (
    <label className="block w-full">
      <p className="text-sm text-gray-300 mb-1">{label}</p>

      <div
        className={`${WRAPPER_BASE} ${wrapperBorderClass} ${focusClasses} ${className}`}
      >
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none px-3 py-2 text-sm text-white"
        />
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </label>
  );
}

function Textarea({ label, name, value, onChange, error, placeholder = "" }) {
  const wrapperBorderClass = error
    ? "border border-red-400"
    : "border border-gray-200";
  const focusClasses = error
    ? "focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-300"
    : "focus-within:border-golden-300 focus-within:ring-2 focus-within:ring-golden-300";

  return (
    <label className="block w-full">
      <p className="text-sm text-gray-300 mb-1">{label}</p>

      <div className={`${WRAPPER_BASE} ${wrapperBorderClass} ${focusClasses}`}>
        <textarea
          name={name}
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none px-3 py-2 text-sm text-white resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </label>
  );
}

function Select({ label, name, options, value, onChange, error }) {
  const wrapperBorderClass = error
    ? "border border-red-400"
    : "border border-gray-200";
  const focusClasses = error
    ? "focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-300"
    : "focus-within:border-golden-300 focus-within:ring-2 focus-within:ring-golden-300";

  return (
    <label className="block w-full">
      <p className="text-sm text-gray-300 mb-1">{label}</p>

      <div className={`${WRAPPER_BASE} ${wrapperBorderClass} ${focusClasses}`}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none px-3 py-2 text-sm text-white"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SKELETON                                   */
/* -------------------------------------------------------------------------- */

function CardSkeleton() {
  return (
    <div className="animate-pulse bg-black-700/40 border border-black-600 rounded-2xl overflow-hidden">
      <div className="w-full h-56 bg-gray-800" />
      <div className="p-6 space-y-4">
        <div className="h-5 w-3/4 bg-gray-800 rounded" />
        <div className="h-4 w-1/2 bg-gray-800 rounded" />
        <div className="h-3 w-full bg-gray-800 rounded" />
        <div className="h-10 w-32 bg-gray-800 rounded" />
        <div className="h-10 w-full bg-gray-800 rounded" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               PROJECT CARD                                 */
/* -------------------------------------------------------------------------- */

function ProjectCard({ project }) {
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
    shortDescription,
  } = project;

  const [fav, setFav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (progressRef.current) {
      requestAnimationFrame(() => {
        progressRef.current.style.width = `${Math.min(
          100,
          Math.max(0, soldPercentage)
        )}%`;
      });
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
      className={`relative bg-black-700/60 border border-black-600 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg transition-all duration-450 transform ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      } group`}
    >
      {/* TOP RIGHT ACTIONS */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <button
          aria-label="favorite"
          onClick={() => setFav((s) => !s)}
          className="p-2 bg-black/50 hover:bg-black/40 rounded-full border border-white/5 transition"
        >
          {fav ? (
            <FaHeart className="text-golden-300" />
          ) : (
            <FaRegHeart className="text-gray-300" />
          )}
        </button>

        {/* 3 DOT MENU */}
        <div className="relative">
          <button
            aria-label="actions"
            onClick={() => setMenuOpen((s) => !s)}
            className="p-2 bg-black/50 hover:bg-black/40 rounded-full border border-white/5 transition"
          >
            <FaEllipsisV className="text-gray-300" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-black-800 border border-gray-800 rounded-md shadow-lg z-30">
              <MenuButton icon={<FaEye />} label="View" />
              <MenuButton icon={<FaEdit />} label="Edit" />
              <MenuButton
                icon={<FaTrash />}
                label="Delete"
                className="text-red-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* IMAGE */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-4 left-4 flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {status}
          </span>

          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-md border border-white/5">
            <strong>{soldPercentage}%</strong> Sold
          </div>
        </div>

        {/* Hover Quick Info */}
        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-64 bg-black/60 backdrop-blur-md border border-gray-700 rounded-md p-3 shadow-lg text-sm text-gray-200">
            <p className="font-semibold mb-1">Quick Info</p>
            <p className="text-gray-300 text-xs">{shortDescription}</p>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-2">
                <FaChartLine /> {roi || "—"} ROI
              </span>
              <span className="flex items-center gap-2">
                <FaCalendarAlt /> {formattedDate || "TBD"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="flex items-center gap-2 text-gray-400 text-sm mt-1">
          <FaMapMarkerAlt className="text-golden-300" /> {location}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-300">
          <SmallInfo label="Units" value={totalUnits} />
          <SmallInfo label="Price / Unit" value={pricePerUnit} />
          <SmallInfo
            className="col-span-2"
            label="Development Type"
            value={developmentType}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge label={`ROI: ${roi || "—"}`} />
          <Badge label={`IRR: ${irr || "—"}`} />
          <Badge label={`Completion: ${formattedDate || "TBD"}`} />
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-400 flex justify-between mb-2">
              <span>Funding Progress</span>
              <span className="font-semibold text-sm">{soldPercentage}%</span>
            </div>

            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-golden-300 transition-[width] duration-700 ease-out"
                style={{ width: "0%" }}
              />
            </div>
          </div>

          <div className="w-36">
            <div className="bg-black rounded-xl px-4 py-2 border border-gray-700 shadow-inner text-right">
              <div className="text-lg font-bold text-golden-300">{budget}</div>
              <div className="text-[10px] text-gray-400">Project Budget</div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-golden-400 text-black font-medium py-2 rounded-md hover:bg-golden-500 transition">
            View Project Details
          </button>

          <button className="px-4 py-2 bg-black/60 border border-gray-700 rounded-md text-gray-200 hover:bg-black/50">
            Quick
          </button>
        </div>
      </div>
    </article>
  );
}

function MenuButton({ icon, label, className = "" }) {
  return (
    <button
      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2 ${className}`}
    >
      {icon} {label}
    </button>
  );
}

function Badge({ label }) {
  return (
    <div className="bg-black/60 border border-gray-700 px-3 py-1 rounded-full text-xs text-gray-200">
      {label}
    </div>
  );
}

function SmallInfo({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-gray-500 uppercase text-[11px] tracking-wide">
        {label}
      </p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
