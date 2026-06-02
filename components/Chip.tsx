"use client";

type Props = {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

export function Chip({ children, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-[14px] font-medium border transition-all ${
        selected
          ? "bg-ink text-white border-ink"
          : "bg-card text-ink-2 border-line hover:border-[#d8d2c4]"
      }`}
    >
      {children}
    </button>
  );
}
