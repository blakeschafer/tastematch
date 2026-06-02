export type OutingId =
  | "date"
  | "girls"
  | "happy"
  | "family"
  | "business"
  | "casual"
  | "surprise";

export type Outing = {
  id: OutingId;
  emoji: string;
  label: string;
  hint: string;
};

export type Budget = {
  id: 1 | 2 | 3 | 4;
  sym: string;
  tier: string;
};

export type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  tier: 1 | 2 | 3 | 4;
  rating: number;
  distance: number;
  img: string;
  tags: string[];
  vibe: OutingId[];
};

export type FlowState = {
  outing: OutingId | null;
  budget: 1 | 2 | 3 | 4 | null;
  cuisines: string[];
  distance: number;
  location: string;
  shownIds: number[];
  currentResults: number[];
};
