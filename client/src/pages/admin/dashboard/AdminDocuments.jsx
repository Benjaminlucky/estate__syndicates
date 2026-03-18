import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaFilePdf,
  FaImage,
  FaDownload,
  FaSearch,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { api } from "../../../lib/api.js";
import { adminAuthHeader } from "../../../hooks/useAdmin.js";

function FileIcon({ url }) {
  if (!url) return <FaFileAlt className="text-black-500 text-xl" />;
  if (url.match(/\.pdf/i))
    return <FaFilePdf className="text-red-400 text-xl" />;
  if (url.match(/\.(jpg|jpeg|png|webp)/i))
    return <FaImage className="text-blue-400 text-xl" />;
  return <FaFileAlt className="text-golden-400 text-xl" />;
}

export default function AdminDocuments() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["admin_expenses_docs"],
    queryFn: async () =>
      (await api.get("/api/expenses", { headers: adminAuthHeader() })).data
        ?.expenses ?? [],
    staleTime: 1000 * 60 * 5,
  });

  /* Only expenses that have an attached invoice */
  const docsExpenses = useMemo(
    () => expenses.filter((e) => e.invoiceUrl),
    [expenses],
  );

  const filtered = useMemo(() => {
    let list = docsExpenses;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.project?.title?.toLowerCase().includes(q),
      );
    }
    if (filter !== "all") {
      list = list.filter((e) => e.category === filter);
    }
    return list;
  }, [docsExpenses, search, filter]);

  const categories = [
    ...new Set(expenses.map((e) => e.category).filter(Boolean)),
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-chivo">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide font-cinzel text-golden-300">
          Document Management
        </h1>
        <p className="text-black-400 text-sm mt-1">
          Invoice and document attachments from all recorded expenses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-black-800 border border-black-700 rounded-2xl p-5">
          <p className="text-black-400 text-xs uppercase tracking-wide mb-1">
            Total Documents
          </p>
          <p className="text-2xl font-bold text-white">{docsExpenses.length}</p>
        </div>
        <div className="bg-black-800 border border-black-700 rounded-2xl p-5">
          <p className="text-black-400 text-xs uppercase tracking-wide mb-1">
            Total Expenses
          </p>
          <p className="text-2xl font-bold text-golden-300">
            {expenses.length}
          </p>
        </div>
        <div className="bg-black-800 border border-black-700 rounded-2xl p-5">
          <p className="text-black-400 text-xs uppercase tracking-wide mb-1">
            Without Attachment
          </p>
          <p className="text-2xl font-bold text-red-400">
            {expenses.length - docsExpenses.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black-500 text-xs" />
          <input
            type="text"
            placeholder="Search by title or project…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black-800 border border-black-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-golden-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-colors ${
                filter === c
                  ? "bg-golden-500 text-white border-golden-500"
                  : "border-black-700 text-black-400 hover:border-golden-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner color="warning" size="xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-black-800 border border-black-700 rounded-2xl">
          <FaFileAlt className="text-black-700 text-5xl mx-auto mb-4" />
          <p className="text-black-500 text-sm">No documents found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e, i) => (
            <motion.div
              key={e._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-black-800 border border-black-700 rounded-2xl p-5 flex items-start gap-4 group hover:border-golden-700 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-black-900 border border-black-700 flex items-center justify-center flex-shrink-0">
                <FileIcon url={e.invoiceUrl} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{e.title}</p>
                <p className="text-black-500 text-xs mt-0.5">
                  {e.project?.title ?? "—"} · {e.category}
                </p>
                <p className="text-black-600 text-xs mt-0.5">
                  {new Date(e.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <a
                  href={e.invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open"
                  className="p-1.5 rounded-lg bg-black-700 hover:bg-black-600 text-black-300 hover:text-white transition-colors"
                >
                  <FaExternalLinkAlt className="text-xs" />
                </a>
                <a
                  href={e.invoiceUrl}
                  download
                  title="Download"
                  className="p-1.5 rounded-lg bg-black-700 hover:bg-black-600 text-black-300 hover:text-white transition-colors"
                >
                  <FaDownload className="text-xs" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
