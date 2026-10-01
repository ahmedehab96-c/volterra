import { motion, type HTMLMotionProps } from 'framer-motion'

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number }

/** Fades and lifts its children into view once, when scrolled into the viewport. */
export function Reveal({ delay = 0, y = 28, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
