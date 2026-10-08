import { cn } from "../lib/utils";

/** Besh qirrali yulduz (markazi cx, cy; tashqi radius r) */
export function starPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.4;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + Math.cos(a) * rad).toFixed(2)} ${(cy + Math.sin(a) * rad).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

/** Logotip: suvga tushgan lak tomchisi + oltin yulduzli muhr */
export function Emblem({ className, seal = true }: { className?: string; seal?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("shrink-0", className)}>
      <circle cx="30" cy="30" r="24" fill="none" stroke="var(--color-feather)" strokeWidth="2.5" />
      <circle cx="30" cy="30" r="16.5" fill="none" stroke="var(--color-dilute)" strokeWidth="2.5" />
      <circle cx="30" cy="30" r="9" fill="var(--color-ink)" />
      <path d={starPath(30, 30.6, 5.2)} fill="var(--color-seal)" />
      {seal && (
        <g>
          <rect x="46" y="46" width="15" height="15" rx="2" fill="var(--color-ink)" />
          <path d={starPath(53.5, 54, 4.6)} fill="var(--color-seal)" />
        </g>
      )}
    </svg>
  );
}
