import { RESTAURANTS } from "./data";
import type { FlowState, Restaurant } from "./types";

export function scoreRestaurant(r: Restaurant, s: FlowState): number {
  let score = r.rating * 10;

  if (s.outing && r.vibe.includes(s.outing)) score += 18;

  if (s.budget) {
    const diff = Math.abs(r.tier - s.budget);
    score += diff === 0 ? 25 : diff === 1 ? 8 : -6 * diff;
    if (s.budget <= 2 && r.tier === 4) score -= 40;
    if (s.budget === 4 && r.tier <= 2) score -= 30;
  }

  if (s.cuisines.length > 0) {
    const match = s.cuisines.some((c) =>
      r.cuisine.toLowerCase().includes(c.toLowerCase()) ||
      (c === "Sushi" && r.cuisine === "Japanese") ||
      (c === "Japanese" && r.cuisine === "Sushi")
    );
    score += match ? 22 : -12;
  }

  if (r.distance > s.distance) score -= (r.distance - s.distance) * 4;

  score += Math.random() * 6;
  return score;
}

export function pickThree(s: FlowState): { picks: Restaurant[]; nextShown: number[] } {
  const shown = new Set(s.shownIds);
  let pool = RESTAURANTS.filter((r) => !shown.has(r.id));
  if (pool.length < 3) {
    shown.clear();
    pool = RESTAURANTS.slice();
  }
  pool.sort((a, b) => scoreRestaurant(b, s) - scoreRestaurant(a, s));
  const picks = pool.slice(0, 3);
  picks.forEach((p) => shown.add(p.id));
  return { picks, nextShown: Array.from(shown) };
}
