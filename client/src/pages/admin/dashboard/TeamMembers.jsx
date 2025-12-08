import { useEffect, useState } from "react";
import { X, Plus, Eye, Edit, Power } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Assuming you have this API utility
const API_URL = "http://localhost:5000/api"; // Change to your backend URL

const api = {
  get: async (url, options) => {
    const response = await fetch(`${API_URL}${url}`, options);
    return response.json();
  },
  post: async (url, data, options) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  put: async (url, data, options) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  patch: async (url, data, options) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export default function TeamMemberManager() {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    employmentType: "Contract",
    assignedProjects: [],
  });

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const token = localStorage.getItem("adminToken");

        const res = await api.get("/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.success) {
          setProjects(res.projects || []);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        toast.error("Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch team members from backend
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoadingMembers(true);
      const token = localStorage.getItem("adminToken");

      const res = await api.get("/team-members", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.success) {
        setTeamMembers(res.teamMembers || []);
      }
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      toast.error("Failed to load team members");
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleProjectSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setForm({ ...form, assignedProjects: selectedOptions });
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingMemberId(null);
    setForm({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      employmentType: "Contract",
      assignedProjects: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setIsEditMode(true);
    setEditingMemberId(member._id);
    setForm({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone || "",
      role: member.role,
      employmentType: member.employmentType,
      assignedProjects: member.assignedProjects.map((p) => p._id || p),
    });
    setIsModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      if (isEditMode) {
        // Update existing member
        const res = await api.put(`/team-members/${editingMemberId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.success) {
          toast.success("Team member updated successfully!");
          fetchTeamMembers();
          setIsModalOpen(false);
        } else {
          toast.error(res.message || "Failed to update team member");
        }
      } else {
        // Create new member
        const res = await api.post("/team-members", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.success) {
          toast.success(
            "Team member created! Login credentials sent to their email."
          );
          fetchTeamMembers();
          setIsModalOpen(false);
        } else {
          toast.error(res.message || "Failed to create team member");
        }
      }

      // Reset form
      setForm({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        employmentType: "Contract",
        assignedProjects: [],
      });
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  const toggleMemberStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await api.patch(
        `/team-members/${id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.success) {
        toast.success(res.message);
        fetchTeamMembers();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Toggle status failed:", err);
      toast.error("Failed to update status");
    }
  };

  const getProjectNames = (projectIds) => {
    if (!Array.isArray(projectIds)) return "None";

    return (
      projectIds
        .map((project) => {
          if (typeof project === "object" && project.title) {
            return project.title;
          }
          const found = projects.find((p) => p._id === project);
          return found?.title;
        })
        .filter(Boolean)
        .join(", ") || "None"
    );
  };

  return (
    <div className="min-h-screen bg-black-900 p-8 font-chivo">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-golden-300 font-cinzel">
            Team Members
          </h1>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-golden-600 to-golden-500 hover:from-golden-700 hover:to-golden-600 text-black-900 px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus size={20} />
            Add Team Member
          </button>
        </div>

        {/* Loading State */}
        {loadingMembers ? (
          <div className="bg-black-800 rounded-xl shadow-2xl p-8 text-center border border-golden-900/30">
            <p className="text-golden-200">Loading team members...</p>
          </div>
        ) : (
          /* Team Members Table */
          <div className="bg-black-800 rounded-xl shadow-2xl overflow-hidden border border-golden-900/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black-700 border-b border-golden-900/30">
                    <th className="text-left py-4 px-6 text-golden-200 font-semibold">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 text-golden-200 font-semibold">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-golden-200 font-semibold">
                      Role
                    </th>
                    <th className="text-left py-4 px-6 text-golden-200 font-semibold">
                      Employment
                    </th>
                    <th className="text-left py-4 px-6 text-golden-200 font-semibold">
                      Projects
                    </th>
                    <th className="text-left py-4 px-6 text-golden-200 font-semibold">
                      Status
                    </th>
                    <th className="text-center py-4 px-6 text-golden-200 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-8 px-6 text-center text-black-400"
                      >
                        No team members yet. Add your first team member to get
                        started.
                      </td>
                    </tr>
                  ) : (
                    teamMembers.map((member) => (
                      <tr
                        key={member._id}
                        className="border-b border-black-700 hover:bg-black-700/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-golden-100">
                          {member.fullName}
                        </td>
                        <td className="py-4 px-6 text-black-300">
                          {member.email}
                        </td>
                        <td className="py-4 px-6 text-golden-100">
                          {member.role}
                        </td>
                        <td className="py-4 px-6 text-black-300">
                          {member.employmentType}
                        </td>
                        <td className="py-4 px-6 text-black-300 text-sm">
                          {getProjectNames(member.assignedProjects)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              member.isActive
                                ? "bg-golden-900/50 text-golden-300 border border-golden-700/50"
                                : "bg-black-600 text-black-300 border border-black-500"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleMemberStatus(member._id)}
                              className={`p-2 rounded-lg transition-all border ${
                                member.isActive
                                  ? "bg-black-600 hover:bg-black-500 text-black-300 border-black-500"
                                  : "bg-golden-900/20 hover:bg-golden-900/30 text-golden-400 border-golden-800"
                              }`}
                              title={
                                member.isActive ? "Deactivate" : "Activate"
                              }
                            >
                              <Power size={18} />
                            </button>
                            <button
                              onClick={() =>
                                toast.info("View feature coming soon")
                              }
                              className="p-2 bg-golden-900/20 hover:bg-golden-900/30 text-golden-400 rounded-lg transition-all border border-golden-800"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => openEditModal(member)}
                              className="p-2 bg-golden-900/20 hover:bg-golden-900/30 text-golden-400 rounded-lg transition-all border border-golden-800"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-golden-900/30">
              <div className="sticky top-0 bg-black-700 px-6 py-4 flex items-center justify-between border-b border-golden-900/30">
                <h2 className="text-2xl font-bold text-golden-300 font-cinzel">
                  {isEditMode ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-black-400 hover:text-golden-300 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-golden-200 mb-2 font-medium">
                    Full Name *
                  </label>
                  <input
                    placeholder="Enter full name"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className="bg-black-900 border border-golden-900/30 text-golden-100 placeholder-black-400 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-golden-200 mb-2 font-medium">
                    Email *
                  </label>
                  <input
                    placeholder="email@example.com"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="bg-black-900 border border-golden-900/30 text-golden-100 placeholder-black-400 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent transition-all"
                    required
                    disabled={isEditMode}
                  />
                  {!isEditMode && (
                    <p className="text-xs text-black-400 mt-1">
                      Login credentials will be automatically sent to this email
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-golden-200 mb-2 font-medium">
                    Phone
                  </label>
                  <input
                    placeholder="+1234567890"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="bg-black-900 border border-golden-900/30 text-golden-100 placeholder-black-400 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-golden-200 mb-2 font-medium">
                    Role/Category *
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="bg-black-900 border border-golden-900/30 text-golden-100 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Painter">Painter</option>
                    <option value="Welder">Welder</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Architect">Architect</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Project Manager">Project Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-golden-200 mb-2 font-medium">
                    Employment Type
                  </label>
                  <select
                    value={form.employmentType}
                    onChange={(e) =>
                      setForm({ ...form, employmentType: e.target.value })
                    }
                    className="bg-black-900 border border-golden-900/30 text-golden-100 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent transition-all"
                  >
                    <option value="Contract">Contract</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-golden-200 mb-2 font-medium">
                    Assign to Projects
                  </label>
                  <select
                    multiple
                    value={form.assignedProjects}
                    onChange={handleProjectSelect}
                    className="bg-black-900 border border-golden-900/30 text-golden-100 p-3 w-full rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent transition-all"
                  >
                    {loadingProjects && <option>Loading projects...</option>}
                    {!loadingProjects && projects.length === 0 && (
                      <option>No projects available</option>
                    )}
                    {!loadingProjects &&
                      projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.title}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-black-400 mt-2">
                    Hold CTRL (Windows) or CMD (Mac) to select multiple projects
                  </p>
                </div>

                {!isEditMode && (
                  <div className="bg-golden-900/10 border border-golden-900/30 rounded-lg p-4">
                    <p className="text-sm text-golden-200">
                      <strong className="text-golden-300">Note:</strong> Upon
                      creation, an automated email with login credentials will
                      be sent to the team member. They can change their password
                      after first login.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={submit}
                    className="flex-1 bg-gradient-to-r from-golden-600 to-golden-500 hover:from-golden-700 hover:to-golden-600 text-black-900 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    {isEditMode
                      ? "Update Member"
                      : "Create Member & Send Invite"}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-black-700 hover:bg-black-600 text-golden-200 rounded-lg font-semibold transition-all border border-golden-900/30"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
