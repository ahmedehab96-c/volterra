import { motion } from 'framer-motion'
import { BrainCircuit, Gauge, PanelsTopLeft } from 'lucide-react'
import type { PointerEvent } from 'react'
import { technology } from '../data/content'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

const icons = { 'ai-drive': BrainCircuit, 'adaptive-control': Gauge, 'smart-cockpit': PanelsTopLeft } as const

// Spotlight follows the pointer via CSS variables — no React re-render per move
const trackPointer = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

export function Technology() {
  return (
    <section id="technology" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[140px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading eyebrow="Technology" title="Intelligence you can feel" intro="Three systems, one purpose: more of you in every corner." />

        <div className="mt-16 grid gap-4 md:mt-24 lg:grid-cols-3 lg:gap-5">
          {technology.map((item, i) => {
            const Icon = icons[item.id]
            return (
              <Reveal key={item.id} delay={i * 0.1}>
                <motion.article
                  onPointerMove={trackPointer}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.045] to-white/[0.01] p-7 backdrop-blur-md transition-colors duration-500 hover:border-white/15 md:min-h-[26rem] md:p-9"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(255,255,255,0.07),transparent_60%)]"
                    aria-hidden
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-wide text-xs font-medium tracking-[0.2em] text-steel">0{i + 1}</span>
                    <span className="grid size-11 place-items-center rounded-full border border-white/10 text-silver transition-colors duration-500 group-hover:border-accent/60 group-hover:text-chrome">
                      <Icon className="size-[1.1rem]" strokeWidth={1.4} aria-hidden />
                    </span>
                  </div>

                  <h3 className="mt-auto pt-16 font-wide text-2xl font-semibold tracking-[-0.01em] text-chrome uppercase md:text-[1.75rem]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-steel">{item.body}</p>

                  <div className="mt-8 flex items-center gap-4">
                    <span className="h-px w-8 bg-accent transition-[width] duration-700 ease-luxe group-hover:w-16" aria-hidden />
                    <span className="text-[0.6875rem] tracking-[0.2em] text-silver uppercase">{item.stat}</span>
                  </div>
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
