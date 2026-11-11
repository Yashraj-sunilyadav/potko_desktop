import { useLocation, useNavigate, useSearchParams as useRRSearchParams } from "react-router-dom";
import { useMemo } from "react";
export function usePathname() { return useLocation().pathname; }
export function useSearchParams() { return useRRSearchParams()[0]; }
export function useRouter() {
  const navigate = useNavigate();
  return useMemo(() => ({ push: (to: string) => navigate(to), replace: (to: string) => navigate(to, { replace: true }) }), [navigate]);
}
