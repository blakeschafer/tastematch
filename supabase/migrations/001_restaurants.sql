create table if not exists restaurants (
  id           uuid primary key default gen_random_uuid(),
  place_id     text unique not null,        -- source:external_id e.g. "yelp:abc123"
  source       text not null,               -- "yelp" | "foursquare" | "osm"
  name         text not null,
  cuisine      text,
  tier         int check (tier between 1 and 4),
  rating       numeric(3,1),
  review_count int default 0,
  neighborhood text,
  address      text,
  city         text not null,
  lat          numeric(9,6),
  lng          numeric(9,6),
  img          text,
  vibe         text[] default '{}',
  tags         text[] default '{}',
  categories   text[] default '{}',         -- raw source categories, used for enrichment
  enriched_at  timestamptz
);

create index if not exists restaurants_city_idx  on restaurants(city);
create index if not exists restaurants_tier_idx  on restaurants(tier);
create index if not exists restaurants_vibe_idx  on restaurants using gin(vibe);
