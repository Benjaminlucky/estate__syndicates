import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaFileContract,
  FaDownload,
  FaFilePdf,
  FaFileImage,
} from "react-icons/fa";
import { api } from "../../../lib/api";

export default function Documents() {
  const token = localStorage.getItem("token");

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ["my-investments"],
    queryFn: async () =>
      (
        await api.get("/api/investments/my", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data?.investments ?? [],
    staleTime: 1000 * 60 * 5,
  });

  // Collect any invoice/document URLs from associated expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ["investor-expenses"],
    queryFn: async () => (await api.get("/api/expenses")).data?.expenses ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const investedIds = new Set(
    investments.map((inv) => inv.project?._id).filter(Boolean),
  );
  const projectExpenses = expenses.filter((ex) =>
    investedIds.has(ex.project?._id ?? ex.project),
  );
  const invoiceDocs = projectExpenses.filter((ex) => ex.invoiceUrl);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold uppercase mb-1">Documents</h1>
        <p className="font-chivo text-black-400 text-sm">
          Contracts, invoices, and reports for your investments
        </p>
      </motion.div>

      {/* Investment contracts */}
      <div className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-black-700">
          <p className="font-bold uppercase text-sm">Investment Records</p>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-14 bg-black-700 rounded-xl"
              />
            ))}
          </div>
        ) : investments.length === 0 ? (
          <div className="py-16 text-center">
            <FaFileContract className="text-black-600 text-4xl mx-auto mb-3" />
            <p className="font-chivo text-black-500 text-sm">
              No investment documents yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black-800">
            {investments.map((inv) => (
              <div
                key={inv._id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-black-700/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-golden-900/30 flex items-center justify-center flex-shrink-0">
                  <FaFileContract className="text-golden-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">
                    {inv.project?.title} — Investment Record
                  </p>
                  <p className="font-chivo text-black-500 text-xs">
                    {inv.units} unit{inv.units !== 1 ? "s" : ""} · ₦
                    {Number(inv.amount).toLocaleString("en-NG")} ·{" "}
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${inv.status === "active" ? "bg-green-900/40 text-green-400" : "bg-black-700 text-black-400"}`}
                >
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice documents */}
      {invoiceDocs.length > 0 && (
        <div className="bg-black-800 border border-black-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-black-700">
            <p className="font-bold uppercase text-sm">
              Project Invoices & Receipts
            </p>
          </div>
          <div className="divide-y divide-black-800">
            {invoiceDocs.map((ex) => {
              const isPdf = ex.invoiceUrl?.toLowerCase().includes(".pdf");
              return (
                <div
                  key={ex._id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-black-700/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-black-700 flex items-center justify-center flex-shrink-0">
                    {isPdf ? (
                      <FaFilePdf className="text-red-400" />
                    ) : (
                      <FaFileImage className="text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{ex.title}</p>
                    <p className="font-chivo text-black-500 text-xs">
                      {ex.category} · {ex.project?.title}
                    </p>
                  </div>
                  <a
                    href={ex.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-black-700 hover:bg-golden-900/40 text-black-400 hover:text-golden-300 transition-colors"
                    aria-label="Download"
                  >
                    <FaDownload className="text-sm" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-golden-900/20 border border-golden-800/40 rounded-xl p-5">
        <p className="font-bold text-sm uppercase mb-2 text-golden-300">
          Need a formal contract?
        </p>
        <p className="font-chivo text-black-400 text-sm">
          Formal investment agreements and certificates of ownership are issued
          upon request. Contact our team via the Support page.
        </p>
      </div>
    </div>
  );
}
