"use client";

import { useState } from "react";
import { CITIES } from "@/lib/data";
import { useFlow } from "@/components/FlowProvider";
import { Chip } from "@/components/Chip";
import { ActionBar } from "@/components/ActionBar";

export default function Step5Page() {
  const { state, set } = useFlow();
  const [gpsLabel, setGpsLabel] = useState("📍 Current");

  const tryGps = () => {
    if (!navigator.geolocation) return;
    setGpsLabel("…");
    navigator.geolocation.getCurrentPosition(
      () => {
        set("location", "Current Location");
        setGpsLabel("✓ Set");
      },
      () => setGpsLabel("📍 Current"),
      { timeout: 4000 },
    );
  };

  return (
    <section className="screen-fade grid gap-7 max-w-[920px]">
      <div className="micro text-coral">Question 05 / 05</div>
      <h1 className="font-serif text-coral m-0 font-normal leading-[0.92] -tracking-[0.035em] text-[54px] sm:text-[clamp(54px,9vw,132px)]">
        where are<br />you?
      </h1>

      <div className="max-w-[720px] grid gap-3.5 mt-4">
        <div className="rounded-[14px] border border-line bg-card px-5 py-4 flex items-center gap-3.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-muted shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <input
            value={state.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Search any city worldwide"
            className="flex-1 border-0 outline-none bg-transparent text-[18px] font-medium -tracking-[0.01em] placeholder:text-muted placeholder:font-normal"
          />
          <button
            onClick={tryGps}
            className="inline-flex h-[38px] items-center gap-2 rounded-full border border-line bg-transparent px-4 text-[13px] font-medium text-ink transition-colors hover:bg-black/[0.04] shrink-0"
          >
            {gpsLabel}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <Chip
              key={c}
              selected={state.location === c}
              onClick={() => set("location", c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <ActionBar
        back="/step-4"
        nextHref="/results"
        nextLabel="Find my 3 spots"
        nextVariant="coral"
      />
    </section>
  );
}
