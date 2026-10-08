import { aseanGdp, keyStats } from "../data";
import { DataTable, FlagBubbles } from "../components/charts";
import { Counter } from "../components/Counter";
import { Words } from "../components/text";
import { delay } from "../lib/utils";

export function Numbers() {
  return (
    <section id="raqamlar" aria-label="Raqamlarda Vyetnam" className="bg-wash">
      <div data-stop className="slide wrap-page py-20">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_1fr]">
          <Words as="h2" className="section-title text-depth" text="Raqamlarda Vyetnam" />
          <p className="lede lg:justify-self-end" data-rev style={delay(120)}>
            ASEAN ichida to‘rtinchi yirik iqtisodiyot va O‘zbekistondan qariyb 3,5 barobar katta. Bayroq doirasining
            maydoni — iqtisodiyot hajmi.
          </p>
        </div>
        <figure className="mt-16">
          <FlagBubbles data={aseanGdp} />
          <figcaption className="note mt-2 text-center">
            Nominal YaIM, trillion AQSh dollari, 2025 · XVF WEO bahosi; Vyetnam va O‘zbekiston — milliy statistika · ~
            yaxlitlangan
          </figcaption>
          <DataTable
            caption="Nominal YaIM, trillion dollar"
            head={["Davlat", "YaIM, trln $"]}
            rows={aseanGdp.map((d) => [d.country, d.value.toLocaleString("ru-RU")])}
          />
        </figure>
      </div>
      <div data-stop className="slide wrap-page py-20">
        <dl className="grid border-t border-feather/60 md:grid-cols-2 md:gap-x-16">
          {keyStats.map((s, i) => (
            <div
              key={s.label}
              className="grid items-baseline gap-3 border-b border-feather/40 py-7 sm:grid-cols-[minmax(10.5rem,auto)_1fr] sm:gap-6"
              data-rev
              style={delay(70 * i)}
            >
              <dd className="order-first text-[clamp(2rem,3.2vw,3.1rem)] leading-none font-light text-depth">
                <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </dd>
              <dt>
                <span className="block text-[1.02rem] leading-snug text-depth">{s.label}</span>
                <span className="note mt-1.5 block">{s.note}</span>
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
