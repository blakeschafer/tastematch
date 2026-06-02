"use client";

import { CUISINES } from "@/lib/data";
import { useFlow } from "@/components/FlowProvider";
import { Chip } from "@/components/Chip";
import { ActionBar } from "@/components/ActionBar";

export default function Step3Page() {
  const { state, set } = useFlow();

  const toggle = (c: string) => {
    const has = state.cuisines.includes(c);
    set("cuisines", has ? state.cuisines.filter((x) => x !== c) : [...state.cuisines, c]);
  };

  return (
    <section className="screen-fade grid gap-7 max-w-[920px]">
      <div className="micro text-coral">Question 03 / 05</div>
      <h1 className="font-serif text-coral m-0 font-normal leading-[0.92] -tracking-[0.035em] text-[54px] sm:text-[clamp(54px,9vw,132px)]">
        pick your<br />cuisines.
      </h1>
      <p className="text-muted text-[16px] max-w-[540px] m-0 leading-relaxed">
        Select as many as you like — or skip to keep it open.
      </p>

      <div className="flex flex-wrap gap-2.5 mt-3">
        {CUISINES.map((c) => (
          <Chip
            key={c}
            selected={state.cuisines.includes(c)}
            onClick={() => toggle(c)}
          >
            {c}
          </Chip>
        ))}
      </div>

      <ActionBar back="/step-2" nextHref="/step-4" />
    </section>
  );
}
