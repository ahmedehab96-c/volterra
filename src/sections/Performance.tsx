import { useT } from '../i18n'
import { motion } from 'framer-motion'
import { headlineStats, secondarySpecs, type Stat } from '../data/content'
import { Counter } from '../components/ui/Counter'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

export function Performance({ stats = headlineStats, secondary = secondarySpecs }: { stats?: Stat[]; secondary?: { label: string; value: string }[] }) {
  const t = useT()
  return (
    <section id="performance" className="relative overflow-hidden bg-ink py-28 md:py-40">
      {/* Faint engineering grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--color-line)_1px,transparent_1px)] [background-size:calc(100%/6)_100%] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow={t('Performance')}
          title={t('Numbers that bend physics')}
          intro={t('Twin-turbo V8, electric boost. Measured, not estimated.')}
        />

        {/* One horizontal track per figure; numbers and bars run when the row scrolls into view */}
        <div className="mt-20 border-t border-line md:mt-28">
          {stats.map((stat, i) => (
            <Reveal
              key={t(stat.label)}
              delay={i * 0.08}
              className="group grid gap-x-10 gap-y-5 border-b border-line py-8 md:grid-cols-12 md:items-center md:py-10"
            >
              <div className="md:col-span-3">
                <p className="eyebrow text-silver">{t(stat.label)}</p>
                <p className="mt-2 text-sm leading-relaxed text-steel">{t(stat.detail)}</p>
              </div>
              {/* Figure over unit, like an instrument readout */}
              <p className="flex flex-col font-wide text-chrome md:col-span-4">
                <Counter
                  value={stat.value}
                  decimals={stat.decimals}
                  className="text-[clamp(3.5rem,7vw,6rem)] leading-[0.9] font-bold tracking-[-0.045em]"
                />
                <span className="mt-3 text-xs font-medium tracking-[0.32em] text-steel md:text-sm">{t(stat.unit)}</span>
              </p>
              <div className="relative h-px bg-line md:col-span-5" aria-hidden>
                <motion.div
                  className="absolute inset-y-0 start-0 bg-gradient-to-r from-accent/70 rtl:bg-gradient-to-l to-accent-soft"
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${stat.gauge * 100}%` }}
                  viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                  transition={{ duration: 2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="absolute top-1/2 -end-1 size-2 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_12px_2px_rgba(255,74,79,0.5)]" />
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>

        {secondary.length > 0 && (
          <dl className="mt-14 grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {secondary.map((spec, i) => (
              <Reveal key={t(spec.label)} delay={0.1 + i * 0.08} className="border-s border-line ps-5">
                <dt className="text-xs tracking-[0.18em] text-steel uppercase">{t(spec.label)}</dt>
                <dd className="mt-2 font-wide text-lg font-semibold text-chrome md:text-xl">{t(spec.value)}</dd>
              </Reveal>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
