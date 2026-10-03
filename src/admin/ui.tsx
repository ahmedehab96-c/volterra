import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { LoadingLine } from '../components/ui/LoadingLine'
import { errorMessage } from './useLoad'

/** Plain, fast admin primitives on the VOLTERRA colour tokens (no cinematic effects). */

const btn = {
  primary: 'bg-chrome text-ink hover:bg-white',
  secondary: 'border border-line text-chrome hover:border-white/40 hover:bg-white/[0.04]',
  danger: 'border border-accent/40 text-accent-soft hover:bg-accent/10',
  ghost: 'text-steel hover:bg-white/[0.05] hover:text-chrome',
}

export function Btn({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof btn }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${btn[variant]} ${className}`}
      {...props}
    />
  )
}

export const inputClass =
  'block h-10 w-full rounded-lg border border-line bg-ink px-3 text-sm text-chrome outline-none transition-colors placeholder:text-steel/60 focus:border-chrome/60 aria-invalid:border-accent-soft'

/** Label, control and error, wired for screen readers */
export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: (props: { id: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }) => ReactNode }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-silver">
        {label}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-err` : undefined })}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-accent-soft">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-steel">{hint}</p>
      )}
    </div>
  )
}

const badge: Record<string, string> = {
  active: 'bg-emerald-400/10 text-emerald-300',
  inactive: 'bg-white/[0.06] text-steel',
  new: 'bg-accent/15 text-accent-soft',
  contacted: 'bg-amber-400/10 text-amber-300',
  closed: 'bg-white/[0.06] text-steel',
}

export const Badge = ({ value }: { value: string }) => (
  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badge[value] ?? badge.inactive}`}>{value}</span>
)

export function PageHeader({ title, intro, action }: { title: string; intro?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-chrome md:text-2xl">{title}</h1>
        {intro && <p className="mt-1 text-sm text-steel">{intro}</p>}
      </div>
      {action}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-carbon ${className}`}>{children}</div>
}

/** Loading, error and empty states in one place */
export function StateView({ loading, error, empty, onRetry }: { loading?: boolean; error?: string; empty?: string; onRetry?: () => void }) {
  if (loading)
    return (
      <div className="grid place-items-center py-16">
        <LoadingLine />
      </div>
    )
  if (error)
    return (
      <div className="py-14 text-center" role="alert">
        <p className="text-sm text-silver">{error}</p>
        {onRetry && (
          <Btn variant="secondary" className="mt-4" onClick={onRetry}>
            Try again
          </Btn>
        )}
      </div>
    )
  return <p className="py-14 text-center text-sm text-steel">{empty}</p>
}

/** Dialog with backdrop, Escape to close and focus moved inside */
export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/70 sm:place-items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[92svh] w-full overflow-y-auto rounded-t-2xl border border-line bg-carbon p-5 sm:rounded-2xl sm:p-6 ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-chrome">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-lg text-steel hover:bg-white/[0.05] hover:text-chrome">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const thClass = 'px-4 py-3 text-left text-xs font-medium tracking-wide text-steel uppercase'
export const tdClass = 'px-4 py-3 align-middle'

/** Shared delete confirmation */
export function ConfirmDelete({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => Promise<unknown> }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return (
    <Modal title={`Delete ${name}?`} onClose={onClose}>
      <p className="text-sm text-steel">This can’t be undone.</p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-accent-soft">
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="danger"
          disabled={busy}
          onClick={() => {
            setBusy(true)
            onConfirm().catch((e) => {
              setError(errorMessage(e))
              setBusy(false)
            })
          }}
        >
          {busy ? 'Deleting…' : 'Delete'}
        </Btn>
      </div>
    </Modal>
  )
}
