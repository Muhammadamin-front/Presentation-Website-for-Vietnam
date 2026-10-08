import { useEffect, useState } from "react";
import {
  ChartColumn,
  Cpu,
  Droplets,
  Factory,
  Flag,
  History,
  Mountain,
  RefreshCw,
  Scale,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { author, sections, type SectionId } from "../data";
import { onScroll, scrollToId } from "../lib/scroll";
import { cn } from "../lib/utils";
import { Emblem } from "./Emblem";

const icons: Record<SectionId, LucideIcon> = {
  kirish: Droplets,
  vyetnam: Mountain,
  raqamlar: ChartColumn,
  tarix: History,
  doimoi: RefreshCw,
  sanoat: Factory,
  elektronika: Cpu,
  muammolar: TriangleAlert,
  kelajak: Sparkles,
  taqqoslash: Scale,
  xulosa: Flag,
};

function useActiveSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(
    () =>
      onScroll((y) => {
        const probe = y + window.innerHeight * 0.45;
        let idx = 0;
        sections.forEach((s, i) => {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top + y <= probe) idx = i;
        });
        setActive(idx);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? y / max : 0);
      }),
    [],
  );
  return { active, progress };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Rail() {
  const { active, progress } = useActiveSection();
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--rail)] flex-col border-r border-mist bg-paper lg:flex">
        <a
          href="#kirish"
          onClick={(e) => (e.preventDefault(), scrollToId("kirish"))}
          className="flex flex-col items-center gap-2.5 px-6 pt-6 pb-5"
        >
          <Emblem className="size-14" />
          <span className="label text-depth">Việt Nam</span>
          <span className="vn -mt-2 text-base text-dilute">Kinh tế Việt Nam</span>
        </a>
        <nav aria-label="Bo‘limlar" className="mx-5 flex-1 overflow-y-auto border-t border-mist pt-4">
          <ul className="flex flex-col gap-0.5">
            {sections.map((s, i) => {
              const Icon = icons[s.id];
              const on = i === active;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(s.id);
                    }}
                    className={cn(
                      "group flex items-center gap-3.5 rounded-full py-1 pr-3 pl-1.5 transition-colors duration-300",
                      on ? "text-depth" : "text-dilute hover:text-depth",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full transition-colors duration-500",
                        on ? "bg-ink text-paper" : "text-dilute group-hover:text-depth",
                      )}
                    >
                      <Icon className="size-[15px]" strokeWidth={1.6} />
                    </span>
                    <span className="label !tracking-[0.14em]">{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mx-5 border-t border-mist py-4">
          <div className="flex items-baseline justify-between">
            <span className="label text-dilute">Bo‘lim</span>
            <span className="tnum text-sm text-depth">
              {pad(active + 1)} <span className="text-feather">/ {pad(sections.length)}</span>
            </span>
          </div>
          <div className="mt-3 h-px w-full bg-mist">
            <div className="h-px bg-ink transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
          {author.name && <p className="mt-4 text-sm text-depth">{author.name}</p>}
          {author.group && <p className="text-xs text-dilute">{author.group}</p>}
          <p className="note mt-3">
            <kbd className="font-sans">←</kbd> <kbd className="font-sans">→</kbd> keyingi qadam ·{" "}
            <kbd className="font-sans">F</kbd> to‘liq ekran · <kbd className="font-sans">?</kbd> yordam
          </p>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center gap-3 border-b border-mist bg-paper px-4 lg:hidden">
        <Emblem className="size-7" seal={false} />
        <span className="label text-depth">{sections[active].label}</span>
        <span className="tnum ml-auto text-xs text-dilute">
          {pad(active + 1)} / {pad(sections.length)}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink" style={{ width: `${progress * 100}%` }} />
      </header>
    </>
  );
}
