import { useEffect, useState } from "react";

const colors = ["var(--tangga)", "var(--ular)", "var(--funfact)", "var(--primary)"];

export function Confetti({ pieces = 60 }: { pieces?: number }) {
  const [items, setItems] = useState<
    Array<{ left: number; delay: number; color: string }>
  >([]);

  useEffect(() => {
    setItems(
      Array.from({ length: pieces }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]!,
      })),
    );
  }, [pieces]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${it.left}%`,
            backgroundColor: it.color,
            animationDelay: `${it.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
