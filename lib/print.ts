import { toast } from "@/lib/toast";

export type BillQuery = Record<string, string | number | undefined>;
export function billQueryString(adj: BillQuery = {}): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(adj)) if (v !== undefined && v !== "" && v !== 0) q.set(k, String(v));
  const value = q.toString();
  return value ? `&${value}` : "";
}
export function openReceiptPrint(_orderId: string, _branchId: string, _adj: BillQuery = {}) {
  toast.info("Receipt printing is disabled in the local preview.");
}
export function openKotPrint(_orderId: string, _branchId: string) {
  toast.info("Kitchen ticket printing is disabled in the local preview.");
}
