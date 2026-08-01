const pipMap: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

const faceTransform: Record<number, string> = {
  1: "rotateX(0deg) rotateY(0deg)",
  2: "rotateY(-90deg)",
  3: "rotateY(180deg)",
  4: "rotateY(90deg)",
  5: "rotateX(-90deg)",
  6: "rotateX(90deg)",
};

function Face({ value, className }: { value: number; className: string }) {
  const pips = pipMap[value] ?? [5];
  return (
    <div className={`dice3d-face ${className}`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={pips.includes(i + 1) ? "dice3d-pip" : ""} />
      ))}
    </div>
  );
}

export function Dice({ value, rolling }: { value: number; rolling: boolean }) {
  const v = Math.min(Math.max(value, 1), 6);
  return (
    <div className="dice3d-stage">
      <div
        className={`dice3d ${rolling ? "is-rolling" : ""}`}
        style={rolling ? undefined : { transform: faceTransform[v] }}
        aria-label={`Dadu bernilai ${v}`}
      >
        <Face value={1} className="dice3d-f1" />
        <Face value={2} className="dice3d-f2" />
        <Face value={3} className="dice3d-f3" />
        <Face value={4} className="dice3d-f4" />
        <Face value={5} className="dice3d-f5" />
        <Face value={6} className="dice3d-f6" />
      </div>
    </div>
  );
}

export function Pion({
  color,
  size = 16,
  active = false,
  title,
}: {
  color: string;
  size?: number;
  active?: boolean;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`pion3d ${active ? "is-active" : ""}`}
      style={
        { "--pion-color": color, "--pion-size": `${size}px` } as React.CSSProperties
      }
    >
      <span className="pion3d-body" />
      <span className="pion3d-head" />
    </span>
  );
}
