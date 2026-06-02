"use client";

import { useRouter } from "next/navigation";
import { OUTINGS } from "@/lib/data";
import { useFlow } from "@/components/FlowProvider";
import { OptionCard } from "@/components/OptionCard";
import { ActionBar } from "@/components/ActionBar";
import type { OutingId } from "@/lib/types";

export default function Step1Page() {
  const router = useRouter();
  const { state, set, patch } = useFlow();

  const pick = (id: OutingId) => {
    set("outing", id);
    if (id === "surprise") {
      patch({ outing: "surprise", budget: state.budget ?? 2 });
      router.push("/results");
    }
  };

  return (
    <section className="screen-fade grid gap-7 max-w-[920px]">
      <div className="micro text-coral">Question 01 / 05</div>
      <h1 className="font-serif text-coral m-0 font-normal leading-[0.92] -tracking-[0.035em] text-[54px] sm:text-[clamp(54px,9vw,132px)]">
        what kind<br />of outing?
      </h1>

      <div className="grid gap-[18px] mt-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
        {OUTINGS.map((o) => (
          <OptionCard
            key={o.id}
            emoji={o.emoji}
            label={o.label}
            hint={o.hint}
            selected={state.outing === o.id}
            onClick={() => pick(o.id)}
          />
        ))}
      </div>

      <ActionBar
        back="/"
        nextHref="/step-2"
        nextDisabled={!state.outing}
      />
    </section>
  );
}
