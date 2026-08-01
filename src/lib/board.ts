export const BOARD_SIZE = 100;

/** Tangga: petak bawah -> petak atas (persis desain papan UTAKA). */
export const ladders: Record<number, number> = {
  8: 13,
  19: 39,
  24: 37,
  49: 53,
  71: 90,
  85: 96,
};

/** Ular: kepala -> ekor (persis desain papan UTAKA). */
export const snakes: Record<number, number> = {
  98: 84,
  91: 88,
  62: 43,
  54: 46,
  32: 29,
  18: 5,
};

export const ladderOrder = Object.keys(ladders).map(Number);
export const snakeOrder = Object.keys(snakes).map(Number);

/** Petak FUNFACT persis mengikuti posisi pada desain papan (2 per baris). */
export const funFactSquares = [
  2, 7, 12, 17, 21, 26, 33, 38, 42, 47, 52, 57, 61, 66, 73, 78, 82, 87, 92, 97,
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
  if (funFactSquares.includes(n)) return "funfact";
  if (ladders[n]) return "tangga";
  if (snakes[n]) return "ular";
  return "normal";
}

/**
 * Warna papan diambil langsung dari desain cetak UTAKA.
 * Warna ditentukan oleh kolom visual dan paritas baris (bukan angka petak).
 */
const rowEvenColumns = [
  "#0a196f",
  "#0052cc",
  "#c2185b",
  "#ff1744",
  "#ffea00",
  "#ffff00",
  "#ff4081",
  "#d81b60",
  "#1976d2",
  "#0d47a1",
];

const rowOddColumns = [
  "#1a237e",
  "#b71c1c",
  "#ff5252",
  "#ffd600",
  "#f8ff73",
  "#fdff9f",
  "#fff176",
  "#ff3d00",
  "#e53935",
  "#1565c0",
];

/** Posisi visual petak: baris (0 = paling atas) dan kolom (0 = paling kiri). */
export function cellGrid(n: number): { row: number; col: number } {
  const idx = n - 1;
  const rowFromBottom = Math.floor(idx / 10);
  const inRow = idx % 10;
  const col = rowFromBottom % 2 === 0 ? inRow : 9 - inRow;
  return { row: 9 - rowFromBottom, col };
}

/** Warna dasar tiap petak, persis seperti desain papan. */
export function cellColor(n: number): string {
  const { row, col } = cellGrid(n);
  // baris paling bawah (row 9) memakai palet "even"
  const useEven = (9 - row) % 2 === 0;
  return (useEven ? rowEvenColumns : rowOddColumns)[col]!;
}

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Teks angka: putih tebal dengan garis tepi gelap (seperti desain). */
export function cellInk(n: number): string {
  return luminance(cellColor(n)) > 0.72 ? "#ffffff" : "#ffffff";
}

/** Warna tulisan FUNFACT: tonal terhadap warna petaknya. */
export function funFactInk(n: number): string {
  const c = cellColor(n);
  return luminance(c) > 0.6
    ? "color-mix(in srgb, " + c + " 35%, #ff2d87)"
    : "color-mix(in srgb, " + c + " 35%, #ffffff)";
}

/** Koordinat pusat petak dalam persen (0-100) untuk overlay ular & tangga. */
export function cellCenter(n: number): { x: number; y: number } {
  const { row, col } = cellGrid(n);
  return { x: col * 10 + 5, y: row * 10 + 5 };
}

export function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${s.toString().padStart(2, "0")}d`;
}
