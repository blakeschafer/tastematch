"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { FlowState } from "@/lib/types";

const STORAGE_KEY = "tastematch.flow.v1";

const initialState: FlowState = {
  outing: null,
  budget: null,
  cuisines: [],
  distance: 15,
  location: "Amsterdam",
  shownIds: [],
  currentResults: [],
};

type Ctx = {
  state: FlowState;
  set: <K extends keyof FlowState>(key: K, value: FlowState[K]) => void;
  patch: (partial: Partial<FlowState>) => void;
  reset: () => void;
};

const FlowCtx = createContext<Ctx | null>(null);

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FlowState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const set: Ctx["set"] = useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const patch: Ctx["patch"] = useCallback((partial) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset: Ctx["reset"] = useCallback(() => {
    setState(initialState);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const value = useMemo(() => ({ state, set, patch, reset }), [state, set, patch, reset]);

  return <FlowCtx.Provider value={value}>{children}</FlowCtx.Provider>;
}

export function useFlow(): Ctx {
  const ctx = useContext(FlowCtx);
  if (!ctx) throw new Error("useFlow must be used inside FlowProvider");
  return ctx;
}
