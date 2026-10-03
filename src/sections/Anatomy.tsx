import { useT } from '../i18n'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { vehicleHotspots } from '../data/content'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SmartImage } from '../components/ui/SmartImage'
import { HotspotLegend, PanelBody } from './Interior'

type HotspotId = (typeof vehicleHotspots)[number]['id']
const ease = [0.22, 1, 0.36, 1] as const

export function Anatomy() {
  const t = useT()
  const [active, setActive] = useState<HotspotId | null>(null)
  const spot = vehicleHotspots.find((h) => h.id === active)
  const toggle = (id: HotspotId) => setActive((cur) => (cur === id ? null : id))

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <section id="anatomy" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading eyebrow={t('Anatomy')} title={t('Engineered where it matters')} intro={t('Select a point to look closer.')} />

        <Reveal className="mt-16 md:mt-24">
          {/* Keeps the photo's 16:9 ratio so hotspots stay anchored at every width */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-graphite">
            <SmartImage src="/assets/images/exterior/coupe-alpine-snow.webp" alt="Silver sports coupé parked in front of snow-covered mountains" className="size-full object-cover" sizes="100vw" />

            {/* Spotlight: dims everything but the selected area */}
            <AnimatePresence>
              {spot && (
                <motion.div
                  key={spot.id}
                  className="pointer-events-none absolute inset-0"
                  style={{ background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, transparent 0 6%, rgba(10,10,11,0.72) 22%)` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease }}
                  aria-hidden
                />
              )}
            </AnimatePresence>

            {vehicleHotspots.map((h) => {
              const on = h.id === active
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggle(h.id)}
                  aria-expanded={on}
                  aria-controls="anatomy-panel"
                  aria-label={`${h.index} ${t(h.title)}`}
                  className="group absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center md:size-11"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  {on ? (
                    <motion.span
                      className="absolute -inset-3 rounded-full border border-accent/60 md:-inset-5"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease }}
                      aria-hidden
                    />
                  ) : (
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/25 [animation-duration:2.4s]" aria-hidden />
                  )}
                  <span
                    className={`relative grid size-full place-items-center rounded-full border text-[0.625rem] font-semibold tracking-wider backdrop-blur-md transition-all duration-500 ease-luxe md:text-[0.6875rem] ${
                      on ? 'scale-110 border-accent bg-accent text-white' : 'border-white/50 bg-ink/50 text-chrome group-hover:scale-110 group-hover:border-white'
                    }`}
                  >
                    {h.index}
                  </span>
                </button>
              )
            })}

            {/* Compact card beside the hotspot on larger screens */}
            <AnimatePresence>
              {spot && (
                <motion.div
                  key={spot.id}
                  id="anatomy-panel"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.45, ease }}
                  className="absolute hidden w-72 rounded-xl border border-white/10 bg-ink/80 p-6 backdrop-blur-xl md:block"
                  style={{
                    ...(spot.x > 50 ? { right: `${100 - spot.x + 5}%` } : { left: `${spot.x + 5}%` }),
                    ...(spot.y > 55 ? { bottom: `${100 - spot.y}%` } : { top: `${spot.y}%` }),
                  }}
                >
                  <PanelBody spot={spot} onClose={() => setActive(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <HotspotLegend spots={vehicleHotspots} active={active} onToggle={(id) => toggle(id as HotspotId)} onClose={() => setActive(null)} />
      </div>
    </section>
  )
}
