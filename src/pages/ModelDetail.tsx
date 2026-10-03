import { useT } from '../i18n'
import { modelStats } from '../data/content'
import { useModel } from '../hooks/useModels'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { StaggerText } from '../components/ui/StaggerText'
import { StudioShot } from '../components/ui/StudioShot'
import { Vehicle3D } from '../components/ui/Vehicle3D'
import { useModel3D } from '../hooks/useModel3D'
import { useTitle } from '../router'
import { Design } from '../sections/Design'
import { FinalCta } from '../sections/FinalCta'
import { Interior } from '../sections/Interior'
import { Performance } from '../sections/Performance'
import { Technology } from '../sections/Technology'
import { NotFound } from './NotFound'

/** One page per model, composed from the home page sections with that model's figures. */
export function ModelDetail({ slug }: { slug: string }) {
  const t = useT()
  const { model } = useModel(slug)
  const src3d = useModel3D(slug, model?.model3d)
  useTitle(model ? `VOLTERRA ${model.name} — ${t(model.tagline)}` : t('Wrong road — VOLTERRA'), model ? t(model.description) : undefined)
  if (!model) return <NotFound />

  const configure = `/configure?model=${model.id}`

  return (
    <>
      <section id="top" className="relative overflow-hidden bg-ink pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto grid max-w-[1440px] items-center gap-6 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
          {src3d ? (
            <Vehicle3D
              src={src3d}
              poster={model.image}
              alt={`Interactive 3D VOLTERRA ${model.name}`}
              className="h-[88vw] max-h-[560px] lg:order-2 lg:col-span-6 lg:h-[70svh] lg:max-h-[640px]"
              fallback={<StudioShot src={model.image} alt={t(model.alt)} priority className="relative size-full" />}
            />
          ) : (
            <StudioShot src={model.image} alt={t(model.alt)} priority className="relative h-[88vw] max-h-[560px] lg:order-2 lg:col-span-6 lg:h-[70svh] lg:max-h-[640px]" />
          )}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-accent" aria-hidden />
                {t(model.tagline)}
              </p>
            </Reveal>
            <StaggerText
              as="h1"
              immediate
              text={`VOLTERRA ${model.name}`}
              className="font-wide text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[0.92] font-bold tracking-[-0.03em] text-chrome uppercase"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-silver md:text-lg">{t(model.description)}</p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
              <Button href={configure}>{t('Configure')}</Button>
              <Button href="#performance" variant="ghost" icon={false}>
                {t('Performance')}
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
      <Performance stats={modelStats(model)} secondary={[]} />
      <Design />
      <Interior />
      <Technology />
      <FinalCta eyebrow={`VOLTERRA ${model.name}`} title={t('MAKE IT UNMISTAKABLY YOURS.')} cta={t('Configure the {model}', { model: model.name })} href={configure} />
    </>
  )
}
