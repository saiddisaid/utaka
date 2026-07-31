export const BOARD_SIZE = 100;

/** Tangga: petak bawah -> petak atas. Index kartu tangga mengikuti urutan. */
export const ladders: Record<number, number> = {
  4: 25,
  13: 46,
  33: 52,
  42: 63,
  50: 69,
  62: 81,
};

/** Ular: kepala -> ekor. */
export const snakes: Record<number, number> = {
  30: 11,
  47: 26,
  58: 39,
  71: 54,
  88: 67,
  95: 75,
};

export const ladderOrder = Object.keys(ladders).map(Number);
export const snakeOrder = Object.keys(snakes).map(Number);

export const funFactSquares = [
  3, 8, 11, 16, 19, 22, 27, 31, 35, 38, 44, 49, 53, 57, 61, 66, 70, 74, 78, 83,
  86, 90, 93, 97,
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

export function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${s.toString().padStart(2, "0")}d`;
}
