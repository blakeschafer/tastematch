"use client";

import { useEffect, useRef } from "react";
import type { Restaurant } from "@/lib/types";

const CITY_CENTERS: Record<string, [number, number]> = {
  Amsterdam:      [52.3676,  4.9041],
  Paris:          [48.8566,  2.3522],
  London:         [51.5074, -0.1278],
  Dallas:         [32.7767, -96.797],
  "New York":     [40.7128, -74.006],
  Tokyo:          [35.6762, 139.6503],
  Barcelona:      [41.3851,  2.1734],
  Rome:           [41.9028,  12.4964],
};

const OFFSETS: [number, number][] = [
  [ 0.010,  0.007],
  [-0.006,  0.013],
  [ 0.004, -0.011],
];

const COLORS = ["#E85D4A", "#2D3142", "#7B8FA1"];

function getCoords(city: string, slot: number): [number, number] {
  const center = CITY_CENTERS[city] ?? [40.7128, -74.006];
  const [dlat, dlng] = OFFSETS[slot % OFFSETS.length];
  return [center[0] + dlat, center[1] + dlng];
}

export function MapView({ restaurants, city }: { restaurants: Restaurant[]; city: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center = CITY_CENTERS[city] ?? [40.7128, -74.006];
      const map = L.map(containerRef.current!).setView(center as [number, number], 14);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      restaurants.forEach((r, i) => {
        const coords = getCoords(city, i);
        const color = COLORS[i % COLORS.length];

        const icon = L.divIcon({
          className: "",
          html: `
            <div style="
              width:36px;height:36px;border-radius:50% 50% 50% 0;
              background:${color};transform:rotate(-45deg);
              border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);
            "></div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -38],
        });

        const popup = `
          <div style="font-family:sans-serif;min-width:160px">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-bottom:4px">${r.cuisine}</div>
            <div style="font-size:16px;font-weight:600;margin-bottom:3px">${r.name}</div>
            <div style="font-size:12px;color:#555">📍 ${r.neighborhood}</div>
            <div style="font-size:12px;color:#555;margin-top:2px">★ ${r.rating.toFixed(1)} · ${r.distance.toFixed(1)} mi</div>
          </div>
        `;

        L.marker(coords, { icon }).addTo(map).bindPopup(popup).openPopup();
      });

      // Fit map to all markers
      if (restaurants.length > 1) {
        const bounds = L.latLngBounds(restaurants.map((_, i) => getCoords(city, i)));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={containerRef}
        className="w-full rounded-[18px] overflow-hidden border border-line"
        style={{ height: 420 }}
      />
    </>
  );
}
