import type { DayHours, Outing, Budget, Restaurant } from "./types";

// Helpers to keep hours data concise
const C = null as DayHours;                                         // closed
const h = (o: string, c: string): DayHours => ({ open: o, close: c });
const daily  = (o: string, c: string): DayHours[] => Array(7).fill(h(o, c));
// [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
const hrs = (...d: DayHours[]): DayHours[] => d;

export const OUTINGS: Outing[] = [
  { id: "date",     emoji: "❤️", label: "Date Night",     hint: "Romantic, lingering, candles" },
  { id: "girls",    emoji: "🍸", label: "Girls Night",     hint: "Cocktails, shareable plates" },
  { id: "happy",    emoji: "🍻", label: "Happy Hour",      hint: "Drinks, bar seats, deals" },
  { id: "family",   emoji: "👨‍👩‍👧", label: "Family Dinner",   hint: "Kid-friendly, comfortable" },
  { id: "business", emoji: "💼", label: "Business Dinner", hint: "Quiet, polished, on-time" },
  { id: "casual",   emoji: "🍕", label: "Casual Hangout",  hint: "Easy, walk-in, vibes" },
  { id: "surprise", emoji: "🎲", label: "Surprise Me",     hint: "Skip the questions" },
];

export const BUDGETS: Budget[] = [
  { id: 1, sym: "$",    tier: "Casual" },
  { id: 2, sym: "$$",   tier: "Mid-Range" },
  { id: 3, sym: "$$$",  tier: "Upscale" },
  { id: 4, sym: "$$$$", tier: "Fine Dining" },
];

export const CUISINES = [
  "Italian", "French", "Japanese", "Sushi", "Steakhouse", "Mexican",
  "Mediterranean", "Indian", "Thai", "Korean", "American", "Seafood",
  "Vegetarian", "Vegan",
];

export const CITIES = [
  "Amsterdam", "Paris", "London", "Dallas", "New York", "Tokyo", "Barcelona", "Rome",
];

