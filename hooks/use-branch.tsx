"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { BranchViewState } from "@/lib/branch-state";

interface Branch { id: string; name: string }
interface BranchContextValue {
  branchId: string | null;
  branches: Branch[];
  isLoading: boolean;
  state: BranchViewState;
  error: unknown;
  retry: () => void;
  retrying: boolean;
  setBranchId: (id: string) => void;
}

const DEMO_BRANCHES: Branch[] = [{ id: "potko-demo-branch", name: "POTKO · Central Kitchen" }];
const BranchContext = createContext<BranchContextValue | null>(null);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branchId, setBranchId] = useState<string | null>(DEMO_BRANCHES[0].id);
  const value = useMemo(() => ({
    branchId, branches: DEMO_BRANCHES, isLoading: false, state: "ready" as BranchViewState,
    error: null, retry: () => undefined, retrying: false, setBranchId,
  }), [branchId]);
  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used within BranchProvider");
  return ctx;
}
