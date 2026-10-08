import { companies } from "../data";

/** Cheksiz aylanuvchi kompaniyalar tasmasi */
export function Marquee() {
  const items = [...companies, ...companies];
  return (
    <div
      className="marquee overflow-hidden border-y border-mist py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      aria-label="Vyetnam kompaniyalari"
    >
      <div className="marquee__track gap-14 pr-14">
        {items.map(([name, what], i) => (
          <span key={i} className="flex items-baseline gap-3 whitespace-nowrap" aria-hidden={i >= companies.length}>
            <span className="vn text-[1.8rem] text-depth">{name}</span>
            <span className="text-sm text-dilute">{what}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
