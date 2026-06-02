"use client";

import { BUDGETS } from "@/lib/data";
import { useFlow } from "@/components/FlowProvider";
import { OptionCard } from "@/components/OptionCard";
import { ActionBar } from "@/components/ActionBar";

export default function Step2Page() {
  const { state, set } = useFlow();

  return (
    <section className="screen-fade grid gap-7 max-w-[920px]">
      <div className="micro text-coral">Question 02 / 05</div>
      <h1 className="font-serif text-coral m-0 font-normal leading-[0.92] -tracking-[0.035em] text-[54px] sm:text-[clamp(54px,9vw,132px)]">
        what&apos;s<br />the budget?
      </h1>

      <div className="grid gap-[18px] mt-4 grid-cols-2 sm:grid-cols-4">
        {BUDGETS.map((b) => (
          <OptionCard
            key={b.id}
            variant="budget"
            label={b.tier}
            priceSym={b.sym}
            tier={b.tier}
            selected={state.budget === b.id}
            onClick={() => set("budget", b.id)}
          />
        ))}
      </div>

      <ActionBar
        back="/step-1"
        nextHref="/step-3"
        nextDisabled={!state.budget}
      />
    </section>
  );
}
