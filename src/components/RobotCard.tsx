import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { cn } from "../lib/utils";

const Spline = lazy(() => import("@splinetool/react-spline"));

function SplineScene({ scene, className }: { scene: string; className?: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <span className="loader" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

/** Sichqonchani kuzatuvchi yumshoq yorug‘lik dog‘i */
function Spotlight({ className, size = 200 }: { className?: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);
  const [parent, setParent] = useState<HTMLElement | null>(null);
  const mx = useSpring(0, { bounce: 0 });
  const my = useSpring(0, { bounce: 0 });
  const left = useTransform(mx, (v) => `${v - size / 2}px`);
  const top = useTransform(my, (v) => `${v - size / 2}px`);

  useEffect(() => {
    const p = ref.current?.parentElement;
    if (p) {
      p.style.position = "relative";
      p.style.overflow = "hidden";
      setParent(p);
    }
  }, []);
  const move = useCallback(
    (e: MouseEvent) => {
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    },
    [mx, my, parent],
  );
  useEffect(() => {
    if (!parent) return;
    const enter = () => setInside(true);
    const leave = () => setInside(false);
    parent.addEventListener("mousemove", move);
    parent.addEventListener("mouseenter", enter);
    parent.addEventListener("mouseleave", leave);
    return () => {
      parent.removeEventListener("mousemove", move);
      parent.removeEventListener("mouseenter", enter);
      parent.removeEventListener("mouseleave", leave);
    };
  }, [parent, move]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200",
        inside ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{ width: size, height: size, left, top }}
    />
  );
}

/** Ko‘rinish maydoniga yaqinlashganda 3D sahnani yuklaydi */
function useNear(margin = "900px") {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return { ref, near };
}

export function RobotCard() {
  const { ref, near } = useNear();
  return (
    <div
      ref={ref}
      className="relative h-[calc(100svh-6rem)] min-h-[480px] w-full overflow-hidden rounded-2xl border border-white/10 bg-sumi text-paper"
    >
      <Spotlight className="-top-40 left-0 from-seal/30 via-ink/25 to-transparent md:-top-20 md:left-60" size={380} />
      <div className="flex h-full max-md:flex-col">
        <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-12">
          <span className="label text-seal">Lắp ráp → Sáng tạo</span>
          <h3 className="mt-4 text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05] font-light text-paper">
            Yig‘uvchidan ixtirochiga
          </h3>
          <p className="mt-5 max-w-[44ch] leading-relaxed text-mist">
            Hozircha Vyetnam ko‘proq yig‘adi: chip va murakkab detallar chetdan keladi. Keyingi qadam —
            avtomatlashtirish va dizayn: Intel, Amkor va Nvidia bilan yarimo‘tkazgich strategiyasi 2030-yilgacha
            50 000 muhandis tayyorlashni ko‘zlaydi.
          </p>
        </div>
        <div className="relative flex-1">
          {near ? (
            <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="h-full w-full" />
          ) : (
            <div className="grid h-full place-items-center">
              <span className="loader" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
