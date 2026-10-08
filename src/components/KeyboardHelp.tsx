import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { scrollToY, step } from "../lib/scroll";

const keys = [
  ["→  ↓  PageDown  Probel", "Keyingi qadam"],
  ["←  ↑  PageUp", "Oldingi qadam"],
  ["Home / End", "Boshi / oxiri"],
  ["F", "To‘liq ekran"],
  ["?", "Shu oynani ochish / yopish"],
];
const live = [
  ["Kirish", "Sichqonchani suring — lak oqadi; bosing — yangi tomchi"],
  ["Sanoat", "To‘rni sichqoncha bilan torting; kartalarni bosing — aylanadi"],
  ["Elektronika", "Robot sichqoncha ortidan qaraydi; nuqtali maydonni bosing"],
  ["Taqqoslash", "Qator ustiga olib boring — necha barobar farq qilishi"],
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          if (t.closest("button") && e.key === " ") return;
          e.preventDefault();
          step(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          step(-1);
          break;
        case "Home":
          e.preventDefault();
          scrollToY(0);
          break;
        case "End":
          e.preventDefault();
          scrollToY(document.documentElement.scrollHeight);
          break;
        case "f":
        case "F":
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.();
          break;
        case "?":
          setOpen((o) => !o);
          break;
        case "Escape":
          setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Klaviatura yordami"
      className="fixed right-6 bottom-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-mist bg-paper p-6 shadow-[0_18px_40px_-18px_rgba(36,19,14,0.35)]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-normal text-depth">Taqdimotni boshqarish</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Yopish"
          className="grid size-8 place-items-center rounded-full text-dilute hover:bg-mist hover:text-depth"
        >
          <X className="size-4" />
        </button>
      </div>
      <dl className="mt-4 divide-y divide-mist">
        {keys.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-sm text-depth">{k}</dt>
            <dd className="text-sm text-dilute">{v}</dd>
          </div>
        ))}
      </dl>
      <h3 className="label mt-6 text-dilute">Jonli effektlar</h3>
      <dl className="mt-2 divide-y divide-mist">
        {live.map(([k, v]) => (
          <div key={k} className="py-2.5">
            <dt className="text-sm text-depth">{k}</dt>
            <dd className="text-sm text-dilute">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="note mt-4">Klikker (pult) ham ishlaydi — u PageDown/PageUp yuboradi.</p>
    </div>
  );
}
