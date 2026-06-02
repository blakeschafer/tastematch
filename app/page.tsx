"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFlow } from "@/components/FlowProvider";

export default function IntroPage() {
  const router = useRouter();
  const { patch } = useFlow();

  const surprise = () => {
    patch({ outing: "surprise", budget: 2 });
    router.push("/results");
  };

  return (
    <section className="screen-fade grid gap-7 max-w-[920px]">
      <div className="micro text-coral">Tastematch · 2026</div>
      <h1 className="font-serif text-coral m-0 font-normal leading-[0.92] -tracking-[0.035em] text-[54px] sm:text-[clamp(54px,9vw,132px)]">
        where<br />should we<br />eat tonight?
      </h1>
      <p className="text-muted text-[16px] max-w-[540px] m-0 leading-relaxed">
        Skip the scroll. Answer five quick questions and we&apos;ll surface only three
        restaurants — the ones you&apos;d actually pick. Under 30 seconds.
      </p>

      <div className="flex gap-3 flex-wrap mt-2">
        <Link
          href="/step-1"
          className="h-[52px] px-[30px] rounded-full bg-coral text-white font-medium text-[15px] -tracking-[0.01em] inline-flex items-center gap-2.5 transition-all hover:bg-coral-dark hover:-translate-y-px"
        >
          Start matching <span>→</span>
        </Link>
        <button
          onClick={surprise}
          className="h-[52px] px-[30px] rounded-full bg-transparent text-ink font-medium text-[15px] -tracking-[0.01em] inline-flex items-center gap-2.5 border border-line transition-all hover:bg-black/[0.04] hover:-translate-y-px"
        >
          🎲 Surprise me
        </button>
      </div>

      <div className="mt-10 flex gap-9 flex-wrap text-muted text-[13px]">
        <div>
          <strong className="block text-ink font-serif text-[22px]">3</strong>
          picks per round
        </div>
        <div>
          <strong className="block text-ink font-serif text-[22px]">5</strong>
          questions, max
        </div>
        <div>
          <strong className="block text-ink font-serif text-[22px]">0</strong>
          ads, ever
        </div>
      </div>
    </section>
  );
}
