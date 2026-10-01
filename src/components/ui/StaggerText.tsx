import { motion, type Variants } from 'framer-motion'

type StaggerTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  /** Animate on mount instead of when scrolled into view */
  immediate?: boolean
  delay?: number
  by?: 'word' | 'char'
}

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({ transition: { staggerChildren: 0.035, delayChildren: delay } }),
}

const piece: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

/** Splits text into masked words/characters that rise in sequence. Screen readers get the plain string. */
export function StaggerText({ text, as = 'h2', className, immediate, delay = 0, by = 'word' }: StaggerTextProps) {
  const Tag = motion[as]
  const words = text.split(' ')
  const trigger = immediate
    ? { animate: 'visible' }
    : { whileInView: 'visible', viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <Tag className={className} aria-label={text} initial="hidden" custom={delay} variants={container} {...trigger}>
      {words.map((word, w) => (
        <span key={w} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          {by === 'word' ? (
            <motion.span className="inline-block" variants={piece}>
              {word}
            </motion.span>
          ) : (
            word.split('').map((char, c) => (
              <motion.span key={c} className="inline-block" variants={piece}>
                {char}
              </motion.span>
            ))
          )}
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}
