import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MOBILE_QUERY, useMediaQuery } from '../../hooks/useMediaQuery'
import { SmartImage } from './SmartImage'

type ParallaxImageProps = {
  src: string
  alt: string
  className?: string
  /** Vertical travel as a percentage of the frame height */
  strength?: number
  /** CSS object-position, to keep the subject in frame when cropped */
  focus?: string
}

/** Image that drifts inside its frame while scrolling and unveils with a clip-path wipe. */
export function ParallaxImage({ src, alt, className = '', strength = 12, focus }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // Gentler travel on phones; frame is overscanned by the same amount so images never distort or gap
  const travel = useMediaQuery(MOBILE_QUERY) ? strength / 2 : strength
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : [`-${travel}%`, `${travel}%`])

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden bg-graphite ${className}`}
      initial={{ clipPath: 'inset(18% 0% 18% 0%)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="absolute inset-x-0" style={{ y, top: `-${travel}%`, bottom: `-${travel}%` }}>
        {/* Settles from a slight push-in while the mask opens */}
        <motion.div
          className="size-full"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <SmartImage src={src} alt={alt} className="size-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.04]" style={focus ? { objectPosition: focus } : undefined} sizes="(min-width: 1024px) 60vw, 100vw" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
