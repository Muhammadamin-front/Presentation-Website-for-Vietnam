/* Taqdimotning barcha matn va raqamlari shu faylda.
   «~» — yaxlitlangan yoki taxminiy qiymat. */

export const author = {
  name: "", // masalan: "Ism Familiya"
  group: "", // masalan: "IQT-21"
  course: "Iqtisodiyot fanidan taqdimot",
};

export const sections = [
  { id: "kirish", label: "Kirish" },
  { id: "vyetnam", label: "Vyetnam" },
  { id: "raqamlar", label: "Raqamlarda" },
  { id: "tarix", label: "Tarix" },
  { id: "doimoi", label: "Đổi Mới" },
  { id: "sanoat", label: "Sanoat" },
  { id: "elektronika", label: "Elektronika" },
  { id: "muammolar", label: "Muammolar" },
  { id: "kelajak", label: "Kelajak" },
  { id: "taqqoslash", label: "Taqqoslash" },
  { id: "xulosa", label: "Xulosa" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/* ── Kirish ── */
export const heroStats = [
  { label: "YaIM", value: "~514 mlrd $", note: "2025, rasmiy statistika" },
  { label: "Aholi", value: "~102 mln", note: "2025" },
  { label: "Real o‘sish", value: "8,02%", note: "2025 · 2026 1-yarim: 8,18%" },
];

/* ── Vyetnam ── */
export const countryFacts = [
  { value: "331 ming km²", label: "Maydoni — O‘zbekistondan (449 ming km²) ~26% kichik" },
  { value: "3 260 km", label: "Dengiz qirg‘og‘i · O‘zbekiston — ikki karra quruqlik bilan o‘ralgan" },
  { value: "~102 mln", label: "Aholi — O‘zbekistondan (38,2 mln) 2,7 barobar ko‘p" },
  { value: "₫ Dong", label: "Milliy valyuta · Poytaxt — Hanoy, eng yirik shahar — Xoshimin" },
];

/* ── Raqamlarda ── */
export type Bubble = { country: string; code: string; value: number; focus?: "vn" | "uz" };
export const aseanGdp: Bubble[] = [
  { country: "Indoneziya", code: "id", value: 1.44 },
  { country: "Singapur", code: "sg", value: 0.57 },
  { country: "Tailand", code: "th", value: 0.55 },
  { country: "Vyetnam", code: "vn", value: 0.514, focus: "vn" },
  { country: "Filippin", code: "ph", value: 0.5 },
  { country: "Malayziya", code: "my", value: 0.45 },
  { country: "O‘zbekiston", code: "uz", value: 0.145, focus: "uz" },
];

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  note: string;
};
export const keyStats: Stat[] = [
  {
    value: 5026,
    suffix: " $",
    label: "Aholi jon boshiga YaIM — yuqori-o‘rta daromadli davlatlar guruhida",
    note: "2025 · O‘zbekiston: ~3,8 ming $",
  },
  {
    value: 475,
    suffix: " mlrd $",
    label: "Eksport — rekord; tashqi savdo aylanmasi 930 mlrd $ dan oshdi",
    note: "2025 · O‘zbekiston eksporti: 33,8 mlrd $",
  },
  {
    value: 27.6,
    suffix: " mlrd $",
    decimals: 1,
    label: "Amalda kiritilgan to‘g‘ridan-to‘g‘ri xorijiy investitsiya (FDI) — 5 yildagi eng yuqori",
    note: "Statistika idorasi, 2025",
  },
  {
    value: 3.31,
    suffix: "%",
    decimals: 2,
    label: "O‘rtacha inflyatsiya — parlament belgilagan maqsad doirasida",
    note: "2025 · O‘zbekiston: 7,3%",
  },
  {
    value: 21.2,
    suffix: " mln",
    decimals: 1,
    label: "Xorijiy sayyohlar — rekord, 2019-yildan 18% ko‘p",
    note: "VNAT, 2025",
  },
  {
    value: 42,
    prefix: "~",
    suffix: "%",
    label: "Xizmatlar sohasining YaIMdagi ulushi (sanoat va qurilish ~38%, qishloq xo‘jaligi ~12%)",
    note: "Statistika idorasi, 2024",
  },
];

/* ── Tarix ── */
export const timeline = [
  {
    year: "1975",
    title: "Birlashish",
    text: "Urush tugadi, Shimol va Janub birlashdi. Sovet uslubidagi rejali iqtisodiyot: kooperativlar, narx nazorati, xususiy savdo taqiqlandi.",
  },
  {
    year: "1986",
    title: "Đổi Mới — yangilanish",
    text: "Inflyatsiya ~775% ga yetgan inqiroz paytida VI Partiya qurultoyi bozor iqtisodiyotiga o‘tish yo‘lini e’lon qildi.",
  },
  {
    year: "1995",
    title: "Dunyoga qaytish",
    text: "AQSh embargoni bekor qildi (1994) va diplomatik munosabatlar tiklandi; Vyetnam ASEANga a’zo bo‘ldi.",
  },
  {
    year: "2007",
    title: "JST a’zoligi",
    text: "Vyetnam Jahon savdo tashkilotiga kirdi — xorijiy investitsiya va eksport oqimi keskin tezlashdi.",
  },
  {
    year: "2019",
    title: "CPTPP va «Xitoy + 1»",
    text: "Tinch okeani savdo bitimi kuchga kirdi, AQSh–Xitoy savdo urushi esa zavodlarni Vyetnamga ko‘chira boshladi.",
  },
  {
    year: "2025",
    title: "Tarixiy sakrash",
    text: "YaIM 8,02% o‘sdi, aholi jon boshiga YaIM 5 000 $ dan oshdi. 63 viloyat 34 taga birlashtirildi. 2026 1-yarim: +8,18%.",
  },
];

export const growthPeriods = [
  { period: "1991–2000", name: "Islohot va ochilish", value: 7.6, approx: true },
  { period: "2001–2010", name: "JST sari", value: 6.8, approx: true },
  { period: "2011–2019", name: "Barqaror o‘sish", value: 6.4, approx: true },
  { period: "2020–2025", name: "Pandemiya va tiklanish", value: 5.6, approx: true },
];

/* ── Đổi Mới ── */
export const crisis = [
  {
    title: "Giperinflyatsiya",
    period: "1985–1988",
    text: "Pul islohoti muvaffaqiyatsiz chiqdi, narxlar 1986-yilda ~775% oshdi. Maosh bir necha haftada qadrsizlanardi.",
  },
  {
    title: "Ocharchilik xavfi",
    period: "1980-yillar",
    text: "Kollektiv xo‘jaliklarda dehqon natijadan manfaatdor emas edi — guruch o‘stiruvchi mamlakat guruchni import qilardi.",
  },
  {
    title: "Izolyatsiya",
    period: "1975–1994",
    text: "AQSh embargosi, Kambodja mojarosi va 1991-yildan Sovet yordamining to‘xtashi tashqi manbalarni kesib qo‘ydi.",
  },
];

export const reformSteps = [
  {
    n: "I",
    title: "Yer — dehqonga",
    text: "1988-yilgi «Khoán 10»: oila yerni uzoq muddatga oldi va ortiqcha hosilni o‘zi sotdi. 1989-yilda Vyetnam guruch eksportchisiga aylandi.",
  },
  {
    n: "II",
    title: "Narx — bozorga",
    text: "Narxlar erkinlashtirildi, valyuta kurslari birlashtirildi, xususiy korxonalarga ruxsat berildi (1990, 1999-yilgi Korxonalar qonuni).",
  },
  {
    n: "III",
    title: "Eshik — dunyoga",
    text: "1987-yilgi Xorijiy investitsiyalar qonuni, eksport zonalari va savdo bitimlari — bugun 17 ta erkin savdo kelishuvi.",
  },
];

/* ── Sanoat ── */
export const exportsList = [
  {
    name: "Elektronika va telefonlar",
    vn: "Điện tử",
    text: "2025-yilda kompyuter va elektronika eksporti 107,8 mlrd $ ga yetdi. Samsung smartfonlarining katta qismi Vyetnamda yig‘iladi.",
    makers: "Samsung · Intel · LG · Foxconn · Apple ta’minotchilari",
  },
  {
    name: "To‘qimachilik va poyabzal",
    vn: "Dệt may",
    text: "Dunyoning yetakchi kiyim va poyabzal eksportchilaridan biri: Nike poyabzalining qariyb yarmi shu yerda tikiladi.",
    makers: "Nike · Adidas · Uniqlo · H&M uchun zavodlar",
  },
  {
    name: "Qishloq xo‘jaligi",
    vn: "Nông sản",
    text: "Kofe eksporti bo‘yicha dunyoda 2-o‘rin (robusta — 1-o‘rin), guruch eksportida yetakchi uchlikda, kaju yong‘og‘ida — 1-o‘rin.",
    makers: "Guruch · Kofe · Kaju · Qisqichbaqa · Durian",
  },
  {
    name: "Turizm va xizmatlar",
    vn: "Du lịch",
    text: "2025-yilda 21,2 mln xorijiy sayyoh — rekord. Ha Long, Hoyan, Fukuok — eksportdan keyingi yirik valyuta manbai.",
    makers: "Vietjet · Vinpearl · Sun Group",
  },
];

export const companies: [string, string][] = [
  ["Vingroup", "konglomerat"],
  ["VinFast", "elektromobil"],
  ["Viettel", "telekom"],
  ["FPT", "IT xizmatlari"],
  ["Vinamilk", "sut mahsulotlari"],
  ["Hòa Phát", "po‘lat"],
  ["Vietjet", "aviatsiya"],
  ["Masan", "iste’mol mollari"],
  ["Vietcombank", "bank"],
  ["PetroVietnam", "energetika"],
  ["Trung Nguyên", "kofe"],
  ["THACO", "avtomobil"],
  ["Sun Group", "turizm"],
  ["MoMo", "fintex"],
  ["Techcombank", "bank"],
  ["Vinpearl", "kurortlar"],
];

export const modelWords = [
  {
    word: "Khoán",
    label: "Khoán 10 · 1988",
    meaning: "Oilaviy pudrat",
    text: "Yer davlatniki qoladi, lekin oila uni uzoq muddat ishlatadi va ortiqcha hosilni bozorda sotadi. Ochlikdan eksportga — ikki yilda.",
  },
  {
    word: "Mở cửa",
    label: "Mở cửa · FDI",
    meaning: "Eshiklarni ochish",
    text: "Xorijiy kapital uchun soliq imtiyozlari va sanoat parklari. Bugun xorijiy kompaniyalar eksportning 77% ini beradi.",
  },
  {
    word: "FTA",
    label: "Hiệp định · 17 ta",
    meaning: "Erkin savdo tarmog‘i",
    text: "CPTPP, EVFTA, RCEP: Vyetnam mollari Yevropa, Yaponiya, Kanada va Osiyo bozorlariga past bojlar bilan kiradi.",
  },
  {
    word: "Tư nhân",
    label: "Nghị quyết 68 · 2025",
    meaning: "Xususiy sektor",
    text: "2025-yilgi 68-qaror xususiy sektorni iqtisodiyotning «eng muhim harakatlantiruvchi kuchi» deb e’lon qildi.",
  },
];

/* ── Elektronika ── */
export const techStats: Stat[] = [
  {
    value: 107.8,
    suffix: " mlrd $",
    decimals: 1,
    label: "Kompyuter va elektronika eksporti",
    note: "2025 · eng yirik eksport moddasi",
  },
  {
    value: 77.3,
    suffix: "%",
    decimals: 1,
    label: "Eksportda xorijiy investitsiyali kompaniyalar ulushi",
    note: "2025",
  },
  {
    value: 153.2,
    suffix: " mlrd $",
    decimals: 1,
    label: "AQShga eksport — eng yirik bozor",
    note: "2025 · +28%",
  },
  {
    value: 50000,
    label: "2030-yilgacha tayyorlanadigan chip muhandislari",
    note: "Yarimo‘tkazgich strategiyasi",
  },
];

export const factoryPath = [
  { year: "1987", name: "Investitsiya qonuni", text: "Xorijiy kapitalga ilk bor eshik ochildi" },
  { year: "1991", name: "Tân Thuận", text: "Xoshiminda birinchi eksport ishlab chiqarish zonasi" },
  { year: "2009", name: "Samsung", text: "Bắc Ninh: Samsungning birinchi telefon zavodi ishga tushdi" },
  { year: "2010", name: "Intel", text: "Xoshimin: Intelning eng yirik yig‘ish-sinov zavodi" },
  { year: "2019", name: "«Xitoy + 1»", text: "Savdo urushi: Apple va Foxconn ta’minotchilari ko‘chib keldi" },
  { year: "2024", name: "Nvidia", text: "AI tadqiqot markazi va milliy chip strategiyasi" },
];

export const fdiChain = [
  { title: "Yosh ishchi kuchi", figure: "~53 mln", note: "kishi mehnat bozorida" },
  { title: "Kapital keladi", figure: "27,6 mlrd $", note: "amalda kiritilgan FDI (2025)" },
  { title: "Zavodlar eksport qiladi", figure: "475 mlrd $", note: "eksport (2025)" },
  { title: "Valyuta kiradi", figure: "+20 mlrd $", note: "savdo profitsiti (2025)" },
  { title: "Daromad o‘sadi", figure: "5 026 $", note: "aholi jon boshiga YaIM (2025)" },
];

export const fdiGives = [
  {
    title: "Texnologiya va ko‘nikma",
    text: "Xorijiy zavodlarda ishlagan muhandis va menejerlar keyin o‘z bizneslarini quradi — bilim mamlakat ichida qoladi.",
  },
  {
    title: "Global zanjirga kirish",
    text: "Vyetnam firmalari Samsung, Nike kabi gigantlarning ta’minotchisiga aylanib, jahon bozoriga chiqadi.",
  },
  {
    title: "Barqaror valyuta",
    text: "Doimiy savdo profitsiti dongni barqaror ushlab turadi va valyuta zaxiralarini to‘ldiradi.",
  },
  {
    title: "Lekin: qo‘shilgan qiymat past",
    text: "Murakkab detal va chiplar import qilinadi, mahalliy ulush kichik. Asosiy vazifa — yig‘ishdan ishlab chiqarishga o‘tish.",
  },
];

/* ── Muammolar ── */
export const aging = [
  { year: 2000, value: 6.0 },
  { year: 2010, value: 6.5 },
  { year: 2024, value: 9.0 },
  { year: 2035, value: 14, projected: true },
  { year: 2050, value: 21, projected: true },
];

export type BarRow = { country: string; code: string; value: number; focus?: boolean; approx?: boolean };
export const exportMarkets: BarRow[] = [
  { country: "AQSh", code: "us", value: 153, focus: true },
  { country: "Xitoy", code: "cn", value: 70, approx: true },
  { country: "Yevropa Ittifoqi", code: "european_union", value: 58, approx: true },
  { country: "Janubiy Koreya", code: "kr", value: 29, approx: true },
  { country: "Yaponiya", code: "jp", value: 28, approx: true },
];

export const risks = [
  {
    figure: "~50%",
    title: "Mekong deltasi xavf ostida",
    text: "Mamlakat guruchining qariyb yarmi shu yerda yetishtiriladi. Dengiz sathi ko‘tarilishi, sho‘rlanish va yer cho‘kishi hosilga tahdid solmoqda.",
  },
  {
    figure: "12,5 mlrd $",
    title: "Bank tizimi va korrupsiya",
    text: "Van Thinh Phat ishi (2024) — mamlakat tarixidagi eng yirik moliyaviy firibgarlik. «Yonayotgan pech» korrupsiyaga qarshi kampaniyasi davom etmoqda.",
  },
];

/* ── Kelajak ── */
export const future = [
  {
    tag: "Chiplar",
    title: "Chiplar va sun’iy intellekt",
    text: "57-qaror (2024): fan, innovatsiya va raqamlashtirish — «milliy yutuq». 2030-yilgacha 50 000 chip muhandisi.",
  },
  {
    tag: "Temir yo‘l",
    title: "Tezyurar temir yo‘l",
    text: "Hanoy–Xoshimin: 1 541 km, ~67 mlrd $ — mamlakat tarixidagi eng yirik loyiha, yakunlash rejasi — 2035.",
  },
  {
    tag: "Islohot",
    title: "Davlat apparati islohoti",
    text: "2025: 63 viloyat 34 taga birlashtirildi, tuman bosqichi bekor qilindi — byurokratiya qisqardi.",
  },
  {
    tag: "Energiya",
    title: "Yashil energiya: 2050-yilga sof nol",
    text: "Iqlim majburiyati va JETP doirasida 15,5 mlrd $ moliyalashtirish va’dasi — quyosh, shamol, LNG.",
  },
  {
    tag: "2045",
    title: "2045: yuqori daromadli davlat",
    text: "Maqsad — 2030-yilga yuqori-o‘rta, 2045-yilga yuqori daromad. 2026-yil uchun reja: 10% dan ortiq o‘sish.",
  },
];

/* ── Taqqoslash ── */
export type CompareRow = {
  label: string;
  unit: string;
  vn: number;
  uz: number;
  digits?: number;
  approx?: boolean;
  note?: string;
};
export const compare: CompareRow[] = [
  { label: "Aholi", unit: "mln", vn: 102.3, uz: 38.2, digits: 1 },
  { label: "YaIM (nominal)", unit: "mlrd $", vn: 514, uz: 145, digits: 0, approx: true },
  { label: "Aholi jon boshiga YaIM", unit: "$", vn: 5026, uz: 3800, digits: 0, approx: true },
  { label: "Real o‘sish, 2025", unit: "%", vn: 8.02, uz: 7.7, digits: 1 },
  { label: "Eksport", unit: "mlrd $", vn: 475, uz: 33.8, digits: 1 },
  { label: "Eksport / YaIM", unit: "%", vn: 92, uz: 23, digits: 0, approx: true },
  { label: "Inflyatsiya, 2025", unit: "%", vn: 3.3, uz: 7.3, digits: 1 },
  { label: "Pul o‘tkazmalari / YaIM", unit: "%", vn: 3, uz: 13, digits: 0, approx: true },
  { label: "Maydon", unit: "ming km²", vn: 331, uz: 449, digits: 0 },
];

export const similar = [
  "Ikkalasi ham sotsialistik rejali iqtisodiyotdan bozorga o‘tmoqda.",
  "Aholi yosh va o‘sib bormoqda — ishchi kuchi asosiy boylik.",
  "Qishloq xo‘jaligi ildizi: guruch va kofe — paxta, meva-sabzavot.",
  "Davlatning roli kuchli: islohotlar yuqoridan rejalashtiriladi.",
];
export const different = [
  "Boshlanish: Vyetnam 1986-yilda, O‘zbekiston faol islohotlarni 2017-yilda boshladi — 31 yil farq.",
  "Geografiya: 3 260 km dengiz qirg‘og‘i — ikki karra quruqlik bilan o‘ralgan mamlakat.",
  "Eksport: Vyetnam — sanoat mollari; O‘zbekistonda oltin, gaz, mis va xomashyo ulushi katta.",
  "Daromad: O‘zbekistonga migrantlar pul o‘tkazmalari 18,9 mlrd $ (2025) — YaIMning ~13% i.",
];

export const lessons = [
  {
    title: "Avval — qishloq",
    text: "Vyetnam islohotni yerdan boshladi: dehqonga erkinlik berilgach, ikki yilda guruch eksportchisiga aylandi. Yer huquqlari va fermer tashabbusi — tez natija.",
  },
  {
    title: "Eksport uchun investitsiya",
    text: "Investorni faqat ichki bozor uchun emas, eksport uchun jalb qilish: sanoat zonalari, tez ruxsatnomalar, o‘zgarmas qoidalar.",
  },
  {
    title: "Savdo bitimlari — yo‘lak",
    text: "17 ta FTA Vyetnamga bozorlarni ochdi. O‘zbekiston uchun JST a’zoligi va transport yo‘laklari dengiz o‘rnini bosuvchi kalitdir.",
  },
  {
    title: "Diversifikatsiya",
    text: "Vyetnam xatolari ham saboq: bitta bozorga qaramlik va bank firibgarliklari. Bozor va tarmoqlarni ko‘paytirish, shaffof moliya.",
  },
];

/* ── Xulosa ── */
export const conclusions = [
  "Resurs emas, islohot: Đổi Mới qashshoq agrar mamlakatni 40 yilda dunyoning 18-yirik eksportchisiga aylantirdi.",
  "Ochiqlik — dvigatel, lekin xavf ham: FDI va eksport o‘sishni tezlashtirdi, ammo AQSh bozori va xorijiy kapitalga bog‘liqlik oshdi.",
  "O‘zbekiston uchun: yosh aholi va islohotlar — o‘xshash boshlang‘ich. Vyetnam tajribasi eksportga yo‘naltirilgan sanoat bu imkoniyatni boylikka aylantirishini ko‘rsatadi.",
];

export const sources = [
  "Vyetnam Milliy statistika idorasi (NSO/GSO) — 2025-yil yakunlari, 2026-yil 1-yarmi",
  "Vyetnam bojxonasi; Sanoat va savdo vazirligi — tashqi savdo, 2025",
  "Vyetnam Turizm milliy boshqarmasi (VNAT), 2025",
  "XVF (IMF) — World Economic Outlook, 2025",
  "Jahon banki — World Development Indicators; «Vietnam 2045»",
  "NSO–UNFPA — Vyetnam aholisi prognozi (2025); BMT WPP 2024",
  "O‘zbekiston Milliy statistika qo‘mitasi, 2025–2026",
  "O‘zbekiston Markaziy banki — inflyatsiya va pul o‘tkazmalari, 2025",
  "Vyetnam Kommunistik partiyasining 57- va 68-son qarorlari (2024–2025)",
  "Ha Long ko‘rfazi surati — Vyacheslav Argenberg, Wikimedia Commons (CC BY 4.0); bayroqlar — circle-flags (MIT)",
];
