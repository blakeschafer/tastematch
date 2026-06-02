"use client";

import { usePathname } from "next/navigation";
import { SCREENS } from "@/lib/data";

export function ProgressDots() {
  const pathname = usePathname();
  const cur = SCREENS.findIndex((s) => s.href === pathname);
  return (
    <div className="hidden sm:flex gap-1.5" aria-hidden>
      {SCREENS.map((s, i) => (
        <span
          key={s.id}
          className={`h-[3px] w-[22px] rounded-full transition-colors ${
            i < cur ? "bg-coral" : i === cur ? "bg-ink" : "bg-line"
          }`}
        />
      ))}
    </div>
  );
}
