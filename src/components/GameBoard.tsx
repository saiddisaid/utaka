import {
  boardCells,
  cellCenter,
  cellColor,
  cellInk,
  funFactInk,
  ladders,
  snakes,
  squareKind,
  playerColors,
} from "@/lib/board";
import { Pion } from "@/components/Dice";

export type Player = { id: number; name: string; pos: number; cards: number };

function Ladder({ from, to }: { from: number; to: number }) {
  const a = cellCenter(from);
  const b = cellCenter(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * 2.4;
  const ny = (dx / len) * 2.4;
  const rungs = Math.max(3, Math.round(len / 5));

  return (
    <g strokeLinecap="round">
      <line
        x1={a.x + nx}
        y1={a.y + ny}
        x2={b.x + nx}
        y2={b.y + ny}
        stroke="#8bc34a"
        strokeWidth="1.8"
      />
      <line
        x1={a.x - nx}
        y1={a.y - ny}
        x2={b.x - nx}
        y2={b.y - ny}
        stroke="#8bc34a"
        strokeWidth="1.8"
      />
      {Array.from({ length: rungs }, (_, i) => {
        const t = (i + 0.5) / rungs;
        const px = a.x + dx * t;
        const py = a.y + dy * t;
        return (
          <line
            key={i}
            x1={px + nx}
            y1={py + ny}
            x2={px - nx}
            y2={py - ny}
            stroke="#c5e88a"
            strokeWidth="1.2"
          />
        );
      })}
    </g>
  );
}

function Snake({ from, to }: { from: number; to: number }) {
  const a = cellCenter(from); // kepala
  const b = cellCenter(to); // ekor
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const off = 14;
  const d = `M ${a.x} ${a.y} C ${mx + off} ${a.y + (my - a.y) / 2}, ${mx - off} ${
    b.y - (b.y - my) / 2
  }, ${b.x} ${b.y}`;
  return (
    <g>
      <path d={d} fill="none" stroke="#7e57c2" strokeWidth="4.4" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#cbb2f0" strokeWidth="3.2" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke="#8a63c9"
        strokeWidth="1.1"
        strokeDasharray="1.2 2.6"
        strokeLinecap="round"
      />
      <circle cx={a.x} cy={a.y} r="2.4" fill="#cbb2f0" stroke="#7e57c2" strokeWidth="0.7" />
      <circle cx={a.x - 0.9} cy={a.y - 0.7} r="0.5" fill="#1a1a1a" />
      <circle cx={a.x + 0.9} cy={a.y - 0.7} r="0.5" fill="#1a1a1a" />
      <path d={`M ${a.x} ${a.y + 2.2} l 0 2.4 l -1.2 1`} stroke="#e01b24" strokeWidth="0.6" fill="none" />
    </g>
  );
}

export function GameBoard({
  players,
  activeSquare,
}: {
  players: Player[];
  activeSquare?: number | null;
}) {
  const cells = boardCells();

  return (
    <div className="rounded-2xl border-4 border-white bg-white p-1 shadow-lift">
      <div className="relative">
        <div className="grid grid-cols-10 gap-[2px]">
          {cells.map((n) => {
            const kind = squareKind(n);
            const here = players.filter((p) => p.pos === n);
            const bg = cellColor(n);
            const ink = cellInk(n);
            return (
              <div
                key={n}
                className={`relative aspect-square overflow-hidden ${
                  activeSquare === n ? "outline outline-2 outline-white" : ""
                }`}
                style={{ backgroundColor: bg, color: ink }}
              >
                {kind === "start" ? (
                  <span className="board-num absolute inset-0 grid place-items-center text-center text-[8px] leading-tight sm:text-[11px]">
                    ♡
                    <br />
                    START
                  </span>
                ) : kind === "finish" ? (
                  <span className="board-num absolute inset-0 grid place-items-center text-center text-[8px] leading-tight sm:text-[11px]">
                    ♛
                    <br />
                    FINISH
                  </span>
                ) : kind === "funfact" ? (
                  <span
                    className="board-funfact absolute inset-0 grid place-items-center px-[1px] text-center text-[6.5px] leading-none sm:text-[10px]"
                    style={{ color: funFactInk(n) }}
                  >
                    FUNFACT
                  </span>
                ) : (
                  <span className="board-num absolute inset-0 grid place-items-center text-[10px] sm:text-base">
                    {n}
                  </span>
                )}

                {here.length > 0 && (
                  <span className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-center gap-[1px]">
                    {here.map((p) => (
                      <Pion
                        key={p.id}
                        title={p.name}
                        color={playerColors[p.id]!}
                        size={here.length > 2 ? 16 : 26}
                        active={activeSquare === n}
                      />
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {Object.entries(ladders).map(([from, to]) => (
            <Ladder key={`l${from}`} from={Number(from)} to={to} />
          ))}
          {Object.entries(snakes).map(([from, to]) => (
            <Snake key={`s${from}`} from={Number(from)} to={to} />
          ))}
        </svg>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl bg-card px-3 py-2 text-[11px] font-extrabold text-foreground">
        <span className="text-tangga-ink">Tangga (naik)</span>
        <span className="text-ular-ink">Ular (turun)</span>
        <span className="text-funfact-ink">FUNFACT</span>
        <span className="text-primary">Finish di petak 100</span>
      </div>
    </div>
  );
}
