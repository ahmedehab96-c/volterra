import { useT } from '../i18n'
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { Check, RotateCcw } from 'lucide-react'
import { useEffect, type KeyboardEvent } from 'react'
import { carColors, formatPrice, interiorOptions, paintRotation, wheelOptions, type ConfigOption } from '../data/content'
import { resetCarConfig, setCarColor, setInterior, setWheels, useCarConfig } from '../state/carConfig'
import { useCatalog, useEstimate } from '../hooks/usePricing'
import { Button } from '../components/ui/Button'
import { StudioShot } from '../components/ui/StudioShot'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'

const ease = [0.22, 1, 0.36, 1] as const

export function Configurator() {
  const t = useT()
  const config = useCarConfig()
  const { model, color, wheels, interior } = config
  const total = useEstimate(config).price
  const catalog = useCatalog()

  return (
    <section id="configurator" className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow={t('Configurator')}
          title={t('Make it unmistakably yours')}
          intro={t('Choose the paint that will carry your signature. Every finish is laid by hand across seven coats and three days.')}
        />

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-12">
          {/* Stage */}
          <Reveal className="lg:col-span-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-graphite sm:aspect-[16/10]">
              {/* The selected model on its studio spotlight */}
              <StudioShot src={model.image} alt={t(model.alt)} fill hue={paintRotation(model, color)} className="absolute inset-0" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" aria-hidden />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={color.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease }}
                    aria-live="polite"
                  >
                    <p className="eyebrow text-silver">{t(color.finish)}</p>
                    <p className="mt-2 font-wide text-xl font-semibold text-chrome uppercase md:text-3xl">{t(color.name)}</p>
                  </motion.div>
                </AnimatePresence>
                <p className="hidden text-xs tracking-[0.2em] text-silver/80 uppercase sm:block">VOLTERRA {model.name}</p>
              </div>
            </div>
          </Reveal>

          {/* Controls */}
          <Reveal delay={0.15} className="flex flex-col lg:col-span-4">
            <div className="mb-8 flex items-center justify-between">
              <p className="font-wide text-sm font-semibold tracking-[0.12em] text-chrome uppercase">{t('Your specification')}</p>
              <button
                type="button"
                onClick={resetCarConfig}
                className="group inline-flex h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-[0.6875rem] tracking-[0.18em] text-steel uppercase transition-colors hover:border-white/40 hover:text-chrome"
              >
                <RotateCcw className="size-3.5 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
                {t('Reset')}
              </button>
            </div>

            <ColorPicker />

            <OptionGroup legend={t('Wheels')} name="wheels" options={wheelOptions} value={wheels} onChange={setWheels} />
            <OptionGroup legend={t('Interior')} name="interior" options={interiorOptions} value={interior} onChange={setInterior} />

            <dl className="mt-10 space-y-3 border-t border-line pt-8 text-sm">
              <div className="flex justify-between text-steel">
                <dt>VOLTERRA {model.name}</dt>
                <dd>{formatPrice(catalog.model(model.slug)?.price ?? model.price)}</dd>
              </div>
              {(
                [
                  ['exterior_color', color, color.name],
                  ['wheels', wheels, `${t(wheels.name)} — ${t(wheels.detail)}`],
                  ['interior', interior, `${t(interior.name)} — ${t(interior.detail)}`],
                ] as const
              ).map(([type, o, label]) => {
                const price = catalog.optionPrice(type, o.id, o.price)
                return (
                  <div key={type} className="flex justify-between text-steel">
                    <dt>{label}</dt>
                    <dd className="shrink-0 ps-4">{price ? `+${formatPrice(price)}` : t('Included')}</dd>
                  </div>
                )
              })}
              <div className="flex items-baseline justify-between pt-4">
                <dt className="eyebrow">{t('Your build')}</dt>
                <dd className="font-wide text-2xl font-semibold text-chrome">
                  <AnimatedPrice value={total} />
                </dd>
              </div>
            </dl>

            <Button href="/configure#request" className="mt-10 w-full">
              {t('Reserve this build')}
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Smoothly tweens the total between selections. */
export function AnimatedPrice({ value }: { value: number }) {
  const reduce = useReducedMotion()
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => formatPrice(Math.round(v)))

  useEffect(() => {
    if (reduce) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration: 0.8, ease })
    return () => controls.stop()
  }, [mv, reduce, value])

  return <motion.span className="tabular-nums">{text}</motion.span>
}

