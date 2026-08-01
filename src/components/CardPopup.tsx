import type { EduCard } from "@/data/cards";
import { typeStyles } from "./EduCardTile";

export function CardPopup({
  card,
  onClose,
  ctaLabel = "Lanjut Bermain",
}: {
  card: EduCard;
  onClose: () => void;
  ctaLabel?: string;
}) {
  const s = typeStyles[card.type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 px-4 py-8 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-pop w-full max-w-md overflow-hidden rounded-3xl border-4 ${s.ring} ${s.bg} shadow-lift`}
      >
        <div className="flex items-center justify-between gap-3 px-6 pt-6">
          <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${s.chip}`}>
            Kartu {s.label}
          </span>
        </div>

        <div className="px-6 pb-2 pt-4 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-card text-4xl shadow-soft">
            {card.emoji}
          </div>
          <h2 className={`mt-4 font-display text-xl font-extrabold ${s.ink}`}>{card.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{card.body}</p>
          <div className="mt-4 rounded-2xl bg-card/90 px-4 py-3 text-sm font-semibold text-foreground/80">
            {card.extra}
          </div>
        </div>

        <div className="p-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-primary px-5 py-3 font-display text-base font-extrabold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
