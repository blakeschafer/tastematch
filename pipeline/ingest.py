#!/usr/bin/env python3
"""
TasteMatch restaurant ingestion pipeline — $0 budget.

Sources (in order of richness):
  1. Yelp Fusion      — ratings, price tier, photos, categories (500 req/day free)
  2. Foursquare v3    — additional coverage, neighborhoods  (1000 req/day free)
  3. OpenStreetMap    — bulk coords + cuisine, no key, unlimited

Enrichment:
  Ollama (local)      — vibe[] + tags[] from categories, free

Storage:
  Supabase            — free tier (500 MB)

Usage:
  cd pipeline
  cp .env.example .env   # fill in your keys
  pip install -r requirements.txt
  python ingest.py                        # all cities in .env CITIES
  python ingest.py --city "New York"      # single city
  python ingest.py --enrich-only          # re-run Ollama on existing rows
"""

import argparse
import json
import os
import time
from datetime import date, datetime
from pathlib import Path
from typing import Optional

import requests
from dotenv import load_dotenv
from supabase import create_client
import ollama

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────

YELP_KEY     = os.getenv("YELP_API_KEY", "")
FSQ_KEY      = os.getenv("FOURSQUARE_API_KEY", "")
SB_URL       = os.environ["SUPABASE_URL"]
SB_KEY       = os.environ["SUPABASE_SERVICE_KEY"]
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
CITIES       = [c.strip() for c in os.getenv("CITIES", "New York").split(",")]

YELP_DAILY_LIMIT = 490   # hard cap under 500 to stay free
FSQ_DAILY_LIMIT  = 990   # hard cap under 1000

QUOTA_FILE = Path(__file__).parent / "quota.json"

VIBES = ["date", "girls", "happy", "family", "business", "casual"]
TAGS  = ["fine", "tasting", "sommelier", "dress", "outdoor", "loud", "quiet", "michelin"]

# Yelp price string → tier int
PRICE_MAP = {"$": 1, "$$": 2, "$$$": 3, "$$$$": 4}

# ── Quota tracking ─────────────────────────────────────────────────────────────
# Tracks daily API usage in a local JSON file so we never exceed free limits.

def load_quota() -> dict:
    today = str(date.today())
    if QUOTA_FILE.exists():
        q = json.loads(QUOTA_FILE.read_text())
        if q.get("date") == today:
            return q
    return {"date": today, "yelp": 0, "foursquare": 0}

def save_quota(q: dict):
    QUOTA_FILE.write_text(json.dumps(q, indent=2))

def quota_ok(q: dict, source: str) -> bool:
    limits = {"yelp": YELP_DAILY_LIMIT, "foursquare": FSQ_DAILY_LIMIT}
    return q.get(source, 0) < limits[source]

def quota_use(q: dict, source: str, n: int = 1):
    q[source] = q.get(source, 0) + n
    save_quota(q)

# ── OpenStreetMap (Overpass) ───────────────────────────────────────────────────
# Unlimited, no key. Pulls all restaurant nodes for a city.

OSM_URL = "https://overpass-api.de/api/interpreter"

def fetch_osm(city: str) -> list[dict]:
    query = f"""
    [out:json][timeout:90];
    area["name"="{city}"]["place"~"city|town|village"]->.a;
    (
      node["amenity"="restaurant"](area.a);
      way["amenity"="restaurant"](area.a);
    );
    out center tags;
    """
    print(f"  [OSM] Fetching restaurants in {city}...")
    try:
        r = requests.post(OSM_URL, data={"data": query}, timeout=120)
        r.raise_for_status()
        elements = r.json().get("elements", [])
    except Exception as e:
        print(f"  [OSM] Error: {e}")
        return []

    restaurants = []
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue
        lat = el.get("lat") or el.get("center", {}).get("lat")
        lng = el.get("lon") or el.get("center", {}).get("lon")
        if not lat or not lng:
            continue
        restaurants.append({
            "place_id":     f"osm:{el['id']}",
            "source":       "osm",
            "name":         name,
            "cuisine":      tags.get("cuisine", "").replace(";", ", ").title() or None,
            "neighborhood": tags.get("addr:suburb") or tags.get("addr:neighbourhood"),
            "address":      tags.get("addr:street"),
            "city":         city,
            "lat":          lat,
            "lng":          lng,
            "categories":   [c.strip() for c in tags.get("cuisine", "").split(";") if c.strip()],
        })

    print(f"  [OSM] Found {len(restaurants)} restaurants")
    time.sleep(2)  # be polite to the free service
    return restaurants

# ── Yelp Fusion ───────────────────────────────────────────────────────────────
# 500 req/day free. Returns ratings, price, photos, categories, neighborhood.

YELP_SEARCH_URL = "https://api.yelp.com/v3/businesses/search"

