import { createClient } from "@supabase/supabase-js";
import type { Restaurant } from "./types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function getRestaurantsByCity(city: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("city", city)
    .not("enriched_at", "is", null)   // only fully enriched rows
    .order("rating", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((r) => ({
    id:           r.id,
    name:         r.name,
    cuisine:      r.cuisine ?? "Restaurant",
    tier:         (r.tier ?? 2) as 1 | 2 | 3 | 4,
    rating:       r.rating ?? 4.0,
    distance:     0,                  // real distance needs user coords — placeholder
    img:          r.img ?? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=720&fit=crop",
    tags:         r.tags ?? [],
    vibe:         r.vibe ?? [],
    neighborhood: r.neighborhood ?? r.city,
    hours:        r.hours ?? Array(7).fill({ open: "11:00", close: "22:00" }),
    walkIn:       r.walk_in ?? true,
    lat:          r.lat,
    lng:          r.lng,
  }));
}
