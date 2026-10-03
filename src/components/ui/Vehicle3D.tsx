import { useT } from '../../i18n'
import { useReducedMotion } from 'framer-motion'
import { Move3d } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MOBILE_QUERY, useMediaQuery } from '../../hooks/useMediaQuery'
import { LoadingLine } from './LoadingLine'

type Vehicle3DProps = {
  /** .glb/.gltf URL or path */
  src: string
  poster: string
  alt: string
  /** Shown instead if the viewer or the model fails to load */
  fallback: ReactNode
  className?: string
  /** Paint preview: degrees of hue rotation, as on the photos */
  hue?: number
}

/**
 * Interactive 3D vehicle via <model-viewer> (downloaded only when a 3D model exists): drag or touch-drag
 * orbits 360° horizontally and vertically, idle auto-rotation, studio environment lighting and soft shadows.
 * Any failure falls back to the given content.
 */
export function Vehicle3D({ src, poster, alt, fallback, className = '', hue = 0 }: Vehicle3DProps) {
  const t = useT()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const mobile = useMediaQuery(MOBILE_QUERY)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [failedSrc, setFailedSrc] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    let alive = true
    import('@google/model-viewer')
      .then(() => alive && setState('ready'))
      .catch(() => alive && setState('failed'))
    return () => {
      alive = false
    }
  }, [])

  // A missing or broken file reports an error event; the first drag hides the hint
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fail = () => setFailedSrc(src)
    const interact = (e: Event) => (e as CustomEvent<{ source?: string }>).detail?.source === 'user-interaction' && setTouched(true)
    el.addEventListener('error', fail)
    el.addEventListener('camera-change', interact)
    return () => {
      el.removeEventListener('error', fail)
      el.removeEventListener('camera-change', interact)
    }
  }, [state, src])

  if (state === 'failed' || failedSrc === src) return <>{fallback}</>

  return (
    <div className={`relative ${className}`}>
      {state === 'loading' ? (
        <div className="grid size-full place-items-center">
          <LoadingLine label={t('Loading 3D')} />
        </div>
      ) : (
        <>
          <model-viewer
            ref={ref}
            src={src}
            poster={poster}
            alt={alt}
            camera-controls=""
            disable-zoom=""
            touch-action="none"
            interaction-prompt="none"
            min-camera-orbit="auto 5deg auto"
            max-camera-orbit="auto 175deg auto"
            {...(reduce ? {} : { 'auto-rotate': '', 'auto-rotate-delay': '2000', 'rotation-per-second': '14deg' })}
            environment-image="neutral"
            exposure="1.05"
            shadow-intensity={mobile ? '0' : '1'}
            shadow-softness="0.9"
            style={{ width: '100%', height: '100%', background: 'transparent', cursor: 'grab', filter: hue ? `hue-rotate(${hue}deg)` : undefined, transition: 'filter 0.8s ease' }}
          />
          <p
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 text-[0.6875rem] tracking-[0.2em] text-silver uppercase transition-opacity duration-700 ${touched ? 'opacity-0' : 'opacity-100'}`}
          >
            <Move3d className="size-3.5 text-accent" />
            {t('Drag to explore')}
          </p>
        </>
      )}
    </div>
  )
}
