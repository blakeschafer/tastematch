import type { DayHours } from "./types";

function toMins(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fmt(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

export type HoursStatus = {
  status: "open" | "closed" | "opening-soon";
  label: string;
};

export function getHoursStatus(hours: DayHours[]): HoursStatus {
  const now = new Date();
  const day = hours[now.getDay()];

  if (!day) return { status: "closed", label: "Closed today" };

  const nowMins  = now.getHours() * 60 + now.getMinutes();
  const openMins = toMins(day.open);
  let closeMins  = toMins(day.close);
  if (closeMins <= openMins) closeMins += 24 * 60; // past midnight close

  if (nowMins < openMins) {
    const minsUntil = openMins - nowMins;
    return {
      status: minsUntil <= 60 ? "opening-soon" : "closed",
      label: `Opens at ${fmt(day.open)}`,
    };
  }

  if (nowMins >= closeMins) {
    return { status: "closed", label: "Closed now" };
  }

  return { status: "open", label: `Open until ${fmt(day.close)}` };
}

export function isOpenNow(hours: DayHours[]): boolean {
  return getHoursStatus(hours).status === "open";
}
