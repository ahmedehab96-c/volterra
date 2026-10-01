import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import { headlineStats, models } from '../data/content'

const heroModel = models.find((m) => m.id === 'gt')!
import { Button } from '../components/ui/Button'
import { StudioShot } from '../components/ui/StudioShot'
import { useIntroDone } from '../state/intro'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%'])
  const fade = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0, 0])
  // Entrances wait for the preloader so they are actually seen
  const intro = useIntroDone()
  const enter = <T,>(to: T) => (intro ? to : undefined)

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink" aria-label="Introduction">
      {/* Soft studio light behind the car, breathing slowly */}
      <div
        className="pointer-events-none absolute top-[8%] left-1/2 h-[70%] w-[110%] -translate-x-1/2 animate-glow bg-[radial-gradient(closest-side,rgba(236,238,241,0.06),transparent)] md:left-[66%] md:w-[70%]"
        aria-hidden
      />

      {/* The hero car on its spotlight */}
      <StudioShot
        src={heroModel.image}
        alt={heroModel.alt}
        priority
        className="absolute inset-x-5 top-[72px] h-[30svh] md:inset-x-auto md:top-[11%] md:right-[3%] md:h-[76%] md:w-[44%]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent md:h-1/3" aria-hidden />

      {/* Light sweep and grain over the stage, never blocking drags */}
      <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden mix-blend-soft-light" aria-hidden>
        <div className="absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      <div className="grain pointer-events-none absolute inset-0 z-[6] opacity-[0.07] mix-blend-overlay" aria-hidden />

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-28 md:justify-center md:px-10 md:pb-0"
      >
        <motion.p
          className="eyebrow mb-6 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={enter({ opacity: 1, x: 0 })}
          transition={{ duration: 1, delay: 0.1, ease }}
        >
          <span className="h-px w-10 bg-accent" aria-hidden />
          The new VOLTERRA GT
        </motion.p>

        {/* Each line rises out of its own mask */}
        <h1 aria-label="Drive the impossible" className="font-wide text-[clamp(2.5rem,4.6vw,5.5rem)] leading-[0.92] font-bold tracking-[-0.03em] text-chrome">
          {['DRIVE', 'THE IMPOSSIBLE'].map((line, i) => (
            <span key={line} aria-hidden className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={enter({ y: '0%' })}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.14, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-8 max-w-md text-base leading-relaxed text-silver md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={enter({ opacity: 1, y: 0 })}
          transition={{ duration: 1, delay: 0.75, ease }}
        >
          Precision engineered for those who refuse ordinary.
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={enter({ opacity: 1, y: 0 })}
          transition={{ duration: 1, delay: 0.9, ease }}
        >
          <Button href="#design">
            Explore vehicle
          </Button>
          <Button href="/configure" variant="ghost" icon={false}>
            Configure
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom rail: quick specs + scroll cue */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={enter({ opacity: 1 })}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <dl className="flex gap-8 md:gap-14">
            {headlineStats.slice(0, 3).map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">{s.label}</dt>
                <dd className="font-wide text-sm font-semibold text-chrome md:text-base">
                  {s.value}
                  <span className="ml-1 text-steel">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          <a href="#performance" className="hidden items-center gap-3 text-xs tracking-[0.2em] text-steel uppercase hover:text-chrome sm:flex">
            Scroll
            <motion.span
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="size-4" aria-hidden />
            </motion.span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
