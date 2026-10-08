import { exportsList, modelWords } from "../data";
import { ClothGrid } from "../components/ClothGrid";
import { FlipCard } from "../components/FlipCard";
import { Marquee } from "../components/Marquee";
import { Words } from "../components/text";
import { delay } from "../lib/utils";

export function Industry() {
  return (
    <section id="sanoat" aria-label="Sanoat: dunyo fabrikasi" className="bg-paper">
      <div data-stop>
        <ClothGrid className="h-svh min-h-[560px]">
          <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-[70%] w-[min(900px,90%)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,var(--color-paper)_35%,rgba(248,245,239,0.75)_65%,transparent)]"
            />
            <span className="vn relative text-[clamp(2.6rem,8.5vw,8rem)] leading-none whitespace-nowrap text-depth">
              Made in <span className="text-ink">Việt Nam</span>
            </span>
            <h2 className="relative mt-6 text-[clamp(1.5rem,2.4vw,2.3rem)] font-light text-depth">
              Dunyo fabrikasi — «Xitoy + 1»
            </h2>
            <p className="lede relative mt-4 max-w-[50ch]">
              Arzon va o‘qimishli ishchi kuchi, dengiz portlari va savdo bitimlari: global kompaniyalar Xitoydan
              tashqaridagi ikkinchi zavodini Vyetnamda quradi. Sanoat va qurilish YaIMning ~38% ini beradi.
            </p>
          </div>
        </ClothGrid>
      </div>

      <div data-stop className="slide wrap-page py-20">
        <Words as="h2" className="section-title max-w-[16ch] text-depth" text="Dunyoga nima sotadi?" />
        <ul className="mt-14 border-t border-mist">
          {exportsList.map((e, i) => (
            <li
              key={e.name}
              className="group grid gap-x-10 gap-y-3 border-b border-mist py-8 md:grid-cols-[8.5rem_minmax(14rem,1fr)_1.6fr]"
              data-rev
              style={delay(80 * i)}
            >
              <span className="vn text-[1.9rem] leading-none text-feather transition-colors duration-500 group-hover:text-ink">
                {e.vn}
              </span>
              <div>
                <h3 className="text-[1.55rem] leading-tight font-light text-depth">{e.name}</h3>
                <p className="mt-2 text-sm text-dilute">{e.makers}</p>
              </div>
              <p className="max-w-[58ch] leading-relaxed text-depth/85">{e.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <Marquee />

      <div data-stop className="slide wrap-page py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Words as="h2" className="section-title text-depth" text="Vyetnam o‘sish modeli" />
          <p className="lede" data-rev style={delay(120)}>
            To‘rtta so‘z — Vyetnam qanday tez o‘sganining kaliti. Kartani bosing yoki ustiga olib boring.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {modelWords.map((m, i) => (
            <div key={m.label} data-rev style={delay(90 * i)}>
              <FlipCard {...m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
