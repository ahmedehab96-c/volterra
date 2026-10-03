import { cars } from './cars'
export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Models', href: '/models' },
  { label: 'Design', href: '/#design' },
  { label: 'Performance', href: '/#performance' },
  { label: 'Configure', href: '/configure' },
] as const

/** Footer navigation: the main sections, without Home */
export const footerLinks = navLinks.filter((l) => l.href !== '/')

export type Stat = {
  value: number
  decimals?: number
  unit: string
  label: string
  detail: string
  /** 0–1, how full the gauge bar is drawn */
  gauge: number
}


export const secondarySpecs = [
  { label: '0–200 km/h', value: '9.8 s' },
  { label: 'Dry weight', value: '1,480 kg' },
  { label: 'Power-to-weight', value: '419 hp/t' },
  { label: 'Downforce @ 250', value: '410 kg' },
]

export type DesignFeature = {
  eyebrow: string
  title: string
  body: string
  image: string
  alt: string
}

export const designFeatures: DesignFeature[] = [
  {
    eyebrow: '01 — Silhouette',
    title: 'One unbroken line',
    body: 'Long bonnet, cab set back, haunches that rise over the rear axle. The proportions of a front-engined thoroughbred, refined over 1,400 hours in the wind tunnel.',
    image: '/assets/images/exterior/coupe-alpine-snow.webp',
    alt: 'Silver sports coupé parked in front of snow-covered mountains',
  },
  {
    eyebrow: '02 — Light',
    title: 'A gaze you remember',
    body: 'Matrix LED blades set deep in the fender, sharp enough to read the road and the onlooker.',
    image: '/assets/images/details/headlight-led.webp',
    alt: 'Close-up of a sharp LED headlight on a white supercar',
  },
  {
    eyebrow: '03 — Stance',
    title: 'Planted at every corner',
    body: 'Forged wheels pushed to the very edge of the body, with carbon ceramics behind.',
    image: '/assets/images/details/wheel-arch.webp',
    alt: 'Close-up of a dark luxury car wheel and wheel arch in low light',
  },
  {
    eyebrow: '04 — Surface',
    title: 'Tension in the metal',
    body: 'Every crease is functional, every surface hand-finished. Paint is laid over seven coats and three days.',
    image: '/assets/images/details/bonnet-stripe.webp',
    alt: 'Low-angle front view of a dark grey sports car bonnet with a single stripe',
  },
]

export type Finish = { color: string; metalness: number; roughness: number }

export type CarColor = {
  id: string
  name: string
  finish: string
  swatch: string
  price: number
  /** Target paint hue in degrees; null keeps the paint exactly as photographed */
  hue: number | null
}

/** Paints are previewed by rotating the photo's hue, which moves only saturated paint (grey studio, tyres and glass stay put). */
export const carColors: CarColor[] = [
  { id: 'signature', name: 'Signature', finish: 'Factory paint, as photographed', swatch: 'linear-gradient(135deg, #f2f3f5 0%, #9ea2a8 50%, #2a2b2f 100%)', price: 0, hue: null },
  { id: 'rosso', name: 'Rosso Corsa', finish: 'Deep candy metallic', swatch: 'linear-gradient(135deg, #ff4a4f 0%, #b3141a 55%, #6d0b0f 100%)', price: 6800, hue: 355 },
  { id: 'arancio', name: 'Arancio Borealis', finish: 'Pearlescent tri-coat', swatch: 'linear-gradient(135deg, #ffb066 0%, #e8731a 55%, #8a3d06 100%)', price: 4200, hue: 24 },
  { id: 'giallo', name: 'Giallo Modena', finish: 'Solid gloss', swatch: 'linear-gradient(135deg, #ffe27a 0%, #e9b51c 55%, #8a6206 100%)', price: 4200, hue: 48 },
  { id: 'verde', name: 'Verde Mantis', finish: 'Metallic', swatch: 'linear-gradient(135deg, #a6e07a 0%, #4f9a24 55%, #234a0c 100%)', price: 5400, hue: 105 },
  { id: 'blu', name: 'Blu Le Mans', finish: 'Liquid metal', swatch: 'linear-gradient(135deg, #7fb0ff 0%, #1f5fbf 55%, #0b2a5e 100%)', price: 5400, hue: 215 },
  { id: 'viola', name: 'Viola Parsifae', finish: 'Chromaflair', swatch: 'linear-gradient(135deg, #c79aff 0%, #7a2bbf 55%, #3a1060 100%)', price: 6800, hue: 280 },
]

