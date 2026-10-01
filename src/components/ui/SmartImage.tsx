import { useState, type ImgHTMLAttributes } from 'react'
import { ImageOff } from 'lucide-react'
import { imageMeta } from '../../data/images'

type SmartImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Above-the-fold images load eagerly with high priority */
  priority?: boolean
  /** Apply the house photo grade (off where colour accuracy matters, e.g. paint swatches) */
  grade?: boolean
}

/** <img> with lazy loading by default and a graceful fallback when the file can't load. */
export function SmartImage({ priority, grade = true, className = '', alt = '', onError, onLoad, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false)
  // Fades in once decoded, over the frame's graphite placeholder; cached images show at once
  const [loaded, setLoaded] = useState(false)
  // Known local images get intrinsic dimensions (no layout shift) and a 960w variant for small screens
  const meta = typeof props.src === 'string' ? imageMeta[props.src] : undefined
  const srcSet = meta?.[2] ? `${props.src!.replace(/\.webp$/, `-${meta[2]}.webp`)} ${meta[2]}w, ${props.src} ${meta[0]}w` : undefined

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-graphite via-carbon to-ink text-steel ${className}`}
      >
        <ImageOff className="size-6 opacity-50" aria-hidden />
      </div>
    )
  }

  return (
    <img
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      width={meta?.[0]}
      height={meta?.[1]}
      srcSet={srcSet}
      sizes={srcSet ? '100vw' : undefined}
      ref={(el) => {
        if (el?.complete && el.naturalWidth && !loaded) setLoaded(true)
      }}
      className={`transition-opacity duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'} ${grade ? 'photo-grade' : ''} ${className}`}
      onLoad={(e) => {
        setLoaded(true)
        onLoad?.(e)
      }}
      onError={(e) => {
        setFailed(true)
        onError?.(e)
      }}
      {...props}
    />
  )
}
