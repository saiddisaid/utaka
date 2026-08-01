/**
 * Mesin permainan UTAKA — dipakai bersama oleh mode lokal (browser)
 * dan mode online (server), agar aturannya benar-benar identik.
 */
import {
  BOARD_SIZE,
  funFactSquares,
  ladderOrder,
  ladders,
  snakeOrder,
  snakes,
} from "@/lib/board";
import { funFactCards, tanggaCards, ularCards } from "@/data/cards";

export type MoveKind = "normal" | "tangga" | "ular" | "funfact";

export type MoveResult = {
  /** petak awal */
  from: number;
  /** hasil dadu */
  dice: number;
  /** petak setelah melangkah (sebelum ular/tangga) */
  landed: number;
  /** petak akhir (setelah ular/tangga) */
  to: number;
  kind: MoveKind;
  /** id kartu edukasi yang didapat, bila ada */
  cardId: string | null;
  /** true bila pemain mencapai petak 100 */
  win: boolean;
};

export function resolveMove(from: number, dice: number): MoveResult {
  const landed = Math.min(from + dice, BOARD_SIZE);
  let to = landed;
  let kind: MoveKind = "normal";
  let cardId: string | null = null;

  if (ladders[landed]) {
    kind = "tangga";
    to = ladders[landed]!;
    const idx = ladderOrder.indexOf(landed);
    cardId = tanggaCards[idx % tanggaCards.length]!.id;
  } else if (snakes[landed]) {
    kind = "ular";
    to = snakes[landed]!;
    const idx = snakeOrder.indexOf(landed);
    cardId = ularCards[idx % ularCards.length]!.id;
  } else if (funFactSquares.includes(landed)) {
    kind = "funfact";
    const idx = funFactSquares.indexOf(landed);
    cardId = funFactCards[idx % funFactCards.length]!.id;
  }

  return { from, dice, landed, to, kind, cardId, win: to >= BOARD_SIZE };
}

export function rollDiceValue(): number {
  return 1 + Math.floor(Math.random() * 6);
}

export function moveLogText(name: string, m: MoveResult): string[] {
  const logs = [`${name} melempar dadu: ${m.dice}.`];
  if (m.kind === "tangga") logs.push(`🪜 ${name} naik tangga dari ${m.landed} ke ${m.to}.`);
  if (m.kind === "ular") logs.push(`🐍 ${name} turun ular dari ${m.landed} ke ${m.to}.`);
  if (m.kind === "funfact") logs.push(`💡 ${name} mendapat kartu Fun Fact di petak ${m.landed}.`);
  if (m.win) logs.push(`🏆 ${name} sampai di petak 100 dan menang!`);
  return logs;
}
