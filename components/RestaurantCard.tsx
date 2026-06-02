"use client";

import Image from "next/image";
import { BUDGETS } from "@/lib/data";
import type { Restaurant } from "@/lib/types";

export function RestaurantCard({ r }: { r: Restaurant }) {
  const b = BUDGETS.find((x) => x.id === r.tier)!;
  const fine = r.tier === 4 || r.tags.includes("fine");

  const badges: { label: string; gold?: boolean }[] = [];
  if (fine) badges.push({ label: "⭐ Fine Dining", gold: true });
  if (r.tags.includes("tasting")) badges.push({ label: "🍷 Tasting Menu" });
  if (r.tags.includes("michelin")) badges.push({ label: "🎖 Michelin" });
  if (r.tags.includes("dress")) badges.push({ label: "👔 Dress Code" });

  return (
    <article className="card-fade group flex flex-col overflow-hidden rounded-[18px] border border-line bg-card transition-all hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#eee]">
        <Image
          src={r.img}
          alt={r.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {badges.map((b, i) => (
              <span
                key={i}
                className={`px-2.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.12em] font-semibold backdrop-blur ${
                  b.gold ? "bg-ink text-gold" : "bg-white/95 text-ink"
                }`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2.5 px-5 py-5">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{r.cuisine}</span>
          <span className="text-[13px] font-semibold inline-flex items-center gap-1">★ {r.rating.toFixed(1)}</span>
        </div>
        <div className="font-serif text-[26px] font-medium leading-[1.05] -tracking-[0.015em]">{r.name}</div>
        <div className="flex items-center gap-3.5 text-[13px] text-muted">
          <span>{r.distance.toFixed(1)} mi</span>
          <span className="w-[3px] h-[3px] rounded-full bg-muted" />
          <span>{b.sym}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-muted" />
          <span>{b.tier}</span>
        </div>
        <div className="mt-1.5 flex gap-2">
          <button className="flex-1 h-[42px] rounded-full bg-ink text-white text-[13px] font-medium border border-ink transition-colors hover:bg-black">
            Reserve
          </button>
          <button className="flex-1 h-[42px] rounded-full bg-card text-ink text-[13px] font-medium border border-line transition-colors hover:bg-black/[0.04]">
            Map
          </button>
          <button
            aria-label="Save"
            className="h-[42px] w-[42px] rounded-full bg-card text-ink border border-line transition-colors hover:bg-black/[0.04]"
          >
            ♡
          </button>
        </div>
      </div>
    </article>
  );
}
