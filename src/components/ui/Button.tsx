import type { AnchorHTMLAttributes, PointerEvent, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { buttonStyles } from './buttonStyles'

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'ghost'
  children: ReactNode
  icon?: boolean
}


const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Small magnetic pull toward a mouse pointer (never touch or reduced motion), set directly on the element — no re-render per move
const attract = (e: PointerEvent<HTMLAnchorElement>) => {
  if (e.pointerType !== 'mouse' || calm()) return
  const r = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - r.left - r.width / 2) * 0.16
  const y = (e.clientY - r.top - r.height / 2) * 0.25
  e.currentTarget.style.transform = `translate(${x}px, ${y}px)`
}
const release = (e: PointerEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.transform = ''
}

export function Button({ variant = 'primary', icon = true, className = '', children, onPointerMove, onPointerLeave, ...props }: ButtonProps) {
  // Only primary calls to action are magnetic
  const magnetic = variant === 'primary'
  return (
    <a
      className={`${buttonStyles(variant)} ${className}`}
      onPointerMove={(e) => {
        if (magnetic) attract(e)
        onPointerMove?.(e)
      }}
      onPointerLeave={(e) => {
        if (magnetic) release(e)
        onPointerLeave?.(e)
      }}
      {...props}
    >
      {children}
      {icon && (
        <ArrowRight aria-hidden className="size-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100" />
      )}
    </a>
  )
}