type OptionGroupProps = {
  legend: string
  name: string
  options: ConfigOption[]
  value: ConfigOption
  onChange: (option: ConfigOption) => void
}

/** Touch-friendly radio list with a finish swatch, detail line and price. */
export function OptionGroup({ legend, name, options, value, onChange }: OptionGroupProps) {
  const t = useT()
  // Prices and availability follow the server catalog when it is reachable
  const catalog = useCatalog()
  const type = name === 'wheels' ? 'wheels' : 'interior'
  return (
    <fieldset className="mt-9">
      <legend className="eyebrow mb-4">{legend}</legend>
      <div className="grid gap-2">
        {options.map((o) => {
          const active = o.id === value.id
          return (
            <label
              key={o.id}
              className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 text-sm transition-colors duration-300 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent-soft ${
                active ? 'border-chrome/60 bg-white/[0.05] text-chrome' : 'border-line text-silver hover:border-white/30'
              }`}
            >
              <input type="radio" name={name} className="sr-only" checked={active} disabled={!catalog.isAvailable(type, o.id)} onChange={() => onChange(o)} />
              <span
                className={`size-5 shrink-0 rounded-full ring-1 transition-all duration-300 ${active ? 'ring-chrome ring-offset-2 ring-offset-ink' : 'ring-white/20'}`}
                style={{ background: o.swatch }}
                aria-hidden
              />
              <span className="flex-1">
                <span className="block font-medium">{t(o.name)}</span>
                <span className="block text-xs text-steel">{t(o.detail)}</span>
              </span>
              <span className="shrink-0 text-xs text-steel">
                {!catalog.isAvailable(type, o.id) ? 'Unavailable' : catalog.optionPrice(type, o.id, o.price) ? `+${formatPrice(catalog.optionPrice(type, o.id, o.price))}` : t('Included')}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Paint swatches as a radiogroup with arrow-key navigation. */
export function ColorPicker() {
  const t = useT()
  const { model, color } = useCarConfig()
  const catalog = useCatalog()
  // Only the paints offered for this car can be chosen
  const fixed = model.colors.length === 1
  const offered = (id: string) => model.colors.includes(id)

  const onSwatchKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    if (fixed) return
    const next = carColors[(carColors.indexOf(color) + dir + carColors.length) % carColors.length]
    setCarColor(next.id)
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-color="${next.id}"]`)?.focus()
  }

  return (
    <fieldset>
      <legend className="eyebrow mb-5">{t('Exterior paint')}</legend>
      <div role="radiogroup" aria-label={t('Exterior paint')} className="grid grid-cols-4 gap-3" onKeyDown={onSwatchKey}>
        {carColors.map((c) => {
          const active = c.id === color.id
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${t(c.name)}, ${catalog.optionPrice('exterior_color', c.id, c.price) ? `+${formatPrice(catalog.optionPrice('exterior_color', c.id, c.price))}` : t('Included')}`}
              tabIndex={active ? 0 : -1}
              data-color={c.id}
              onClick={() => setCarColor(c.id)}
              disabled={!offered(c.id) || !catalog.isAvailable('exterior_color', c.id)}
              className="group flex flex-col items-center gap-3 disabled:pointer-events-none disabled:opacity-25"
            >
              <span
                className={`relative grid aspect-square w-full max-w-16 place-items-center rounded-full ring-1 transition-all duration-500 ease-luxe ${
                  active ? 'ring-chrome ring-offset-4 ring-offset-ink' : 'ring-white/15 group-hover:ring-white/40'
                }`}
              >
                <span
                  className="absolute inset-0 rounded-full transition-transform duration-500 ease-luxe group-hover:scale-95"
                  style={{ background: c.swatch }}
                />
                <AnimatePresence>
                  {active && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`relative ${c.id === 'signature' || c.id === 'giallo' ? 'text-ink' : 'text-chrome'}`}
                    >
                      <Check className="size-4" strokeWidth={2.5} aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className={`text-[0.6875rem] tracking-wide transition-colors ${active ? 'text-chrome' : 'text-steel'}`}>
                {t(c.name).split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>
      {fixed && <p className="mt-5 text-xs leading-relaxed text-steel">{t('The VOLTERRA {model} is offered in its signature white.', { model: model.name })}</p>}
    </fieldset>
  )
}
