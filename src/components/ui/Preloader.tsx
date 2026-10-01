import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { finishIntro } from '../../state/intro'
import { Wordmark } from '../layout/Logo'

/** Never hold the page longer than this, whatever is still pending */
const MAX_WAIT = 3500

const windowLoaded = () =>
  new Promise<void>((resolve) => (document.readyState === 'complete' ? resolve() : window.addEventListener('load', () => resolve(), { once: true })))

/** Brand intro shown until fonts and the initial page assets are ready. Failures and slow assets never block. */
export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let alive = true
    let loaded = 0
    const tasks = [document.fonts?.ready ?? Promise.resolve(), windowLoaded()]
    const tick = () => alive && setProgress(++loaded / tasks.length)
    const all = Promise.all(tasks.map((t) => t.catch(() => undefined).then(tick)))
    const cap = new Promise((r) => setTimeout(r, MAX_WAIT))
    let hide: number | undefined
    Promise.race([all, cap]).then(() => {
      if (!alive) return
      setProgress(1)
      // Let the bar finish, then lift the curtain
      hide = window.setTimeout(() => {
        if (!alive) return
        setDone(true)
        finishIntro()
      }, 400)
    })
    return () => {
      alive = false
      window.clearTimeout(hide)
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-label="Loading experience"
        >
          <div className="flex flex-col items-center gap-7">
            {/* Left padding balances the trailing letter-spacing so the mark sits optically centred */}
            <Wordmark className="pl-[0.42em] text-xl md:text-2xl" />
            <div className="h-px w-40 overflow-hidden bg-line md:w-56" aria-hidden>
              <motion.div
                className="h-px bg-accent"
                initial={{ width: '8%' }}
                animate={{ width: `${Math.max(progress, 0.08) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="eyebrow">Loading experience...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
