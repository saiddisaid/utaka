import { createFileRoute, Link } from "@tanstack/react-router";
import { strategies, dampakTidakDikelola, tipsCintaTakBerbalas } from "@/data/materi";

export const Route = createFileRoute("/belajar")({
  head: () => ({
    meta: [
      { title: "Belajar Regulasi Emosi — UTAKA" },
      {
        name: "description",
        content:
          "Pahami regulasi emosi, cinta tak berbalas, dampaknya, dan 6 strategi regulasi emosi: reappraisal, acceptance, distraction, social support, problem solving, mindfulness.",
      },
      { property: "og:title", content: "Belajar Regulasi Emosi — UTAKA" },
      {
        property: "og:description",
        content: "Materi psikoedukasi ringkas untuk remaja yang sedang menghadapi cinta tak berbalas.",
      },
    ],
  }),
  component: Belajar,
});

function Belajar() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
        📖 Learn
      </span>
      <h1 className="mt-4 text-4xl font-extrabold">Belajar Regulasi Emosi</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Sebelum bermain, kenali dulu apa yang sebenarnya terjadi di dalam dirimu ketika perasaan
        tidak berbalas. Materi ini singkat, ringan, dan tidak menghakimi.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <article className="card-soft p-6">
          <span className="text-2xl">🧠</span>
          <h2 className="mt-3 font-display text-xl font-bold">Apa itu Regulasi Emosi?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Regulasi emosi adalah kemampuan mengenali, memahami, dan mengelola emosi yang muncul
            agar respons kita tetap sehat dan sesuai situasi. Regulasi emosi bukan berarti
            menahan atau menyembunyikan perasaan, melainkan memilih cara merespons yang tidak
            merugikan diri sendiri maupun orang lain.
          </p>
        </article>

        <article className="card-soft p-6">
          <span className="text-2xl">💔</span>
          <h2 className="mt-3 font-display text-xl font-bold">Apa itu Cinta Tak Berbalas?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Cinta tak berbalas (unrequited love) terjadi ketika perasaan romantis yang kita miliki
            tidak dirasakan balik oleh orang tersebut — misalnya ditolak, gagal confess, atau
            PDKT yang berhenti di tengah jalan. Ini pengalaman yang sangat umum pada remaja dan
            bisa memunculkan sedih, malu, cemas, hingga rasa tidak berharga.
          </p>
        </article>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold">Dampak Jika Emosi Tidak Dikelola</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {dampakTidakDikelola.map((d) => (
            <div key={d.title} className="rounded-2xl border-2 border-ular bg-ular-soft p-5">
              <span className="text-2xl">{d.emoji}</span>
              <h3 className="mt-2 font-display text-base font-bold text-ular-ink">{d.title}</h3>
              <p className="mt-1 text-sm text-ular-ink/85">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold">6 Strategi Regulasi Emosi</h2>
        <p className="mt-2 text-muted-foreground">
          Keenam strategi ini menjadi dasar seluruh kartu dalam permainan UTAKA.
        </p>
        <div className="mt-6 space-y-5">
          {strategies.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className="card-soft scroll-mt-24 p-6 md:flex md:gap-6"
            >
              <div className="mb-4 flex shrink-0 items-center gap-3 md:mb-0 md:block md:text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-tangga-soft text-2xl">
                  {s.emoji}
                </span>
                <span className="mt-2 block text-xs font-bold text-muted-foreground">
                  Strategi {i + 1} · {s.code}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-secondary p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Contoh penerapan
                    </p>
                    <p className="mt-1 text-sm">{s.example}</p>
                  </div>
                  <div className="rounded-2xl bg-tangga-soft p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-tangga-ink/80">
                      Manfaat
                    </p>
                    <p className="mt-1 text-sm text-tangga-ink">{s.benefit}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl surface-cream p-8">
        <h2 className="text-2xl font-extrabold">Tips Menghadapi Cinta Tak Berbalas</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {tipsCintaTakBerbalas.map((t) => (
            <li key={t} className="flex gap-3 rounded-2xl bg-card p-4 text-sm shadow-soft">
              <span className="shrink-0">✅</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-primary/10 p-8">
        <div>
          <h2 className="font-display text-xl font-bold">Sudah paham dasarnya?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Saatnya mempraktikkan lewat permainan UTAKA.
          </p>
        </div>
        <Link
          to="/bermain"
          className="rounded-2xl bg-primary px-6 py-3.5 font-display font-bold text-primary-foreground transition-transform hover:scale-105"
        >
          Mulai Bermain
        </Link>
      </div>
    </div>
  );
}
