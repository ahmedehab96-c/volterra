import { motion, useReducedMotion } from 'framer-motion'

/** Thin travelling accent line with a label: the one loading indicator used across the site. */
export function LoadingLine({ label = 'Loading' }: { label?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-col items-center gap-4" role="status">
      <div className="h-px w-32 overflow-hidden bg-line" aria-hidden>
        <motion.div
          className="h-px w-1/3 bg-accent"
          animate={reduce ? undefined : { x: ['-100%', '300%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <span className="eyebrow">{label}</span>
    </div>
  )
}
