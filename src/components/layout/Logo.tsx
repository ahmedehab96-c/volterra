/** The VOLTERRA wordmark: wide geometric caps, generous tracking, nothing else. */
export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`font-wide font-semibold tracking-[0.42em] text-chrome ${className}`}>VOLTERRA</span>
}

/** Wordmark as the home link (navbar, mobile menu, footer). */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="/" aria-label="VOLTERRA — home" className={`inline-flex min-h-11 items-center text-[0.95rem] ${className}`}>
      <Wordmark />
    </a>
  )
}
