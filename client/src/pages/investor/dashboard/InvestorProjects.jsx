import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProjectCard from "../../../components/ProjectCard";
import { api } from "../../../lib/api.js";

export default function InvestorProjects() {
  const fetchProjects = async () => {
    const res = await api.get("/api/projects");
    return res.data?.projects ?? [];
  };

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["investor_projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 10, // 10 mins
    cacheTime: 1000 * 60 * 30, // 30 mins
  });

  if (isError) {
    console.error("Error loading projects:", error);
    toast.error("Failed to load investment projects.");
  }

  return (
    <div className="w-full font-chivo p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Investment Projects
      </h1>

      {isLoading ? (
        <SkeletonGrid />
      ) : projects.length === 0 ? (
        <p className="text-gray-400 text-center text-lg py-20">
          No projects available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------
   🔶 Skeleton Loader Grid
-------------------------- */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* -------------------------
   🔶 Individual Skeleton Card
-------------------------- */
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-black-700/60 border border-black-600 rounded-2xl p-4">
      <div className="h-40 bg-gray-700 rounded-lg mb-4"></div>

      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>

      <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-5/6 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-2/3 mb-6"></div>

      <div className="h-10 bg-gray-700 rounded-lg"></div>
    </div>
  );
}
