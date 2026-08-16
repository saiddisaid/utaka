import { createFileRoute, Link } from "@tanstack/react-router";
import avatarAlyna from "@/assets/avatar-alyna.png";
import avatarTsamara from "@/assets/avatar-tsamara.png";


export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang UTAKA — Tujuan, Tim & Penelitian" },
      {
        name: "description",
        content:
          "Tentang UTAKA: tujuan website, latar belakang penelitian, dan tim peneliti media psikoedukasi regulasi emosi remaja.",
      },
      { property: "og:title", content: "Tentang UTAKA" },
      {
        property: "og:description",
        content: "Latar belakang, tujuan, dan penelitian di balik permainan edukatif UTAKA.",
      },
    ],
  }),
  component: Tentang,
});

const tujuan = [
  "Meningkatkan pemahaman remaja tentang regulasi emosi.",
  "Membantu remaja mengenali emosi akibat cinta tak berbalas.",
  "Melatih pengambilan keputusan positif saat menghadapi penolakan.",
  "Menumbuhkan penerimaan diri dan cara berpikir yang lebih adaptif.",
  "Memberikan pengalaman belajar yang menyenangkan melalui permainan.",
];

const asalSekolah = "MAN 3 Bantul, Daerah Istimewa Yogyakarta";

const tim = [
  {
    avatar: avatarAlyna,
    name: "Alyna Yukha Rizqananda",
    role: "Ketua Peneliti",
  },
  {
    avatar: avatarTsamara,
    name: "Tsamara Khairanna Mufida",
    role: "Anggota Peneliti",
  },
];


function Tentang() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
        ℹ️ Tentang
      </span>
      <h1 className="mt-4 text-4xl font-extrabold">Tentang UTAKA</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        UTAKA (Ular Tangga Kartu) adalah media psikoedukasi berbasis permainan yang mengubah
        permainan fisik menjadi pengalaman belajar digital tentang regulasi emosi.
      </p>

      <section className="mt-10 card-soft p-8">
        <h2 className="text-2xl font-extrabold">Tujuan Website</h2>
        <ul className="mt-5 space-y-3">
          {tujuan.map((t) => (
            <li key={t} className="flex gap-3 rounded-2xl bg-secondary p-4 text-sm">
              <span className="shrink-0">🎯</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-3xl surface-cream p-8">
        <h2 className="text-2xl font-extrabold">Tentang Penelitian</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          UTAKA dikembangkan sebagai media bimbingan kelompok yang dapat digunakan oleh siapa pun
          yang pernah mengalami cinta tak berbalas, penolakan, atau kegagalan dalam mendekati
          seseorang — dengan remaja sebagai target utamanya. Materinya berpijak pada enam strategi
          regulasi emosi yang dijadikan dasar seluruh kartu permainan.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Pendekatan yang digunakan adalah experiential learning: pemain belajar dari pengalaman
          bermain, diskusi kelompok, dan refleksi diri. Website ini tidak memberikan penilaian
          maupun diagnosis; hasil refleksi sepenuhnya milik pengguna dan disimpan di perangkatnya
          sendiri.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { k: "Target utama", v: "Remaja" },
            { k: "Durasi permainan", v: "± 30 menit" },
          ].map((i) => (
            <div key={i.k} className="rounded-2xl bg-card p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {i.k}
              </p>
              <p className="mt-1 font-display font-bold">{i.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold">Tim Peneliti</h2>
        <p className="mt-2 text-sm text-muted-foreground">{asalSekolah}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {tim.map((t) => (
            <div key={t.name} className="card-soft hover-lift flex items-center gap-4 p-6">
              <img
                src={t.avatar}
                alt={`Avatar ${t.name}`}
                width={512}
                height={512}
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-full bg-secondary object-cover"
              />
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold">{t.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{t.role}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-primary/10 p-8">
        <div>
          <h2 className="font-display text-xl font-bold">Mulai perjalanan belajarmu</h2>
          <p className="mt-1 text-sm text-muted-foreground">Learn → Play → Reflect → Improve</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/belajar"
            className="rounded-2xl border-2 border-primary/30 bg-card px-5 py-3 font-display font-bold text-primary transition-transform hover:scale-105"
          >
            Belajar
          </Link>
          <Link
            to="/bermain"
            className="rounded-2xl bg-primary px-5 py-3 font-display font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Bermain
          </Link>
        </div>
      </div>
    </div>
  );
}
