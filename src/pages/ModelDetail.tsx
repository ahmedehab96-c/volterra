import { models, modelStats } from '../data/content'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { StaggerText } from '../components/ui/StaggerText'
import { StudioShot } from '../components/ui/StudioShot'
import { useTitle } from '../router'
import { Design } from '../sections/Design'
import { FinalCta } from '../sections/FinalCta'
import { Interior } from '../sections/Interior'
import { Performance } from '../sections/Performance'
import { Technology } from '../sections/Technology'
import { NotFound } from './NotFound'

/** One page per model, composed from the home page sections with that model's figures. */
export function ModelDetail({ slug }: { slug: string }) {
  const model = models.find((m) => m.slug === slug)
  useTitle(model ? `VOLTERRA ${model.name} — ${model.tagline}` : 'Wrong road — VOLTERRA', model?.description)
  if (!model) return <NotFound />

  const configure = `/configure?model=${model.id}`

  return (
    <>
      <section id="top" className="relative overflow-hidden bg-ink pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto grid max-w-[1440px] items-center gap-6 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
          <StudioShot src={model.image} alt={model.alt} priority className="relative h-[88vw] max-h-[560px] lg:order-2 lg:col-span-6 lg:h-[70svh] lg:max-h-[640px]" />
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-accent" aria-hidden />
                {model.tagline}
              </p>
            </Reveal>
            <StaggerText
              as="h1"
              immediate
              text={`VOLTERRA ${model.name}`}
              className="font-wide text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[0.92] font-bold tracking-[-0.03em] text-chrome uppercase"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-silver md:text-lg">{model.description}</p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
              <Button href={configure}>Configure</Button>
              <Button href="#performance" variant="ghost" icon={false}>
                Performance
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
      <Performance stats={modelStats(model)} secondary={[]} />
      <Design />
      <Interior />
      <Technology />
      <FinalCta eyebrow={`VOLTERRA ${model.name}`} title="MAKE IT UNMISTAKABLY YOURS." cta={`Configure the ${model.name}`} href={configure} />
    </>
  )
}
