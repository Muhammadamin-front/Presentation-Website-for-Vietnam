import { aging, exportMarkets, risks } from "../data";
import { DataTable, HBarList, LineChart } from "../components/charts";
import { ParticleFlow } from "../components/ParticleFlow";
import { Vertical, Words } from "../components/text";
import { delay } from "../lib/utils";

export function Problems() {
  return (
    <section id="muammolar" aria-label="Muammolar" className="bg-paper">
      <div data-stop>
        <ParticleFlow theme="lacquer" density="medium" className="h-svh min-h-[560px]">
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-[60%] w-[min(820px,92%)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,var(--color-paper)_40%,rgba(248,245,239,0.7)_70%,transparent)]"
            />
            <Vertical vn="Thách thức" className="relative">
              <Words as="h2" className="section-title text-depth" text="Tez o‘sishning narxi" />
            </Vertical>
            <p className="lede relative mt-6 max-w-[48ch]" data-rev style={delay(160)}>
              Bitta bozorga qaramlik, boyimasdan qarish xavfi, iqlim va moliya tizimidagi zaifliklar — Vyetnam bugun
              yechayotgan og‘ir masalalar.
            </p>
          </div>
        </ParticleFlow>
      </div>

      <div data-stop className="slide wrap-page grid gap-14 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <h3 className="text-[clamp(2rem,3.2vw,3rem)] leading-tight font-light text-depth" data-rev>
            Har uch dollar eksportdan biri — AQShga
          </h3>
          <p className="lede mt-6" data-rev style={delay(120)}>
            2025-yilda AQShga eksport 153 mlrd $ ga yetdi (+28%). Aprelda Vashington 46% boj e’lon qildi, iyuldagi
            kelishuv bilan u 20% ga tushdi (tranzit tovarlarga — 40%). Bitta bozorga bog‘liqlik — eng katta tashqi xavf.
          </p>
          <p className="mt-6 max-w-[42ch] text-[0.95rem] leading-relaxed text-depth" data-rev style={delay(220)}>
            <span className="mr-2 inline-block size-2 rounded-full bg-uz align-middle" aria-hidden="true" />
            Kesik chiziq — O‘zbekistonning 2025-yildagi <em>butun</em> eksporti (33,8 mlrd $): Vyetnam faqat AQShning
            o‘ziga 4,5 barobar ko‘p sotadi.
          </p>
        </div>
        <figure className="pt-6">
          <HBarList
            data={exportMarkets}
            max={170}
            unit=" mlrd $"
            label="Vyetnam eksporti bozorlar bo‘yicha, mlrd dollar"
            reference={{ value: 33.8, label: "O‘zbekiston: jami eksport, 33,8" }}
          />
          <figcaption className="note mt-5">
            Vyetnam eksporti bozorlar bo‘yicha, mlrd $, 2025 · AQSh — Sanoat va savdo vazirligi; qolganlari ~ taxminiy
          </figcaption>
        </figure>
      </div>

      <div data-stop className="slide bg-wash py-20">
        <div className="wrap-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h3 className="text-[clamp(2rem,3.2vw,3rem)] leading-tight font-light text-depth" data-rev>
              Boyimasdan qarish xavfi
            </h3>
            <p className="lede mt-6" data-rev style={delay(120)}>
              2024-yilda 65+ yoshdagilar ~9% edi. 2035-yil atrofida bu ulush 14% ga yetadi — Vyetnam «qarigan jamiyat»ga
              Yaponiya va Koreyadan ancha past daromad bilan kiradi. «Oltin demografiya» oynasi 2036-yil atrofida yopiladi.
            </p>
            <p className="mt-6 max-w-[42ch] text-[0.95rem] leading-relaxed text-depth" data-rev style={delay(220)}>
              <span className="mr-2 inline-block size-2 rounded-full bg-uz align-middle" aria-hidden="true" />
              O‘zbekistonda bu ulush ~5–6%, aholi ancha yosh — demografik imkoniyat oynasi hali uzoq ochiq.
            </p>
          </div>
          <figure>
            <LineChart
              data={aging}
              label="Vyetnamda 65 va undan katta yoshdagilar ulushi, foiz"
              unitLabel="aholi 65+"
            />
            <figcaption className="note mt-3">
              Jahon banki (2000–2024); 2035 va 2050 — prognoz (NSO–UNFPA, BMT).{" "}
              <span aria-hidden="true" className="mx-1 inline-block size-2 rounded-full bg-seal align-middle" /> 2024 —
              so‘nggi ma’lumot
            </figcaption>
            <DataTable
              caption="65 va undan katta yoshdagilar ulushi"
              head={["Yil", "Ulush"]}
              rows={aging.map((a) => [a.year, `${a.value.toLocaleString("ru-RU")}%${a.projected ? " (prognoz)" : ""}`])}
            />
          </figure>
        </div>
      </div>

      <div data-stop className="slide wrap-page py-20">
        <div className="grid gap-px bg-mist md:grid-cols-2">
          {risks.map((r, i) => (
            <article key={r.title} className="bg-paper py-16 md:px-10 md:first:pl-0" data-rev style={delay(100 * i)}>
              <p className="text-[clamp(2.8rem,4.6vw,4.4rem)] leading-none font-light text-depth">{r.figure}</p>
              <h3 className="mt-5 text-[1.45rem] font-light text-depth">{r.title}</h3>
              <p className="mt-3 max-w-[46ch] leading-relaxed text-dilute">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
