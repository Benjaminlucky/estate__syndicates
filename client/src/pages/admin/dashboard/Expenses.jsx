"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { api } from "../../../lib/api.js";

const CATEGORY_OPTIONS = [
  "Development",
  "Maintenance",
  "Operational",
  "Legal",
  "Tax",
];
const PAYMENT_STATUS_OPTIONS = ["Paid", "Unpaid", "Partially Paid"];
const PAYMENT_METHOD_OPTIONS = ["Bank Transfer", "Cash", "Cheque", "Online"];

export default function Expenses() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm());
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  /* ---------------------- DATA FETCHING ------------------------ */

  const { data: expenses = [], isLoading: loadingExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => (await api.get("/api/expenses")).data.expenses,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await api.get("/api/projects")).data.projects,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => (await api.get("/api/vendors")).data.vendors,
  });

  /* ----------------------- COMPUTATIONS ----------------------- */

  const filteredExpenses = useMemo(() => {
    return expenses.filter((ex) => {
      const matchesSearch = ex.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" || ex.paymentStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [expenses, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = expenses.reduce(
      (acc, curr) => acc + (Number(curr.amount) || 0),
      0
    );
    const paid = expenses
      .filter((e) => e.paymentStatus === "Paid")
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return { total, paid, pending: total - paid };
  }, [expenses]);

  /* ----------------------------- MUTATION --------------------------------- */

  const mutation = useMutation({
    mutationFn: async (formData) =>
      (await api.post("/api/expenses", formData)).data,
    onSuccess: () => {
      toast.success("Expense recorded successfully");
      queryClient.invalidateQueries(["expenses"]);
      setForm(defaultForm());
      setShowModal(false);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to save"),
    onSettled: () => setSubmitting(false),
  });

  const submitExpense = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData();

    // Append all form fields except the invoice file first
    Object.entries(form).forEach(([k, v]) => {
      if (k !== "invoice" && v !== "" && v !== null) {
        fd.append(k, v);
      }
    });

    // Append the file with the key "invoice" to match backend middleware
    if (form.invoice) {
      fd.append("invoice", form.invoice);
    }

    mutation.mutate(fd);
  };

  return (
    <div className="w-full font-chivo p-6 bg-black min-h-screen text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-golden-300">
            Expense Management
          </h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">
            Financial Overview
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-golden-500 text-black font-bold rounded-lg hover:bg-golden-400 transition-all shadow-lg active:scale-95"
        >
          + Record New Expense
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          title="Total Expenses"
          amount={stats.total}
          color="text-white"
          border="border-golden-900/30"
        />
        <SummaryCard
          title="Total Paid"
          amount={stats.paid}
          color="text-green-400"
          border="border-green-900/20"
        />
        <SummaryCard
          title="Pending Payment"
          amount={stats.pending}
          color="text-red-400"
          border="border-red-900/20"
        />
      </div>

      {/* FILTERS */}
      <div className="bg-black-800 p-4 rounded-xl border border-golden-900/20 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full bg-black border border-golden-900/50 rounded-lg px-4 py-2 text-sm focus:border-golden-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["All", ...PAYMENT_STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                filterStatus === status
                  ? "bg-golden-500 text-black border-golden-500"
                  : "border-golden-900/30 text-gray-400 hover:border-golden-500"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* EXPENSE TABLE */}
      <div className="bg-black-900 border border-golden-900/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black-800 border-b border-golden-900/30">
              <tr>
                <th className="p-4 text-xs font-bold text-golden-500 uppercase tracking-widest">
                  Title
                </th>
                <th className="p-4 text-xs font-bold text-golden-500 uppercase tracking-widest">
                  Project
                </th>
                <th className="p-4 text-xs font-bold text-golden-500 uppercase tracking-widest">
                  Amount
                </th>
                <th className="p-4 text-xs font-bold text-golden-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-golden-500 uppercase tracking-widest text-right">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-golden-900/10">
              {loadingExpenses ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <Spinner color="warning" />
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((ex) => (
                  <tr
                    key={ex._id}
                    className="hover:bg-golden-900/5 transition-colors group"
                  >
                    <td className="p-4 font-medium">{ex.title}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {ex.project?.title || "N/A"}
                    </td>
                    <td className="p-4 font-bold text-golden-300">
                      ₦{Number(ex.amount).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={ex.paymentStatus} />
                    </td>
                    <td className="p-4 text-right text-gray-500 text-sm">
                      {new Date(ex.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ExpenseModal
          form={form}
          setForm={setForm}
          projects={projects}
          vendors={vendors}
          submitting={submitting}
          onClose={() => setShowModal(false)}
          onSubmit={submitExpense}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UI SUB-COMPONENTS                              */
/* -------------------------------------------------------------------------- */

function ExpenseModal({
  form,
  setForm,
  projects,
  vendors,
  submitting,
  onClose,
  onSubmit,
}) {
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // AUTO-COMMA FORMATTING LOGIC
  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    update("amount", rawValue); // Store pure number in state
  };

  const displayAmount = form.amount
    ? "₦" + Number(form.amount).toLocaleString()
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-black-900 border border-golden-800/30 text-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-golden-900/50 flex justify-between items-center bg-black-800">
          <h2 className="text-2xl font-cinzel font-bold text-golden-300">
            Record Expense
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-golden-300 hover:bg-white/10 rounded-full"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Expense Title"
                value={form.title}
                placeholder="e.g., Purchase of Building Materials"
                onChange={(e) => update("title", e.target.value)}
                required
              />
            </div>
            <Input
              label="Amount"
              type="text"
              placeholder="₦0"
              value={displayAmount}
              onChange={handleAmountChange}
              required
            />
            <Select
              label="Project"
              value={form.project}
              onChange={(e) => update("project", e.target.value)}
              options={projects.map((p) => ({ label: p.title, value: p._id }))}
              required
            />
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              options={CATEGORY_OPTIONS}
            />
            <Select
              label="Vendor"
              value={form.vendor}
              onChange={(e) => update("vendor", e.target.value)}
              options={vendors.map((v) => ({ label: v.name, value: v._id }))}
              allowEmpty
            />
            <Select
              label="Status"
              value={form.paymentStatus}
              onChange={(e) => update("paymentStatus", e.target.value)}
              options={PAYMENT_STATUS_OPTIONS}
            />
            <Select
              label="Method"
              value={form.paymentMethod}
              onChange={(e) => update("paymentMethod", e.target.value)}
              options={PAYMENT_METHOD_OPTIONS}
            />
          </div>
          <Textarea
            label="Remarks"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
          <FileInput
            label="Invoice Attachment"
            onChange={(f) => update("invoice", f)}
          />

          <div className="flex justify-end gap-4 pt-6 border-t border-golden-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-10 py-2.5 bg-golden-500 hover:bg-golden-400 text-black font-bold rounded-lg flex items-center gap-2"
            >
              {submitting ? <Spinner size="sm" /> : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* REUSABLE UI ELEMENTS                           */
/* -------------------------------------------------------------------------- */

function SummaryCard({ title, amount, color, border }) {
  return (
    <div className={`bg-black-800 p-6 rounded-2xl border ${border} shadow-xl`}>
      <p className="text-xs font-bold text-golden-500 uppercase tracking-widest mb-2">
        {title}
      </p>
      <p className={`text-3xl font-cinzel font-bold ${color}`}>
        ₦{amount.toLocaleString()}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Paid: "bg-green-500/10 text-green-400 border-green-500/20",
    Unpaid: "bg-red-500/10 text-red-400 border-red-500/20",
    "Partially Paid": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function defaultForm() {
  return {
    title: "",
    amount: "",
    project: "",
    category: "Development",
    vendor: "",
    paymentStatus: "Unpaid",
    paymentMethod: "Bank Transfer",
    notes: "",
    invoice: null,
  };
}

const inputStyles =
  "w-full bg-black-800 border-2 border-golden-900/30 rounded-xl px-4 py-3 text-white focus:border-golden-400 outline-none transition-all";

function Input({ label, ...props }) {
  return (
    <label className="block">
      <p className="text-[10px] font-bold uppercase tracking-widest text-golden-500 mb-2">
        {label}
      </p>
      <input {...props} className={inputStyles} />
    </label>
  );
}

function Select({ label, options, allowEmpty, ...props }) {
  return (
    <label className="block">
      <p className="text-[10px] font-bold uppercase tracking-widest text-golden-500 mb-2">
        {label}
      </p>
      <select {...props} className={inputStyles}>
        {allowEmpty && <option value="">Select...</option>}
        {options.map((o) => (
          <option key={o.value || o} value={o.value || o} className="bg-black">
            {o.label || o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label className="block">
      <p className="text-[10px] font-bold uppercase tracking-widest text-golden-500 mb-2">
        {label}
      </p>
      <textarea {...props} className={`${inputStyles} resize-none`} rows={3} />
    </label>
  );
}

function FileInput({ label, onChange }) {
  return (
    <label className="block">
      <p className="text-[10px] font-bold uppercase tracking-widest text-golden-500 mb-2">
        {label}
      </p>
      <div className="border-2 border-dashed border-golden-900/30 rounded-xl p-4 text-center hover:border-golden-400 cursor-pointer relative">
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => onChange(e.target.files?.[0])}
        />
        <p className="text-xs text-gray-500">Attach Document (PDF, Image)</p>
      </div>
    </label>
  );
}
