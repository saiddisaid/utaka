export const BOARD_SIZE = 100;

/** Tangga: petak bawah -> petak atas (mengikuti desain papan). */
export const ladders: Record<number, number> = {
  8: 13,
  19: 40,
  24: 37,
  49: 54,
  71: 90,
  76: 85,
};

/** Ular: kepala -> ekor (mengikuti desain papan). */
export const snakes: Record<number, number> = {
  98: 83,
  89: 70,
  62: 43,
  54: 35,
  29: 11,
  5: 2,
};

export const ladderOrder = Object.keys(ladders).map(Number);
export const snakeOrder = Object.keys(snakes).map(Number);

/** Petak FUNFACT persis mengikuti posisi pada desain papan. */
export const funFactSquares = [
  2, 7, 17, 21, 26, 33, 38, 42, 47, 52, 57, 61, 66, 73, 78, 82, 87, 92, 97,
];

export const playerColors = [
  "var(--pion-1)",
  "var(--pion-2)",
  "var(--pion-3)",
  "var(--pion-4)",
];

export const playerNames = ["Pemain 1", "Pemain 2", "Pemain 3", "Pemain 4"];

/** Urutan kotak boustrophedon: baris bawah kiri->kanan, baris atas kanan->kiri. */
export function boardCells(): number[] {
  const rows: number[][] = [];
  for (let r = 0; r < 10; r++) {
    const start = r * 10 + 1;
    const row = Array.from({ length: 10 }, (_, i) => start + i);
    rows.push(r % 2 === 0 ? row : row.reverse());
  }
  return rows.reverse().flat();
}

export type SquareKind = "start" | "finish" | "tangga" | "ular" | "funfact" | "normal";

export function squareKind(n: number): SquareKind {
  if (n === 1) return "start";
  if (n === BOARD_SIZE) return "finish";
  if (ladders[n]) return "tangga";
  if (snakes[n]) return "ular";
  if (funFactSquares.includes(n)) return "funfact";
  return "normal";
}

/** Palet kuat papan: merah, biru navy, kuning, magenta, oranye. */
const cellPalette = [
  "var(--board-red)",
  "var(--board-navy)",
  "var(--board-yellow)",
  "var(--board-magenta)",
  "var(--board-orange)",
  "var(--board-pink)",
];

/** Warna dasar tiap petak, deterministik agar konsisten seperti desain cetak. */
export function cellColor(n: number): string {
  if (n === 1) return "var(--board-navy)";
  if (n === BOARD_SIZE) return "var(--board-blue)";
  const i = (n * 7 + Math.floor(n / 10) * 3) % cellPalette.length;
  return cellPalette[i]!;
}

/** Teks kontras untuk petak. */
export function cellInk(n: number): string {
  const c = cellColor(n);
  return c === "var(--board-yellow)" ? "var(--board-navy)" : "#ffffff";
}

/** Koordinat pusat petak dalam persen (0-100) untuk overlay ular & tangga. */
export function cellCenter(n: number): { x: number; y: number } {
  const idx = n - 1;
  const row = Math.floor(idx / 10); // 0 = baris bawah
  const inRow = idx % 10;
  const col = row % 2 === 0 ? inRow : 9 - inRow;
  return { x: col * 10 + 5, y: (9 - row) * 10 + 5 };
}

export function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${s.toString().padStart(2, "0")}d`;
}
