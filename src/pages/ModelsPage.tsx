import { formatStat, models, modelStats, type Model } from '../data/content'
import { Button } from '../components/ui/Button'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { Reveal } from '../components/ui/Reveal'
import { StaggerText } from '../components/ui/StaggerText'
import { useTitle } from '../router'

export function ModelsPage() {
  useTitle('The Range — VOLTERRA', 'VOLTERRA X, GT and S: three performance cars built by hand, compared side by side.')

  return (
    <section id="top" className="relative bg-ink pt-32 pb-28 md:pt-44 md:pb-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal className="mb-6 flex items-center gap-4">
          <span className="h-px w-10 bg-accent" aria-hidden />
          <span className="eyebrow">Models</span>
        </Reveal>
        <StaggerText
          as="h1"
          text="THE VOLTERRA RANGE"
          className="max-w-[14ch] font-wide text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] font-bold tracking-[-0.03em] text-chrome"
        />
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-steel md:text-lg">
            Three cars, one philosophy. Each built by hand in Modena, each tuned for a different kind of road.
          </p>
        </Reveal>

        <div className="mt-20 space-y-24 md:mt-32 md:space-y-40">
          {models.map((m, i) => (
            <ModelFeature key={m.id} model={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Editorial spread: large image, alternating sides, with headline figures and a link to the model page. */
function ModelFeature({ model, index }: { model: Model; index: number }) {
  const [power, , topSpeed, sprint] = modelStats(model)
  const figures = [
    { label: 'Power', value: formatStat(power), unit: power.unit },
    { label: '0–100 km/h', value: formatStat(sprint), unit: sprint.unit },
    { label: 'Top speed', value: formatStat(topSpeed), unit: topSpeed.unit },
  ]
  const flip = index % 2 === 1

  return (
    <article className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-16" aria-labelledby={`model-${model.id}`}>
      <ParallaxImage
        src={model.image}
        alt={model.alt}
        className={`aspect-[4/3] rounded-2xl md:aspect-[16/10] lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
      />

      <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <Reveal>
          <p className="eyebrow">
            0{index + 1} / 0{models.length} — {model.tagline}
          </p>
        </Reveal>
        <div id={`model-${model.id}`} className="transition-transform duration-700 ease-luxe group-hover:translate-x-2">
          <StaggerText
            text={`VOLTERRA ${model.name}`}
            className="mt-5 font-wide text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.95] font-bold tracking-[-0.03em] text-chrome uppercase"
          />
        </div>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-md leading-relaxed text-steel">{model.description}</p>
        </Reveal>

        <Reveal delay={0.25}>
          <dl className="mt-10 grid grid-cols-3 border-y border-line">
            {figures.map((f, i) => (
              <div key={f.label} className={`py-5 ${i ? 'border-l border-line pl-4 md:pl-6' : 'pr-4'}`}>
                <dt className="text-[0.625rem] tracking-[0.18em] text-steel uppercase">{f.label}</dt>
                <dd className="mt-2 font-wide text-lg font-semibold text-chrome md:text-2xl">
                  {f.value}
                  <span className="ml-1 text-[0.625rem] font-medium tracking-[0.08em] text-accent md:text-xs">{f.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.3} className="mt-10">
          <Button href={`/models/${model.slug}`} aria-label={`Explore VOLTERRA ${model.name}`}>
            Explore
          </Button>
        </Reveal>
      </div>
    </article>
  )
}
