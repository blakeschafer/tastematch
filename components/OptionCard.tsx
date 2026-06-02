"use client";

type Props = {
  emoji?: string;
  label: string;
  hint?: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: "default" | "budget";
  priceSym?: string;
  tier?: string;
};

export function OptionCard({
  emoji, label, hint, selected, onClick, variant = "default", priceSym, tier,
}: Props) {
  const base =
    "block w-full text-left rounded-[18px] border bg-card transition-all hover:-translate-y-[3px] hover:shadow-card";
  const border = selected
    ? "border-ink shadow-card"
    : "border-line hover:border-[#d8d2c4]";

  if (variant === "budget") {
    return (
      <button
        onClick={onClick}
        className={`${base} ${border} text-center px-4 py-7 min-h-[160px] grid content-center`}
      >
        <div className="font-serif text-[38px] font-medium -tracking-[0.02em] text-ink">{priceSym}</div>
        <div className="micro mt-1.5">{tier}</div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${border} px-5 pt-5 pb-5 min-h-[150px] grid gap-3.5`}
    >
      {emoji && <div className="text-[28px] leading-none">{emoji}</div>}
      <div>
        <div className="font-serif font-medium text-[22px] -tracking-[0.01em]">{label}</div>
        {hint && <div className="text-[12px] text-muted mt-0.5">{hint}</div>}
      </div>
    </button>
  );
}
