import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Loader2, LogIn, Send, Wifi, WifiOff } from "lucide-react";
import { GameBoard, type Player } from "@/components/GameBoard";
import { Dice, Pion } from "@/components/Dice";
import { CardPopup } from "@/components/CardPopup";
import { Confetti } from "@/components/Confetti";
import { playerColors } from "@/lib/board";
import { funFactCards, tanggaCards, ularCards, type EduCard } from "@/data/cards";
import {
  setMuted,
  sfxDiceRoll,
  sfxLadder,
  sfxSnake,
  sfxStep,
  sfxWin,
  startMusic,
  stopMusic,
  unlockAudio,
} from "@/lib/sfx";
import type { NarratorVoice } from "@/lib/narrate";
import {
  closeCardFn,
  getRoomStateFn,
  heartbeatFn,
  joinRoomFn,
  kickPlayerFn,
  resetRoomFn,
  rollDiceFn,
  saveReflectionFn,
  sendMessageFn,
  skipTurnFn,
  startGameFn,
} from "@/lib/online.functions";
import { getRoomSession, lastUsedName, saveRoomSession, type RoomSession } from "@/lib/room-session";

export const Route = createFileRoute("/main/$kode")({
  head: ({ params }) => ({
    meta: [
      { title: `Room ${params.kode} — Main UTAKA Online` },
      {
        name: "description",
        content:
          "Papan UTAKA real-time: lempar dadu bergantian, buka kartu regulasi emosi, dan berdiskusi lewat chat room.",
      },
      { property: "og:title", content: `Room ${params.kode} — Main UTAKA Online` },
      {
        property: "og:description",
        content: "Gabung ke room UTAKA dan mainkan ular tangga regulasi emosi bersama.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  ssr: false,
  component: RoomPage,
});

const allCards: EduCard[] = [...tanggaCards, ...ularCards, ...funFactCards];
const cardById = new Map(allCards.map((c) => [c.id, c]));

type RoomRow = {
  id: string;
  code: string;
  status: string;
  host_player_id: string | null;
  turn_index: number;
  dice: number;
  total_rolls: number;
  pending_card_id: string | null;
  pending_card_player_id: string | null;
  winner_player_id: string | null;
  move_seq: number;
  last_move: {
    seq: number;
    playerId: string;
    dice: number;
    from: number;
    landed: number;
    to: number;
    kind: "normal" | "tangga" | "ular" | "funfact";
    cardId: string | null;
  } | null;
};

type PlayerRow = {
  id: string;
  name: string;
  seat: number;
  pos: number;
  cards: number;
  last_seen: string;
};

type EventRow = { id: number; text: string; created_at: string };
type MessageRow = { id: number; name: string; body: string; created_at: string };
type ReflectionRow = { id: string; name: string; answers: Record<string, string> };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function RoomPage() {
  const { kode } = Route.useParams();
  const code = kode.toUpperCase();

  const [session, setSession] = useState<RoomSession | null>(null);
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [reflections, setReflections] = useState<ReflectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Animasi lokal
  const [dice, setDice] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [animPos, setAnimPos] = useState<Record<string, number>>({});
  const [animating, setAnimating] = useState(false);
  const seenSeq = useRef(0);
  const [pendingCard, setPendingCard] = useState<EduCard | null>(null);

  const [muted, setMutedState] = useState(false);
  const [voice, setVoice] = useState<NarratorVoice>("hangat");
  const [chat, setChat] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [joinName, setJoinName] = useState("");

  useEffect(() => {
    setSession(getRoomSession(code));
    setJoinName(lastUsedName() || "Pemain");
  }, [code]);

  const tokenRef = useRef<string | null>(null);
  tokenRef.current = session?.token ?? null;

  const refresh = useCallback(async () => {
    const state = await getRoomStateFn({
      data: { code, token: tokenRef.current },
    }).catch(() => null);
    if (!state) {
      setLoading(false);
      return;
    }
    if (state.notFound) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setRoom(state.room as unknown as RoomRow);
    setPlayers((state.players ?? []) as unknown as PlayerRow[]);
    setEvents((state.events ?? []) as unknown as EventRow[]);
    setMessages(((state.messages ?? []) as unknown as MessageRow[]).slice().reverse());
    setReflections((state.reflections ?? []) as unknown as ReflectionRow[]);
    setLoading(false);
  }, [code]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Sinkronisasi berkala (data dibaca lewat server, bukan langsung dari database)
  useEffect(() => {
    const t = setInterval(() => void refresh(), 1500);
    return () => clearInterval(t);
  }, [refresh]);


  // Heartbeat + jam status koneksi
  useEffect(() => {
    if (!session) return;
    const send = () => void heartbeatFn({ data: { token: session.token } }).catch(() => {});
    send();
    const t = setInterval(send, 10000);
    return () => clearInterval(t);
  }, [session]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  // Musik latar saat bermain
  useEffect(() => {
    if (room?.status === "playing" && !muted) startMusic();
    else stopMusic();
    return () => stopMusic();
  }, [room?.status, muted]);

  // Animasi langkah dari server (sinkron di semua perangkat)
  useEffect(() => {
    const move = room?.last_move;
    if (!move || move.seq <= seenSeq.current) return;
    seenSeq.current = move.seq;
    let cancelled = false;

    (async () => {
      setAnimating(true);
      setRolling(true);
      sfxDiceRoll();
      await sleep(1700);
      if (cancelled) return;
      setDice(move.dice);
      setRolling(false);
      await sleep(1100);
      if (cancelled) return;

      for (let n = move.from + 1; n <= move.landed; n++) {
        if (cancelled) return;
        setAnimPos((prev) => ({ ...prev, [move.playerId]: n }));
        sfxStep();
        await sleep(400);
      }
      if (move.kind === "tangga") sfxLadder();
      if (move.kind === "ular") sfxSnake();
      if (move.to !== move.landed) {
        await sleep(500);
        if (cancelled) return;
        setAnimPos((prev) => ({ ...prev, [move.playerId]: move.to }));
      }
      await sleep(300);
      if (cancelled) return;
      setAnimating(false);
      if (move.cardId) setPendingCard(cardById.get(move.cardId) ?? null);
      if (move.to >= 100) sfxWin();
    })();

    return () => {
      cancelled = true;
    };
  }, [room?.last_move]);

  // Tutup popup saat server menghapus kartu
  useEffect(() => {
    if (room && !room.pending_card_id) setPendingCard(null);
  }, [room?.pending_card_id]);

  const me = useMemo(
    () => players.find((p) => p.id === session?.playerId) ?? null,
    [players, session],
  );
  const isHost = !!me && room?.host_player_id === me.id;
  const current = players.length > 0 && room ? players[room.turn_index % players.length] : null;
  const myTurn = !!me && !!current && current.id === me.id && room?.status === "playing";
  const winner = players.find((p) => p.id === room?.winner_player_id) ?? null;

  const boardPlayers: Player[] = players.map((p) => ({
    id: p.seat,
    name: p.name,
    pos: animPos[p.id] ?? p.pos,
    cards: p.cards,
  }));

  const isOnline = (p: PlayerRow) => now - new Date(p.last_seen).getTime() < 30000;

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    setBusy(true);
    setError(null);
    try {
      const res = await joinRoomFn({ data: { code, name: joinName } });
      const s = { ...res, name: joinName };
      saveRoomSession(s);
      setSession(s);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal bergabung.");
    } finally {
      setBusy(false);
    }
  }

  const inviteLink =
    typeof window !== "undefined" ? `${window.location.origin}/main/${code}` : `/main/${code}`;

  if (loading) {
    return (
      <main className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Room {code} tidak ditemukan</h1>
        <p className="mt-3 opacity-80">Mungkin kodenya salah atau room sudah dihapus.</p>
        <Link to="/online" className="btn-primary mt-6 inline-block">
          Kembali ke Mode Online
        </Link>
      </main>
    );
  }

  if (!session || !me) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-extrabold">Gabung Room {code}</h1>
        <p className="mt-2 opacity-80">Masukkan nama tampilanmu untuk ikut bermain.</p>
        <input
          value={joinName}
          maxLength={16}
          onChange={(e) => setJoinName(e.target.value)}
          className="mt-5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold outline-none focus:border-white/60"
        />
        <button
          type="button"
          onClick={handleJoin}
          disabled={busy}
          className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" /> Gabung Sekarang
        </button>
        {error && <p className="mt-4 font-semibold text-red-300">{error}</p>}
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-70">Room Online</p>
          <h1 className="text-3xl font-extrabold tracking-[0.2em]">{code}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(code)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold"
          >
            <Copy className="mr-1 inline h-4 w-4" /> Salin kode
          </button>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(inviteLink)}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold"
          >
            <Copy className="mr-1 inline h-4 w-4" /> Salin link undangan
          </button>
          <button
            type="button"
            onClick={() => {
              const next = !muted;
              setMutedState(next);
              setMuted(next);
            }}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold"
          >
            {muted ? "🔇 Suara mati" : "🔊 Suara nyala"}
          </button>
        </div>
      </header>

      {error && (
        <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 font-semibold">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          {room?.status === "lobby" ? (
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h2 className="text-2xl font-extrabold">Menunggu pemain…</h2>
              <p className="mt-2 opacity-80">
                Bagikan kode <b className="tracking-widest">{code}</b> atau link undangan. Maksimal 4
                pemain.
              </p>
              <ul className="mt-5 space-y-2">
                {players.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <Pion color={playerColors[p.seat % playerColors.length]!} size={22} />
                    <span className="font-bold">{p.name}</span>
                    {room?.host_player_id === p.id && (
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold">
                        Host
                      </span>
                    )}
                    {p.id === me.id && <span className="text-xs opacity-70">(kamu)</span>}
                    <span className="ml-auto flex items-center gap-1 text-xs opacity-80">
                      {isOnline(p) ? (
                        <>
                          <Wifi className="h-3.5 w-3.5 text-green-400" /> online
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3.5 w-3.5 text-red-400" /> terputus
                        </>
                      )}
                    </span>
                    {isHost && p.id !== me.id && (
                      <button
                        type="button"
                        onClick={() =>
                          void run(() =>
                            kickPlayerFn({ data: { token: session.token, playerId: p.id } }),
                          )
                        }
                        className="rounded-lg border border-white/20 px-2 py-1 text-xs font-bold"
                      >
                        Keluarkan
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {isHost ? (
                <button
                  type="button"
                  disabled={busy || players.length < 2}
                  onClick={() => {
                    unlockAudio();
                    void run(() => startGameFn({ data: { token: session.token } }));
                  }}
                  className="btn-primary mt-6 disabled:opacity-60"
                >
                  Mulai Permainan
                </button>
              ) : (
                <p className="mt-6 font-semibold opacity-80">
                  Menunggu host memulai permainan…
                </p>
              )}
            </div>
          ) : (
            <>
              <GameBoard players={boardPlayers} activeSquare={current ? current.pos : null} />
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                <Dice value={dice} rolling={rolling} />
                <div className="min-w-[180px]">
                  <p className="text-sm opacity-70">Giliran</p>
                  <p className="text-xl font-extrabold">
                    {current ? current.name : "-"} {myTurn && "(kamu)"}
                  </p>
                </div>
                {room?.status === "playing" && (
                  <button
                    type="button"
                    disabled={!myTurn || busy || animating || !!room.pending_card_id}
                    onClick={() => {
                      unlockAudio();
                      void run(() => rollDiceFn({ data: { token: session.token } }));
                    }}
                    className="btn-primary disabled:opacity-50"
                  >
                    {myTurn ? "Lempar Dadu" : "Menunggu giliran…"}
                  </button>
                )}
                {isHost && room?.status === "playing" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void run(() => skipTurnFn({ data: { token: session.token } }))}
                    className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold"
                  >
                    Lewati giliran
                  </button>
                )}
                <label className="ml-auto text-sm">
                  <span className="mr-2 opacity-70">Suara narator</span>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value as NarratorVoice)}
                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 font-semibold"
                  >
                    <option value="hangat">Hangat</option>
                    <option value="ceria">Ceria</option>
                    <option value="tenang">Tenang</option>
                  </select>
                </label>
              </div>

              {room?.status === "finished" && winner && (
                <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-center">
                  <Confetti />
                  <h2 className="text-2xl font-extrabold">🏆 {winner.name} menang!</h2>
                  <p className="mt-1 opacity-80">
                    Total {room.total_rolls} lemparan dadu. Yuk isi refleksi bersama di bawah.
                  </p>
                  {isHost && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void run(() => resetRoomFn({ data: { token: session.token } }))}
                      className="btn-primary mt-4"
                    >
                      Main Lagi
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <h3 className="font-extrabold">Pemain</h3>
            <ul className="mt-3 space-y-2">
              {players.map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-sm">
                  <Pion color={playerColors[p.seat % playerColors.length]!} size={18} />
                  <span className="font-bold">{p.name}</span>
                  <span className="opacity-70">petak {animPos[p.id] ?? p.pos}</span>
                  <span className="opacity-70">· {p.cards} kartu</span>
                  <span className="ml-auto">
                    {isOnline(p) ? (
                      <Wifi className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <WifiOff className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <h3 className="font-extrabold">Chat Room</h3>
            <div className="mt-3 h-48 space-y-2 overflow-y-auto pr-1 text-sm">
              {messages.map((m) => (
                <p key={m.id}>
                  <b className="text-[color:var(--accent)]">{m.name}:</b> {m.body}
                </p>
              ))}
              {messages.length === 0 && <p className="opacity-60">Belum ada pesan.</p>}
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const body = chat;
                if (!body.trim()) return;
                setChat("");
                void run(() => sendMessageFn({ data: { token: session.token, body } }));
              }}
            >
              <input
                value={chat}
                onChange={(e) => setChat(e.target.value)}
                maxLength={300}
                placeholder="Tulis pesan…"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm outline-none focus:border-white/60"
              />
              <button type="submit" className="btn-primary px-3">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <h3 className="font-extrabold">Riwayat Permainan</h3>
            <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto text-sm opacity-90">
              {events.map((e) => (
                <li key={e.id}>• {e.text}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <SharedReflection
        token={session.token}
        reflections={reflections}
        onSaved={() => void refresh()}
      />

      {pendingCard && (
        <CardPopup
          card={pendingCard}
          narrateOnOpen
          voice={voice}
          ctaLabel={
            room?.pending_card_player_id === me.id ? "Lanjut Bermain" : "Menunggu pemain lain…"
          }
          onClose={() => {
            if (room?.pending_card_player_id === me.id) {
              void run(() => closeCardFn({ data: { token: session.token } }));
            }
          }}
        />
      )}
    </main>
  );
}

const REFLECTION_QUESTIONS = [
  { key: "perasaan", label: "Bagaimana perasaanmu setelah bermain UTAKA?" },
  { key: "strategi", label: "Strategi regulasi emosi mana yang paling ingin kamu coba?" },
  { key: "penerapan", label: "Kapan kamu akan menerapkannya dalam kehidupan sehari-hari?" },
];

function SharedReflection({
  token,
  reflections,
  onSaved,
}: {
  token: string;
  reflections: ReflectionRow[];
  onSaved: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <section className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5">
      <h2 className="text-2xl font-extrabold">Refleksi Bersama</h2>
      <p className="mt-1 opacity-80">
        Setiap pemain bisa menuliskan refleksinya di sini, dan semua anggota room dapat membacanya.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setSaving(true);
          void saveReflectionFn({ data: { token, answers } })
            .then(() => {
              setSaved(true);
              setAnswers({});
              onSaved();
            })
            .finally(() => setSaving(false));
        }}
      >
        {REFLECTION_QUESTIONS.map((q) => (
          <div key={q.key}>
            <label htmlFor={q.key} className="text-sm font-bold">
              {q.label}
            </label>
            <textarea
              id={q.key}
              rows={2}
              value={answers[q.key] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none focus:border-white/60"
            />
          </div>
        ))}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Menyimpan…" : "Kirim Refleksi"}
        </button>
        {saved && <p className="text-sm font-semibold text-green-300">Refleksi tersimpan!</p>}
      </form>

      {reflections.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-extrabold">Refleksi teman-teman</h3>
          {reflections.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
              <p className="font-bold text-[color:var(--accent)]">{r.name}</p>
              {REFLECTION_QUESTIONS.map((q) =>
                r.answers?.[q.key] ? (
                  <p key={q.key} className="mt-1">
                    <span className="opacity-70">{q.label}</span>
                    <br />
                    {r.answers[q.key]}
                  </p>
                ) : null,
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
