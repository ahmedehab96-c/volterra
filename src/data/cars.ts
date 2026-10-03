/**
 * The VOLTERRA range: one local source for every car (names, copy, specs, imagery, 3D, colours),
 * with English and Arabic values side by side. Existing assets only.
 */

export type Text = { en: string; ar: string }

export type Car = {
  id: string
  /** URL segment: /models/{slug} */
  slug: string
  name: string
  tagline: Text
  description: Text
  heroImage: string
  alt: Text
  /** .glb/.gltf path when a 3D model exists; otherwise /models/{slug}.glb or /models/car.glb are tried, then the photo is shown */
  model3d: string | null
  /** Paint ids from carColors offered for this car (white photography cannot be recoloured) */
  colors: string[]
  /** Hue of the photographed paint, for the paint preview; omitted for neutral paint */
  baseHue?: number
  price: number
  specs: { horsepower: number; torque: number; topSpeed: number; acceleration: number }
  /** One engineering line per figure */
  notes: { horsepower: Text; torque: Text; topSpeed: Text; acceleration: Text }
  /** Fourth spec (range or drivetrain) */
  extra: { label: Text; value: Text }
  highlights: Text[]
}

const ALL_PAINTS = ['signature', 'rosso', 'arancio', 'giallo', 'verde', 'blu', 'viola']

export const cars: Car[] = [
  {
    id: 'x',
    slug: 'volterra-x',
    name: 'X',
    tagline: { en: 'The electric flagship', ar: 'الرائدة الكهربائية' },
    description: {
      en: 'Four motors, instant torque, and not a single drop of fuel. X is the quickest VOLTERRA we have ever built.',
      ar: 'أربعة محركات، وعزم فوري، ولا قطرة وقود واحدة. X هي أسرع VOLTERRA صنعناها على الإطلاق.',
    },
    heroImage: '/assets/images/models/volterra-x.webp',
    alt: { en: 'Red and black hypercar with a horseshoe grille in a white studio', ar: 'سيارة خارقة باللونين الأحمر والأسود بشبكة أمامية على شكل حدوة حصان في استوديو أبيض' },
    model3d: null,
    colors: ALL_PAINTS,
    baseHue: 355,
    price: 412000,
    specs: { horsepower: 1020, torque: 1400, topSpeed: 310, acceleration: 2.1 },
    notes: {
      horsepower: { en: 'Four motors, one per wheel', ar: 'أربعة محركات، واحد لكل عجلة' },
      torque: { en: 'Available from standstill', ar: 'متاح من الثبات التام' },
      topSpeed: { en: 'Electronically limited', ar: 'محدودة إلكترونيًا' },
      acceleration: { en: 'Quad-motor launch control', ar: 'انطلاق بأربعة محركات' },
    },
    extra: { label: { en: 'Range', ar: 'المدى' }, value: { en: '540 km', ar: '540 كم' } },
    highlights: [
      { en: 'Quad-motor torque vectoring', ar: 'توزيع العزم بأربعة محركات' },
      { en: '350 kW charging — 10–80% in 18 min', ar: 'شحن 350 كيلوواط — من 10 إلى 80% في 18 دقيقة' },
      { en: 'Synthesised acoustic signature', ar: 'بصمة صوتية مُركّبة' },
    ],
  },
  {
    id: 'gt',
    slug: 'volterra-gt',
    name: 'GT',
    tagline: { en: 'The continent crosser', ar: 'عابرة القارات' },
    description: {
      en: 'Our grand tourer pairs the full 620 HP with adaptive air suspension and a cabin made for a thousand kilometres in a single sitting.',
      ar: 'سيارتنا للرحلات الفاخرة تجمع قوة 620 حصانًا مع تعليق هوائي تكيّفي ومقصورة صُمّمت لألف كيلومتر في جلسة واحدة.',
    },
    heroImage: '/assets/images/models/volterra-gt.webp',
    alt: { en: 'Orange grand-touring coupé with a carbon rear wing in a grey studio', ar: 'كوبيه برتقالية للرحلات الفاخرة بجناح خلفي من الكربون في استوديو رمادي' },
    model3d: null,
    colors: ALL_PAINTS,
    baseHue: 24,
    price: 289000,
    specs: { horsepower: 620, torque: 850, topSpeed: 320, acceleration: 3.2 },
    notes: {
      horsepower: { en: 'Twin-turbo 4.0L V8, electric boost', ar: 'V8 سعة 4.0 لتر مزدوج التيربو مع دفع كهربائي' },
      torque: { en: 'From 2,200 to 6,000 rpm', ar: 'من 2,200 إلى 6,000 دورة/دقيقة' },
      topSpeed: { en: 'Governed at the limit', ar: 'محدودة عند الحد الأقصى' },
      acceleration: { en: 'Launch control, torque vectoring', ar: 'نظام انطلاق وتوزيع ذكي للعزم' },
    },
    extra: { label: { en: 'Drivetrain', ar: 'نظام الدفع' }, value: { en: 'AWD', ar: 'دفع رباعي' } },
    highlights: [
      { en: 'Adaptive air suspension', ar: 'تعليق هوائي تكيّفي' },
      { en: 'Four-zone climate', ar: 'تكييف بأربع مناطق' },
      { en: '18-speaker reference audio', ar: 'نظام صوتي مرجعي بـ 18 مكبّرًا' },
    ],
  },
  {
    id: 's',
    slug: 'volterra-s',
    name: 'S',
    tagline: { en: 'Built for the circuit', ar: 'صُنعت للحلبة' },
    description: {
      en: 'Two hundred kilograms lighter, with a fixed carbon aero package and a track-tuned chassis. Road legal, barely.',
      ar: 'أخف بمئتي كيلوغرام، مع حزمة هوائية كربونية ثابتة وهيكل مضبوط للحلبة. قانونية على الطرق، بالكاد.',
    },
    heroImage: '/assets/images/models/volterra-s.webp',
    alt: { en: 'White and black hypercar in a grey studio', ar: 'سيارة خارقة باللونين الأبيض والأسود في استوديو رمادي' },
    model3d: null,
    colors: ['signature'],
    price: 364000,
    specs: { horsepower: 710, torque: 800, topSpeed: 330, acceleration: 2.8 },
    notes: {
      horsepower: { en: 'Twin-turbo V8, track calibration', ar: 'V8 مزدوج التيربو بمعايرة الحلبة' },
      torque: { en: 'From 3,000 to 6,500 rpm', ar: 'من 3,000 إلى 6,500 دورة/دقيقة' },
      topSpeed: { en: 'With the fixed rear wing', ar: 'مع الجناح الخلفي الثابت' },
      acceleration: { en: 'Launch control, track tyres', ar: 'نظام انطلاق وإطارات حلبة' },
    },
    extra: { label: { en: 'Drivetrain', ar: 'نظام الدفع' }, value: { en: 'RWD', ar: 'دفع خلفي' } },
    highlights: [
      { en: 'Carbon ceramic brakes', ar: 'مكابح سيراميك كربونية' },
      { en: 'Fixed rear wing — 410 kg downforce', ar: 'جناح خلفي ثابت — قوة ضغط 410 كغ' },
      { en: 'FIA-spec roll structure', ar: 'هيكل حماية وفق مواصفات FIA' },
    ],
  },
]

/** English → Arabic pairs for every car text, merged into the UI dictionary */
export const carTranslations: Record<string, string> = Object.fromEntries(
  cars.flatMap((c) => [c.tagline, c.description, c.alt, ...Object.values(c.notes), c.extra.label, c.extra.value, ...c.highlights].map((t) => [t.en, t.ar])),
)
