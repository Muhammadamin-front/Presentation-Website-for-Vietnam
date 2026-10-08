import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../lib/utils";

/** Nuqtali to‘r: vaqti-vaqti bilan (va bosilganda) sonar to‘lqini tarqaladi */
export function SonarGrid({
  spacing = 26,
  dotRadius = 1.4,
  baseOpacity = 0.28,
  color,
  pingEvery = 2.4,
  speed = 260,
  ringWidth = 90,
  amplitude = 2.2,
  maxRings = 6,
  pingArea = [0.15, 0.2, 0.85, 0.8] as [number, number, number, number],
  className,
  children,
}: {
  spacing?: number;
  dotRadius?: number;
  baseOpacity?: number;
  color?: string;
  pingEvery?: number;
  speed?: number;
  ringWidth?: number;
  amplitude?: number;
  maxRings?: number;
  pingArea?: [number, number, number, number];
  className?: string;
  children?: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const opts = useRef({ spacing, dotRadius, baseOpacity, pingEvery, speed, ringWidth, amplitude, maxRings, pingArea });
  opts.current = { spacing, dotRadius, baseOpacity, pingEvery, speed, ringWidth, amplitude, maxRings, pingArea };

  useEffect(() => {
    const el = host.current;
    const canvas = cvs.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let raf = 0;
    let timer = 0;
    let visible = true;
    let seeded = false;
    let fill = "";
    let rings: { x: number; y: number; born: number }[] = [];
    let nextPing = performance.now() + opts.current.pingEvery * 1000;

    const readColor = () => {
      fill = getComputedStyle(canvas).color;
    };
    const ping = (x: number, y: number, at: number) => {
      readColor();
      rings.push({ x, y, born: at });
      while (rings.length > opts.current.maxRings) rings.shift();
    };
    const draw = (now: number) => {
      const o = opts.current;
      const life = (Math.hypot(w, h) + o.ringWidth) / o.speed;
      rings = rings.filter((r) => (now - r.born) / 1000 < life);
      const active = rings.map((r) => {
        const age = (now - r.born) / 1000;
        const radius = age * o.speed;
        return { x: r.x, y: r.y, radius, reach: radius + o.ringWidth, fade: 1 - age / life };
      });
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = fill;
      const cols = Math.ceil(w / o.spacing) + 1;
      const rows = Math.ceil(h / o.spacing) + 1;
      const ox = (w - (cols - 1) * o.spacing) / 2;
      const oy = (h - (rows - 1) * o.spacing) / 2;
      const lit: number[] = [];
      ctx.globalAlpha = o.baseOpacity;
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const x = ox + c * o.spacing;
        for (let r = 0; r < rows; r++) {
          const y = oy + r * o.spacing;
          let k = 0;
          for (const a of active) {
            if (Math.abs(x - a.x) > a.reach || Math.abs(y - a.y) > a.reach) continue;
            const d = Math.abs(Math.hypot(x - a.x, y - a.y) - a.radius);
            if (d >= o.ringWidth) continue;
            const s = 1 - d / o.ringWidth;
            const v = s * s * (3 - 2 * s) * a.fade;
            if (v > k) k = v;
          }
          if (k < 0.01) {
            ctx.moveTo(x + o.dotRadius, y);
            ctx.arc(x, y, o.dotRadius, 0, Math.PI * 2);
          } else lit.push(x, y, k);
        }
      }
      ctx.fill();
      for (let i = 0; i < lit.length; i += 3) {
        const k = lit[i + 2];
        ctx.globalAlpha = o.baseOpacity + (1 - o.baseOpacity) * k;
        ctx.beginPath();
        ctx.arc(lit[i], lit[i + 1], o.dotRadius * (1 + o.amplitude * k), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const fit = () => {
      const r = el.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!seeded) {
        seeded = true;
        const [x0, y0, x1, y1] = opts.current.pingArea;
        if (!mq.matches) ping(w * (x0 + (x1 - x0) * 0.68), h * (y0 + (y1 - y0) * 0.34), performance.now() - 500);
      }
      draw(performance.now());
    };
    const sleep = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => loop(performance.now()), Math.max(16, ms));
    };
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (mq.matches) {
        rings = [];
        draw(now);
        return;
      }
      const o = opts.current;
      if (o.pingEvery > 0 && now >= nextPing) {
        const [x0, y0, x1, y1] = o.pingArea;
        ping(w * (x0 + Math.random() * (x1 - x0)), h * (y0 + Math.random() * (y1 - y0)), now);
        nextPing = now + o.pingEvery * 1000;
      }
      draw(now);
      if (rings.length > 0) raf = requestAnimationFrame(loop);
      else if (o.pingEvery > 0) sleep(nextPing - now);
    };
    const wake = () => {
      if (!raf) {
        window.clearTimeout(timer);
        raf = requestAnimationFrame(loop);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (mq.matches) return;
      const r = el.getBoundingClientRect();
      ping(e.clientX - r.left, e.clientY - r.top, performance.now());
      wake();
    };
    const onVis = () => {
      if (!document.hidden) wake();
    };
    const ro = new ResizeObserver(fit);
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e?.isIntersecting ?? true;
        if (visible) wake();
      },
      { threshold: 0 },
    );
    readColor();
    fit();
    ro.observe(el);
    io.observe(el);
    el.addEventListener("pointerdown", onDown);
    document.addEventListener("visibilitychange", onVis);
    wake();
    return () => {
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={host} data-slot="sonar-grid" className={cn("relative isolate cursor-crosshair overflow-hidden", className)}>
      <canvas
        ref={cvs}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full text-feather"
        style={color ? { color } : undefined}
      />
      {children}
    </div>
  );
}
