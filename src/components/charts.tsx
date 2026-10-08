import { useState, type ReactNode } from "react";
import type { BarRow, Bubble, CompareRow } from "../data";
import { cn, fmt } from "../lib/utils";

export function Tooltip({ x, y, children }: { x: string; y: string; children: ReactNode }) {
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-lg bg-depth px-3.5 py-2 text-sm whitespace-nowrap text-paper shadow-[0_10px_24px_-12px_rgba(36,19,14,0.6)]"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  );
}

/** Ochiladigan jadval — diagrammaning matnli nusxasi */
export function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <details className="group mt-6 text-sm text-dilute">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-mist px-3.5 py-1.5 transition-colors hover:border-feather hover:text-depth">
        <span className="transition-transform group-open:rotate-45">+</span> Jadval ko‘rinishi
      </summary>
      <table className="mt-4 w-full max-w-lg border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-mist">
            {head.map((h) => (
              <th key={h} className="py-2 pr-4 font-medium text-depth">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-mist/70">
              {r.map((c, j) => (
                <td key={j} className={cn("tnum py-2 pr-4", j === 0 && "text-depth")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

const focusStroke = (f?: "vn" | "uz") => (f === "uz" ? "var(--color-uz)" : "var(--color-ink)");

/** Bayroq doiralari: doira maydoni YaIMga mutanosib, suvga tomchi kabi tushadi */
export function FlagBubbles({ data }: { data: Bubble[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 1200;
  const maxR = 122;
  const gap = 28;
  const max = Math.max(...data.map((d) => d.value));
  const radii = data.map((d) => maxR * Math.sqrt(d.value / max));
  let cursor = (W - (radii.reduce((s, r) => s + 2 * r, 0) + gap * (data.length - 1))) / 2;
  const cx = radii.map((r) => {
    const c = cursor + r;
    cursor += 2 * r + gap;
    return c;
  });
  const cy = 166;

  return (
    <div className="relative" data-rev>
      <svg
        viewBox={`0 0 ${W} 400`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Davlatlar YaIMi, trillion dollar; bayroq doirasining maydoni YaIMga mutanosib"
      >
        {data.map((d, i) => {
          const r = radii[i];
          return (
            <g
              key={d.country}
              tabIndex={0}
              role="img"
              aria-label={`${d.country}: ${fmt(d.value, 2)} trillion dollar`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="cursor-default outline-none"
            >
              <circle cx={cx[i]} cy={cy} r={Math.max(r, 24) + 10} fill="transparent" />
              <circle
                className="ripple"
                cx={cx[i]}
                cy={cy}
                r={r}
                fill="none"
                stroke={d.focus ? focusStroke(d.focus) : "var(--color-dilute)"}
                strokeWidth="1"
                style={{ animationDelay: `${i * 140 + 200}ms` }}
              />
              <g className="drop" style={{ transitionDelay: `${i * 140}ms` }}>
                <image
                  href={`/flags/${d.code}.svg`}
                  x={cx[i] - r}
                  y={cy - r}
                  width={2 * r}
                  height={2 * r}
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle
                  cx={cx[i]}
                  cy={cy}
                  r={r - 0.5}
                  fill="none"
                  stroke="var(--color-feather)"
                  strokeOpacity="0.8"
                  strokeWidth="1"
                />
              </g>
              {d.focus && (
                <circle cx={cx[i]} cy={cy} r={r + 9} fill="none" stroke={focusStroke(d.focus)} strokeWidth="2.5" />
              )}
              {hover === i && !d.focus && (
                <circle cx={cx[i]} cy={cy} r={r + 7} fill="none" stroke="var(--color-dilute)" strokeWidth="1.5" />
              )}
              <text
                x={cx[i]}
                y={360}
                textAnchor="middle"
                className={cn(
                  "text-[19px]",
                  d.focus === "uz" ? "fill-uz font-medium" : d.focus ? "fill-depth font-medium" : "fill-dilute",
                )}
              >
                {d.country}
              </text>
              <text
                x={cx[i]}
                y={386}
                textAnchor="middle"
                className={cn("tnum text-[17px]", d.focus ? "fill-depth" : "fill-dilute")}
              >
                {fmt(d.value, 2)}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <Tooltip x={`${(cx[hover] / W) * 100}%`} y="0%">
          <span className="font-medium">{data[hover].country}</span> — {fmt(data[hover].value, 2)} trln $ · 2025
        </Tooltip>
      )}
    </div>
  );
}

/** Davrlar bo‘yicha o‘rtacha o‘sish + O‘zbekiston bilan taqqoslash chizig‘i */
export function PeriodBars({
  data,
  reference,
}: {
  data: { period: string; name: string; value: number; approx?: boolean }[];
  reference?: { value: number; label: string };
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 900;
  const slot = W / data.length;
  const bw = Math.min(150, slot * 0.62);
  const top = 10;
  const y = (v: number) => 430 - (v / top) * 360;

  return (
    <div className="relative" data-rev>
      <svg
        viewBox={`0 0 ${W} 534`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Real YaIM o‘rtacha yillik o‘sishi, davrlar bo‘yicha"
      >
        {[0, 5, 10].map((g) => (
          <g key={g}>
            <line x1="0" x2={W} y1={y(g)} y2={y(g)} stroke="var(--color-mist)" strokeWidth="1" />
            <text x="0" y={y(g) - 8} className="tnum fill-dilute text-[22px]">
              {g}%
            </text>
          </g>
        ))}
        {reference && (
          <g className="pointer-events-none">
            <line
              x1="0"
              x2={W}
              y1={y(reference.value)}
              y2={y(reference.value)}
              stroke="var(--color-uz)"
              strokeWidth="1.5"
              strokeDasharray="7 6"
            />
            <text x={W} y={y(reference.value) - 10} textAnchor="end" className="fill-uz text-[22px]">
              {reference.label}
            </text>
          </g>
        )}
        {data.map((d, i) => {
          const cx = slot * i + slot / 2;
          const h = (d.value / top) * 360;
          const l = cx - bw / 2;
          const r = cx + bw / 2;
          return (
            <g
              key={d.period}
              tabIndex={0}
              role="img"
              aria-label={`${d.period}, ${d.name}: ${fmt(d.value)}%`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="outline-none"
            >
              <rect x={l - 20} y={30} width={bw + 40} height={400} fill="transparent" />
              <path
                className="bar"
                style={{ transitionDelay: `${i * 160}ms` }}
                d={`M${l} 430 V${430 - h + 4} Q${l} ${430 - h} ${l + 4} ${430 - h} H${r - 4} Q${r} ${430 - h} ${r} ${430 - h + 4} V430 Z`}
                fill={hover === i ? "var(--color-depth)" : "var(--color-ink)"}
              />
              <text
                x={cx}
                y={430 - h - 16}
                textAnchor="middle"
                className="fill-depth text-[40px] font-light"
                stroke="var(--color-paper)"
                strokeWidth={8}
                paintOrder="stroke"
                strokeLinejoin="round"
              >
                {d.approx ? "~" : ""}
                {fmt(d.value)}%
              </text>
              <text x={cx} y={474} textAnchor="middle" className="tnum fill-depth text-[24px]">
                {d.period}
              </text>
              <text x={cx} y={508} textAnchor="middle" className="fill-dilute text-[19px]">
                {d.name}
              </text>
            </g>
          );
        })}
        <line x1="0" x2={W} y1={430} y2={430} stroke="var(--color-feather)" strokeWidth="1" />
      </svg>
      {hover !== null && (
        <Tooltip x={`${((slot * hover + slot / 2) / W) * 100}%`} y="0%">
          {data[hover].period}: yiliga o‘rtacha {data[hover].approx ? "~" : ""}
          {fmt(data[hover].value)}% real o‘sish
        </Tooltip>
      )}
    </div>
  );
}

/** Chiziqli diagramma: tarix — chizilib chiqadi, prognoz — nuqtali */
export function LineChart({
  data,
  max = 25,
  ticks = [0, 5, 10, 15, 20, 25],
  label,
  unitLabel,
}: {
  data: { year: number; value: number; projected?: boolean }[];
  max?: number;
  ticks?: number[];
  label: string;
  unitLabel: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const first = data[0].year;
  const last = data[data.length - 1].year;
  const x = (yr: number) => 58 + ((yr - first) / (last - first)) * 812;
  const y = (v: number) => 360 - (v / max) * 330;
  const actual = data.filter((d) => !d.projected);
  const now = actual[actual.length - 1];
  const future = [now, ...data.filter((d) => d.projected)];
  const line = (pts: typeof data) =>
    pts.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line(actual)} L${x(now.year)} 360 L${x(first)} 360 Z`;

  return (
    <div className="relative" data-rev>
      <svg viewBox="0 0 900 450" className="w-full overflow-visible" role="img" aria-label={label}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={58} x2={870} y1={y(t)} y2={y(t)} stroke="var(--color-mist)" />
            <text x={46} y={y(t) + 5} textAnchor="end" className="tnum fill-dilute text-[20px]">
              {t}%
            </text>
          </g>
        ))}
        <path d={area} fill="var(--color-ink)" opacity="0.08" />
        <path className="draw" d={line(actual)} fill="none" stroke="var(--color-ink)" strokeWidth="2.5" pathLength={1} />
        <path
          d={line(future)}
          fill="none"
          stroke="var(--color-feather)"
          strokeWidth="2.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        {data.map((d, i) => (
          <g
            key={d.year}
            tabIndex={0}
            role="img"
            aria-label={`${d.year}: ${fmt(d.value)}%${d.projected ? " (prognoz)" : ""}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="outline-none"
          >
            <rect x={x(d.year) - 24} y={30} width="48" height={376} fill="transparent" />
            {hover === i && <line x1={x(d.year)} x2={x(d.year)} y1={30} y2={360} stroke="var(--color-feather)" />}
            <circle
              cx={x(d.year)}
              cy={y(d.value)}
              r={d.year === now.year ? 7 : 5}
              fill={d.projected ? "var(--color-paper)" : d.year === now.year ? "var(--color-seal)" : "var(--color-ink)"}
              stroke={d.projected ? "var(--color-feather)" : "var(--color-paper)"}
              strokeWidth="2"
            />
            <text
              x={x(d.year)}
              y={400}
              textAnchor="middle"
              className={cn("tnum text-[21px]", d.projected ? "fill-dilute" : "fill-depth")}
            >
              {d.year}
            </text>
          </g>
        ))}
        {[data[0], now, data[data.length - 1]].map((d) => (
          <text
            key={d.year}
            x={x(d.year)}
            y={y(d.value) - 18}
            textAnchor={d === data[0] ? "start" : d === data[data.length - 1] ? "end" : "middle"}
            className={cn("text-[26px]", d === now ? "fill-depth font-medium" : "fill-dilute")}
          >
            {fmt(d.value)}%{d.projected ? " (prognoz)" : ""}
          </text>
        ))}
      </svg>
      {hover !== null && (
        <Tooltip x={`${(x(data[hover].year) / 900) * 100}%`} y={`${(y(data[hover].value) / 450) * 100}%`}>
          {data[hover].year}: {fmt(data[hover].value)}% {unitLabel}
          {data[hover].projected ? " · prognoz" : ""}
        </Tooltip>
      )}
    </div>
  );
}

/** Gorizontal ustunlar + mos chiziq (O‘zbekiston bilan taqqoslash) */
export function HBarList({
  data,
  max,
  reference,
  unit,
  label,
}: {
  data: BarRow[];
  max: number;
  reference?: { value: number; label: string };
  unit: string;
  label: string;
}) {
  const col = "10.5rem";
  const end = "6.5rem";
  return (
    <div data-rev>
      <ul className="relative flex flex-col gap-2.5" aria-label={label}>
        {reference && (
          <span
            aria-hidden="true"
            className="absolute inset-y-0 border-l-2 border-dashed border-uz"
            style={{ left: `calc(${col} + (100% - ${col} - ${end}) * ${reference.value / max})` }}
          >
            <span className="absolute -top-6 left-1.5 text-xs whitespace-nowrap text-uz max-sm:right-1.5 max-sm:left-auto">
              {reference.label}
            </span>
          </span>
        )}
        {data.map((d, i) => (
          <li key={d.country} className="grid grid-cols-[10.5rem_1fr_6.5rem] items-center">
            <span
              className={cn(
                "flex items-center justify-end gap-2.5 pr-4 text-right text-[0.95rem]",
                d.focus ? "font-medium text-depth" : "text-dilute",
              )}
            >
              {d.country}
              <img
                src={`/flags/${d.code}.svg`}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0 rounded-full ring-1 ring-mist"
              />
            </span>
            <span className="h-7">
              <span
                className="hbar block h-full rounded-r-[4px]"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  background: d.focus ? "var(--color-ink)" : "var(--color-feather)",
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </span>
            <span className={cn("tnum pl-3 text-[0.95rem] whitespace-nowrap", d.focus ? "font-medium text-depth" : "text-dilute")}>
              {d.approx ? "~" : ""}
              {d.value}
              {unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** «Kapalak» diagramma: chapda Vyetnam, o‘ngda O‘zbekiston */
export function Butterfly({ rows }: { rows: CompareRow[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const val = (v: number, d = 1) => fmt(v, d).replace(/,0+$/, "");
  return (
    <div data-rev>
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 border-b border-mist pb-5 sm:gap-4">
        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <span className="min-w-0 text-right">
            <span className="block text-[clamp(1.05rem,2vw,1.9rem)] font-light text-depth">Vyetnam</span>
            <span className="vn hidden text-base text-dilute sm:inline">Việt Nam</span>
          </span>
          <img src="/flags/vn.svg" alt="" width={48} height={48} className="size-8 shrink-0 rounded-full ring-1 ring-mist sm:size-12" />
        </div>
        <span className="label pb-3 text-feather">vs</span>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img src="/flags/uz.svg" alt="" width={48} height={48} className="size-8 shrink-0 rounded-full ring-1 ring-mist sm:size-12" />
          <span className="min-w-0">
            <span className="block text-[clamp(1.05rem,2vw,1.9rem)] font-light text-depth">O‘zbekiston</span>
            <span className="vn hidden text-base text-dilute sm:inline">Uzbekistan</span>
          </span>
        </div>
      </div>
      <ul aria-label="Vyetnam va O‘zbekiston ko‘rsatkichlari">
        {rows.map((r, i) => {
          const m = Math.max(r.vn, r.uz);
          const ratio = r.vn >= r.uz ? r.vn / r.uz : r.uz / r.vn;
          const leader = r.vn >= r.uz ? "Vyetnam" : "O‘zbekiston";
          const on = hover === i;
          return (
            <li
              key={r.label}
              tabIndex={0}
              aria-label={`${r.label}: Vyetnam ${val(r.vn, r.digits)} ${r.unit}, O‘zbekiston ${val(r.uz, r.digits)} ${r.unit}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={cn(
                "relative border-b border-mist py-3 outline-none transition-colors duration-300",
                on && "bg-wash",
              )}
            >
              <div className="mb-1.5 flex items-baseline justify-center gap-2 text-center">
                <span className={cn("text-[0.9rem]", on ? "text-depth" : "text-dilute")}>
                  {r.label}, {r.unit}
                </span>
                <span
                  className={cn(
                    "tnum rounded-full px-2 text-xs transition-opacity duration-300",
                    on ? "bg-depth text-paper opacity-100" : "opacity-0",
                  )}
                >
                  {leader}: ×{fmt(ratio, ratio < 10 ? 1 : 0)}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_1fr] items-center gap-1.5">
                <div className="flex items-center justify-end gap-3">
                  <span className="tnum text-[clamp(1rem,1.3vw,1.2rem)] text-depth">
                    {r.approx ? "~" : ""}
                    {val(r.vn, r.digits)}
                  </span>
                  <span className="h-5 w-[min(100%,26rem)]">
                    <span
                      className="hbar hbar--rtl ml-auto block h-full rounded-l-[4px]"
                      style={{
                        width: `${(r.vn / m) * 100}%`,
                        background: "var(--color-ink)",
                        transitionDelay: `${i * 80}ms`,
                      }}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-5 w-[min(100%,26rem)]">
                    <span
                      className="hbar block h-full rounded-r-[4px]"
                      style={{
                        width: `${(r.uz / m) * 100}%`,
                        background: "var(--color-uz)",
                        transitionDelay: `${i * 80 + 40}ms`,
                      }}
                    />
                  </span>
                  <span className="tnum text-[clamp(1rem,1.3vw,1.2rem)] text-depth">
                    {r.approx ? "~" : ""}
                    {val(r.uz, r.digits)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