def fetch_yelp(city: str, quota: dict) -> list[dict]:
    if not YELP_KEY:
        print("  [Yelp] No API key, skipping.")
        return []
    if not quota_ok(quota, "yelp"):
        print("  [Yelp] Daily quota reached, skipping.")
        return []

    headers = {"Authorization": f"Bearer {YELP_KEY}"}
    restaurants = []
    offset = 0

    print(f"  [Yelp] Fetching restaurants in {city}...")
    while quota_ok(quota, "yelp"):
        try:
            r = requests.get(
                YELP_SEARCH_URL,
                headers=headers,
                params={
                    "location":   city,
                    "categories": "restaurants",
                    "limit":      50,
                    "offset":     offset,
                },
                timeout=15,
            )
            r.raise_for_status()
            data = r.json()
        except Exception as e:
            print(f"  [Yelp] Error at offset {offset}: {e}")
            break

        quota_use(quota, "yelp")
        businesses = data.get("businesses", [])
        if not businesses:
            break

        for b in businesses:
            loc = b.get("location", {})
            coords = b.get("coordinates", {})
            categories = [c["title"] for c in b.get("categories", [])]
            restaurants.append({
                "place_id":     f"yelp:{b['id']}",
                "source":       "yelp",
                "name":         b["name"],
                "cuisine":      categories[0] if categories else None,
                "tier":         PRICE_MAP.get(b.get("price", ""), None),
                "rating":       b.get("rating"),
                "review_count": b.get("review_count", 0),
                "neighborhood": (loc.get("display_address") or [""])[1] if len(loc.get("display_address", [])) > 1 else None,
                "address":      ", ".join(loc.get("display_address", [])),
                "city":         city,
                "lat":          coords.get("latitude"),
                "lng":          coords.get("longitude"),
                "img":          b.get("image_url"),
                "categories":   categories,
            })

        offset += len(businesses)
        if offset >= min(data.get("total", 0), 1000):
            break

        time.sleep(0.3)

    print(f"  [Yelp] Fetched {len(restaurants)} restaurants ({quota['yelp']} req used today)")
    return restaurants

# ── Foursquare v3 ─────────────────────────────────────────────────────────────
# 1000 req/day free. Good global coverage and neighborhood data.

FSQ_SEARCH_URL = "https://api.foursquare.com/v3/places/search"
FSQ_FOOD_CATEGORY = "13065"  # Food & Drink

def fetch_foursquare(city: str, quota: dict) -> list[dict]:
    if not FSQ_KEY:
        print("  [Foursquare] No API key, skipping.")
        return []
    if not quota_ok(quota, "foursquare"):
        print("  [Foursquare] Daily quota reached, skipping.")
        return []

    headers = {
        "Authorization": FSQ_KEY,
        "Accept":        "application/json",
    }
    restaurants = []
    cursor = None

    print(f"  [Foursquare] Fetching restaurants in {city}...")
    while quota_ok(quota, "foursquare"):
        params = {
            "near":       city,
            "categories": FSQ_FOOD_CATEGORY,
            "limit":      50,
            "fields":     "fsq_id,name,categories,rating,price,location,photos",
        }
        if cursor:
            params["cursor"] = cursor

        try:
            r = requests.get(FSQ_SEARCH_URL, headers=headers, params=params, timeout=15)
            r.raise_for_status()
            data = r.json()
        except Exception as e:
            print(f"  [Foursquare] Error: {e}")
            break

        quota_use(quota, "foursquare")
        results = data.get("results", [])
        if not results:
            break

        for p in results:
            loc = p.get("location", {})
            cats = [c["name"] for c in p.get("categories", [])]
            photos = p.get("photos", [])
            img = None
            if photos:
                ph = photos[0]
                img = f"{ph['prefix']}300x300{ph['suffix']}"
            restaurants.append({
                "place_id":     f"fsq:{p['fsq_id']}",
                "source":       "foursquare",
                "name":         p["name"],
                "cuisine":      cats[0] if cats else None,
                "tier":         p.get("price"),  # FSQ price is 1-4
                "rating":       round(p["rating"] / 2, 1) if p.get("rating") else None,  # FSQ is 0-10
                "neighborhood": loc.get("neighborhood", [None])[0] if loc.get("neighborhood") else None,
                "address":      loc.get("formatted_address"),
                "city":         city,
                "lat":          loc.get("lat"),
                "lng":          loc.get("lng"),
                "img":          img,
                "categories":   cats,
            })

        cursor = data.get("context", {}).get("next_cursor")
        if not cursor:
            break

        time.sleep(0.2)

    print(f"  [Foursquare] Fetched {len(restaurants)} restaurants ({quota['foursquare']} req used today)")
    return restaurants

# ── Ollama vibe enrichment ─────────────────────────────────────────────────────
# Runs locally — completely free. Assigns vibe[] and tags[] from categories + tier.

