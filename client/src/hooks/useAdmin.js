import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";

/* ── Auth header ────────────────────────────────────────────────── */
export function adminAuthHeader() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ── Decode role from JWT without a library ─────────────────────── */
export function useAdminRole() {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return "viewer";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? "viewer";
  } catch {
    return "viewer";
  }
}

/* ── Permission helpers ─────────────────────────────────────────── */
export const canWrite = (role) => role === "super_admin" || role === "manager";

export const isSuperAdmin = (role) => role === "super_admin";

/* ── All investments (admin) ────────────────────────────────────── */
export function useAllInvestments() {
  return useQuery({
    queryKey: ["admin_investments"],
    queryFn: async () => {
      const res = await api.get("/api/investments", {
        headers: adminAuthHeader(),
      });
      return res.data?.investments ?? [];
    },
    staleTime: 1000 * 60 * 2,
  });
}

/* ── Currency ────────────────────────────────────────────────────── */
export function fmtNaira(n) {
  if (n == null || n === "") return "₦0";
  return "₦" + Number(n).toLocaleString("en-NG");
}
