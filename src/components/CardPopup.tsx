import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Loader2 } from "lucide-react";
import type { EduCard } from "@/data/cards";
import { typeStyles } from "./EduCardTile";
import { narrate, stopNarration, type NarratorVoice } from "@/lib/narrate";
import { duckMusic, isMuted } from "@/lib/sfx";

type Mood = "senang" | "murung" | "penasaran";

function moodOf(card: EduCard): Mood {
  if (card.type === "tangga") return "senang";
  if (card.type === "ular") return "murung";
  return "penasaran";
}

/** Karakter remaja pembaca kartu — gaya sama seperti karakter di hero page. */
function NarratorCharacter({ mood, speaking }: { mood: Mood; speaking: boolean }) {
  const skin = "#f2c19a";
  const skinShade = "#dda87f";
  const hair = mood === "murung" ? "#2b2350" : "#3a2b1c";
  const hoodie =
    mood === "senang" ? "#22c55e" : mood === "murung" ? "#7c5cf0" : "#f59e0b";
  const hoodieDark =
    mood === "senang" ? "#16a34a" : mood === "murung" ? "#6440d8" : "#d97706";

  return (
    <div className={`narrator narrator-${mood} ${speaking ? "is-speaking" : ""}`}>
      <svg viewBox="0 0 140 150" className="h-32 w-32" role="img" aria-label={`Karakter remaja ${mood}`}>
        <ellipse cx="70" cy="142" rx="40" ry="6" fill="rgba(0,0,0,.28)" />

        {/* badan + hoodie */}
        <path d="M32 142c0-26 12-40 24-45h28c12 5 24 19 24 45z" fill={hoodie} />
        <path d="M56 97h28c-3 9-9 13-14 13s-11-4-14-13z" fill={hoodieDark} />
        <path d="M70 110v32" stroke={hoodieDark} strokeWidth="3" strokeLinecap="round" />
        {/* lengan */}
        <path
          className="narrator-arm"
          d={mood === "senang" ? "M36 104q-14-10-16-26" : "M36 106q-12 10-12 26"}
          stroke={hoodie}
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={mood === "senang" ? "M104 104q14-10 16-26" : "M104 106q12 10 12 26"}
          stroke={hoodie}
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={mood === "senang" ? 20 : 24} cy={mood === "senang" ? 76 : 132} r="7" fill={skin} />
        <circle cx={mood === "senang" ? 120 : 116} cy={mood === "senang" ? 76 : 132} r="7" fill={skin} />

        <g className="narrator-head">
          {/* leher */}
          <rect x="62" y="86" width="16" height="14" rx="7" fill={skinShade} />
          {/* wajah */}
          <ellipse cx="70" cy="58" rx="30" ry="32" fill={skin} />
          <ellipse cx="41" cy="60" rx="5" ry="7" fill={skinShade} />
          <ellipse cx="99" cy="60" rx="5" ry="7" fill={skinShade} />
          {/* rambut remaja bergaya */}
          <path
            d="M40 52c-2-22 12-36 30-36s32 14 30 36c-4-6-8-10-13-12-6 5-16 7-27 5-8-1-14 1-20 7z"
            fill={hair}
          />
          <path d="M96 34q10 8 8 22-6-10-14-14z" fill={hair} />

          {/* mata & alis */}
          {mood === "murung" ? (
            <>
              <path d="M50 48l14 6M90 48l-14 6" stroke="#2b2340" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="58" cy="62" r="4" fill="#2b2340" />
              <circle cx="82" cy="62" r="4" fill="#2b2340" />
              <path d="M59 80q11-9 22 0" stroke="#2b2340" strokeWidth="3.6" fill="none" strokeLinecap="round" />
              <circle className="narrator-tear" cx="58" cy="70" r="3.4" fill="#60a5fa" />
            </>
          ) : mood === "senang" ? (
            <>
              <path d="M50 46q8-7 16 0M74 46q8-7 16 0" stroke="#2b2340" strokeWidth="3.2" fill="none" strokeLinecap="round" />
              <path d="M52 60q6-7 12 0M76 60q6-7 12 0" stroke="#2b2340" strokeWidth="3.6" fill="none" strokeLinecap="round" />
              <path d="M57 76q13 13 26 0" stroke="#2b2340" strokeWidth="3.8" fill="none" strokeLinecap="round" />
              <circle cx="46" cy="72" r="5.5" fill="#f472b6" opacity=".55" />
              <circle cx="94" cy="72" r="5.5" fill="#f472b6" opacity=".55" />
            </>
          ) : (
            <>
              <path d="M50 46q8-4 16-1M74 45q8-3 16 1" stroke="#2b2340" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="58" cy="61" r="4.4" fill="#2b2340" />
              <circle cx="82" cy="61" r="4.4" fill="#2b2340" />
              <path d="M59 78q11 7 22 0" stroke="#2b2340" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            </>
          )}
          {/* mulut bicara */}
          <ellipse className="narrator-mouth" cx="70" cy="79" rx="8" ry="6" fill="#2b2340" />
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
  voice = "hangat",
}: {
  card: EduCard;
  onClose: () => void;
  ctaLabel?: string;
  narrateOnOpen?: boolean;
  voice?: NarratorVoice;
}) {
  const s = typeStyles[card.type];
  const mood = moodOf(card);
  const [speaking, setSpeaking] = useState(false);
  const [done, setDone] = useState(!narrateOnOpen);
  const cancelledRef = useRef(false);

  const text = `Kartu ${s.label}. ${card.title}. ${card.body} ${card.extra}`;

  const play = useCallback(() => {
    cancelledRef.current = false;
    setSpeaking(true);
    duckMusic(true);
    void narrate(text, voice)
      .catch((err) => {
        if (cancelledRef.current || (err as Error)?.name === "AbortError") return;
        console.error("Narasi kartu gagal:", err);
      })
      .finally(() => {
        if (cancelledRef.current) return;
        setSpeaking(false);
        duckMusic(false);
        setDone(true);
      });
  }, [text, voice]);

  useEffect(() => {
    if (!narrateOnOpen) return;
    if (isMuted()) {
      setDone(true);
      return;
    }
    setDone(false);
    play();
    return () => {
      cancelledRef.current = true;
      stopNarration();
      duckMusic(false);
    };
  }, [narrateOnOpen, play]);

  useEffect(
    () => () => {
      cancelledRef.current = true;
      stopNarration();
      duckMusic(false);
    },
    [],
  );

  const lockedByNarration = narrateOnOpen && (!done || speaking);

  const replay = () => {
    // Saat kartu wajib dibacakan, pemain tidak boleh menghentikan narasi.
    if (lockedByNarration) return;
    if (speaking) {
      cancelledRef.current = true;
      stopNarration();
      duckMusic(false);
      setSpeaking(false);
      setDone(true);
      return;
    }
    play();
  };

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
          <button
            type="button"
            onClick={replay}
            disabled={lockedByNarration}
            className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1 text-[11px] font-bold text-foreground/70 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {speaking ? (
              <>
                <Volume2 className="h-3.5 w-3.5 animate-pulse" />{" "}
                {lockedByNarration ? "Sedang dibacakan…" : "Sedang dibacakan… (hentikan)"}
              </>
            ) : done ? (
              <>
                <Volume2 className="h-3.5 w-3.5" />{" "}
                {narrateOnOpen ? "Dengarkan lagi" : "Dengarkan kartu"}
              </>
            ) : (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyiapkan suara…
              </>
            )}
          </button>
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
            disabled={lockedByNarration}
            className="w-full rounded-2xl bg-primary px-5 py-3 font-display text-base font-extrabold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {lockedByNarration ? "Dengarkan dulu kartunya…" : ctaLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
