import {
  boardCells,
  cellCenter,
  cellColor,
  cellInk,
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
  const nx = (-dy / len) * 2.6;
  const ny = (dx / len) * 2.6;
  const rungs = Math.max(3, Math.round(len / 6));

  return (
    <g stroke="#7ac70c" strokeWidth="1.5" strokeLinecap="round">
      <line x1={a.x + nx} y1={a.y + ny} x2={b.x + nx} y2={b.y + ny} stroke="#a4e34a" />
      <line x1={a.x - nx} y1={a.y - ny} x2={b.x - nx} y2={b.y - ny} stroke="#a4e34a" />
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
            strokeWidth="1.1"
          />
        );
      })}
    </g>
  );
}

function Snake({ from, to, hue }: { from: number; to: number; hue: string }) {
  const a = cellCenter(from); // kepala
  const b = cellCenter(to); // ekor
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const off = 16;
  const d = `M ${a.x} ${a.y} C ${mx + off} ${a.y + (my - a.y) / 2}, ${mx - off} ${
    b.y - (b.y - my) / 2
  }, ${b.x} ${b.y}`;
  return (
    <g>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="5.4" strokeLinecap="round" />
      <path d={d} fill="none" stroke={hue} strokeWidth="4.4" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.2"
        strokeDasharray="1.6 3"
        strokeLinecap="round"
      />
      <circle cx={a.x} cy={a.y} r="3.4" fill={hue} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
      <circle cx={a.x - 1.2} cy={a.y - 0.9} r="0.7" fill="#111" />
      <circle cx={a.x + 1.2} cy={a.y - 0.9} r="0.7" fill="#111" />
      <path
        d={`M ${a.x} ${a.y + 1.6} l -1.6 2.2 l 1.6 -0.8 l 1.6 0.8 z`}
        fill="#e01b24"
      />
    </g>
  );
}

const snakeHues = ["#c05cf0", "#ff4fa3", "#9b5de5", "#ff6a13", "#7b3fe4", "#e836a8"];

export function GameBoard({
  players,
  activeSquare,
}: {
  players: Player[];
  activeSquare?: number | null;
}) {
  const cells = boardCells();

  return (
    <div className="rounded-3xl border-4 border-board-navy bg-board-navy p-1.5 shadow-lift sm:p-2">
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
                  activeSquare === n ? "ring-2 ring-board-yellow ring-offset-0" : ""
                }`}
                style={{ backgroundColor: bg, color: ink }}
              >
                {kind === "start" ? (
                  <span className="absolute inset-0 grid place-items-center text-center text-[7px] font-black italic leading-tight sm:text-[10px]">
                    ⭐<br />
                    START
                  </span>
                ) : kind === "finish" ? (
                  <span className="absolute inset-0 grid place-items-center text-center text-[7px] font-black italic leading-tight sm:text-[10px]">
                    👑<br />
                    FINISH
                  </span>
                ) : kind === "funfact" ? (
                  <span className="absolute inset-0 grid place-items-center px-[1px] text-center text-[6px] font-black italic leading-none tracking-tight sm:text-[9px]">
                    FUNFACT
                  </span>
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-[9px] font-black italic sm:text-sm">
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
                        size={here.length > 2 ? 14 : 22}
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
          {Object.entries(snakes).map(([from, to], i) => (
            <Snake key={`s${from}`} from={Number(from)} to={to} hue={snakeHues[i % 6]!} />
          ))}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-2xl bg-card px-3 py-2 text-[11px] font-extrabold text-foreground">
        <span className="text-tangga-ink">🪜 Tangga (naik)</span>
        <span className="text-ular-ink">🐍 Ular (turun)</span>
        <span className="text-funfact-ink">💡 FUNFACT</span>
        <span className="text-primary">👑 Finish di 100</span>
      </div>
    </div>
  );
}
