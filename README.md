# Vyetnam iqtisodiyoti — taqdimot sayti

Iqtisodiyot fanidan interaktiv taqdimot: Vyetnam iqtisodiyoti va O‘zbekiston bilan taqqoslash.
Tuzilishi va animatsiyalari «Yaponiya iqtisodiyoti» saytidagi bilan bir xil.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ papkasiga tayyor sayt
```

Vercel’ga joylash: loyihani GitHub’ga yuklang va Vercel’da import qiling (Framework: Vite) yoki `npx vercel`.

## Ism va guruhni qo‘shish

`src/data.ts` faylining boshida:

```ts
export const author = { name: "Ism Familiya", group: "Guruh", course: "Iqtisodiyot fanidan taqdimot" };
```

Barcha matn va raqamlar ham shu faylda.

## Boshqarish

`→ ↓ PageDown Probel` — keyingi qadam · `← ↑ PageUp` — oldingi · `F` — to‘liq ekran · `?` — yordam.

## Bo‘limlar va animatsiyalar

| Bo‘lim | Effekt |
| --- | --- |
| Kirish | WebGL lak/siyoh suyuqlik simulyatsiyasi (sichqoncha — oqim, bosish — tomchi), marmar tugma |
| Vyetnam | GSAP ScrollTrigger parallax (Ha Long ko‘rfazi) |
| Raqamlarda | Bayroq doiralari (suvga tomchi), NumberFlow hisoblagichlar |
| Tarix | Sticky scroll-timeline, siyoh halqalari, ustunli diagramma + O‘zbekiston chizig‘i |
| Đổi Mới | «Whiteout» scroll matni, chiziladigan o‘qlar |
| Sanoat | 3D mato to‘ri, kompaniyalar marquee, 3D flip kartalar |
| Elektronika | Spotlight + Spline 3D robot, sonar nuqtali to‘r, chiziladigan zanjir |
| Muammolar | Particle flow, gorizontal va chiziqli diagrammalar |
| Kelajak | Suzuvchi marmar (aurora) fon |
| Taqqoslash | «Kapalak» diagramma: Vyetnam ↔ O‘zbekiston, saboqlar |
| Xulosa | MeshGradient shader, PulsingBorder muhr, «Rahmat!» flip-matn, splash tugma |

Stack: React 19, Vite, Tailwind CSS v4, GSAP, Lenis, Motion, Paper Shaders, NumberFlow, Spline.
# Presentation-Website-for-Vietnam
