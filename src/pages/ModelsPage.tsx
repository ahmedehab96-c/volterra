import { useT } from '../i18n'
import { formatStat, modelStats, type Model } from '../data/content'
import { apiEnabled } from '../api/apiClient'
import { LoadingLine } from '../components/ui/LoadingLine'
import { useModels } from '../hooks/useModels'
import { Button } from '../components/ui/Button'
import { ParallaxImage } from '../components/ui/ParallaxImage'
import { StudioShot } from '../components/ui/StudioShot'
import { Vehicle3D } from '../components/ui/Vehicle3D'
import { useModel3D } from '../hooks/useModel3D'
import { Reveal } from '../components/ui/Reveal'
import { StaggerText } from '../components/ui/StaggerText'
import { useTitle } from '../router'

export function ModelsPage() {
  const t = useT()
  useTitle(t('The Range — VOLTERRA'), t('VOLTERRA X, GT and S: three performance cars built by hand, compared side by side.'))
  const { models, status } = useModels()

  return (
    <section id="top" className="relative bg-ink pt-32 pb-28 md:pt-44 md:pb-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal className="mb-6 flex items-center gap-4">
          <span className="h-px w-10 bg-accent" aria-hidden />
          <span className="eyebrow">{t('Models')}</span>
        </Reveal>
        <StaggerText
          as="h1"
          text={t('THE VOLTERRA RANGE')}
          className="max-w-[14ch] font-wide text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] font-bold tracking-[-0.03em] text-chrome"
        />
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-steel md:text-lg">
            {t('Three cars, one philosophy. Each built by hand in Modena, each tuned for a different kind of road.')}
          </p>
        </Reveal>

        {/* Data states: a quiet sync line, a note if a configured API is unreachable (local data is shown) */}
        <div className="mt-10 min-h-8" aria-live="polite">
          {status === 'loading' && <LoadingLine label={t('Syncing the range')} />}
          {status === 'offline' && apiEnabled && <p className="text-xs tracking-[0.18em] text-steel uppercase">{t('Live specifications unavailable — showing the published range')}</p>}
        </div>

        {models.length ? (
          <div className="mt-10 space-y-24 md:mt-20 md:space-y-40">
            {models.map((m, i) => (
              <ModelFeature key={m.id} model={m} index={i} total={models.length} />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-line bg-carbon p-10 text-center md:p-16">
            <p className="eyebrow">{t('The range')}</p>
            <p className="mt-5 font-wide text-2xl font-semibold text-chrome uppercase md:text-3xl">{t('New models are on their way')}</p>
            <p className="mx-auto mt-4 max-w-sm text-steel">{t('The range is being prepared. Please check back soon.')}</p>
            <Button href="/" className="mt-8">
              {t('Return home')}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

/** Editorial spread: large image, alternating sides, with headline figures and a link to the model page. */
function ModelFeature({ model, index, total }: { model: Model; index: number; total: number }) {
  const t = useT()
  const src3d = useModel3D(model.slug, model.model3d)
  const [power, , topSpeed, sprint] = modelStats(model)
  const figures = [
    { label: 'Power', value: formatStat(power), unit: power.unit },
    { label: '0–100 km/h', value: formatStat(sprint), unit: sprint.unit },
    { label: 'Top speed', value: formatStat(topSpeed), unit: topSpeed.unit },
  ]
  const flip = index % 2 === 1

  return (
    <article className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-16" aria-labelledby={`model-${model.id}`}>
      {src3d ? (
        <Vehicle3D
          src={src3d}
          poster={model.image}
          alt={`VOLTERRA ${model.name}`}
          className={`aspect-[4/3] overflow-hidden rounded-2xl bg-graphite md:aspect-[16/10] lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}
          fallback={<StudioShot src={model.image} alt={t(model.alt)} fill className="absolute inset-0" />}
        />
      ) : (
        <ParallaxImage src={model.image} alt={t(model.alt)} className={`aspect-[4/3] rounded-2xl md:aspect-[16/10] lg:col-span-7 ${flip ? 'lg:order-2' : ''}`} />
      )}

      <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <Reveal>
          <p className="eyebrow">
            0{index + 1} / 0{total} — {t(model.tagline)}
          </p>
        </Reveal>
        <div id={`model-${model.id}`} className="transition-transform duration-700 ease-luxe group-hover:translate-x-2 rtl:group-hover:-translate-x-2">
          <StaggerText
            text={`VOLTERRA ${model.name}`}
            className="mt-5 font-wide text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.95] font-bold tracking-[-0.03em] text-chrome uppercase"
          />
        </div>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-md leading-relaxed text-steel">{t(model.description)}</p>
        </Reveal>

        <Reveal delay={0.25}>
          <dl className="mt-10 grid grid-cols-3 border-y border-line">
            {figures.map((f, i) => (
              <div key={t(f.label)} className={`py-5 ${i ? 'border-s border-line ps-4 md:ps-6' : 'pe-4'}`}>
                <dt className="text-[0.625rem] tracking-[0.18em] text-steel uppercase">{t(f.label)}</dt>
                <dd className="mt-2 font-wide text-lg font-semibold text-chrome md:text-2xl">
                  {f.value}
                  <span className="ms-1 text-[0.625rem] font-medium tracking-[0.08em] text-accent md:text-xs">{t(f.unit)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.3} className="mt-10">
          <Button href={`/models/${model.slug}`} aria-label={t('Explore VOLTERRA {model}', { model: model.name })}>
            {t('Explore')}
          </Button>
        </Reveal>
      </div>
    </article>
  )
}
