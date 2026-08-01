import { createFileRoute, Link } from "@tanstack/react-router";
import { strategies } from "@/data/materi";
import { allCards } from "@/data/cards";
import heroTeens from "@/assets/hero-teens.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UTAKA — Belajar Regulasi Emosi Lewat Ular Tangga" },
      {
        name: "description",
        content:
          "Permainan edukatif UTAKA membantu remaja memahami dan melatih regulasi emosi saat menghadapi cinta tak berbalas. Learn, Play, Reflect, Improve.",
      },
      { property: "og:title", content: "UTAKA — Belajar Regulasi Emosi Lewat Ular Tangga" },
      {
        property: "og:description",
        content:
          "Main ular tangga kartu, baca kartu edukasi, dan refleksikan pengalamanmu tentang cinta tak berbalas.",
      },
    ],
  }),
  component: Home,
});

const keunggulan = [
  {
    emoji: "🎮",
    title: "Interaktif",
    text: "Lempar dadu, jalankan bidak, dan buka kartu edukasi langsung di layarmu.",
  },
  {
    emoji: "📚",
    title: "Edukatif",
    text: "Enam strategi regulasi emosi dikemas jadi 36 kartu yang mudah dipahami remaja.",
  },
  {
    emoji: "✨",
    title: "Menyenangkan",
    text: "Belajar tanpa ceramah. Bisa main sendiri atau bareng sampai 4 orang.",
  },
];

const alur = [
  { step: "Learn", emoji: "📖", text: "Pahami regulasi emosi & cinta tak berbalas." },
  { step: "Play", emoji: "🎲", text: "Mainkan UTAKA dan temui kartu di setiap petak." },
  { step: "Reflect", emoji: "💭", text: "Tuliskan apa yang kamu rasakan dan pelajari." },
  { step: "Improve", emoji: "🌱", text: "Pilih strategi yang ingin kamu coba di dunia nyata." },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-32 h-72 w-72 rounded-full bg-ular/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Belajar Regulasi Emosi Lewat Permainan{" "}
              <span className="text-primary">Ular Tangga!</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              UTAKA (Ular Tangga Kartu) menemani kamu memahami perasaan saat cinta tak
              berbalas — lewat bermain, membaca kartu, dan merefleksikan pengalamanmu sendiri.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/bermain"
                className="rounded-2xl bg-primary px-6 py-3.5 font-display font-bold text-primary-foreground shadow-soft transition-transform hover:scale-105"
              >
                ▶ Mulai Bermain
              </Link>
              <Link
                to="/belajar"
                className="rounded-2xl bg-board-blue px-6 py-3.5 font-display font-bold text-white transition-transform hover:scale-105"
              >
                Belajar Dulu
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Gratis, tanpa akun, bisa dimainkan sendiri atau bersama teman.
            </p>
          </div>

          <img
            src={heroTeens}
            alt="Dua remaja bermain ular tangga UTAKA bersama"
            width={1024}
            height={912}
            className="animate-float mx-auto h-auto w-full max-w-lg drop-shadow-2xl"
          />
        </div>
      </section>


      {/* Keunggulan */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-5 md:grid-cols-3">
          {keunggulan.map((k) => (
            <div key={k.title} className="card-soft hover-lift p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-2xl">
                {k.emoji}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{k.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{k.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tentang UTAKA */}
      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="rounded-3xl surface-cream p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold">Tentang UTAKA</h2>
              <p className="mt-4 text-muted-foreground">
                UTAKA adalah permainan edukatif yang menggabungkan ular tangga dengan kartu
                psikoedukasi. Setiap petak menghadirkan situasi yang sering dialami remaja saat
                cinta bertepuk sebelah tangan, lalu mengajak pemain berpikir dan menemukan cara
                yang lebih sehat dalam mengelola emosinya.
              </p>
              <p className="mt-3 text-muted-foreground">
                Pendekatannya adalah <strong>experiential learning</strong>: kamu belajar dari
                pengalaman bermain, diskusi, dan refleksi diri — bukan dari ceramah.
              </p>
              <Link
                to="/tentang"
                className="mt-6 inline-flex rounded-2xl border-2 border-primary/30 bg-card px-5 py-3 font-display font-bold text-primary transition-transform hover:scale-105"
              >
                Selengkapnya
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {alur.map((a) => (
                <div key={a.step} className="rounded-2xl bg-card p-5 shadow-soft">
                  <span className="text-2xl">{a.emoji}</span>
                  <h3 className="mt-2 font-display text-base font-bold">{a.step}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preview materi */}
      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold">6 Strategi Regulasi Emosi</h2>
            <p className="mt-2 text-muted-foreground">
              Dasar dari seluruh kartu di dalam permainan UTAKA.
            </p>
          </div>
          <Link to="/belajar" className="font-display font-bold text-primary hover:underline">
            Pelajari semua →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((s) => (
            <Link
              key={s.id}
              to="/belajar"
              hash={s.id}
              className="card-soft hover-lift block p-5"
            >
              <span className="text-2xl">{s.emoji}</span>
              <h3 className="mt-3 font-display text-base font-bold">{s.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.short}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Preview permainan */}
      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-8 shadow-soft md:grid-cols-2 md:items-center md:p-12">
          <div>
            <h2 className="text-3xl font-extrabold">Siap main?</h2>
            <p className="mt-3 text-muted-foreground">
              Sampai 4 pemain, papan 100 petak, {allCards.length} kartu edukasi, dan popup yang
              muncul setiap kali kamu mendarat di tangga, ular, atau petak Fun Fact.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/bermain"
                className="rounded-2xl bg-primary px-6 py-3.5 font-display font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                Mulai Bermain
              </Link>
              <Link
                to="/cara-bermain"
                className="rounded-2xl border-2 border-primary/30 px-6 py-3.5 font-display font-bold text-primary transition-transform hover:scale-105"
              >
                Lihat Cara Bermain
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-tangga bg-tangga-soft p-4 text-center">
              <span className="text-2xl">🪜</span>
              <p className="mt-2 font-display text-sm font-bold text-tangga-ink">Kartu Tangga</p>
              <p className="text-xs text-tangga-ink/80">Regulasi emosi adaptif</p>
            </div>
            <div className="rounded-2xl border-2 border-ular bg-ular-soft p-4 text-center">
              <span className="text-2xl">🐍</span>
              <p className="mt-2 font-display text-sm font-bold text-ular-ink">Kartu Ular</p>
              <p className="text-xs text-ular-ink/80">Hambatan emosi</p>
            </div>
            <div className="rounded-2xl border-2 border-funfact bg-funfact-soft p-4 text-center">
              <span className="text-2xl">💡</span>
              <p className="mt-2 font-display text-sm font-bold text-funfact-ink">Fun Fact</p>
              <p className="text-xs text-funfact-ink/80">Fakta ilmiah</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