/** CSS hue rotation that turns the model's photographed paint into the chosen one (0 when it cannot be recoloured) */
export const paintRotation = (model: Model, color: CarColor) =>
  model.baseHue == null || color.hue == null ? 0 : ((color.hue - model.baseHue + 540) % 360) - 180

export type ConfigOption = { id: string; name: string; detail: string; price: number; finish: Finish; swatch: string }

export const wheelOptions: ConfigOption[] = [
  { id: 'sport', name: 'Sport', detail: '20" split-spoke, brushed silver', price: 0, finish: { color: '#c3c6cc', metalness: 1, roughness: 0.3 }, swatch: '#c3c6cc' },
  { id: 'performance', name: 'Performance', detail: '21" forged, satin graphite', price: 6900, finish: { color: '#45474c', metalness: 1, roughness: 0.42 }, swatch: '#45474c' },
  { id: 'carbon', name: 'Carbon', detail: '21" carbon fibre, gloss', price: 14500, finish: { color: '#141518', metalness: 0.4, roughness: 0.16 }, swatch: '#141518' },
]

export const interiorOptions: ConfigOption[] = [
  { id: 'black', name: 'Black', detail: 'Nero Nappa leather', price: 0, finish: { color: '#141416', metalness: 0, roughness: 0.62 }, swatch: '#1a1a1c' },
  { id: 'tan', name: 'Tan', detail: 'Cognac semi-aniline', price: 2800, finish: { color: '#9a5f36', metalness: 0, roughness: 0.58 }, swatch: '#a8693c' },
  { id: 'red', name: 'Red', detail: 'Rosso Corsa Nappa', price: 3400, finish: { color: '#6e1015', metalness: 0, roughness: 0.58 }, swatch: '#7c1419' },
]

export const technology = [
  {
    id: 'ai-drive',
    title: 'AI Drive',
    body: 'Reads the road 200 metres ahead and pre-loads the chassis for every corner before you turn in.',
    stat: '120 decisions / sec',
  },
  {
    id: 'adaptive-control',
    title: 'Adaptive Control',
    body: 'Active aero, rear-wheel steer and magnetorheological dampers, tuned as one system in real time.',
    stat: '4 ms response',
  },
  {
    id: 'smart-cockpit',
    title: 'Smart Cockpit',
    body: 'A curved 14.9-inch display that shows only what matters, when it matters, and disappears on track.',
    stat: '0.2 s glance time',
  },
] as const

export const interiorHotspots = [
  { id: 'cockpit', index: '01', title: 'Digital Cockpit', body: 'A driver-angled display with augmented navigation and a lap-timing mode that strips away everything else.', x: 76, y: 52 },
  { id: 'seats', index: '02', title: 'Premium Seats', body: 'Carbon-shell sport seats, 18-way adjustable, heated, ventilated and massaging. Fitted to you in Modena.', x: 20, y: 86 },
  { id: 'audio', index: '03', title: 'Immersive Audio', body: '21 speakers and 1,800 W, tuned by ear in the finished cabin. Optional active noise shaping on long drives.', x: 52, y: 27 },
] as const

/** Positions are percentages of the 16:9 design-full photograph */
export const vehicleHotspots = [
  { id: 'headlights', index: '01', title: 'Headlights', body: 'Adaptive matrix LED with 84 segments per side, shaping the beam around oncoming traffic.', x: 51, y: 68 },
  { id: 'aero', index: '02', title: 'Aerodynamics', body: 'A swan-neck rear wing and flat underbody generate 410 kg of downforce at 250 km/h.', x: 25, y: 59 },
  { id: 'wheels', index: '03', title: 'Performance Wheels', body: 'Centre-lock forged alloys, 3.1 kg lighter per corner, wrapped in bespoke Michelin rubber.', x: 40, y: 83 },
] as const

export type GalleryImage = { src: string; alt: string; caption: string; span?: 'wide' | 'tall' }

