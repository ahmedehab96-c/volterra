import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { formatPrice, interiorOptions, models, paintRotation, wheelOptions } from '../data/content'
import { Button } from '../components/ui/Button'
import { buttonStyles } from '../components/ui/buttonStyles'
import { StudioShot } from '../components/ui/StudioShot'
import { StaggerText } from '../components/ui/StaggerText'
import { useTitle } from '../router'
import { AnimatedPrice, ColorPicker, OptionGroup } from '../sections/Configurator'
import { RequestForm } from '../sections/RequestForm'
import { configTotal, resetCarConfig, setInterior, setModel, setWheels, useCarConfig } from '../state/carConfig'

const steps = ['Exterior color', 'Wheels', 'Interior', 'Summary'] as const
const ease = [0.22, 1, 0.36, 1] as const

export function ConfigurePage() {
  useTitle('Configure — VOLTERRA', 'Build your VOLTERRA: choose a model, paint, wheels and interior, and see the estimated price.')
  const config = useCarConfig()
  const { model, color, wheels, interior } = config
  const total = configTotal(config)
  const [step, setStep] = useState(0)
  const panel = useRef<HTMLDivElement>(null)
  const panelInView = useInView(panel, { margin: '0px 0px -20% 0px' })

  // /configure?model=x preselects a model
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('model')
    if (id) setModel(id)
  }, [])

  const go = (dir: number) => setStep((s) => Math.min(steps.length - 1, Math.max(0, s + dir)))

  const onModelKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = models[(models.indexOf(model) + dir + models.length) % models.length]
    setModel(next.id)
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-model="${next.id}"]`)?.focus()
  }

  return (
    <>
      <section id="top" className="relative bg-ink pt-28 pb-28 md:pt-36 md:pb-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-5 flex items-center gap-4">
                <span className="h-px w-10 bg-accent" aria-hidden />
                Configurator
              </p>
              <StaggerText
                as="h1"
                text="Build your VOLTERRA"
                immediate
                className="font-wide text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.02em] text-chrome uppercase"
              />
            </div>

            {/* Model choice */}
            <div role="radiogroup" aria-label="Model" className="flex rounded-full border border-line p-1" onKeyDown={onModelKey}>
              {models.map((m) => {
                const on = m.id === model.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    data-model={m.id}
                    onClick={() => setModel(m.id)}
                    className={`relative h-10 rounded-full px-5 font-wide text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-300 ${on ? 'text-ink' : 'text-steel hover:text-chrome'}`}
                  >
                    {on && <motion.span layoutId="model-pill" className="absolute inset-0 rounded-full bg-chrome" transition={{ duration: 0.5, ease }} />}
                    <span className="relative">{m.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:gap-12">
            {/* Preview: the selected model, sticky beside the steps on desktop */}
            <div className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start xl:col-span-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-graphite sm:aspect-[16/10] lg:aspect-auto lg:h-[calc(100svh-10rem)] lg:max-h-[760px] lg:min-h-[420px]">
                <StudioShot src={model.image} alt={model.alt} fill hue={paintRotation(model, color)} className="absolute inset-0" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" aria-hidden />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-8" aria-live="polite">
                  <p className="eyebrow text-silver">VOLTERRA {model.name}</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={color.id}
                      className="mt-2 font-wide text-xl font-semibold text-chrome uppercase md:text-3xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease }}
                    >
                      {color.name}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div ref={panel} className="flex flex-col lg:col-span-5 xl:col-span-4">
              <ol className="grid grid-cols-4 border-b border-line">
                {steps.map((label, i) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      aria-current={i === step ? 'step' : undefined}
                      className={`relative w-full pb-4 text-left transition-colors duration-300 ${i === step ? 'text-chrome' : 'text-steel hover:text-silver'}`}
                    >
                      <span className="block text-[0.625rem] tracking-[0.2em]">0{i + 1}</span>
                      <span className="mt-1 block truncate text-[0.625rem] font-medium tracking-[0.12em] uppercase sm:text-[0.6875rem]">{label.split(' ')[0]}</span>
                      {i === step && <motion.span layoutId="step-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" transition={{ duration: 0.5, ease }} />}
                    </button>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex items-center justify-between">
                <h2 className="font-wide text-sm font-semibold tracking-[0.12em] text-chrome uppercase">
                  <span className="text-accent">0{step + 1}</span> — {steps[step]}
                </h2>
                <button
                  type="button"
                  onClick={resetCarConfig}
                  className="group inline-flex h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-[0.6875rem] tracking-[0.18em] text-steel uppercase transition-colors hover:border-white/40 hover:text-chrome"
                >
                  <RotateCcw className="size-3.5 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
                  Reset
                </button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  className="mt-6 min-h-[16rem]"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35, ease }}
                >
                  {step === 0 && <ColorPicker />}
                  {step === 1 && <OptionGroup legend="Wheels" name="wheels" options={wheelOptions} value={wheels} onChange={setWheels} />}
                  {step === 2 && <OptionGroup legend="Interior" name="interior" options={interiorOptions} value={interior} onChange={setInterior} />}
                  {step === 3 && (
                    <dl className="space-y-4 text-sm">
                      {[
                        ['Model', `VOLTERRA ${model.name}`, model.price],
                        ['Exterior', color.name, color.price],
                        ['Wheels', `${wheels.name} — ${wheels.detail}`, wheels.price],
                        ['Interior', `${interior.name} — ${interior.detail}`, interior.price],
                      ].map(([label, value, price]) => (
                        <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                          <div>
                            <dt className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">{label}</dt>
                            <dd className="mt-1 text-chrome">{value}</dd>
                          </div>
                          <dd className="shrink-0 text-steel">{label === 'Model' ? formatPrice(price as number) : price ? `+${formatPrice(price as number)}` : 'Included'}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 border-t border-line pt-6">
                <p className="eyebrow">Estimated configuration</p>
                <p className="mt-2 font-wide text-3xl font-semibold text-chrome">
                  <AnimatedPrice value={total} />
                </p>
                <p className="mt-2 text-xs text-steel">Indicative price before taxes and delivery. No payment is taken online.</p>
              </div>

              {step === steps.length - 1 ? (
                <Button href="#request" className="mt-8 w-full">
                  Request your Volterra
                </Button>
              ) : null}

              {/* Desktop step controls; phones use the bottom bar */}
              <div className="mt-8 hidden gap-3 lg:flex">
                <StepButton dir={-1} disabled={step === 0} onClick={() => go(-1)} />
                {step < steps.length - 1 && <StepButton dir={1} onClick={() => go(1)} label={`Next: ${steps[step + 1]}`} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      <RequestForm />

      {/* Mobile bottom controls, shown while the steps are on screen */}
      <AnimatePresence>
        {panelInView && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">
                  Step 0{step + 1} / 0{steps.length}
                </p>
                <p className="truncate font-wide text-base font-semibold text-chrome">
                  <AnimatedPrice value={total} />
                </p>
              </div>
              <div className="flex gap-2">
                <StepButton dir={-1} disabled={step === 0} onClick={() => go(-1)} compact />
                {step < steps.length - 1 ? (
                  <StepButton dir={1} onClick={() => go(1)} compact />
                ) : (
                  <a href="#request" className={buttonStyles('primary', 'sm')}>
                    Request
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function StepButton({ dir, onClick, disabled, label, compact }: { dir: -1 | 1; onClick: () => void; disabled?: boolean; label?: string; compact?: boolean }) {
  const Icon = dir < 0 ? ArrowLeft : ArrowRight
  const text = label ?? (dir < 0 ? 'Back' : 'Next')
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={compact ? text : undefined}
      className={`group inline-flex h-11 items-center justify-center gap-2 rounded-full border text-xs font-medium tracking-[0.14em] uppercase transition-colors duration-300 disabled:pointer-events-none disabled:opacity-30 ${
        compact ? 'w-11' : dir < 0 ? 'px-5' : 'flex-1 px-5'
      } ${dir > 0 ? 'border-chrome bg-chrome text-ink hover:bg-white' : 'border-white/20 text-chrome hover:border-white/60'}`}
    >
      {dir < 0 && <Icon className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden />}
      {!compact && text}
      {dir > 0 && <Icon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />}
    </button>
  )
}
