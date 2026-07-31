import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cara-bermain")({
  head: () => ({
    meta: [
      { title: "Cara Bermain UTAKA — Panduan Langkah demi Langkah" },
      {
        name: "description",
        content:
          "Panduan bermain UTAKA: lempar dadu, ikuti petak, baca kartu tangga/ular/fun fact, dan capai finish di petak 100.",
      },
      { property: "og:title", content: "Cara Bermain UTAKA" },
      {
        property: "og:description",
        content: "Empat langkah sederhana untuk memainkan ular tangga kartu UTAKA.",
      },
    ],
  }),
  component: CaraBermain,
});

const steps = [
  {
    n: 1,
    emoji: "🎲",
    title: "Roll Dice",
    text: "Pemain bergiliran melempar dadu. Urutan pemain ditentukan otomatis oleh sistem, seperti hompimpa pada versi fisik.",
  },
  {
    n: 2,
    emoji: "👣",
    title: "Ikuti Petak",
    text: "Bidak bergerak satu per satu sesuai mata dadu. Kamu wajib mengikuti instruksi petak yang kamu tempati.",
  },
  {
    n: 3,
    emoji: "🃏",
    title: "Baca Kartu",
    text: "Tangga → kartu hijau dan naik. Ular → kartu ungu dan turun. Petak Fun Fact → kartu pink berisi fakta ilmiah. Bacakan keras-keras jika bermain bersama teman.",
  },
  {
    n: 4,
    emoji: "🏁",
    title: "Capai Finish",
    text: "Permainan berakhir ketika ada pemain mencapai petak 100, atau ketika waktu 30 menit habis. Lanjutkan ke halaman refleksi.",
  },
];

const rules = [
  "Jumlah pemain 1–4 orang dalam satu perangkat.",
  "Semua bidak dimulai dari petak START (angka 1).",
  "Pemain wajib mengikuti instruksi pada petak yang ditempati.",
  "Tangga membuat bidak naik, ular membuat bidak turun.",
  "Setiap kartu yang muncul dibacakan sebelum melanjutkan giliran.",
  "Durasi permainan disarankan sekitar 30 menit.",
  "Pemenang: pemain yang lebih dulu mencapai finish atau posisi terjauh saat waktu habis.",
];

function CaraBermain() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
        🎮 Play
      </span>
      <h1 className="mt-4 text-4xl font-extrabold">Cara Bermain UTAKA</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Aturannya sama dengan permainan fisik UTAKA, hanya saja dadu, bidak, dan kartunya kini
        digital.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {steps.map((s) => (
          <div key={s.n} className="card-soft hover-lift relative p-6">
            <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-secondary">
              {s.n}
            </span>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-2xl">
              {s.emoji}
            </span>
            <h2 className="mt-4 font-display text-lg font-bold">
              Step {s.n} · {s.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-14 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border-2 border-tangga bg-tangga-soft p-6">
          <span className="text-2xl">🪜</span>
          <h2 className="mt-2 font-display text-lg font-bold text-tangga-ink">Kartu Hijau</h2>
          <p className="mt-2 text-sm text-tangga-ink/85">
            Diambil saat bidak berada di tangga. Berisi gambaran sikap positif dan keberhasilan
            meregulasi emosi. Bidak naik ke petak lebih tinggi.
          </p>
        </div>
        <div className="rounded-3xl border-2 border-ular bg-ular-soft p-6">
          <span className="text-2xl">🐍</span>
          <h2 className="mt-2 font-display text-lg font-bold text-ular-ink">Kartu Ungu</h2>
          <p className="mt-2 text-sm text-ular-ink/85">
            Diambil saat bidak berada di kepala ular. Berisi perilaku regulasi emosi yang kurang
            sehat beserta dampaknya. Bidak turun ke petak lebih rendah.
          </p>
        </div>
        <div className="rounded-3xl border-2 border-funfact bg-funfact-soft p-6">
          <span className="text-2xl">💡</span>
          <h2 className="mt-2 font-display text-lg font-bold text-funfact-ink">Kartu Pink</h2>
          <p className="mt-2 text-sm text-funfact-ink/85">
            Diambil saat bidak berhenti di petak Fun Fact. Berisi fakta ilmiah singkat dan pesan
            edukasi untuk dibaca bersama.
          </p>
        </div>
      </section>

      <section className="mt-14 rounded-3xl surface-cream p-8">
        <h2 className="text-2xl font-extrabold">Aturan Permainan</h2>
        <ul className="mt-5 space-y-3">
          {rules.map((r) => (
            <li key={r} className="flex gap-3 rounded-2xl bg-card p-4 text-sm shadow-soft">
              <span className="shrink-0">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-primary/10 p-8">
        <div>
          <h2 className="font-display text-xl font-bold">Sudah siap?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ajak sampai 3 temanmu bermain.</p>
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
