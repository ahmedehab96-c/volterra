import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SmartImage } from './SmartImage'
import { StaggerText } from './StaggerText'

type CinematicBandProps = {
  id?: string
  image: string
  alt: string
  eyebrow: string
  title: string
  body?: string
  /** CSS object-position, to keep the subject in frame when cropped */
  focus?: string
  /** Slow light sweep across the image */
  sweep?: boolean
  /** h1 when the band opens a page */
  heading?: 'h1' | 'h2'
  /** Extra content under the text, e.g. calls to action */
  children?: ReactNode
}

/** Full-bleed image interlude: the mask opens on entry, the image settles from a slow push-in and drifts with scroll. */
export function CinematicBand({ id, image, alt, eyebrow, title, body, focus, sweep, heading = 'h2', children }: CinematicBandProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Ranges span 0–1: clip-path may run as a WAAPI scroll animation, which needs both ends
  const open = 'inset(0% 0% 0% 0% round 0px)'
  const clipPath = useTransform(scrollYProgress, [0, 0.4, 1], [reduce ? open : 'inset(14% 6% 14% 6% round 24px)', open, open])
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.16, 1.02])
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])

  return (
    <section ref={ref} id={id} aria-label={title} className="relative h-[90svh] min-h-[560px] overflow-hidden bg-ink md:h-screen">
      <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
        {/* Overscanned so the drift never reveals an edge */}
        <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={{ scale, y }}>
          <SmartImage src={image} alt={alt} className="size-full object-cover" style={focus ? { objectPosition: focus } : undefined} sizes="100vw" />
        </motion.div>
        {sweep && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen" aria-hidden>
            <div className="absolute inset-y-0 left-0 w-1/2 animate-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-5% via-ink/45 via-45% to-ink/40" aria-hidden />
        <div className="absolute inset-0 hidden bg-gradient-to-r rtl:bg-gradient-to-l from-ink/70 via-ink/20 via-50% to-transparent md:block" aria-hidden />
      </motion.div>

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-4 text-silver">
            <span className="h-px w-10 bg-accent" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <StaggerText
          as={heading}
          text={title}
          className="max-w-[16ch] font-wide text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.03em] text-chrome uppercase"
        />
        {body && (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-silver md:text-lg">{body}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
