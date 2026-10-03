import { useT } from '../../i18n'
/** The VOLTERRA wordmark: wide geometric caps, generous tracking, nothing else. */
export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`keep-tracking font-wide font-semibold tracking-[0.42em] text-chrome ${className}`}>VOLTERRA</span>
}

/** Wordmark as the home link (navbar, mobile menu, footer). */
export function Logo({ className = '' }: { className?: string }) {
  const t = useT()
  return (
    <a href="/" aria-label={t('VOLTERRA — home')} className={`inline-flex min-h-11 items-center text-[0.95rem] ${className}`}>
      <Wordmark />
    </a>
  )
}
