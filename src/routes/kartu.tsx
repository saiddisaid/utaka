import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { allCards, cardTypeLabel, type CardType, type EduCard } from "@/data/cards";
import { EduCardTile } from "@/components/EduCardTile";
import { CardPopup } from "@/components/CardPopup";

export const Route = createFileRoute("/kartu")({
  head: () => ({
    meta: [
      { title: "Kartu Edukasi UTAKA — Tangga, Ular & Fun Fact" },
      {
        name: "description",
        content:
          "Jelajahi 36 kartu edukasi UTAKA: 6 kartu tangga, 6 kartu ular, dan 24 kartu fun fact tentang regulasi emosi remaja.",
      },
      { property: "og:title", content: "Kartu Edukasi UTAKA" },
      {
        property: "og:description",
        content: "Semua kartu bisa dipelajari kapan saja, walaupun kamu belum bermain.",
      },
    ],
  }),
  component: KartuPage,
});

const filters: Array<{ key: "semua" | CardType; label: string }> = [
  { key: "semua", label: "Semua" },
  { key: "tangga", label: "Tangga" },
  { key: "ular", label: "Ular" },
  { key: "funfact", label: "Fun Fact" },
];

function KartuPage() {
  const [filter, setFilter] = useState<"semua" | CardType>("semua");
  const [active, setActive] = useState<EduCard | null>(null);

  const list = useMemo(
    () => (filter === "semua" ? allCards : allCards.filter((c) => c.type === filter)),
    [filter],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
        🃏 Koleksi Kartu
      </span>
      <h1 className="mt-4 text-4xl font-extrabold">Kartu Edukasi</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Semua kartu UTAKA bisa kamu baca kapan saja, bahkan tanpa bermain. Klik satu kartu untuk
        membaca isinya secara utuh.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-primary/15"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-muted-foreground">
          {list.length} kartu
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <EduCardTile key={c.id} card={c} onClick={() => setActive(c)} />
        ))}
      </div>

      <div className="mt-14 grid gap-4 rounded-3xl surface-cream p-8 sm:grid-cols-3">
        {(["tangga", "ular", "funfact"] as CardType[]).map((t) => (
          <div key={t} className="rounded-2xl bg-card p-5 shadow-soft">
            <h2 className="font-display text-base font-bold">{cardTypeLabel[t]}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {allCards.filter((c) => c.type === t).length} kartu
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-primary/10 p-8">
        <div>
          <h2 className="font-display text-xl font-bold">Temui kartu ini di permainan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kartu muncul otomatis ketika bidakmu mendarat di petak tertentu.
          </p>
        </div>
        <Link
          to="/bermain"
          className="rounded-2xl bg-primary px-6 py-3.5 font-display font-bold text-primary-foreground transition-transform hover:scale-105"
        >
          Mulai Bermain
        </Link>
      </div>

      {active && (
        <CardPopup card={active} onClose={() => setActive(null)} ctaLabel="Tutup Kartu" />
      )}
    </div>
  );
}
