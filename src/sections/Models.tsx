import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { formatPrice, models, modelSpecs } from '../data/content'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SmartImage } from '../components/ui/SmartImage'

const ease = [0.22, 1, 0.36, 1] as const

export function Models() {
  const [index, setIndex] = useState(0)
  const model = models[index]

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    const next = (index + dir + models.length) % models.length
    setIndex(next)
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }

  return (
    <section id="models" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow="The range"
          title="Three answers to one question"
          intro="How fast do you want to go — and how do you want to get there?"
        />

        {/* Model tabs */}
        <Reveal delay={0.1} className="mt-14 md:mt-20">
          <div role="tablist" aria-label="VOLTERRA models" className="grid grid-cols-3 border-b border-line" onKeyDown={onTabKey}>
            {models.map((m, i) => {
              const selected = i === index
              return (
                <button
                  key={m.id}
                  role="tab"
                  id={`tab-${m.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${m.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className="group relative pb-5 text-left"
                >
                  <span className="block text-[0.625rem] tracking-[0.2em] text-steel uppercase md:text-[0.6875rem]">0{i + 1} — Volterra</span>
                  <span
                    className={`mt-2 block font-wide text-xl font-semibold uppercase transition-colors duration-300 md:text-3xl ${
                      selected ? 'text-chrome' : 'text-steel/60 group-hover:text-silver'
                    }`}
                  >
                    {m.name}
                  </span>
                  <span className="mt-1 hidden text-sm text-steel md:block">{m.tagline}</span>
                  {selected && (
                    <motion.span layoutId="model-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" transition={{ duration: 0.6, ease }} />
                  )}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Active model: photos crossfade in place, details swap beside them */}
        <div
          role="tabpanel"
          id={`panel-${model.id}`}
          aria-labelledby={`tab-${model.id}`}
          className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-14"
        >
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-graphite md:aspect-[16/10] lg:col-span-7">
            <AnimatePresence initial={false}>
              <motion.div
                key={model.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.9, ease: 'easeInOut' }, scale: { duration: 1.6, ease } }}
              >
                <SmartImage
                  src={model.image}
                  alt={model.alt}
                  className="size-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence initial={false}>
              <motion.span
                key={model.id}
                className="pointer-events-none absolute -bottom-6 left-4 font-wide text-[clamp(5rem,14vw,11rem)] leading-none font-bold text-white/10 select-none"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.8, ease }}
                aria-hidden
              >
                {model.name}
              </motion.span>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={model.id}
              className="flex flex-col lg:col-span-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                VOLTERRA {model.name} — {model.tagline}
              </motion.p>
              <motion.p
                className="mt-5 text-lg leading-relaxed text-silver"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08, ease }}
              >
                {model.description}
              </motion.p>

              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
                {modelSpecs(model).map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    className="bg-carbon p-5"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.12 + i * 0.06, ease }}
                  >
                    <dt className="text-[0.6875rem] tracking-[0.18em] text-steel uppercase">{spec.label}</dt>
                    <dd className="mt-2 font-wide text-xl font-semibold text-chrome">{spec.value}</dd>
                  </motion.div>
                ))}
              </dl>

              <ul className="mt-8 space-y-3">
                {model.highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    className="flex items-center gap-3 text-sm text-silver"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease }}
                  >
                    <ArrowRight className="size-3.5 shrink-0 text-accent" aria-hidden />
                    {h}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-8 lg:mt-auto">
                <p>
                  <span className="block text-xs tracking-[0.18em] text-steel uppercase">From</span>
                  <span className="font-wide text-2xl font-semibold text-chrome">{formatPrice(model.price)}</span>
                </p>
                <Button href={`/models/${model.slug}`} variant="ghost">
                  Explore
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
