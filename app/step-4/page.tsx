"use client";

import { useFlow } from "@/components/FlowProvider";
import { ActionBar } from "@/components/ActionBar";

function distLabel(m: number) {
  if (m <= 1) return "Within 5 min";
  if (m <= 5) return "Within 15 min";
  if (m <= 15) return "Within 30 min";
  return "Worth the drive";
}

export default function Step4Page() {
  const { state, set } = useFlow();

  return (
    <section className="screen-fade grid gap-7 max-w-[920px]">
      <div className="micro text-coral">Question 04 / 05</div>
      <h1 className="font-serif text-coral m-0 font-normal leading-[0.92] -tracking-[0.035em] text-[54px] sm:text-[clamp(54px,9vw,132px)]">
        how far<br />will you go?
      </h1>

      <div className="max-w-[720px] mt-4">
        <div className="rounded-[18px] border border-line bg-card px-6 py-7 grid gap-[18px]">
          <div className="flex justify-between items-end">
            <div className="font-serif text-coral text-[42px] sm:text-[56px] font-medium leading-none -tracking-[0.02em]">
              {state.distance}
              <span className="text-[18px] text-muted ml-1.5">miles</span>
            </div>
            <div className="micro">{distLabel(state.distance)}</div>
          </div>
          <input
            type="range"
            className="dist"
            min={1}
            max={50}
            value={state.distance}
            onChange={(e) => set("distance", parseInt(e.target.value, 10))}
          />
          <div className="flex justify-between text-[11px] text-muted uppercase tracking-[0.12em]">
            <span>5 min</span>
            <span>15 min</span>
            <span>30 min</span>
            <span>Worth it</span>
          </div>
        </div>
      </div>

      <ActionBar back="/step-3" nextHref="/step-5" />
    </section>
  );
}
