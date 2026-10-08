import { useEffect, useRef } from "react";
import { crisis, reformSteps } from "../data";
import { Words } from "../components/text";
import { trackStage } from "../lib/scroll";
import { delay } from "../lib/utils";

export function DoiMoi() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => (stage.current ? trackStage(stage.current) : undefined), []);

  return (
    <section id="doimoi" aria-label="Đổi Mới — yangilanish">
      <div ref={stage} data-stop data-stops="0.04" className="stage h-[260svh]">
        <div className="stage__pin grid place-items-center bg-paper">
          <div className="wrap-page text-center">
            <h2
              className="whiteout mx-auto text-[clamp(2.1rem,9.2vw,8.4rem)] leading-[0.92] font-light tracking-[-0.035em] text-depth uppercase"
              aria-label="Đổi Mới — yangilanish"
            >
              <span className="block">Đổi Mới</span>
              <span className="block text-ink">yangilanish</span>
              <span className="block">1986</span>
            </h2>
            <p className="whiteout-caption mx-auto mt-10 max-w-[48ch] text-[clamp(1.05rem,1.4vw,1.3rem)] text-dilute">
              1986-yil dekabr. Giperinflyatsiya, oziq-ovqat tanqisligi, izolyatsiya — partiya rejali iqtisodiyotdan voz
              kechib, bozorga eshik ochdi. Eski tizim xuddi shu yozuv kabi eriy boshladi.
            </p>
          </div>
        </div>
      </div>

      <div data-stop className="slide bg-paper py-20">
        <div className="wrap-page">
          <Words as="h2" className="section-title max-w-[18ch] text-depth" text="Islohotdan oldin: boshi berk ko‘cha" />
          <div className="mt-14 grid gap-px border-y border-mist bg-mist md:grid-cols-3">
            {crisis.map((c, i) => (
              <article
                key={c.title}
                className="bg-paper py-9 md:px-8 md:first:pl-0 md:last:pr-0"
                data-rev
                style={delay(90 * i)}
              >
                <p className="tnum text-sm text-dilute">{c.period}</p>
                <h3 className="mt-2 text-[1.6rem] font-light text-depth">{c.title}</h3>
                <p className="mt-4 leading-relaxed text-dilute">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div data-stop className="slide bg-wash py-20">
        <div className="wrap-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Words as="h2" className="section-title text-depth" text="Đổi Mới: uch qadam" />
            <p className="lede" data-rev style={delay(120)}>
              Yuqoridan buyruq emas, pastdan tashabbus: dehqonlar yashirincha boshlagan oilaviy pudrat tajribasini davlat
              qonunlashtirdi. Islohot uch yo‘nalishda bir vaqtda urildi.
            </p>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3" data-rev>
            {reformSteps.map((s, i) => (
              <div key={s.title}>
                <svg viewBox="0 0 320 40" className="w-full overflow-visible" aria-hidden="true">
                  <path
                    className="draw"
                    pathLength={1}
                    d="M4 20 H300"
                    stroke="var(--color-depth)"
                    strokeWidth="1.6"
                    fill="none"
                    style={{ transitionDelay: `${i * 220}ms` }}
                  />
                  <path
                    className="draw"
                    pathLength={1}
                    d="M286 8 L306 20 L286 32"
                    stroke="var(--color-ink)"
                    strokeWidth="1.6"
                    fill="none"
                    style={{ transitionDelay: `${i * 220 + 500}ms` }}
                  />
                  <path
                    className="draw"
                    pathLength={1}
                    d="M4 20 l-10 -10 M4 20 l-10 10 M14 20 l-10 -10 M14 20 l-10 10"
                    stroke="var(--color-feather)"
                    strokeWidth="1.4"
                    fill="none"
                    style={{ transitionDelay: `${i * 220}ms` }}
                  />
                </svg>
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="vn text-[2.6rem] leading-none text-ink">{s.n}</span>
                  <h3 className="text-[1.45rem] font-light text-depth">{s.title}</h3>
                </div>
                <p className="mt-3 leading-relaxed text-dilute">{s.text}</p>
              </div>
            ))}
          </div>
          <p
            className="mt-16 max-w-[62ch] border-t border-feather/50 pt-8 text-[clamp(1.1rem,1.5vw,1.35rem)] leading-relaxed font-light text-depth"
            data-rev
          >
            Natija: inflyatsiya 1990-yillar o‘rtasida bir xonali raqamga tushdi, qashshoqlik 1990-yillar boshidagi ~60%
            dan bugun bir necha foizgacha qisqardi (Jahon banki).{" "}
            <span className="text-uz">
              O‘zbekiston uchun parallel — 2017-yildagi valyuta liberallashuvi: Vyetnam bu yo‘lni 31 yil oldin boshlagan.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