export const galleryImages: GalleryImage[] = [
  { src: '/assets/images/exterior/sedan-highway-dusk.webp', alt: 'Black four-door sports car accelerating on a highway', caption: 'Coastal Highway, Blue Hour', span: 'wide' },
  { src: '/assets/images/exterior/coupe-harbour-quay.webp', alt: 'Dark sports car parked on a harbour quay with yachts behind', caption: 'Monaco, Off-Season', span: 'tall' },
  { src: '/assets/images/exterior/coupe-country-road-sunset.webp', alt: 'Silver sports car driving away down a winding mountain road', caption: 'Passo dello Stelvio' },
  { src: '/assets/images/exterior/coupe-neon-garage.webp', alt: 'Red performance car lit by blue neon in a dark garage', caption: 'Night Garage' },
  { src: '/assets/images/exterior/coupe-mountain-ridge.webp', alt: 'Grey mid-engine coupé on a mountain road', caption: 'Ridge Line Test' },
  { src: '/assets/images/exterior/supercar-underground.webp', alt: 'Orange supercar parked in an underground car park', caption: 'Underground', span: 'tall' },
  { src: '/assets/images/exterior/coupe-proving-ground.webp', alt: 'Grey coupé with yellow brake calipers on an empty road', caption: 'Proving Ground', span: 'wide' },
  { src: '/assets/images/exterior/supercar-pink-studio.webp', alt: 'Magenta supercar photographed in a white studio', caption: 'Studio Edition' },
]

export type Model = {
  id: string
  /** URL segment: /models/{slug} */
  slug: string
  name: string
  tagline: string
  description: string
  image: string
  alt: string
  price: number
  /** Single source for every figure shown about this car; acceleration is 0–100 km/h in seconds */
  performance: { horsepower: number; torque: number; topSpeed: number; acceleration: number }
  /** One engineering line per figure, shown under the performance bars */
  notes: { horsepower: string; torque: string; topSpeed: string; acceleration: string }
  /** Hue of the photographed paint; omitted for neutral paint (white), which cannot be recoloured */
  baseHue?: number
  /** Paint ids offered for this car */
  colors: string[]
  /** Fourth spec on the model tabs (drivetrain or range) */
  extra: { label: string; value: string }
  highlights: string[]
  /** From the API when available: database id, optional .glb/.gltf and uploaded gallery */
  apiId?: number
  model3d?: string | null
  gallery?: { exterior: string[]; interior: string[]; detail: string[] }
}

/** The range, derived from the bilingual car data in ./cars (English values; Arabic comes through the dictionary) */
export const models: Model[] = cars.map((c) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  tagline: c.tagline.en,
  description: c.description.en,
  image: c.heroImage,
  alt: c.alt.en,
  price: c.price,
  model3d: c.model3d,
  colors: c.colors,
  baseHue: c.baseHue,
  performance: c.specs,
  notes: {
    horsepower: c.notes.horsepower.en,
    torque: c.notes.torque.en,
    topSpeed: c.notes.topSpeed.en,
    acceleration: c.notes.acceleration.en,
  },
  extra: { label: c.extra.label.en, value: c.extra.value.en },
  highlights: c.highlights.map((h) => h.en),
}))

/** Headline figures for the performance bars; gauges are scaled against the top of the range so models compare honestly */
export const modelStats = ({ performance: p, notes: n }: Model): Stat[] => [
  { value: p.horsepower, unit: 'HP', label: 'Power', detail: n.horsepower, gauge: p.horsepower / 1100 },
  { value: p.torque, unit: 'NM', label: 'Torque', detail: n.torque, gauge: p.torque / 1500 },
  { value: p.topSpeed, unit: 'KM/H', label: 'Top speed', detail: n.topSpeed, gauge: p.topSpeed / 350 },
  { value: p.acceleration, decimals: 1, unit: 'SEC', label: '0–100 km/h', detail: n.acceleration, gauge: Math.min(1, 2.6 / p.acceleration) },
]

/** Compact spec list for the model tabs */
export const modelSpecs = ({ performance: p, extra }: Model) => [
  { label: 'Power', value: `${p.horsepower.toLocaleString('en-US')} HP` },
  { label: '0–100 km/h', value: `${p.acceleration.toFixed(1)} s` },
  { label: 'Top speed', value: `${p.topSpeed} km/h` },
  extra,
]

/** The hero car's figures, used by the hero rail and the home performance section */
export const headlineStats = modelStats(models.find((m) => m.id === 'gt')!)

export const formatStat = (s: Stat) => s.value.toLocaleString('en-US', { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 })

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
