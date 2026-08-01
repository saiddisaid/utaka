import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameBoard, type Player } from "@/components/GameBoard";
import { Dice, Pion } from "@/components/Dice";
import { CardPopup } from "@/components/CardPopup";
import { Confetti } from "@/components/Confetti";
import {
  BOARD_SIZE,
  formatDuration,
  funFactSquares,
  ladderOrder,
  ladders,
  playerColors,
  snakeOrder,
  snakes,
} from "@/lib/board";
import {
  setMuted,
  sfxDiceRoll,
  sfxForCard,
  sfxLadder,
  sfxSnake,
  sfxStep,
  sfxWin,
  startMusic,
  stopMusic,
  unlockAudio,
} from "@/lib/sfx";

import { funFactCards, tanggaCards, ularCards, type EduCard } from "@/data/cards";

export const Route = createFileRoute("/bermain")({
  head: () => ({
    meta: [
      { title: "Bermain UTAKA — Ular Tangga Kartu Regulasi Emosi" },
      {
        name: "description",
        content:
          "Mainkan UTAKA hingga 4 pemain: lempar dadu, naiki tangga, hindari ular, dan buka kartu edukasi regulasi emosi.",
      },
      { property: "og:title", content: "Bermain UTAKA" },
      {
        property: "og:description",
        content: "Papan 100 petak, dadu, kartu edukasi, dan refleksi di akhir permainan.",
      },
    ],
  }),
  component: BermainPage,
});

type Phase = "setup" | "playing" | "finished";

type LogItem = { id: number; text: string };

const SAVE_KEY = "utaka-game-progress-v1";

type SavedGame = {
  phase: Phase;
  count: number;
  names: string[];
  players: Player[];
  turn: number;
  log: LogItem[];
  totalRolls: number;
  startedAt: number;
  elapsed: number;
};

function BermainPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(["Pemain 1", "Pemain 2", "Pemain 3", "Pemain 4"]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [busy, setBusy] = useState(false);
  const [card, setCard] = useState<EduCard | null>(null);
  const [log, setLog] = useState<LogItem[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [totalRolls, setTotalRolls] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [voice, setVoice] = useState<NarratorVoice>("hangat");
  const [restored, setRestored] = useState(false);
  const logId = useRef(0);
  const loaded = useRef(false);

  /* ---- Muat progres tersimpan ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as SavedGame;
        if (s.players?.length && s.phase === "playing") {
          setPhase("playing");
          setCount(s.count);
          setNames(s.names);
          setPlayers(s.players);
          setTurn(s.turn);
          setLog(s.log ?? []);
          setTotalRolls(s.totalRolls ?? 0);
          setElapsed(s.elapsed ?? 0);
          setStartedAt(Date.now() - (s.elapsed ?? 0));
          logId.current = (s.log?.[0]?.id ?? 0) + 1;
          setRestored(true);
        }
      }
    } catch {
      /* abaikan progres rusak */
    }
    loaded.current = true;
  }, []);

  /* ---- Simpan progres otomatis ---- */
  useEffect(() => {
    if (!loaded.current) return;
    if (phase === "playing" && players.length > 0) {
      const data: SavedGame = {
        phase,
        count,
        names,
        players,
        turn,
        log,
        totalRolls,
        startedAt,
        elapsed,
      };
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      } catch {
        /* penyimpanan penuh */
      }
    } else if (phase !== "playing") {
      localStorage.removeItem(SAVE_KEY);
    }
  }, [phase, count, names, players, turn, log, totalRolls, startedAt, elapsed]);

  useEffect(() => {
    setMuted(!soundOn);
  }, [soundOn]);

  /* ---- Musik latar saat bermain ---- */
  useEffect(() => {
    if (phase === "playing" && soundOn) startMusic();
    else stopMusic();
    return () => stopMusic();
  }, [phase, soundOn]);

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => setElapsed(Date.now() - startedAt), 1000);
    return () => clearInterval(t);
  }, [phase, startedAt]);

  const addLog = useCallback((text: string) => {
    logId.current += 1;
    setLog((l) => [{ id: logId.current, text }, ...l].slice(0, 30));
  }, []);


  function start() {
    unlockAudio();
    const list: Player[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: names[i]?.trim() || `Pemain ${i + 1}`,
      pos: 1,
      cards: 0,
    }));
    setPlayers(list);
    setTurn(0);
    setLog([]);
    setWinner(null);
    setTotalRolls(0);
    setElapsed(0);
    setRestored(false);
    setStartedAt(Date.now());
    setPhase("playing");
    addLog(`Permainan dimulai! Giliran pertama: ${list[0]!.name}.`);
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function roll() {
    if (busy || phase !== "playing") return;
    unlockAudio();
    setBusy(true);
    setRolling(true);
    sfxDiceRoll();
    const value = 1 + Math.floor(Math.random() * 6);
    for (let i = 0; i < 12; i++) {
      setDice(1 + Math.floor(Math.random() * 6));
      await sleep(120);
    }
    await sleep(250);
    setDice(value);
    setRolling(false);
    setTotalRolls((n) => n + 1);

    const current = players[turn]!;
    addLog(`${current.name} melempar dadu: ${value}.`);

    let pos = current.pos;
    const target = Math.min(pos + value, BOARD_SIZE);
    while (pos < target) {
      pos += 1;
      const step = pos;
      setPlayers((ps) => ps.map((p) => (p.id === current.id ? { ...p, pos: step } : p)));
      sfxStep();
      await sleep(400);
    }

    let drawn: EduCard | null = null;

    if (ladders[pos]) {
      const idx = ladderOrder.indexOf(pos);
      drawn = tanggaCards[idx % tanggaCards.length]!;
      const to = ladders[pos]!;
      await sleep(450);
      sfxLadder();
      setPlayers((ps) => ps.map((p) => (p.id === current.id ? { ...p, pos: to } : p)));
      addLog(`🪜 ${current.name} naik tangga dari ${pos} ke ${to}.`);
      pos = to;
    } else if (snakes[pos]) {
      const idx = snakeOrder.indexOf(pos);
      drawn = ularCards[idx % ularCards.length]!;
      const to = snakes[pos]!;
      await sleep(450);
      sfxSnake();
      setPlayers((ps) => ps.map((p) => (p.id === current.id ? { ...p, pos: to } : p)));
      addLog(`🐍 ${current.name} turun ular dari ${pos} ke ${to}.`);
      pos = to;
    } else if (funFactSquares.includes(pos)) {
      const idx = funFactSquares.indexOf(pos);
      drawn = funFactCards[idx % funFactCards.length]!;
      addLog(`💡 ${current.name} mendapat kartu Fun Fact di petak ${pos}.`);
    }

    if (drawn) {
      const type = drawn.type;
      setPlayers((ps) =>
        ps.map((p) => (p.id === current.id ? { ...p, cards: p.cards + 1 } : p)),
      );
      await sleep(450);
      sfxForCard(type);
      setCard(drawn);
      return; // giliran lanjut setelah popup ditutup
    }

    finishTurn(pos, current.id);
  }


  function finishTurn(pos: number, playerId: number) {
    if (pos >= BOARD_SIZE) {
      sfxWin();
      setPlayers((ps) => {
        const w = ps.find((p) => p.id === playerId) ?? null;
        setWinner(w);
        return ps;
      });
      setElapsed(Date.now() - startedAt);
      setPhase("finished");
      setBusy(false);
      return;
    }
    setTurn((t) => (t + 1) % players.length);
    setBusy(false);
  }

  function closeCard() {
    setCard(null);
    const current = players[turn]!;
    const latest = players.find((p) => p.id === current.id)!;
    // posisi terkini diambil dari state terbaru
    setPlayers((ps) => {
      const p = ps.find((x) => x.id === current.id) ?? latest;
      setTimeout(() => finishTurn(p.pos, p.id), 0);
      return ps;
    });
  }

  function reset() {
    setPhase("setup");
    setPlayers([]);
    setCard(null);
    setBusy(false);
    setWinner(null);
  }

  /* ---------------- SETUP ---------------- */
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
          🎲 Play
        </span>
        <h1 className="mt-4 text-4xl font-extrabold">Mulai Bermain UTAKA</h1>
        <p className="mt-4 text-muted-foreground">
          Masukkan nama pemain. Kamu bisa bermain sendiri atau bersama hingga 4 orang dalam satu
          perangkat.
        </p>

        <div className="card-soft mt-8 p-6">
          <p className="font-display text-sm font-bold">Jumlah pemain</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`h-12 w-12 rounded-2xl font-display font-bold transition-colors ${
                  count === n
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Pion color={playerColors[i]!} size={30} />
                <input
                  value={names[i]}
                  onChange={(e) =>
                    setNames((ns) => ns.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                  placeholder={`Pemain ${i + 1}`}
                  maxLength={16}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={start}
            className="mt-6 w-full rounded-2xl bg-primary px-6 py-4 font-display text-lg font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Mulai Permainan
          </button>
          <Link
            to="/cara-bermain"
            className="mt-3 block text-center text-sm font-semibold text-primary hover:underline"
          >
            Belum paham aturannya? Baca cara bermain →
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- FINISHED ---------------- */
  if (phase === "finished") {
    const sorted = [...players].sort((a, b) => b.pos - a.pos);
    const totalCards = players.reduce((s, p) => s + p.cards, 0);
    return (
      <div className="relative mx-auto max-w-3xl px-4 py-14">
        <Confetti />
        <div className="card-soft p-8 text-center">
          <span className="text-5xl">🏆</span>
          <h1 className="mt-4 text-3xl font-extrabold">
            {winner ? `${winner.name} menang!` : "Permainan selesai"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Setiap pemain sudah melewati tangga, ular, dan fakta ilmiah. Sekarang waktunya
            refleksi.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-secondary p-5">
              <p className="text-xs font-bold uppercase text-muted-foreground">Total lemparan</p>
              <p className="mt-1 font-display text-2xl font-extrabold">{totalRolls}</p>
            </div>
            <div className="rounded-2xl bg-funfact-soft p-5">
              <p className="text-xs font-bold uppercase text-funfact-ink/80">Kartu terbuka</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-funfact-ink">
                {totalCards}
              </p>
            </div>
            <div className="rounded-2xl bg-tangga-soft p-5">
              <p className="text-xs font-bold uppercase text-tangga-ink/80">Waktu bermain</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-tangga-ink">
                {formatDuration(elapsed)}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-2 text-left">
            {sorted.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <span className="font-display font-extrabold text-muted-foreground">#{i + 1}</span>
                <Pion color={playerColors[p.id]!} size={24} />
                <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                <span className="text-sm text-muted-foreground">petak {p.pos}</span>
                <span className="text-sm text-muted-foreground">{p.cards} kartu</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/refleksi"
              className="rounded-2xl bg-primary px-6 py-3.5 font-display font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              Lanjut ke Refleksi
            </Link>
            <button
              type="button"
              onClick={reset}
              className="rounded-2xl border-2 border-primary/30 px-6 py-3.5 font-display font-bold text-primary transition-transform hover:scale-105"
            >
              Main Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- PLAYING ---------------- */
  const current = players[turn]!;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {restored && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-tangga-soft px-4 py-3 text-sm font-semibold text-tangga-ink">
          <span>💾 Progres permainanmu sebelumnya berhasil dilanjutkan.</span>
          <button
            type="button"
            onClick={() => setRestored(false)}
            className="ml-auto rounded-full bg-card px-3 py-1 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <GameBoard players={players} activeSquare={current.pos} />
        </div>

        <aside className="space-y-4">
          <div className="card-soft space-y-3 p-5">
            <button
              type="button"
              onClick={() => setSoundOn((v) => !v)}
              className="w-full rounded-2xl border-2 border-border px-5 py-3 text-sm font-bold"
            >
              {soundOn ? "🔊 Suara Aktif" : "🔇 Suara Mati"}
            </button>
            <div>
              <label
                htmlFor="voice"
                className="text-xs font-bold uppercase text-muted-foreground"
              >
                Suara Narator Kartu
              </label>
              <select
                id="voice"
                value={voice}
                onChange={(e) => setVoice(e.target.value as NarratorVoice)}
                className="mt-2 w-full rounded-2xl border-2 border-border bg-card px-4 py-2.5 text-sm font-semibold"
              >
                <option value="hangat">Hangat &amp; Ramah</option>
                <option value="ceria">Ceria &amp; Bersemangat</option>
                <option value="tenang">Tenang &amp; Lembut</option>
              </select>
            </div>
          </div>


          <div className="card-soft p-5">
            <div className="flex min-w-0 items-center gap-3">
              <Pion color={playerColors[current.id]!} size={30} active />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-muted-foreground">Giliran</p>
                <p className="truncate font-display text-lg font-bold">{current.name}</p>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-bold">
                {formatDuration(elapsed)}
              </span>
            </div>

            <div className="mt-5 flex flex-col items-center gap-4">
              <Dice value={dice} rolling={rolling} />
              <button
                type="button"
                onClick={roll}
                disabled={busy}
                className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-lg font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {busy ? "Bidak bergerak..." : "Roll Dice"}
              </button>
            </div>
          </div>

          <div className="card-soft p-5">
            <p className="font-display text-sm font-bold">Progress Pemain</p>
            <div className="mt-3 space-y-3">
              {players.map((p) => (
                <div key={p.id}>
                  <div className="flex items-center gap-2 text-sm">
                    <Pion color={playerColors[p.id]!} size={20} />
                    <span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {p.pos}/100 · {p.cards}🃏
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${p.pos}%`,
                        backgroundColor: playerColors[p.id],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-soft max-h-64 overflow-y-auto p-5">
            <p className="font-display text-sm font-bold">Riwayat Permainan</p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {log.map((l) => (
                <li key={l.id} className="rounded-xl bg-secondary/60 px-3 py-2">
                  {l.text}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={reset}
            className="w-full rounded-2xl border-2 border-border px-5 py-3 text-sm font-bold text-muted-foreground"
          >
            Keluar & Atur Ulang
          </button>
        </aside>
      </div>

      {card && <CardPopup card={card} onClose={closeCard} narrateOnOpen />}
    </div>
  );
}
