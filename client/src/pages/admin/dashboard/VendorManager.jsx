import { useState } from "react";
import { X, Plus, Edit, Power } from "lucide-react";
import useSWR from "swr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Replace with your actual API
import { api } from "../../../lib/api.js";

// SWR fetcher function
const fetcher = (url) => api.get(url).then((res) => res.data);

export default function VendorManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    vendorType: "",
    vendorState: "",
    address: "",
    vendorBank: "",
    accountNumber: "",
    vendorAccountName: "",
  });

  // SWR for data fetching with auto-revalidation
  const { data, error, isLoading, mutate } = useSWR("/api/vendors", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const vendors = data?.vendors || [];

  const openCreate = () => {
    setIsEditMode(false);
    setEditingId(null);
    setForm({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      vendorType: "",
      vendorState: "",
      address: "",
      vendorBank: "",
      accountNumber: "",
      vendorAccountName: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (vendor) => {
    setIsEditMode(true);
    setEditingId(vendor._id);
    setForm({
      name: vendor.name || "",
      contactPerson: vendor.contactPerson || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      vendorType: vendor.vendorType || "",
      vendorState: vendor.vendorState || "",
      address: vendor.address || "",
      vendorBank: vendor.vendorBank || "",
      accountNumber: vendor.accountNumber || "",
      vendorAccountName: vendor.vendorAccountName || "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Check all required fields
    if (!form.name.trim()) {
      toast.error("Vendor name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.vendorType) {
      toast.error("Vendor type is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email address is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.vendorState) {
      toast.error("Vendor state is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.address.trim()) {
      toast.error("Full address is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.contactPerson.trim()) {
      toast.error("Contact person name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.vendorBank) {
      toast.error("Bank name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.accountNumber.trim()) {
      toast.error("Account number is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!form.vendorAccountName.trim()) {
      toast.error("Account name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  };

  const submit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await api.put(`/api/vendors/${editingId}`, form);
        toast.success("✅ Vendor updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        await api.post("/api/vendors", form);
        toast.success("✅ Vendor added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      // Revalidate the data
      mutate();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(
        `❌ ${err.response?.data?.message || "Failed to save vendor"}`,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/api/vendors/${id}/toggle-status`);
      toast.success("✅ Vendor status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      mutate();
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("❌ Failed to update vendor status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black-900 p-8 font-chivo">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#171717",
          color: "#F1E2D0",
          border: "1px solid #5D3F1C",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        }}
        progressStyle={{
          background: "linear-gradient(to right, #94662A, #C99E75)",
        }}
      />

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-golden-300 font-cinzel">
          Vendors
        </h1>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-golden-600 to-golden-500 text-black-900 px-5 py-3 rounded-lg flex items-center gap-2 font-semibold hover:from-golden-500 hover:to-golden-400 transition-all shadow-lg"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      <div className="bg-black-800 rounded-xl border border-golden-900/30 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-8 text-center text-golden-200">
            Loading vendors...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">
            Failed to load vendors. Please try again.
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-8 text-center text-black-300">
            No vendors found. Add your first vendor!
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-black-700">
              <tr>
                <th className="px-6 py-4 text-left text-golden-200 font-semibold">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-golden-200 font-semibold">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-golden-200 font-semibold">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-golden-200 font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-golden-200 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-golden-200 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr
                  key={v._id}
                  className="border-b border-black-700 hover:bg-black-700/50 transition-colors"
                >
                  <td className="px-6 py-4 text-golden-100">{v.name}</td>
                  <td className="px-6 py-4 text-black-300">{v.vendorType}</td>
                  <td className="px-6 py-4 text-black-300">{v.phone}</td>
                  <td className="px-6 py-4 text-black-300">{v.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        v.isActive
                          ? "bg-golden-900/50 text-golden-300"
                          : "bg-black-600 text-black-300"
                      }`}
                    >
                      {v.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => toggleStatus(v._id)}
                      className="p-2 bg-black-700 rounded-lg hover:bg-black-600 text-golden-300 transition-colors"
                      title="Toggle Status"
                    >
                      <Power size={16} />
                    </button>
                    <button
                      onClick={() => openEdit(v)}
                      className="p-2 bg-golden-900/20 rounded-lg hover:bg-golden-900/30 text-golden-300 transition-colors"
                      title="Edit Vendor"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-black-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-golden-900/30 animate-slideUp shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-golden-300 font-bold font-cinzel">
                {isEditMode ? "Edit Vendor" : "Add Vendor"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-black-300 hover:text-golden-300 transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Vendor Name */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Vendor Name or Company Name"
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 placeholder-black-400 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Vendor Type */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Vendor Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="vendorType"
                  value={form.vendorType}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                >
                  <option value="">Select Vendor Type</option>
                  <option value="Materials">Materials</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Services">Services</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Vendor Email Address"
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 placeholder-black-400 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter Vendor Phone Number"
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 placeholder-black-400 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="vendorState"
                  value={form.vendorState}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                >
                  <option value="">Select Vendor State</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Owerri">Owerri</option>
                  <option value="Onitsha">Onitsha</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter Vendor Full Address"
                  rows={3}
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 placeholder-black-400 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 resize-none transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  placeholder="Enter Contact Person Full Name"
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 placeholder-black-400 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Bank */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Bank <span className="text-red-500">*</span>
                </label>
                <select
                  name="vendorBank"
                  value={form.vendorBank}
                  onChange={handleChange}
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                >
                  <option value="">Select Vendor Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="UBA">UBA</option>
                  <option value="Wema Bank">Wema Bank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="GTBank">GTBank</option>
                  <option value="First Bank">First Bank</option>
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter Vendor Account Number"
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 placeholder-black-400 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-golden-200 mb-2 text-sm font-medium">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vendorAccountName"
                  value={form.vendorAccountName}
                  onChange={handleChange}
                  placeholder="Enter Vendor Account Name"
                  className="w-full py-3 px-4 rounded-lg bg-black-700 border border-black-600 text-golden-100 placeholder-black-400 focus:outline-none focus:border-golden-500 focus:ring-2 focus:ring-golden-500/20 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-golden-600 to-golden-500 text-black-900 py-3 rounded-lg font-semibold mt-6 hover:from-golden-500 hover:to-golden-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Vendor"
                : "Save Vendor"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
