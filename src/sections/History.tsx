import { useEffect, useRef, useState } from "react";
import { growthPeriods, timeline } from "../data";
import { DataTable, PeriodBars } from "../components/charts";
import { Words } from "../components/text";
import { trackStage } from "../lib/scroll";
import { cn, delay } from "../lib/utils";

const N = timeline.length;
const STOPS = timeline.map((_, i) => ((i + 0.5) / N).toFixed(3)).join(",");

export function History() {
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let last = -1;
    return trackStage(el, (p) => {
      const i = Math.min(N - 1, Math.floor(p * N));
      if (i !== last) {
        last = i;
        setActive(i);
      }
    });
  }, []);

  const year = timeline[active].year;
  const reached = timeline.map((_, i) => i).filter((i) => i <= active);

  return (
    <section id="tarix" aria-label="Tarix">
      <div ref={stage} data-stop data-stops={STOPS} className="stage h-[560svh]">
        <div className="stage__pin bg-paper">
          <div className="wrap-page flex h-full flex-col pt-16 pb-10 lg:pt-10">
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="text-[clamp(1.6rem,2.4vw,2.3rem)] font-light text-depth">Urushdan bozor iqtisodiyotiga</h2>
              <span className="tnum text-sm text-dilute">
                1975 → <span className="text-depth">{year}</span>
              </span>
            </div>
            <div className="grid flex-1 items-center gap-10 py-6 lg:grid-cols-[1.05fr_1fr]">
              <div className="relative grid place-items-center">
                <svg
                  viewBox="-260 -260 520 520"
                  aria-hidden="true"
                  className="absolute size-[min(66vh,42vw)] overflow-visible max-lg:size-[30vh]"
                >
                  <defs>
                    <filter id="ink-edge" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="4" />
                      <feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G" />
                      <feGaussianBlur stdDeviation="0.6" />
                    </filter>
                    <radialGradient id="now-drop">
                      <stop offset="0" stopColor="var(--color-ink)" stopOpacity="0.26" />
                      <stop offset="0.55" stopColor="var(--color-ink)" stopOpacity="0.16" />
                      <stop offset="0.85" stopColor="var(--color-ink)" stopOpacity="0.07" />
                      <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <g filter="url(#ink-edge)">
                    {reached
                      .slice()
                      .reverse()
                      .map((age) => {
                        const fade = age / Math.max(1, N - 1);
                        const s = Math.sqrt(age + 1);
                        return (
                          <g
                            key={timeline[active - age].year}
                            style={{ transform: `scale(${s})`, transformBox: "view-box", transformOrigin: "0 0" }}
                            className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                          >
                            {[0, 0.94, 0.86].map((k, j) => (
                              <circle
                                key={j}
                                r={age === 0 && j === 0 ? 104 : 96 * (k || 1)}
                                fill={age === 0 && j === 0 ? "url(#now-drop)" : "none"}
                                stroke={
                                  age === 0 && j === 0 ? "none" : age === 0 ? "var(--color-ink)" : "var(--color-dilute)"
                                }
                                strokeOpacity={(age === 0 ? 0.7 : 0.55 - fade * 0.35) * (j === 0 ? 1 : 0.5)}
                                strokeWidth={j === 0 ? 1.4 : 0.8}
                                vectorEffect="non-scaling-stroke"
                              />
                            ))}
                          </g>
                        );
                      })}
                  </g>
                </svg>
                <p
                  className="num relative text-[clamp(6rem,14vw,12.5rem)] leading-none font-[200] tracking-[-0.045em]"
                  aria-live="polite"
                >
                  <span className="text-dilute">{year.slice(0, 2)}</span>
                  <span className="text-depth">{year.slice(2)}</span>
                </p>
              </div>
              <ol className="flex flex-col">
                {timeline.map((t, i) => (
                  <li
                    key={t.year}
                    className={cn(
                      "relative border-t border-mist py-3.5 transition-[opacity,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] last:border-b",
                      i <= active ? "pl-4 opacity-100" : "opacity-30",
                    )}
                  >
                    {i === active && (
                      <span aria-hidden="true" className="absolute top-[1.35rem] left-0 size-1.5 rounded-full bg-ink" />
                    )}
                    <div className="flex items-baseline gap-4">
                      <span className="tnum w-12 shrink-0 text-sm text-dilute">{t.year}</span>
                      <div>
                        <h3 className="text-[1.15rem] font-normal text-depth">{t.title}</h3>
                        <p
                          className={cn(
                            "overflow-hidden text-[0.95rem] leading-relaxed text-dilute transition-[max-height,opacity,margin] duration-700",
                            i === active ? "mt-1.5 max-h-40 opacity-100" : "max-h-0 opacity-0",
                          )}
                        >
                          {t.text}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="h-[2px] w-full bg-mist" aria-hidden="true">
              <div className="h-full bg-ink" style={{ width: "calc(var(--p) * 100%)" }} />
            </div>
          </div>
        </div>
      </div>

      <div data-stop className="slide bg-paper py-20">
        <div className="wrap-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Words as="h2" className="section-title text-depth" text="To‘rt davr, to‘rt sur’at" />
            <p className="lede mt-8" data-rev style={delay(120)}>
              Real YaIMning o‘rtacha yillik o‘sishi. 1991-yildan beri Vyetnam iqtisodiyoti har ~10–11 yilda ikki
              barobar kattalashdi — 35 yil davomida deyarli uzilishsiz.
            </p>
            <p className="mt-6 max-w-[42ch] text-[0.95rem] leading-relaxed text-depth" data-rev style={delay(220)}>
              <span className="mr-2 inline-block size-2 rounded-full bg-uz align-middle" aria-hidden="true" />
              Taqqoslash uchun: O‘zbekiston iqtisodiyoti 2025-yilda 7,7% o‘sdi — bu Vyetnamning uzoq muddatli
              o‘rtachasidan yuqori. Savol — bu sur’atni o‘n yillar davomida ushlab turishda.
            </p>
          </div>
          <figure>
            <PeriodBars data={growthPeriods} reference={{ value: 7.7, label: "O‘zbekiston, 2025: 7,7%" }} />
            <figcaption className="note mt-2">
              Manba: Vyetnam Statistika idorasi, Jahon banki · davr o‘rtachalari ~ taxminiy
            </figcaption>
            <DataTable
              caption="Real YaIM o‘sishi, davrlar bo‘yicha"
              head={["Davr", "Nomi", "O‘rtacha o‘sish"]}
              rows={growthPeriods.map((g) => [
                g.period,
                g.name,
                `${g.approx ? "~" : ""}${g.value.toLocaleString("ru-RU")}%`,
              ])}
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
