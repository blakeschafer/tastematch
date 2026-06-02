"use client";

import { usePathname, useRouter } from "next/navigation";
import { SCREENS } from "@/lib/data";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const curIdx = SCREENS.findIndex((s) => s.href === pathname);

  return (
    <aside className="hidden lg:flex sticky top-[90px] h-[calc(100dvh-90px)] flex-col border-r border-line px-6 py-9">
      <div className="mb-7 micro">The Flow</div>
      <ul className="grid gap-3.5">
        {SCREENS.map((s, i) => {
          const active = i === curIdx;
          const reachable = i <= curIdx;
          return (
            <li key={s.id}>
              <button
                onClick={() => reachable && router.push(s.href)}
                disabled={!reachable}
                className={`w-full text-left text-[13px] uppercase tracking-[0.12em] font-medium transition-colors py-1 ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                } ${!reachable ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {active && <span className="text-coral">— </span>}
                {s.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto micro pt-8">No login · 3 picks · 30 seconds</div>
    </aside>
  );
}
