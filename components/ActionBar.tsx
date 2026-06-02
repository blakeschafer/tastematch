"use client";

import { useRouter } from "next/navigation";

type Props = {
  back?: string;
  nextHref?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
  nextVariant?: "default" | "coral";
};

export function ActionBar({
  back,
  nextHref,
  nextLabel = "Continue",
  nextDisabled = false,
  onNext,
  nextVariant = "default",
}: Props) {
  const router = useRouter();
  const goNext = () => {
    if (nextDisabled) return;
    if (onNext) onNext();
    if (nextHref) router.push(nextHref);
  };

  const ctaClasses =
    nextVariant === "coral"
      ? "bg-coral text-white hover:bg-coral-dark"
      : "bg-ink text-white hover:bg-black";

  return (
    <>
      {/* Desktop bar (inline) */}
      <div className="hidden sm:flex items-center justify-between gap-4 mt-9 pt-5 border-t border-line">
        {back ? (
          <button
            onClick={() => router.push(back)}
            className="text-[13px] uppercase tracking-[0.12em] font-medium text-muted hover:text-ink transition-colors"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={goNext}
          disabled={nextDisabled}
          className={`h-[52px] px-[30px] rounded-full font-medium text-[15px] -tracking-[0.01em] inline-flex items-center gap-2.5 transition-all ${ctaClasses} disabled:opacity-35 disabled:cursor-not-allowed enabled:hover:-translate-y-px`}
        >
          {nextLabel} <span>→</span>
        </button>
      </div>

      {/* Mobile sticky bar */}
      <div
        className="sm:hidden fixed left-0 right-0 bottom-0 z-50 flex items-center gap-2.5 border-t border-line bg-bg/90 px-4 py-3.5"
        style={{ paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom))", backdropFilter: "blur(14px)" }}
      >
        {back && (
          <button
            onClick={() => router.push(back)}
            className="text-[13px] uppercase tracking-[0.12em] font-medium text-muted px-3"
          >
            ← Back
          </button>
        )}
        <button
          onClick={goNext}
          disabled={nextDisabled}
          className={`flex-1 h-[50px] rounded-full font-medium text-[15px] inline-flex items-center justify-center gap-2 transition-all ${ctaClasses} disabled:opacity-35`}
        >
          {nextLabel} <span>→</span>
        </button>
      </div>
    </>
  );
}
