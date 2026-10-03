import { setLang, useLang, useT } from '../../i18n'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navLinks } from '../../data/content'
import { usePath } from '../../router'
import { AudioToggle } from '../ui/AudioToggle'
import { buttonStyles } from '../ui/buttonStyles'
import { Logo } from './Logo'

export function Navbar() {
  const t = useT()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const path = usePath()

  // Pages match by route; Design and Performance by the home section in view
  const isActive = (href: string) =>
    href === '/'
      ? path === '/' && !navLinks.some((l) => l.href === `/${current}`)
      : href.startsWith('/#')
        ? path === '/' && current === href.slice(1)
        : path === href || path.startsWith(`${href}/`)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  // Scroll spy: whichever section crosses the middle of the viewport is current
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -54% 0px' },
    )
    // Wait a frame so a newly routed page has mounted its sections
    const frame = requestAnimationFrame(() => document.querySelectorAll('main section[id]').forEach((el) => io.observe(el)))
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [path])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled && !open ? 'border-b border-white/5 bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-10" aria-label={t('Main')}>
        <Logo className="relative z-10" />

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => {
            const on = isActive(link.href)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={on ? 'page' : undefined}
                  className={`group relative py-2 text-[0.6875rem] font-medium tracking-[0.22em] uppercase transition-colors duration-500 hover:text-chrome ${on ? 'text-chrome' : 'text-silver'}`}
                >
                  {t(link.label)}
                  <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-luxe group-hover:scale-x-100 ${on ? 'scale-x-100' : 'scale-x-0'}`} />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <LangToggle />
          <AudioToggle />
          <a
            href="/configure#request"
            className="hidden h-10 items-center rounded-full border border-white/15 px-5 text-[0.6875rem] font-medium tracking-[0.22em] text-chrome uppercase transition-colors hover:border-white/50 hover:bg-white/5 sm:inline-flex"
          >
            {t('Enquire')}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 grid size-10 place-items-center rounded-full text-chrome lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 flex flex-col justify-between bg-ink/95 px-5 pt-28 pb-10 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="space-y-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-baseline gap-4 py-2 font-wide text-3xl font-semibold uppercase transition-colors ${isActive(link.href) ? 'text-chrome' : 'text-chrome/55 hover:text-chrome'}`}
                  >
                    <span className={`font-sans text-xs font-normal ${isActive(link.href) ? 'text-accent' : 'text-steel'}`}>0{i + 1}</span>
                    {t(link.label)}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="/configure#request"
              onClick={() => setOpen(false)}
              className={`w-full ${buttonStyles()}`}
            >
              {t('Enquire')}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/** AR / EN switch; Arabic is the default */
function LangToggle() {
  const t = useT()
  const lang = useLang()
  return (
    <div role="group" aria-label={t('Language')} className="relative z-10 flex h-10 items-center rounded-full border border-white/15 p-1">
      {(['ar', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          aria-label={l === 'ar' ? t('Switch to Arabic') : t('Switch to English')}
          onClick={() => setLang(l)}
          className={`keep-tracking h-8 min-w-9 rounded-full px-2.5 text-[0.6875rem] font-medium tracking-[0.12em] transition-colors duration-300 ${lang === l ? 'bg-chrome text-ink' : 'text-steel hover:text-chrome'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
