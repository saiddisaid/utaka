import { boardCells, ladders, snakes, squareKind, playerColors } from "@/lib/board";

export type Player = { id: number; name: string; pos: number; cards: number };

const kindStyle: Record<string, string> = {
  start: "bg-primary/15 text-primary",
  finish: "bg-primary text-primary-foreground",
  tangga: "bg-tangga-soft text-tangga-ink",
  ular: "bg-ular-soft text-ular-ink",
  funfact: "bg-funfact-soft text-funfact-ink",
  normal: "bg-card text-muted-foreground",
};

const kindIcon: Record<string, string> = {
  start: "🚩",
  finish: "🏁",
  tangga: "🪜",
  ular: "🐍",
  funfact: "💡",
  normal: "",
};

export function GameBoard({
  players,
  activeSquare,
}: {
  players: Player[];
  activeSquare?: number | null;
}) {
  const cells = boardCells();

  return (
    <div className="rounded-3xl border border-border bg-cream p-2 shadow-soft sm:p-3">
      <div className="grid grid-cols-10 gap-[3px] sm:gap-1.5">
        {cells.map((n) => {
          const kind = squareKind(n);
          const here = players.filter((p) => p.pos === n);
          return (
            <div
              key={n}
              className={`relative aspect-square rounded-md border border-border/60 p-[2px] text-[8px] font-bold sm:rounded-lg sm:p-1 sm:text-[10px] ${kindStyle[kind]} ${
                activeSquare === n ? "ring-2 ring-primary" : ""
              }`}
            >
              <span className="absolute left-[2px] top-[1px] opacity-70">{n}</span>
              <span className="absolute inset-0 grid place-items-center text-[11px] sm:text-sm">
                {kindIcon[kind]}
              </span>
              {here.length > 0 && (
                <span className="absolute inset-x-0 bottom-[2px] flex flex-wrap justify-center gap-[2px]">
                  {here.map((p) => (
                    <span
                      key={p.id}
                      title={p.name}
                      className="h-2 w-2 rounded-full ring-1 ring-card transition-all sm:h-2.5 sm:w-2.5"
                      style={{ backgroundColor: playerColors[p.id] }}
                    />
                  ))}
                </span>
              )}
              {ladders[n] && (
                <span className="absolute bottom-[1px] right-[2px] text-[7px] opacity-70">
                  →{ladders[n]}
                </span>
              )}
              {snakes[n] && (
                <span className="absolute bottom-[1px] right-[2px] text-[7px] opacity-70">
                  →{snakes[n]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-muted-foreground">
        <span>🪜 Tangga (naik)</span>
        <span>🐍 Ular (turun)</span>
        <span>💡 Fun Fact</span>
        <span>🏁 Finish di 100</span>
      </div>
    </div>
  );
}
