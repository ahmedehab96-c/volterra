import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { galleryImages } from '../data/content'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SmartImage } from '../components/ui/SmartImage'

const spanClass = {
  wide: 'md:col-span-2',
  tall: 'md:row-span-2',
} as const

export function Gallery() {
  const [active, setActive] = useState<number | null>(null)
  const [direction, setDirection] = useState(0)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setActive(null)
    lastTrigger.current?.focus()
  }, [])

  const step = useCallback((dir: number) => {
    setDirection(dir)
    setActive((i) => (i === null ? i : (i + dir + galleryImages.length) % galleryImages.length))
  }, [])

  useEffect(() => {
    if (active === null) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active, close, step])

  return (
    <section id="gallery" className="relative bg-carbon py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Gallery" title="Seen in its element" />
          <Reveal delay={0.2}>
            <p className="max-w-xs text-sm leading-relaxed text-steel">
              From alpine passes to midnight garages. Select any frame to view it full screen.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid auto-rows-[15rem] grid-cols-1 gap-3 sm:grid-cols-2 md:mt-24 md:auto-rows-[17rem] md:grid-cols-4 md:gap-4">
          {galleryImages.map((img, i) => (
            <motion.li
              key={img.src}
              className={img.span ? spanClass[img.span] : undefined}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.9, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget
                  setDirection(0)
                  setActive(i)
                }}
                className="group relative block size-full overflow-hidden rounded-xl bg-graphite text-left"
                aria-label={`View ${img.caption} full screen`}
              >
                <SmartImage
                  src={img.src}
                  alt={img.alt}
                  className="size-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.06]"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                  <span className="translate-y-1 text-sm text-chrome transition-transform duration-500 ease-luxe group-hover:translate-y-0">
                    {img.caption}
                  </span>
                  <Expand className="size-4 text-chrome opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={galleryImages[active].caption}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
          >
            <div className="flex h-16 items-center justify-between px-5 md:h-20 md:px-10" onClick={(e) => e.stopPropagation()}>
              <p className="text-xs tracking-[0.2em] text-steel uppercase tabular-nums">
                {String(active + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="grid size-10 place-items-center rounded-full border border-white/15 text-chrome transition-colors hover:border-white/50"
                aria-label="Close gallery"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 md:px-24">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.figure
                  key={active}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 80, scale: d ? 1 : 0.96 }),
                    center: { opacity: 1, x: 0, scale: 1 },
                    exit: (d: number) => ({ opacity: 0, x: d * -80 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex max-h-full flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SmartImage
                    src={galleryImages[active].src}
                    alt={galleryImages[active].alt}
                    priority
                    className="max-h-[72svh] w-auto max-w-full rounded-xl object-contain"
                  />
                  <figcaption className="mt-5 text-sm text-silver">{galleryImages[active].caption}</figcaption>
                </motion.figure>
              </AnimatePresence>

              {[-1, 1].map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(dir)
                  }}
                  className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink/60 text-chrome transition-colors hover:border-white/50 ${
                    dir < 0 ? 'left-3 md:left-8' : 'right-3 md:right-8'
                  }`}
                  aria-label={dir < 0 ? 'Previous image' : 'Next image'}
                >
                  {dir < 0 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
                </button>
              ))}
            </div>
            <div className="h-16 md:h-20" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
