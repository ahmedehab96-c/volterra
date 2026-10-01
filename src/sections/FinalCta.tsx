import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { SmartImage } from '../components/ui/SmartImage'
import { StaggerText } from '../components/ui/StaggerText'

type FinalCtaProps = { eyebrow?: string; title?: string; cta?: string; href?: string }

export function FinalCta({
  eyebrow = 'Allocation open for 2027',
  title = 'YOUR ROAD STARTS HERE.',
  cta = 'Build your Volterra',
  href = '/configure',
}: FinalCtaProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Slow push-in on the car while the section crosses the viewport
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.18, 1])
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])

  return (
    <section ref={ref} id="build" className="relative flex min-h-[85svh] items-center overflow-hidden bg-ink py-28 md:min-h-screen">
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <SmartImage
          src="/assets/images/hero/garage-coupe-front.webp"
          alt="Performance coupé in a dark private garage, lit by a single overhead beam"
          className="size-full object-cover object-[70%_50%]"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink" aria-hidden />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-accent" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <StaggerText
          as="h2"
          text={title}
          className="max-w-[14ch] font-wide text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] font-bold tracking-[-0.03em] text-chrome"
        />
        <Reveal delay={0.25} className="mt-10">
          <Button href={href}>
            {cta}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
