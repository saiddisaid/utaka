import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { strategies } from "@/data/materi";

export const Route = createFileRoute("/refleksi")({
  head: () => ({
    meta: [
      { title: "Refleksi Setelah Bermain — UTAKA" },
      {
        name: "description",
        content:
          "Tuliskan pelajaran yang kamu dapat setelah bermain UTAKA dan pilih strategi regulasi emosi yang ingin kamu coba.",
      },
      { property: "og:title", content: "Refleksi Setelah Bermain — UTAKA" },
      {
        property: "og:description",
        content: "Refleksi pribadi tanpa penilaian, tersimpan hanya di perangkatmu.",
      },
    ],
  }),
  component: Refleksi,
});

const STORAGE_KEY = "utaka-refleksi";

type Saved = { feeling: string; learned: string; strategy: string; action: string };

const feelings = ["😌 Lega", "🙂 Biasa saja", "😔 Sedih", "🤔 Merenung", "😄 Senang"];

function Refleksi() {
  const [feeling, setFeeling] = useState("");
  const [learned, setLearned] = useState("");
  const [strategy, setStrategy] = useState("");
  const [action, setAction] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Saved;
      setFeeling(d.feeling ?? "");
      setLearned(d.learned ?? "");
      setStrategy(d.strategy ?? "");
      setAction(d.action ?? "");
    } catch {
      /* abaikan */
    }
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ feeling, learned, strategy, action } satisfies Saved),
    );
    setSaved(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
        💭 Reflect
      </span>
      <h1 className="mt-4 text-4xl font-extrabold">Refleksi Setelah Bermain</h1>
      <p className="mt-4 text-muted-foreground">
        Tidak ada jawaban benar atau salah, dan tidak ada penilaian. Refleksi ini hanya untukmu
        dan tersimpan di perangkatmu sendiri.
      </p>

      <form onSubmit={save} className="card-soft mt-8 space-y-7 p-6 md:p-8">
        <div>
          <label className="font-display text-sm font-bold">
            Bagaimana perasaanmu setelah bermain?
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {feelings.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFeeling(f)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  feeling === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="learned" className="font-display text-sm font-bold">
            Apa pelajaran yang kamu dapat hari ini?
          </label>
          <textarea
            id="learned"
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
            rows={4}
            placeholder="Tulis sejujurnya, sebanyak atau sesedikit yang kamu mau..."
            className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="font-display text-sm font-bold">
            Strategi regulasi emosi mana yang paling ingin kamu coba?
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {strategies.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStrategy(s.name)}
                className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left text-sm font-semibold transition-colors ${
                  strategy === s.name
                    ? "border-tangga bg-tangga-soft text-tangga-ink"
                    : "border-border bg-card text-foreground/80"
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="min-w-0">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="action" className="font-display text-sm font-bold">
            Satu langkah kecil yang akan kamu lakukan minggu ini
          </label>
          <textarea
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            rows={3}
            placeholder="Contoh: aku akan berhenti mengecek media sosialnya setiap malam."
            className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-primary px-6 py-4 font-display text-lg font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Simpan Refleksi
        </button>

        {saved && (
          <div className="animate-pop rounded-2xl bg-tangga-soft p-4 text-center text-sm font-semibold text-tangga-ink">
            Refleksimu tersimpan. Terima kasih sudah jujur pada dirimu sendiri 🤍
          </div>
        )}
      </form>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl surface-cream p-8">
        <div>
          <h2 className="font-display text-xl font-bold">Improve</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Baca lagi materinya, atau ajak temanmu bermain bersama.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/belajar"
            className="rounded-2xl border-2 border-primary/30 bg-card px-5 py-3 font-display font-bold text-primary transition-transform hover:scale-105"
          >
            Baca Materi
          </Link>
          <Link
            to="/"
            className="rounded-2xl bg-primary px-5 py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}