VIBE_PROMPT = """You are a restaurant classifier. Given a restaurant's details, assign vibes and tags.

Restaurant:
- Name: {name}
- Cuisine/Categories: {categories}
- Price tier: {tier} (1=cheap, 2=mid, 3=upscale, 4=fine dining)
- Rating: {rating}

Vibes to choose from (pick 1-3 that fit): date, girls, happy, family, business, casual
Tags to choose from (pick only what clearly applies): fine, tasting, sommelier, dress, outdoor, loud, quiet, michelin

Rules:
- tier 4 or "omakase/tasting/fine" → always include "fine" tag
- tier 1-2 casual cuisines (ramen, pizza, tacos) → "casual", "happy"
- wine bar / cocktail bar → "girls", "happy"
- steakhouse tier 3-4 → "business", "date"
- family-style cuisines (Italian, Mexican, Indian tier 1-2) → "family"

Return ONLY valid JSON, no explanation:
{{"vibe": [...], "tags": [...]}}"""

def enrich_vibe(row: dict) -> tuple[list, list]:
    categories = ", ".join(row.get("categories") or [row.get("cuisine") or "restaurant"])
    prompt = VIBE_PROMPT.format(
        name=row["name"],
        categories=categories,
        tier=row.get("tier") or 2,
        rating=row.get("rating") or "unknown",
    )
    try:
        resp = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[{"role": "user", "content": prompt}],
            format="json",
        )
        data = json.loads(resp["message"]["content"])
        vibe = [v for v in data.get("vibe", []) if v in VIBES]
        tags = [t for t in data.get("tags", []) if t in TAGS]
        return vibe or ["casual"], tags
    except Exception as e:
        print(f"    [Ollama] Error for {row['name']}: {e}")
        return ["casual"], []

# ── Supabase ───────────────────────────────────────────────────────────────────

def get_db():
    return create_client(SB_URL, SB_KEY)

def upsert_batch(db, rows: list[dict]):
    if not rows:
        return
    db.table("restaurants").upsert(rows, on_conflict="place_id").execute()

def get_unenriched(db, city: str) -> list[dict]:
    result = (
        db.table("restaurants")
        .select("id,name,cuisine,tier,rating,categories")
        .eq("city", city)
        .is_("enriched_at", "null")
        .execute()
    )
    return result.data or []

# ── Deduplication ──────────────────────────────────────────────────────────────
# Merge OSM, Yelp, and Foursquare results. Prefer Yelp > Foursquare > OSM
# for the same restaurant (matched by normalized name).

def normalize_name(name: str) -> str:
    return name.lower().strip().replace("'", "").replace("-", " ")

def deduplicate(sources: list[list[dict]]) -> list[dict]:
    seen: dict[str, dict] = {}
    # Process in priority order: Yelp first, then FSQ, then OSM
    for batch in sources:
        for r in batch:
            key = normalize_name(r["name"])
            if key not in seen:
                seen[key] = r
            else:
                # Merge: fill in missing fields from lower-priority source
                existing = seen[key]
                for field in ["tier", "rating", "img", "neighborhood", "lat", "lng"]:
                    if not existing.get(field) and r.get(field):
                        existing[field] = r[field]
    return list(seen.values())

# ── Pipeline ───────────────────────────────────────────────────────────────────

def run_city(city: str, quota: dict, db, enrich_only: bool = False):
    print(f"\n{'─'*50}")
    print(f"City: {city}")
    print(f"{'─'*50}")

    if not enrich_only:
        yelp_data = fetch_yelp(city, quota)
        fsq_data  = fetch_foursquare(city, quota)
        osm_data  = fetch_osm(city)

        # Merge, dedup, upsert raw data
        merged = deduplicate([yelp_data, fsq_data, osm_data])
        print(f"\n  Merged: {len(merged)} unique restaurants")

        # Upsert in batches of 100
        for i in range(0, len(merged), 100):
            upsert_batch(db, merged[i:i+100])
        print(f"  Upserted to Supabase.")

    # Ollama enrichment for rows missing vibe/tags
    unenriched = get_unenriched(db, city)
    print(f"\n  [Ollama] Enriching {len(unenriched)} restaurants with vibe + tags...")

    for i, row in enumerate(unenriched):
        vibe, tags = enrich_vibe(row)
        db.table("restaurants").update({
            "vibe":        vibe,
            "tags":        tags,
            "enriched_at": datetime.utcnow().isoformat(),
        }).eq("id", row["id"]).execute()

        if (i + 1) % 10 == 0:
            print(f"    Enriched {i+1}/{len(unenriched)}...")

    print(f"  Done: {city}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--city", help="Single city to process")
    parser.add_argument("--enrich-only", action="store_true", help="Skip fetching, only run Ollama enrichment on existing rows")
    args = parser.parse_args()

    db    = get_db()
    quota = load_quota()
    cities = [args.city] if args.city else CITIES

    print(f"TasteMatch Ingestion Pipeline")
    print(f"Date: {quota['date']}")
    print(f"Yelp usage today: {quota['yelp']}/{YELP_DAILY_LIMIT}")
    print(f"Foursquare usage today: {quota['foursquare']}/{FSQ_DAILY_LIMIT}")
    print(f"Cities: {cities}")

    for city in cities:
        run_city(city, quota, db, enrich_only=args.enrich_only)

    print(f"\nDone. Yelp used: {quota['yelp']}, Foursquare used: {quota['foursquare']}")

if __name__ == "__main__":
    main()
