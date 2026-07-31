import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6] as const;

export function Dice({ value, rolling }: { value: number; rolling: boolean }) {
  const Icon = icons[Math.min(Math.max(value, 1), 6) - 1] ?? Dice1;
  return (
    <div
      className={`grid h-20 w-20 place-items-center rounded-3xl border-2 border-primary/30 bg-card shadow-soft ${
        rolling ? "animate-dice" : ""
      }`}
    >
      <Icon className="h-12 w-12 text-primary" strokeWidth={1.8} />
    </div>
  );
}
