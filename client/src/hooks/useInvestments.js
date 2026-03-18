import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";

/* ── Auth header helper ─────────────────────────────────────────── */
export function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ── My investments list ────────────────────────────────────────── */
export function useMyInvestments() {
  return useQuery({
    queryKey: ["my_investments"],
    queryFn: async () => {
      const res = await api.get("/api/investments/my", {
        headers: authHeader(),
      });
      return res.data?.investments ?? [];
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

/* ── Portfolio stats ────────────────────────────────────────────── */
export function usePortfolioStats() {
  return useQuery({
    queryKey: ["my_stats"],
    queryFn: async () => {
      const res = await api.get("/api/investments/my/stats", {
        headers: authHeader(),
      });
      return res.data?.stats ?? {};
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

/* ── Currency formatter ─────────────────────────────────────────── */
export function fmtNaira(n) {
  if (n === undefined || n === null || n === "") return "₦0";
  return "₦" + Number(n).toLocaleString("en-NG");
}
