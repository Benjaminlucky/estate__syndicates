import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaUserShield, FaEdit, FaTrash, FaLock } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { api } from "../../../lib/api.js";
import {
  adminAuthHeader,
  useAdminRole,
  isSuperAdmin,
} from "../../../hooks/useAdmin.js";

const ROLES = ["super_admin", "manager", "viewer"];

const ROLE_INFO = {
  super_admin: {
    label: "Super Admin",
    desc: "Full access — can manage admins, approve investments, all actions.",
    cls: "bg-golden-500/10 text-golden-300 border-golden-700",
  },
  manager: {
    label: "Manager",
    desc: "Can manage projects, approve/reject investments, record payouts, manage team.",
    cls: "bg-blue-500/10 text-blue-400 border-blue-700",
  },
  viewer: {
    label: "Viewer",
    desc: "Read-only access across all sections. Cannot create, edit, or delete.",
    cls: "bg-black-600/50 text-black-300 border-black-600",
  },
};

/* ─── Role badge ────────────────────────────────────────────────── */
function RoleBadge({ role }) {
  const info = ROLE_INFO[role] ?? ROLE_INFO.viewer;
  return (
    <span
      className={`font-chivo text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${info.cls}`}
    >
      {info.label}
    </span>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function AdminUsers() {
  const role = useAdminRole();
  const superAdmin = isSuperAdmin(role);
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [newRole, setNewRole] = useState("");

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () =>
      (await api.get("/api/admin/admins", { headers: adminAuthHeader() })).data
        ?.admins ?? [],
    staleTime: 1000 * 60 * 5,
    enabled: superAdmin,
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role: r }) =>
      (
        await api.patch(
          `/api/admin/admins/${id}`,
          { role: r },
          { headers: adminAuthHeader() },
        )
      ).data,
    onSuccess: () => {
      toast.success("Role updated.");
      queryClient.invalidateQueries(["admin_users"]);
      setEditingId(null);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update role"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      (
        await api.delete(`/api/admin/admins/${id}`, {
          headers: adminAuthHeader(),
        })
      ).data,
    onSuccess: () => {
      toast.success("Admin removed.");
      queryClient.invalidateQueries(["admin_users"]);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed"),
  });

  /* Decode current admin's own ID to prevent self-actions */
  const myId = (() => {
    try {
      const token = localStorage.getItem("adminToken");
      return token ? JSON.parse(atob(token.split(".")[1])).id : null;
    } catch {
      return null;
    }
  })();

  if (!superAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center">
        <FaLock className="text-black-600 text-5xl" />
        <h2 className="font-bold text-xl uppercase">Access Restricted</h2>
        <p className="font-chivo text-black-400 text-sm max-w-sm">
          Admin user management is only available to Super Admins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[900px] mx-auto font-chivo">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide font-cinzel text-golden-300">
          Admin Users
        </h1>
        <p className="text-black-400 text-sm mt-1">
          Manage admin accounts and role permissions. Super admin only.
        </p>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(ROLE_INFO).map(([key, info]) => (
          <div
            key={key}
            className="bg-black-800 border border-black-700 rounded-xl p-4"
          >
            <RoleBadge role={key} />
            <p className="font-chivo text-black-400 text-xs mt-2 leading-relaxed">
              {info.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Admin table */}
      <div className="bg-black-900 border border-black-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-black-700 flex items-center justify-between">
          <p className="font-bold uppercase text-sm text-golden-300">
            {admins.length} Admin{admins.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2 font-chivo text-black-500 text-xs">
            <FaUserShield className="text-xs" />
            <span>Role changes take effect on next login</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner color="warning" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-center py-12 text-black-500 text-sm">
            No admins found.
          </p>
        ) : (
          <div className="divide-y divide-black-800">
            {admins.map((admin) => {
              const isMe = admin._id === myId;
              const isEditing = editingId === admin._id;

              return (
                <motion.div
                  key={admin._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-black-800/30 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-golden-800 flex items-center justify-center font-bold text-sm text-golden-200 flex-shrink-0 uppercase">
                    {admin.firstName?.[0]}
                    {admin.lastName?.[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm">
                        {admin.firstName} {admin.lastName}
                        {isMe && (
                          <span className="font-chivo text-black-500 text-xs ml-1">
                            (you)
                          </span>
                        )}
                      </p>
                      <RoleBadge role={admin.role} />
                    </div>
                    <p className="text-black-500 text-xs mt-0.5">
                      {admin.email}
                    </p>
                    <p className="text-black-600 text-xs">
                      Joined {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Role editor */}
                  {!isMe && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {isEditing ? (
                        <>
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="bg-black-800 border border-black-700 rounded-lg px-3 py-1.5 font-chivo text-sm focus:outline-none focus:border-golden-500"
                          >
                            {ROLES.map((r) => (
                              <option
                                key={r}
                                value={r}
                                className="bg-black-800"
                              >
                                {ROLE_INFO[r].label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              updateRoleMutation.mutate({
                                id: admin._id,
                                role: newRole,
                              })
                            }
                            disabled={updateRoleMutation.isPending || !newRole}
                            className="px-3 py-1.5 bg-golden-500 hover:bg-golden-400 text-white font-bold text-xs uppercase rounded-lg transition-colors disabled:opacity-50"
                          >
                            {updateRoleMutation.isPending ? (
                              <Spinner size="sm" />
                            ) : (
                              "Save"
                            )}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 border border-black-600 text-black-300 font-bold text-xs uppercase rounded-lg hover:bg-black-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(admin._id);
                              setNewRole(admin.role);
                            }}
                            title="Edit role"
                            className="p-1.5 rounded-lg bg-black-700 hover:bg-black-600 text-black-300 hover:text-white transition-colors"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Remove ${admin.firstName} ${admin.lastName}?`,
                                )
                              ) {
                                deleteMutation.mutate(admin._id);
                              }
                            }}
                            title="Remove admin"
                            className="p-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note */}
      <div className="bg-golden-900/10 border border-golden-800/40 rounded-xl p-4">
        <p className="font-chivo text-black-300 text-sm">
          <span className="text-golden-300 font-bold">Note:</span> To add a new
          admin, use the{" "}
          <code className="text-golden-400 text-xs bg-black-800 px-1 py-0.5 rounded">
            /admin/signup
          </code>{" "}
          route. New admins default to Super Admin — update their role here
          immediately after creation.
        </p>
      </div>
    </div>
  );
}
