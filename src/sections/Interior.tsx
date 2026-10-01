import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { interiorHotspots } from '../data/content'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SmartImage } from '../components/ui/SmartImage'

type HotspotId = (typeof interiorHotspots)[number]['id']
const ease = [0.22, 1, 0.36, 1] as const

export function Interior() {
  const [active, setActive] = useState<HotspotId | null>(null)
  const spot = interiorHotspots.find((h) => h.id === active)
  const toggle = (id: HotspotId) => setActive((cur) => (cur === id ? null : id))

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <section id="interior" className="relative bg-carbon py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading eyebrow="Interior" title="A cockpit, not a cabin" intro="Select a point to look closer." />

        <Reveal className="mt-16 md:mt-24">
          {/* Frame keeps the photo's own 16:9 ratio so hotspots stay anchored at every width */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-graphite">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.12 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease }}
            >
              <SmartImage src="/assets/images/interior/cockpit-wide.webp" alt="Driver cockpit with leather steering wheel and a large portrait touchscreen" className="size-full object-cover" sizes="100vw" />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20" aria-hidden />

            {interiorHotspots.map((h) => {
              const on = h.id === active
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggle(h.id)}
                  aria-expanded={on}
                  aria-controls="interior-panel"
                  aria-label={`${h.index} ${h.title}`}
                  className="group absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center md:size-11"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  {!on && <span className="absolute inset-0 animate-ping rounded-full bg-white/25 [animation-duration:2.4s]" aria-hidden />}
                  <span
                    className={`relative grid size-full place-items-center rounded-full border text-[0.625rem] font-semibold tracking-wider backdrop-blur-md transition-all duration-500 ease-luxe md:text-[0.6875rem] ${
                      on ? 'scale-110 border-accent bg-accent text-white' : 'border-white/40 bg-ink/40 text-chrome group-hover:scale-110 group-hover:border-white'
                    }`}
                  >
                    {h.index}
                  </span>
                </button>
              )
            })}

            {/* Floating panel on larger screens */}
            <AnimatePresence>
              {spot && (
                <motion.div
                  key={spot.id}
                  id="interior-panel"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.45, ease }}
                  className="absolute hidden w-72 rounded-xl border border-white/10 bg-ink/75 p-6 backdrop-blur-xl md:block"
                  style={{
                    ...(spot.x > 50 ? { right: `${100 - spot.x + 4}%` } : { left: `${spot.x + 4}%` }),
                    ...(spot.y > 55 ? { bottom: `${100 - spot.y}%` } : { top: `${spot.y}%` }),
                  }}
                >
                  <PanelBody spot={spot} onClose={() => setActive(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <HotspotLegend spots={interiorHotspots} active={active} onToggle={(id) => toggle(id as HotspotId)} onClose={() => setActive(null)} />
      </div>
    </section>
  )
}

/** Hotspot card content, shared with the exterior Anatomy section */
export function PanelBody({ spot, onClose }: { spot: { index: string; title: string; body: string }; onClose: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.625rem] tracking-[0.22em] text-accent">{spot.index}</p>
          <h3 className="mt-2 font-wide text-base font-semibold tracking-[0.04em] text-chrome uppercase">{spot.title}</h3>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="-mt-1 -mr-1 grid size-8 place-items-center rounded-full text-steel transition-colors hover:text-chrome">
          <X className="size-4" />
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-steel">{spot.body}</p>
    </>
  )
}

type LegendSpot = { id: string; index: string; title: string; body: string }

/** Numbered hotspot index (the primary control on touch screens, a legend on desktop) plus the inline card on phones. */
export function HotspotLegend({ spots, active, onToggle, onClose }: { spots: readonly LegendSpot[]; active: string | null; onToggle: (id: string) => void; onClose: () => void }) {
  const spot = spots.find((h) => h.id === active)
  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-2 md:mt-8 md:gap-4">
        {spots.map((h) => {
          const on = h.id === active
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => onToggle(h.id)}
              aria-expanded={on}
              className={`min-h-12 border-t pt-4 text-left transition-colors duration-300 ${on ? 'border-accent text-chrome' : 'border-line text-steel hover:text-silver'}`}
            >
              <span className="block text-[0.625rem] tracking-[0.2em]">{h.index}</span>
              <span className="mt-1 block font-wide text-[0.6875rem] font-semibold tracking-[0.06em] uppercase sm:text-sm">{h.title}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {spot && (
          <motion.div
            key={spot.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden md:hidden"
          >
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <PanelBody spot={spot} onClose={onClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
