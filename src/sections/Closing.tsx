import { useEffect, useRef, useState } from "react";
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";
import { author, conclusions, sources } from "../data";
import { Emblem } from "../components/Emblem";
import { FlipText } from "../components/FlipText";
import { SplashButton } from "../components/SplashButton";
import { Words } from "../components/text";
import { scrollToY } from "../lib/scroll";
import { delay } from "../lib/utils";

/** Har safar ko‘rinishga kirganda hisoblagich oshadi — animatsiya qayta ishga tushadi */
function useReplay() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setCount((c) => c + 1), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, count };
}

function Seal() {
  return (
    <div className="relative grid size-40 place-items-center">
      <PulsingBorder
        colors={["#c9971c", "#e8c66a", "#8f1d14", "#f8f5ef"]}
        colorBack="#00000000"
        speed={1.2}
        roundness={1}
        thickness={0.08}
        softness={0.3}
        intensity={0.5}
        spots={4}
        spotSize={0.12}
        pulse={0.12}
        smoke={0.4}
        smokeSize={3}
        style={{ width: 96, height: 96, borderRadius: "50%" }}
        className="absolute"
      />
      <Emblem className="relative size-12" />
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 size-full animate-[spin_28s_linear_infinite] motion-reduce:animate-none"
      >
        <defs>
          <path id="seal-ring" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
        </defs>
        <text className="fill-feather text-[7px] tracking-[0.24em] uppercase">
          <textPath href="#seal-ring">Vyetnam iqtisodiyoti · Kinh tế Việt Nam · 2026 · Rahmat ·</textPath>
        </text>
      </svg>
    </div>
  );
}

export function Closing() {
  const replay = useReplay();
  return (
    <>
      <section id="xulosa" aria-label="Xulosa" className="relative isolate overflow-hidden bg-depth text-paper">
        <MeshGradient
          className="absolute inset-0 -z-10 h-full w-full"
          colors={["#24130e", "#5c1610", "#140a07", "#8f1d14"]}
          distortion={0.85}
          swirl={0.25}
          speed={0.22}
        />
        <div data-stop className="slide wrap-page py-20">
          <Words as="h2" className="section-title text-paper" text="Xulosa" />
          <ul className="mt-14 grid gap-10 md:grid-cols-3">
            {conclusions.map((c, i) => (
              <li
                key={i}
                className="border-t border-white/20 pt-6 text-[clamp(1.1rem,1.5vw,1.35rem)] leading-relaxed font-light text-mist"
                data-rev
                style={delay(120 * i)}
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div
          ref={replay.ref}
          data-stop
          className="flex min-h-svh flex-col items-center justify-center px-6 pb-24 text-center"
        >
          <Seal />
          <h2 className="mt-10 text-[clamp(4.5rem,12vw,10.5rem)] leading-none font-extralight tracking-[-0.04em] text-paper">
            {replay.count > 0 ? <FlipText key={replay.count}>Rahmat!</FlipText> : "Rahmat!"}
          </h2>
          <p className="vn mt-5 text-[clamp(1.4rem,2vw,1.9rem)] tracking-[0.08em] text-seal">Xin cảm ơn!</p>
          <p className="lede mt-4 !text-mist">E’tiboringiz uchun rahmat. Savollaringiz bo‘lsa — marhamat.</p>
          {author.name && (
            <p className="mt-2 text-mist">
              {author.name}
              {author.group && <span className="text-feather"> · {author.group}</span>}
            </p>
          )}
          <SplashButton
            className="splash-btn--light mt-12"
            label="Boshiga qaytish"
            hoverLabel="Yana bir bor"
            onClick={() => scrollToY(0)}
          />
        </div>
      </section>

      <section id="manbalar" data-stop aria-label="Manbalar" className="slide bg-paper py-20">
        <div className="wrap-page grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <h2 className="text-[1.8rem] font-light text-depth">Manbalar</h2>
            <p className="note mt-3 max-w-[32ch]">
              Barcha raqamlar ochiq manbalardan olingan. «~» — yaxlitlangan yoki taxminiy qiymat.
            </p>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {sources.map((s) => (
              <li key={s} className="border-b border-mist py-3 text-[0.95rem] text-depth">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <p className="wrap-page note mt-14">
          Sayt React, Spline 3D, GSAP, Lenis va WebGL lak simulyatsiyasi bilan qurilgan · 2026
        </p>
      </section>
    </>
  );
}
