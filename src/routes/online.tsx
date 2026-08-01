import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Users, Wifi } from "lucide-react";
import { createRoomFn, joinRoomFn } from "@/lib/online.functions";
import { lastUsedName, saveRoomSession } from "@/lib/room-session";

export const Route = createFileRoute("/online")({
  head: () => ({
    meta: [
      { title: "Main Online Bersama Teman — UTAKA" },
      {
        name: "description",
        content:
          "Buat room UTAKA atau gabung dengan kode undangan untuk bermain ular tangga regulasi emosi secara real-time bersama teman.",
      },
      { property: "og:title", content: "Main Online Bersama Teman — UTAKA" },
      {
        property: "og:description",
        content: "Room real-time hingga 4 pemain, lengkap dengan chat dan refleksi bersama.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    kode: typeof s['kode'] === "string" ? (s['kode'] as string) : undefined,
  }),
  component: OnlinePage,
});

function OnlinePage() {
  const navigate = useNavigate();
  const { kode } = Route.useSearch();
  const [name, setName] = useState("");
  const [code, setCode] = useState(kode ?? "");
  const [busy, setBusy] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(lastUsedName() || "Pemain");
  }, []);

  async function handleCreate() {
    setBusy("create");
    setError(null);
    try {
      const res = await createRoomFn({ data: { name } });
      saveRoomSession({ ...res, name });
      navigate({ to: "/main/$kode", params: { kode: res.code } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuat room.");
      setBusy(null);
    }
  }

  async function handleJoin() {
    setBusy("join");
    setError(null);
    try {
      const res = await joinRoomFn({ data: { code, name } });
      saveRoomSession({ ...res, name });
      navigate({ to: "/main/$kode", params: { kode: res.code } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal bergabung ke room.");
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--accent)]">
        Mode Online
      </p>
      <h1 className="mt-2 text-4xl font-extrabold">Main Bareng Teman, Real-Time</h1>
      <p className="mt-3 max-w-2xl opacity-80">
        Buat room lalu bagikan kode atau link undangan. Semua pemain melihat papan, dadu, dan kartu
        yang sama secara langsung — lengkap dengan chat dan refleksi bersama di akhir permainan.
      </p>

      <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5">
        <label htmlFor="nama" className="text-sm font-bold">
          Nama tampilan kamu
        </label>
        <input
          id="nama"
          value={name}
          maxLength={16}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold outline-none focus:border-white/60"
          placeholder="Nama kamu"
        />
        <p className="mt-2 text-xs opacity-70">
          Bermain sebagai tamu tanpa login.{" "}
          <Link to="/auth" className="underline">
            Login (opsional)
          </Link>{" "}
          bila ingin riwayat permainanmu tersimpan di akun.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <Users className="h-7 w-7 text-[color:var(--accent)]" />
          <h2 className="mt-3 text-xl font-extrabold">Buat Room Baru</h2>
          <p className="mt-1 text-sm opacity-80">
            Kamu menjadi host: mengatur kapan permainan dimulai, dan bisa melewati giliran bila ada
            pemain yang terputus.
          </p>
          <button
            type="button"
            onClick={handleCreate}
            disabled={busy !== null}
            className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Buat Room
          </button>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <Wifi className="h-7 w-7 text-[color:var(--accent)]" />
          <h2 className="mt-3 text-xl font-extrabold">Gabung Room</h2>
          <p className="mt-1 text-sm opacity-80">Masukkan kode room 5 huruf dari temanmu.</p>
          <input
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="mt-4 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-2xl font-extrabold tracking-[0.4em] outline-none focus:border-white/60"
            placeholder="ABC12"
          />
          <button
            type="button"
            onClick={handleJoin}
            disabled={busy !== null || code.trim().length < 3}
            className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy === "join" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Gabung
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 font-semibold">
          {error}
        </p>
      )}

      <p className="mt-8 text-sm opacity-75">
        Ingin bermain satu perangkat bergantian?{" "}
        <Link to="/bermain" className="font-bold underline">
          Mode lokal (offline)
        </Link>
        .
      </p>
    </main>
  );
}
