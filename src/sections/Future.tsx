import { future } from "../data";
import { AuroraBackground } from "../components/marbling";
import { Vertical, Words } from "../components/text";
import { cn, delay } from "../lib/utils";

export function Future() {
  return (
    <section id="kelajak" aria-label="Kelajak">
      <AuroraBackground>
        <div data-stop className="slide wrap-page py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Vertical vn="Tương lai">
              <Words as="h2" className="section-title text-depth" text="2045 sari: yangi o‘sish manbalari" />
            </Vertical>
            <p className="lede" data-rev style={delay(120)}>
              Vyetnam 2030-yilga yuqori-o‘rta, 2045-yilga — mustaqillikning 100 yilligiga — yuqori daromadli davlat
              bo‘lishni maqsad qilgan. Yo‘l: chiplar, infratuzilma, ixcham davlat va yashil energiya.
            </p>
          </div>
          <ul className="mt-16 grid gap-x-10 md:grid-cols-6">
            {future.map((f, i) => (
              <li
                key={f.tag}
                className={cn("border-t border-feather/60 py-8", i < 3 ? "md:col-span-2" : "md:col-span-3")}
                data-rev
                style={delay(90 * i)}
              >
                <span className="label text-ink">{f.tag}</span>
                <h3
                  className={cn(
                    "mt-3 leading-tight font-light text-depth",
                    i < 3 ? "text-[1.6rem]" : "text-[2rem]",
                  )}
                >
                  {f.title}
                </h3>
                <p className="mt-3 max-w-[48ch] leading-relaxed text-depth/80">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </AuroraBackground>
    </section>
  );
}
