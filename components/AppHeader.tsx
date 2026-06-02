"use client";

import Link from "next/link";
import { useFlow } from "./FlowProvider";
import { ProgressDots } from "./ProgressDots";

export function AppHeader() {
  const { reset } = useFlow();

  return (
    <header className="sticky top-[34px] sm:top-[36px] z-40 flex items-center justify-between border-b border-line bg-bg px-4 sm:px-7 py-3 sm:py-4">
      <Link href="/" onClick={reset} className="flex items-center gap-2">
        <span className="font-serif font-semibold text-[22px] -tracking-[0.02em]">
          tastematch<span className="text-coral font-bold">+</span>
        </span>
      </Link>

      <ProgressDots />

      <div className="flex items-center gap-1.5">
        <button
          aria-label="Saved"
          className="hidden sm:inline-flex h-[38px] w-[38px] items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-black/5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <Link
          href="/"
          onClick={reset}
          className="inline-flex h-[38px] items-center gap-2 rounded-full border border-line bg-transparent px-4 text-[13px] font-medium text-ink transition-colors hover:bg-black/[0.04]"
        >
          Start over
        </Link>
      </div>
    </header>
  );
}
