import { factoryPath, fdiChain, fdiGives, techStats } from "../data";
import { Counter } from "../components/Counter";
import { Endpaper } from "../components/marbling";
import { RobotCard } from "../components/RobotCard";
import { SonarGrid } from "../components/SonarGrid";
import { Vertical, Words } from "../components/text";
import { delay } from "../lib/utils";

export function Electronics() {
  return (
    <section id="elektronika" aria-label="Elektronika ustaxonasi" className="bg-depth text-paper">
      <Endpaper />
      <div data-stop className="slide wrap-page py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Vertical vn="Công xưởng" tone="text-seal">
            <Words
              as="h2"
              className="text-[clamp(3rem,7vw,6rem)] leading-[0.98] font-[250] tracking-[-0.03em] text-paper"
              text="Elektronika ustaxonasi"
            />
          </Vertical>
          <p className="lede !text-mist" data-rev style={delay(120)}>
            Bir avlod ichida guruch dalalaridan smartfon zavodlarigacha: elektronika bugun Vyetnam eksportining eng yirik
            moddasi, telefon va noutbuklar butun dunyoga shu yerdan jo‘natiladi.
          </p>
        </div>
      </div>

      <div data-stop className="slide wrap-page py-12">
        <div data-rev>
          <RobotCard />
        </div>
      </div>

      <div data-stop>
        <SonarGrid color="#bcae9c" baseOpacity={0.16} spacing={28} pingEvery={2.6} ringWidth={110} className="slide py-20">
          <div className="wrap-page">
            <Words
              as="h2"
              className="text-[clamp(2rem,3.6vw,3.4rem)] leading-tight font-light text-paper"
              text="Elektronika raqamlarda"
            />
            <dl className="mt-14 grid gap-y-12 sm:grid-cols-2 2xl:grid-cols-4">
              {techStats.map((s, i) => (
                <div key={s.label} className="@container border-l border-white/15 px-6" data-rev style={delay(90 * i)}>
                  <dd className="order-first text-[clamp(1.6rem,14cqw,3.2rem)] leading-none font-light text-paper">
                    <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-4 leading-snug text-mist">{s.label}</dt>
                  <dd className="note mt-2 !text-feather">{s.note}</dd>
                </div>
              ))}
            </dl>
            <p className="note mt-12 !text-feather">
              Manba: Vyetnam bojxonasi; Sanoat va savdo vazirligi; Statistika idorasi (2025); Hukumatning 1018-son qarori
              (2024)
            </p>
          </div>
        </SonarGrid>
      </div>

      <div data-stop className="slide wrap-page py-20">
        <Words
          as="h2"
          className="text-[clamp(2rem,3.6vw,3.4rem)] leading-tight font-light text-paper"
          text="Fabrikaga aylanish yo‘li"
        />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-6 md:gap-6" data-rev>
          <svg
            aria-hidden="true"
            className="absolute top-[3.1rem] left-0 hidden h-2 w-full overflow-visible md:block"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            <path
              className="draw"
              pathLength={1}
              d="M0 1 H100"
              stroke="#6e6152"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              fill="none"
            />
          </svg>
          {factoryPath.map((f, i) => (
            <li key={f.year} className="relative" style={delay(120 * i)}>
              <span className="tnum block text-2xl font-light text-paper">{f.year}</span>
              <span
                className={`relative mt-3 mb-5 block size-3.5 rounded-full border-2 border-depth ${i === factoryPath.length - 1 ? "bg-seal" : "bg-feather"}`}
              />
              <h3 className="text-[1.05rem] font-normal text-paper">{f.name}</h3>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-feather">{f.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-sumi">
        <div data-stop className="slide wrap-page py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Words as="h2" className="section-title text-paper" text="Nega FDI — o‘sish dvigateli?" />
            <p className="lede !text-mist" data-rev style={delay(120)}>
              Zanjirni chapdan o‘ngga o‘qing: yosh ishchi kuchi xorijiy kapital orqali eksport, valyuta va daromadga
              aylanadi.
            </p>
          </div>
          <ol className="mt-16 grid gap-10 md:grid-cols-5 md:gap-0" data-rev>
            {fdiChain.map((c, i) => (
              <li key={c.title} className="@container relative md:pr-8" style={delay(160 * i)}>
                {i < fdiChain.length - 1 && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                    className="absolute top-[1.35rem] left-14 hidden h-3 w-[calc(100%-4.5rem)] overflow-visible md:block"
                  >
                    <path
                      className="draw"
                      pathLength={1}
                      d="M0 6 H96"
                      stroke="#6e6152"
                      strokeWidth="1.2"
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                      style={{ transitionDelay: `${i * 260 + 300}ms` }}
                    />
                    <path
                      className="draw"
                      pathLength={1}
                      d="M92 1 L100 6 L92 11"
                      stroke="#c9971c"
                      strokeWidth="1.2"
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                      style={{ transitionDelay: `${i * 260 + 900}ms` }}
                    />
                  </svg>
                )}
                <span className="grid size-11 place-items-center rounded-full border border-feather/60">
                  <span className="size-3 rounded-full bg-seal" style={{ opacity: 0.35 + i * 0.16 }} />
                </span>
                <p className="mt-6 text-[clamp(1.3rem,15cqw,2.4rem)] leading-none font-light text-paper">
                  {c.figure}
                </p>
                <h3 className="mt-4 text-[1.1rem] font-normal text-paper">{c.title}</h3>
                <p className="mt-1.5 text-[0.92rem] leading-relaxed text-feather">{c.note}</p>
              </li>
            ))}
          </ol>
        </div>

        <div data-stop className="slide wrap-page py-20">
          <Words
            as="h2"
            className="text-[clamp(2rem,3.6vw,3.4rem)] leading-tight font-light text-paper"
            text="FDI Vyetnamga nima beradi?"
          />
          <div className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {fdiGives.map((g, i) => (
              <div key={g.title} className="flex gap-5" data-rev style={delay(80 * i)}>
                <span
                  aria-hidden="true"
                  className={`mt-2 size-2.5 shrink-0 rounded-full border ${i === fdiGives.length - 1 ? "border-seal bg-seal" : "border-feather"}`}
                />
                <div>
                  <h3 className="text-[1.3rem] font-light text-paper">{g.title}</h3>
                  <p className="mt-2 max-w-[48ch] leading-relaxed text-mist">{g.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="note mt-12 !text-feather">
            Manbalar: Vyetnam Statistika idorasi (2025); Sanoat va savdo vazirligi; Jahon banki.
          </p>
        </div>
      </div>
    </section>
  );
}
