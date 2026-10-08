import type { ElementType, ReactNode } from "react";
import { cn } from "../lib/utils";

/** So‘zma-so‘z xiralikdan chiqib keladigan sarlavha */
export function Words({
  text,
  as: Tag = "span",
  className,
  start = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  start?: number;
}) {
  const words = text.split(" ");
  return (
    <Tag className={cn(className)} data-words="">
      {words.map((w, i) => (
        <span key={i}>
          <span className="w" style={{ "--i": i + start } as React.CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/** Chap tomonda vertikal vyetnamcha yozuv + kontent */
export function Vertical({
  vn,
  children,
  className,
  tone = "text-dilute",
}: {
  vn: string;
  children: ReactNode;
  className?: string;
  tone?: string;
}) {
  return (
    <div className={cn("flex items-start gap-[clamp(1rem,2vw,1.75rem)]", className)}>
      <span
        className={cn(
          "vn shrink-0 pt-2 text-[clamp(1.15rem,1.7vw,1.6rem)] leading-none tracking-[0.18em] whitespace-nowrap [writing-mode:vertical-rl]",
          tone,
        )}
        aria-hidden="true"
      >
        {vn}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
