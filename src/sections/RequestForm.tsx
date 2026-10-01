import { AnimatePresence, motion } from 'framer-motion'
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { formatPrice, models } from '../data/content'
import { configTotal, setModel, useCarConfig } from '../state/carConfig'
import { trackEvent } from '../utils/analytics'
import { buttonStyles } from '../components/ui/buttonStyles'

const countries = ['Italy', 'Germany', 'France', 'Switzerland', 'United Kingdom', 'United States', 'United Arab Emirates', 'Saudi Arabia', 'Egypt', 'Japan', 'Other']
const ease = [0.22, 1, 0.36, 1] as const

type Fields = { name: string; email: string; phone: string; country: string }
const empty: Fields = { name: '', email: '', phone: '', country: '' }

function validate(f: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {}
  if (f.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!/^\+?[\d\s().-]{7,20}$/.test(f.phone.trim())) errors.phone = 'Please enter a valid phone number.'
  if (!f.country) errors.country = 'Please select your country.'
  return errors
}

/** Enquiry form with client-side validation only. Nothing is sent anywhere. */
export function RequestForm() {
  const config = useCarConfig()
  const { model, color, wheels, interior } = config
  const [fields, setFields] = useState(empty)
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [reference, setReference] = useState('')

  const set = (key: keyof Fields) => (value: string) => {
    setFields((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validate(fields)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    // Simulated hand-off; no backend
    trackEvent('request_information', { model: model.id, color: color.id, wheels: wheels.id, interior: interior.id })
    setStatus('sending')
    window.setTimeout(() => {
      setReference(`VT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
      setStatus('sent')
    }, 700)
  }

  const reset = () => {
    setFields(empty)
    setStatus('idle')
  }

  const summary = `${color.name} · ${wheels.name} wheels · ${interior.name} interior`

  return (
    <section id="request" className="relative border-t border-line bg-carbon py-24 md:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-accent" aria-hidden />
            Request information
          </p>
          <h2 className="font-wide text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.02em] text-chrome uppercase">
            Request your VOLTERRA
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-steel">
            A specialist from the Modena atelier will contact you to walk through your build and arrange a private viewing.
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-12"
              >
                <svg viewBox="0 0 52 52" className="size-14 text-accent" aria-hidden>
                  <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
                  <motion.path
                    d="M15 27l7 7 15-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease }}
                  />
                </svg>
                <h3 className="mt-8 font-wide text-2xl font-semibold tracking-[-0.01em] text-chrome uppercase md:text-3xl">Request received</h3>
                <p className="mt-4 max-w-md leading-relaxed text-steel">
                  Thank you, {fields.name.trim().split(' ')[0]}. Your VOLTERRA {model.name} specialist will be in touch within two working days.
                </p>
                <dl className="mt-8 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">Reference</dt>
                    <dd className="mt-1 font-wide text-chrome">{reference}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">Estimated configuration</dt>
                    <dd className="mt-1 font-wide text-chrome">{formatPrice(configTotal(config))}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">Build</dt>
                    <dd className="mt-1 text-silver">VOLTERRA {model.name} — {summary}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={reset}
                  className={`mt-10 ${buttonStyles('ghost', 'sm')}`}
                >
                  New request
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid gap-x-8 gap-y-8 sm:grid-cols-2"
              >
                <Field label="Full name" error={errors.name}>
                  {(p) => <input {...p} name="name" autoComplete="name" value={fields.name} onChange={(e) => set('name')(e.target.value)} />}
                </Field>
                <Field label="Email" error={errors.email}>
                  {(p) => <input {...p} name="email" type="email" autoComplete="email" value={fields.email} onChange={(e) => set('email')(e.target.value)} />}
                </Field>
                <Field label="Phone" error={errors.phone}>
                  {(p) => <input {...p} name="phone" type="tel" autoComplete="tel" value={fields.phone} onChange={(e) => set('phone')(e.target.value)} />}
                </Field>
                <Field label="Country" error={errors.country}>
                  {(p) => (
                    <select {...p} name="country" autoComplete="country-name" value={fields.country} onChange={(e) => set('country')(e.target.value)}>
                      <option value="" disabled>
                        Select
                      </option>
                      {countries.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field label="Preferred model">
                  {(p) => (
                    <select {...p} name="model" value={model.id} onChange={(e) => setModel(e.target.value)}>
                      {models.map((m) => (
                        <option key={m.id} value={m.id}>
                          VOLTERRA {m.name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <div>
                  <p className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">Selected configuration</p>
                  <p className="mt-3 text-sm leading-relaxed text-silver">{summary}</p>
                  <p className="mt-1 font-wide text-sm text-chrome">{formatPrice(configTotal(config))}</p>
                </div>

                <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className={buttonStyles()}
                  >
                    {status === 'sending' ? 'Sending…' : 'Request information'}
                  </button>
                  <p className="text-xs text-steel">Demo form — no data leaves your browser.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

type ControlProps = { id: string; className: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }

/** Label, underlined control and inline error, wired up for screen readers. */
function Field({ label, error, children }: { label: string; error?: string; children: (props: ControlProps) => ReactNode }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? `${id}-error` : undefined,
        className: `mt-2 block h-12 w-full appearance-none rounded-none border-0 border-b bg-transparent px-0 text-base text-chrome transition-colors duration-300 outline-none placeholder:text-steel/50 focus:border-chrome focus-visible:outline-none [&>option]:bg-carbon ${
          error ? 'border-accent-soft' : 'border-line hover:border-white/40'
        }`,
      })}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="mt-2 text-xs text-accent-soft"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
