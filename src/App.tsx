import { useEffect } from "react";
import { KeyboardHelp } from "./components/KeyboardHelp";
import { Rail } from "./components/Rail";
import { initScroll } from "./lib/scroll";
import { Closing } from "./sections/Closing";
import { Compare } from "./sections/Compare";
import { Country } from "./sections/Country";
import { DoiMoi } from "./sections/DoiMoi";
import { Electronics } from "./sections/Electronics";
import { Future } from "./sections/Future";
import { History } from "./sections/History";
import { Industry } from "./sections/Industry";
import { Intro } from "./sections/Intro";
import { Numbers } from "./sections/Numbers";
import { Problems } from "./sections/Problems";

/** [data-rev] va [data-words] elementlariga ko‘rinishga kirganda .is-in qo‘shadi */
function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) document.documentElement.classList.add("motion");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-rev], [data-words]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  useEffect(() => initScroll(), []);
  useReveal();
  return (
    <>
      <a
        href="#vyetnam"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-depth focus:px-4 focus:py-2 focus:text-paper"
      >
        Taqdimotga o‘tish
      </a>
      <Rail />
      <main className="pt-12 lg:pt-0 lg:pl-[var(--rail)]">
        <Intro />
        <Country />
        <Numbers />
        <History />
        <DoiMoi />
        <Industry />
        <Electronics />
        <Problems />
        <Future />
        <Compare />
        <Closing />
      </main>
      <KeyboardHelp />
    </>
  );
}
