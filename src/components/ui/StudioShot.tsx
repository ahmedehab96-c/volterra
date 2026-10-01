import { AnimatePresence, motion } from 'framer-motion'
import type { PointerEvent } from 'react'
import { SmartImage } from './SmartImage'

type StudioShotProps = {
  src: string
  alt: string
  className?: string
  priority?: boolean
  /** Fill the parent frame (configurator previews) instead of a square showroom card */
  fill?: boolean
  /** Paint preview: degrees of hue rotation applied to the photo */
  hue?: number
}

const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Perspective tilt and a moving reflection that follow a mouse pointer, set directly on the element (no re-render)
const tilt = (e: PointerEvent<HTMLDivElement>) => {
  if (e.pointerType !== 'mouse' || calm()) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.transform = `perspective(1100px) rotateY(${(x - 0.5) * 12}deg) rotateX(${(0.5 - y) * 9}deg) scale(1.02)`
  el.style.setProperty('--gx', `${x * 100}%`)
  el.style.setProperty('--gy', `${y * 100}%`)
  el.style.setProperty('--glare', '1')
}
const settle = (e: PointerEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = ''
  e.currentTarget.style.setProperty('--glare', '0')
}

/** Studio car photograph in a showroom card that tilts in 3D under the pointer. Crossfades between images, eases between paints. */
export function StudioShot({ src, alt, className = '', priority, fill, hue = 0 }: StudioShotProps) {
  const image = (
    <AnimatePresence initial={false}>
      <motion.div
        key={src}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <SmartImage
          src={src}
          alt={alt}
          priority={priority}
          grade={false}
          className="size-full object-cover"
          style={{ filter: hue ? `hue-rotate(${hue}deg)` : undefined, transition: 'filter 0.8s ease, opacity 0.7s ease-out' }}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </motion.div>
    </AnimatePresence>
  )

  if (fill) return <div className={`pointer-events-none ${className}`}>{image}</div>

  return (
    <div className={`grid place-items-center [container-type:size] ${className}`}>
      {/* Largest square that fits, matching the square studio photos; floats gently when idle */}
      <div className="size-[min(100cqw,100cqh)] animate-float">
        <div
          onPointerMove={tilt}
          onPointerLeave={settle}
          className="relative size-full overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-transform duration-700 ease-luxe [--glare:0]"
        >
          {image}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(10,10,11,0.4)]" aria-hidden />
          {/* Reflection that tracks the pointer */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[var(--glare)] mix-blend-soft-light transition-opacity duration-500 [background:radial-gradient(40%_40%_at_var(--gx,50%)_var(--gy,30%),rgba(255,255,255,0.55),transparent)]"
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}
