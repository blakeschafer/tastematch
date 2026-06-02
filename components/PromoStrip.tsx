export function PromoStrip() {
  const items = [
    "Open tonight",
    "Decide in under 30 seconds",
    "Curated, not crowded",
    "3 spots. No scroll.",
  ];
  return (
    <div className="sticky top-0 z-50 bg-coral text-white text-[11px] uppercase tracking-[0.18em] font-semibold py-2 px-4 sm:px-5 overflow-hidden whitespace-nowrap">
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
