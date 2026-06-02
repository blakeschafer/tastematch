"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BUDGETS, OUTINGS, RESTAURANTS } from "@/lib/data";
import { pickThree } from "@/lib/scoring";
import { useFlow } from "@/components/FlowProvider";
import { RestaurantCard } from "@/components/RestaurantCard";

export default function ResultsPage() {
  const router = useRouter();
  const { state, patch } = useFlow();
  const [, force] = useState(0);

  useEffect(() => {
    // First visit OR no results yet — generate.
    if (state.currentResults.length === 0) {
      const { picks, nextShown } = pickThree(state);
      patch({ currentResults: picks.map((p) => p.id), shownIds: nextShown });
    }
    // We only want this on mount of this page session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(
    () => state.currentResults.map((id) => RESTAURANTS.find((r) => r.id === id)!).filter(Boolean),
    [state.currentResults],
  );

  const refresh = () => {
    const { picks, nextShown } = pickThree(state);
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
        </div>
      </div>

      <div className="grid gap-[22px] grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {results.length > 0 ? (
          results.map((r) => <RestaurantCard key={r.id} r={r} />)
        ) : (
          <div className="col-span-full text-center py-14 px-5 border border-dashed border-line rounded-[18px] text-muted">
            No restaurants matched. Loosen a filter and try again.
          </div>
        )}
      </div>

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
