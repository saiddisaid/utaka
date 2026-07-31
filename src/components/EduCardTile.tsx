import type { EduCard, CardType } from "@/data/cards";

export const typeStyles: Record<
  CardType,
  { bg: string; ink: string; ring: string; chip: string; label: string }
> = {
  tangga: {
    bg: "bg-tangga-soft",
    ink: "text-tangga-ink",
    ring: "border-tangga",
    chip: "bg-tangga text-tangga-ink",
    label: "Tangga",
  },
  ular: {
    bg: "bg-ular-soft",
    ink: "text-ular-ink",
    ring: "border-ular",
    chip: "bg-ular text-ular-ink",
    label: "Ular",
  },
  funfact: {
    bg: "bg-funfact-soft",
    ink: "text-funfact-ink",
    ring: "border-funfact",
    chip: "bg-funfact text-funfact-ink",
    label: "Fun Fact",
  },
};

export function EduCardTile({ card, onClick }: { card: EduCard; onClick?: () => void }) {
  const s = typeStyles[card.type];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hover-lift w-full rounded-3xl border-2 ${s.ring} ${s.bg} p-5 text-left`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.chip}`}>{s.label}</span>
        <span className="text-2xl">{card.emoji}</span>
      </div>
      <h3 className={`mt-3 font-display text-base font-bold ${s.ink}`}>{card.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-foreground/75">{card.body}</p>
      <span className="mt-3 inline-block text-xs font-semibold text-muted-foreground">
        Kode {card.code} · klik untuk baca
      </span>
    </button>
  );
}
