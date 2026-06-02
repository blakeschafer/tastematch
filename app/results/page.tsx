"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BUDGETS, OUTINGS, RESTAURANTS } from "@/lib/data";
import { pickThree } from "@/lib/scoring";
import { isOpenNow } from "@/lib/hours";
import { useFlow } from "@/components/FlowProvider";
import { RestaurantCard } from "@/components/RestaurantCard";

const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), { ssr: false });

export default function ResultsPage() {
  const router = useRouter();
  const { state, patch } = useFlow();
  const [, force] = useState(0);
  const [view, setView] = useState<"cards" | "map">("cards");
  const [openNow, setOpenNow] = useState(false);

  useEffect(() => {
    if (state.currentResults.length === 0) {
      const { picks, nextShown } = pickThree(state);
      patch({ currentResults: picks.map((p) => p.id), shownIds: nextShown });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-pick when open-now filter is toggled
  useEffect(() => {
    const filter = openNow ? (r: (typeof RESTAURANTS)[0]) => isOpenNow(r.hours) : undefined;
    const { picks, nextShown } = pickThree({ ...state, shownIds: [] }, filter);
    patch({ currentResults: picks.map((p) => p.id), shownIds: nextShown });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNow]);

  const results = useMemo(
    () => state.currentResults.map((id) => RESTAURANTS.find((r) => r.id === id)!).filter(Boolean),
    [state.currentResults],
  );

  const refresh = () => {
    const filter = openNow ? (r: (typeof RESTAURANTS)[0]) => isOpenNow(r.hours) : undefined;
    const { picks, nextShown } = pickThree(state, filter);
    patch({ currentResults: picks.map((p) => p.id), shownIds: nextShown });
    force((n) => n + 1);
  };

  const outing = OUTINGS.find((o) => o.id === state.outing);
  const budget = BUDGETS.find((b) => b.id === state.budget);

  const chips: string[] = [];
  if (outing) chips.push(`${outing.emoji} ${outing.label}`);
  if (budget) chips.push(`${budget.sym} ${budget.tier}`);
  state.cuisines.forEach((c) => chips.push(c));
  chips.push(`≤ ${state.distance} mi`);
  chips.push(`📍 ${state.location}`);

  return (
    <section className="screen-fade">
      <div className="grid gap-4 mb-9">
        <div className="micro text-coral">Your 3 picks · {state.location}</div>
        <h2 className="font-serif text-coral m-0 font-normal leading-[0.92] -tracking-[0.03em] text-[44px] sm:text-[clamp(44px,7vw,96px)]">
          three spots,<br />nothing else.
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-full bg-black/[0.05] text-[12px] tracking-wide text-ink-2"
            >
              {c}
            </span>
          ))}
          {/* Open now toggle */}
          <button
            onClick={() => setOpenNow((v) => !v)}
            className={`inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-full border text-[12px] font-medium transition-all ${
              openNow
                ? "bg-green-600 border-green-600 text-white"
                : "bg-card border-line text-muted hover:text-ink"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${openNow ? "bg-white" : "bg-muted"}`} />
            Open now
          </button>

          {/* View toggle */}
          <div className="flex items-center rounded-full border border-line bg-card p-1 gap-1">
            <button
              onClick={() => setView("cards")}
              className={`h-[30px] px-3.5 rounded-full text-[12px] font-medium transition-all ${
                view === "cards" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setView("map")}
              className={`h-[30px] px-3.5 rounded-full text-[12px] font-medium transition-all ${
                view === "map" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {view === "map" ? (
        <MapView restaurants={results} city={state.location} />
      ) : (
        <div className="grid gap-[22px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {results.length > 0 ? (
            results.map((r) => <RestaurantCard key={r.id} r={r} />)
          ) : (
            <div className="col-span-full text-center py-14 px-5 border border-dashed border-line rounded-[18px] text-muted">
              No restaurants matched. Loosen a filter and try again.
            </div>
          )}
        </div>
      )}

      {/* Desktop refresh row */}
      <div className="hidden sm:flex items-center justify-between gap-4 mt-10 pt-7 border-t border-line">
        <div>
          <div className="micro mb-1.5">Not these?</div>
          <div className="text-muted text-[14px]">
            Tap for three new spots — we&apos;ll never repeat.
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => router.push("/")}
            className="h-[52px] px-[24px] rounded-full bg-transparent text-ink border border-line font-medium text-[14px] -tracking-[0.01em] inline-flex items-center transition-all hover:bg-black/[0.04]"
          >
            Start over
          </button>
          <button
            onClick={refresh}
            className="h-[52px] px-[30px] rounded-full bg-coral text-white font-medium text-[15px] -tracking-[0.01em] inline-flex items-center gap-2.5 transition-all hover:bg-coral-dark hover:-translate-y-px"
          >
            ↻ Show me 3 more
          </button>
        </div>
      </div>

      {/* Mobile sticky refresh bar */}
      <div
        className="sm:hidden fixed left-0 right-0 bottom-0 z-50 flex items-center gap-2.5 border-t border-line bg-bg/90 px-4 py-3.5"
        style={{ paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom))", backdropFilter: "blur(14px)" }}
      >
        <button
          onClick={refresh}
          className="flex-1 h-[50px] rounded-full bg-coral text-white font-medium text-[15px] inline-flex items-center justify-center gap-2"
        >
          ↻ Show me 3 more
        </button>
      </div>
    </section>
  );
}
