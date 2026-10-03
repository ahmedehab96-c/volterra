import { useT } from '../i18n'
import { designFeatures } from '../data/content'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { StaggerText } from '../components/ui/StaggerText'

export function Design() {
  const t = useT()
  const [silhouette, light, stance, surface] = designFeatures

  return (
    <section id="design" className="relative bg-carbon py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow={t('Design')}
          title={t('Tension in every line')}
          intro={t('Designed in a single studio by a team of nine. No committees, no compromise — only proportion, light and intent.')}
        />

        {/* Full vehicle — cinematic, full width */}
        <div className="mt-20 md:mt-28">
          <ParallaxImage src={silhouette.image} alt={silhouette.alt} className="aspect-[4/3] rounded-2xl md:aspect-[21/9]" strength={14} focus="50% 80%" />
          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <p className="eyebrow md:col-span-3">{t(silhouette.eyebrow)}</p>
            <StaggerText as="h3" text={t(silhouette.title)} className="font-wide text-2xl font-semibold text-chrome uppercase md:col-span-4 md:text-3xl" />
            <Reveal delay={0.15} className="md:col-span-5">
              <p className="leading-relaxed text-steel">{t(silhouette.body)}</p>
            </Reveal>
          </div>
        </div>

        {/* Headlight close-up beside text */}
        <div className="mt-24 grid items-center gap-10 md:mt-40 lg:grid-cols-12 lg:gap-16">
          <ParallaxImage src={light.image} alt={light.alt} className="aspect-[4/5] rounded-2xl sm:aspect-[4/3] lg:col-span-7 lg:aspect-[4/5]" />
          <FeatureText feature={light} className="lg:col-span-4 lg:col-start-9" />
        </div>

        {/* Wheel + surface detail — offset pair */}
        <div className="mt-24 grid gap-16 md:mt-40 md:grid-cols-2 md:gap-10">
          <div>
            <ParallaxImage src={stance.image} alt={stance.alt} className="aspect-[5/4] rounded-2xl" />
            <FeatureText feature={stance} className="mt-10" compact />
          </div>
          <div className="md:mt-48">
            <ParallaxImage src={surface.image} alt={surface.alt} className="aspect-[5/4] rounded-2xl" />
            <FeatureText feature={surface} className="mt-10" compact />
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureText({
  feature,
  className = '',
  compact,
}: {
  feature: (typeof designFeatures)[number]
  className?: string
  compact?: boolean
}) {
  const t = useT()
  return (
    <div className={className}>
      <Reveal>
        <p className="eyebrow">{t(feature.eyebrow)}</p>
      </Reveal>
      <StaggerText
        as="h3"
        text={t(feature.title)}
        className={`mt-5 font-wide font-semibold text-chrome uppercase ${compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}`}
      />
      <Reveal delay={0.15}>
        <p className="mt-5 max-w-md leading-relaxed text-steel">{t(feature.body)}</p>
      </Reveal>
    </div>
  )
}
