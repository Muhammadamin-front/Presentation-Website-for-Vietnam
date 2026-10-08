import { countryFacts } from "../data";
import { ParallaxHero } from "../components/ParallaxHero";
import { Words } from "../components/text";
import { delay } from "../lib/utils";

export function Country() {
  return (
    <section id="vyetnam" aria-label="Vyetnam" className="relative bg-paper">
      <div data-stop>
        <ParallaxHero
          image="/images/halong.jpg"
          alt="Ha Long ko‘rfazidagi ohaktosh qoyalar va an’anaviy yelkanli kema"
          title={
            <>
              <span className="vn text-[clamp(4.5rem,11vw,10rem)] leading-none text-depth [text-shadow:0_2px_30px_rgba(248,245,239,0.6)]">
                Việt Nam
              </span>
              <span className="mt-3 text-[clamp(1.05rem,1.5vw,1.4rem)] font-normal text-depth">
                Vyetnam — «janubdagi Viet» yurti · Ha Long ko‘rfazi
              </span>
            </>
          }
        />
      </div>
      <div data-stop className="slide wrap-page grid gap-x-20 gap-y-14 py-24 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <Words as="h2" className="section-title text-depth" text="Tor qirg‘oq, ulkan imkoniyat" />
          <p className="lede mt-8" data-rev style={delay(120)}>
            Shimoldan janubga 1 650 km cho‘zilgan tor mamlakat: Qizil daryo va Mekong deltalari — guruch omborlari,
            uzun qirg‘oq — dunyo okeaniga ochiq eshik. 1980-yillarda aholi jon boshiga daromad dunyodagi eng pastlardan edi.
          </p>
          <p
            className="mt-10 max-w-[28ch] text-[clamp(1.5rem,2.4vw,2.2rem)] leading-snug font-light text-depth"
            data-rev
            style={delay(240)}
          >
            Arzon va intizomli mehnatni dunyo bozori bilan bog‘lash — Vyetnam modelining mohiyati.
          </p>
        </div>
        <dl className="self-end border-t border-mist">
          {countryFacts.map((f, i) => (
            <div
              key={f.label}
              className="grid items-baseline gap-2 border-b border-mist py-5 sm:grid-cols-[minmax(9rem,auto)_1fr] sm:gap-6"
              data-rev
              style={delay(80 * i)}
            >
              <dt className="text-[clamp(1.5rem,2.2vw,2rem)] font-light text-depth">{f.value}</dt>
              <dd className="text-dilute">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
