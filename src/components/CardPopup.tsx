import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import type { EduCard } from "@/data/cards";
import { typeStyles } from "./EduCardTile";
import { narrate, stopNarration } from "@/lib/narrate";
import { duckMusic, isMuted } from "@/lib/sfx";

type Mood = "senang" | "murung" | "penasaran";

function moodOf(card: EduCard): Mood {
  if (card.type === "tangga") return "senang";
  if (card.type === "ular") return "murung";
  return "penasaran";
}

/** Karakter pembaca kartu — beranimasi sesuai mood kartu. */
function NarratorCharacter({ mood, speaking }: { mood: Mood; speaking: boolean }) {
  const skin = "#f5c8a0";
  const hair = mood === "murung" ? "#3b2c55" : "#2f2350";
  const shirt =
    mood === "senang" ? "#22c55e" : mood === "murung" ? "#7e57c2" : "#f59e0b";

  return (
    <div className={`narrator narrator-${mood} ${speaking ? "is-speaking" : ""}`}>
      <svg viewBox="0 0 120 120" className="h-24 w-24" role="img" aria-label={`Karakter ${mood}`}>
        <ellipse cx="60" cy="112" rx="34" ry="6" fill="rgba(0,0,0,.25)" />
        <path d="M28 112c0-20 14-30 32-30s32 10 32 30z" fill={shirt} />
        <g className="narrator-head">
          <circle cx="60" cy="52" r="30" fill={skin} />
          <path d="M30 46c2-20 16-30 30-30s28 10 30 30c-8-8-18-12-30-12s-22 4-30 12z" fill={hair} />
          {mood === "murung" ? (
            <>
              <path d="M42 46l14 5M78 46l-14 5" stroke="#2b2340" strokeWidth="3" strokeLinecap="round" />
              <circle cx="49" cy="56" r="3.6" fill="#2b2340" />
              <circle cx="71" cy="56" r="3.6" fill="#2b2340" />
              <path d="M50 74q10-8 20 0" stroke="#2b2340" strokeWidth="3.4" fill="none" strokeLinecap="round" />
              <circle className="narrator-tear" cx="49" cy="63" r="3" fill="#60a5fa" />
            </>
          ) : mood === "senang" ? (
            <>
              <path d="M42 44q7-6 14 0M64 44q7-6 14 0" stroke="#2b2340" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M44 55q5-6 10 0M66 55q5-6 10 0" stroke="#2b2340" strokeWidth="3.4" fill="none" strokeLinecap="round" />
              <path d="M48 68q12 12 24 0" stroke="#2b2340" strokeWidth="3.6" fill="none" strokeLinecap="round" />
              <circle cx="38" cy="64" r="5" fill="#f472b6" opacity=".6" />
              <circle cx="82" cy="64" r="5" fill="#f472b6" opacity=".6" />
            </>
          ) : (
            <>
              <circle cx="49" cy="55" r="4" fill="#2b2340" />
              <circle cx="71" cy="55" r="4" fill="#2b2340" />
              <path d="M50 70q10 6 20 0" stroke="#2b2340" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            </>
          )}
          <ellipse className="narrator-mouth" cx="60" cy="72" rx="7" ry="5" fill="#2b2340" />
        </g>
      </svg>
    </div>
  );
}

export function CardPopup({
  card,
  onClose,
  ctaLabel = "Lanjut Bermain",
  narrateOnOpen = false,
}: {
  card: EduCard;
  onClose: () => void;
  ctaLabel?: string;
  narrateOnOpen?: boolean;
}) {
  const s = typeStyles[card.type];
  const mood = moodOf(card);
  const [speaking, setSpeaking] = useState(false);
  const [done, setDone] = useState(!narrateOnOpen);
  const started = useRef(false);

  useEffect(() => {
    if (!narrateOnOpen || started.current) return;
    started.current = true;
    if (isMuted()) {
      setDone(true);
      return;
    }
    const text = `Kartu ${s.label}. ${card.title}. ${card.body} ${card.extra}`;
    setSpeaking(true);
    duckMusic(true);
    narrate(text)
      .catch(() => {})
      .finally(() => {
        setSpeaking(false);
        duckMusic(false);
        setDone(true);
      });
    return () => {
      stopNarration();
      duckMusic(false);
    };
  }, [card, narrateOnOpen, s.label]);

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
          {narrateOnOpen && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1 text-[11px] font-bold text-foreground/70">
              {speaking ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 animate-pulse" /> Sedang dibacakan…
                </>
              ) : done ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" /> Selesai dibacakan
                </>
              ) : (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyiapkan suara…
                </>
              )}
            </span>
          )}
        </div>

        <div className="px-6 pb-2 pt-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <NarratorCharacter mood={mood} speaking={speaking} />
            <div className="grid h-20 w-20 place-items-center rounded-full bg-card text-4xl shadow-soft">
              {card.emoji}
            </div>
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
            disabled={!done}
            className="w-full rounded-2xl bg-primary px-5 py-3 font-display text-base font-extrabold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {done ? ctaLabel : "Dengarkan dulu kartunya…"}
          </button>
        </div>
      </div>
    </div>
  );
}
