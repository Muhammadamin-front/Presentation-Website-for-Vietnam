import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CSSProperties } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Paydo bo‘lish kechikishi: style={delay(120)} */
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** So‘z indeksi: style={wordIndex(0)} */
export const wordIndex = (i: number) => ({ "--i": i }) as CSSProperties;

/** 1234.5 → «1 234,5» (o‘zbekcha yozuv) */
export const fmt = (v: number, digits = 1) =>
  v.toLocaleString("ru-RU", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