const ph = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&h=720&fit=crop&auto=format&q=70`;

export const RESTAURANTS: Restaurant[] = [
  { id: 1,  name: "Maison Reverie",     cuisine: "French",        tier: 4, rating: 4.9, distance: 1.8, img: ph("1414235077428-338989a2e8c0"), tags: ["fine","tasting","michelin"], vibe: ["date","business"], neighborhood: "Le Marais",         hours: hrs(C, C, h("18:00","22:30"), h("18:00","22:30"), h("18:00","22:30"), h("18:00","23:00"), h("18:00","23:00")), walkIn: false },
  { id: 2,  name: "Sora Omakase",       cuisine: "Japanese",      tier: 4, rating: 4.8, distance: 2.4, img: ph("1564671165093-20688ff1fffa"), tags: ["fine","tasting","sommelier"], vibe: ["date","business"], neighborhood: "Nishi-Azabu",       hours: hrs(h("18:00","22:00"), C, C, h("18:00","22:00"), h("18:00","22:00"), h("18:00","22:00"), h("18:00","22:00")), walkIn: false },
  { id: 3,  name: "Trattoria del Sole", cuisine: "Italian",       tier: 2, rating: 4.6, distance: 0.7, img: ph("1565299624946-b28f40a0ae38"), tags: [], vibe: ["casual","family","date"], neighborhood: "Trastevere",         hours: daily("12:00","22:00"), walkIn: true },
  { id: 4,  name: "Velvet & Vine",      cuisine: "Wine Bar",      tier: 3, rating: 4.7, distance: 1.1, img: ph("1559339352-11d035aa65de"), tags: ["sommelier"], vibe: ["date","girls"], neighborhood: "West Village",         hours: daily("16:00","00:00"), walkIn: true },
  { id: 5,  name: "Tinto Tapas",        cuisine: "Mediterranean", tier: 2, rating: 4.5, distance: 0.9, img: ph("1551782450-a2132b4ba21d"), tags: [], vibe: ["girls","casual","happy"], neighborhood: "El Born",               hours: daily("12:00","23:00"), walkIn: true },
  { id: 6,  name: "The Round Table",    cuisine: "American",      tier: 2, rating: 4.3, distance: 1.5, img: ph("1568901346375-23c9450c58cd"), tags: [], vibe: ["family","casual"], neighborhood: "Midtown",                  hours: daily("11:00","22:00"), walkIn: true },
  { id: 7,  name: "Hashi Ramen",        cuisine: "Japanese",      tier: 1, rating: 4.4, distance: 0.4, img: ph("1574071318508-1cdbab80d002"), tags: [], vibe: ["casual","happy"], neighborhood: "Shinjuku",                  hours: hrs(h("11:30","21:30"), C, h("11:30","21:30"), h("11:30","21:30"), h("11:30","21:30"), h("11:30","22:00"), h("11:30","22:00")), walkIn: true },
  { id: 8,  name: "Nopalito",           cuisine: "Mexican",       tier: 2, rating: 4.6, distance: 1.2, img: ph("1565299585323-38d6b0865b47"), tags: [], vibe: ["casual","girls","happy"], neighborhood: "Mission District",   hours: daily("12:00","22:00"), walkIn: true },
  { id: 9,  name: "Le Petit Comptoir",  cuisine: "French",        tier: 3, rating: 4.7, distance: 2.0, img: ph("1414235077428-338989a2e8c0"), tags: [], vibe: ["date","business"], neighborhood: "Montmartre",               hours: hrs(h("12:00","22:30"), C, h("12:00","22:30"), h("12:00","22:30"), h("12:00","22:30"), h("12:00","23:00"), h("12:00","23:00")), walkIn: true },
  { id: 10, name: "Bombay Brass",       cuisine: "Indian",        tier: 2, rating: 4.5, distance: 1.8, img: ph("1565557623262-b51c2513a641"), tags: [], vibe: ["family","casual"], neighborhood: "Brick Lane",               hours: daily("12:00","22:00"), walkIn: true },
  { id: 11, name: "Saffron & Smoke",    cuisine: "Indian",        tier: 3, rating: 4.6, distance: 2.6, img: ph("1631515243349-e0cb75fb8d3a"), tags: [], vibe: ["date","business"], neighborhood: "Mayfair",                  hours: daily("17:00","23:00"), walkIn: true },
  { id: 12, name: "Bia Bar",            cuisine: "Cocktail Bar",  tier: 3, rating: 4.7, distance: 0.6, img: ph("1559847844-5315695dadae"), tags: [], vibe: ["girls","happy","date"], neighborhood: "SoHo",                   hours: daily("17:00","02:00"), walkIn: true },
  { id: 13, name: "Carmela Pizzeria",   cuisine: "Italian",       tier: 1, rating: 4.4, distance: 0.5, img: ph("1555396273-367ea4eb4db5"), tags: [], vibe: ["casual","family","happy"], neighborhood: "Williamsburg",        hours: daily("11:00","23:00"), walkIn: true },
  { id: 14, name: "Ocean & Oak",        cuisine: "Seafood",       tier: 3, rating: 4.6, distance: 3.4, img: ph("1559737558-2f5a35f4523b"), tags: ["sommelier"], vibe: ["date","business"], neighborhood: "Harbor District",    hours: hrs(h("17:00","22:00"), C, h("17:00","22:00"), h("17:00","22:00"), h("17:00","22:00"), h("17:00","22:30"), h("17:00","22:30")), walkIn: false },
  { id: 15, name: "Bistro Lumière",     cuisine: "French",        tier: 4, rating: 4.9, distance: 4.1, img: ph("1517248135467-4c7edcad34c4"), tags: ["fine","michelin","dress"], vibe: ["date","business"], neighborhood: "Saint-Germain",      hours: hrs(C, C, h("18:30","22:00"), h("18:30","22:00"), h("18:30","22:00"), h("18:30","22:30"), h("18:30","22:30")), walkIn: false },
  { id: 16, name: "Seoul Smoke",        cuisine: "Korean",        tier: 2, rating: 4.5, distance: 1.7, img: ph("1583224994076-ae3a3e9c2087"), tags: [], vibe: ["casual","girls"], neighborhood: "Koreatown",                hours: daily("12:00","22:30"), walkIn: true },
  { id: 17, name: "Cha Cha Thai",       cuisine: "Thai",          tier: 1, rating: 4.4, distance: 0.8, img: ph("1559314809-0d155014e29e"), tags: [], vibe: ["casual","family","happy"], neighborhood: "Chinatown",            hours: daily("11:00","22:00"), walkIn: true },
  { id: 18, name: "The Greenhouse",     cuisine: "Vegetarian",    tier: 2, rating: 4.6, distance: 1.1, img: ph("1540420773420-3366772f4999"), tags: [], vibe: ["date","casual","family"], neighborhood: "Greenwich Village",   hours: hrs(C, h("11:00","21:30"), h("11:00","21:30"), h("11:00","21:30"), h("11:00","21:30"), h("11:00","21:30"), h("11:00","21:30")), walkIn: true },
  { id: 19, name: "Roots & Bowls",      cuisine: "Vegan",         tier: 1, rating: 4.3, distance: 0.6, img: ph("1546069901-ba9599a7e63c"), tags: [], vibe: ["casual"], neighborhood: "Silver Lake",                        hours: hrs(C, h("09:00","20:00"), h("09:00","20:00"), h("09:00","20:00"), h("09:00","20:00"), h("09:00","20:00"), h("09:00","20:00")), walkIn: true },
  { id: 20, name: "The Butchers Cut",   cuisine: "Steakhouse",    tier: 4, rating: 4.8, distance: 2.8, img: ph("1600891964092-4316c288032e"), tags: ["fine","dress","sommelier"], vibe: ["business","date"], neighborhood: "Meatpacking",         hours: hrs(C, h("17:00","22:30"), h("17:00","22:30"), h("17:00","22:30"), h("17:00","22:30"), h("17:00","23:00"), h("17:00","23:00")), walkIn: false },
  { id: 21, name: "Casa Verde",         cuisine: "Mexican",       tier: 3, rating: 4.6, distance: 2.2, img: ph("1565299507177-b0ac66763828"), tags: [], vibe: ["girls","date"], neighborhood: "Condesa",                      hours: daily("12:00","23:00"), walkIn: true },
  { id: 22, name: "Olive & Anchor",     cuisine: "Mediterranean", tier: 3, rating: 4.7, distance: 1.6, img: ph("1432139509613-5c4255815697"), tags: [], vibe: ["date","girls","business"], neighborhood: "Jordaan",            hours: daily("12:00","23:00"), walkIn: true },
  { id: 23, name: "Public House",       cuisine: "American",      tier: 2, rating: 4.4, distance: 1.3, img: ph("1514933651103-005eec06c04b"), tags: [], vibe: ["happy","casual"], neighborhood: "Lower East Side",            hours: daily("11:00","01:00"), walkIn: true },
  { id: 24, name: "Sushi Hinoki",       cuisine: "Sushi",         tier: 3, rating: 4.7, distance: 2.0, img: ph("1579871494447-9811cf80d66c"), tags: ["sommelier"], vibe: ["date","business"], neighborhood: "Roppongi",          hours: hrs(h("17:00","22:00"), C, h("17:00","22:00"), h("17:00","22:00"), h("17:00","22:00"), h("17:00","22:30"), h("17:00","22:30")), walkIn: true },
];

export const SCREENS = [
  { id: "intro",   label: "Start",    href: "/" },
  { id: "step1",   label: "Outing",   href: "/step-1" },
  { id: "step2",   label: "Budget",   href: "/step-2" },
  { id: "step3",   label: "Cuisine",  href: "/step-3" },
  { id: "step4",   label: "Distance", href: "/step-4" },
  { id: "step5",   label: "Location", href: "/step-5" },
  { id: "results", label: "Your 3",   href: "/results" },
] as const;
