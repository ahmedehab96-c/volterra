import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type CounterProps = { value: number; decimals?: number; duration?: number; className?: string }

/** Counts up from zero the first time it scrolls into view. */
export function Counter({ value, decimals = 0, duration = 2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setDisplay })
    return () => controls.stop()
  }, [inView, reduce, value, duration])

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {(reduce ? value : display).toFixed(decimals)}
    </span>
  )
}
