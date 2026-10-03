import { useT } from '../../i18n'
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import { footerLinks } from '../../data/content'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { StaggerText } from '../ui/StaggerText'
import { Logo } from './Logo'

const year = new Date().getFullYear()

export function Footer() {
  const t = useT()
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line bg-carbon">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" aria-hidden />

      <div className="relative mx-auto max-w-[1440px] px-5 pt-24 pb-10 md:px-10 md:pt-36">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">{t('Private appointments')}</p>
            </Reveal>
            <StaggerText
              text={t('Your drive begins here.')}
              className="font-wide text-[clamp(2.25rem,6vw,5rem)] leading-[0.98] font-semibold tracking-[-0.02em] text-chrome uppercase"
            />
            <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
              <Button href="mailto:concierge@volterra.example?subject=Test%20drive%20request">{t('Request a test drive')}</Button>
              <Button href="/configure" variant="ghost">
                {t('Build yours')}
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="grid gap-5 text-sm text-steel">
            <a href="mailto:concierge@volterra.example" className="flex min-h-11 items-center gap-3 transition-colors hover:text-chrome md:min-h-0">
              <Mail className="size-4 text-accent" aria-hidden /> concierge@volterra.example
            </a>
            <a href="tel:+390000000000" className="flex min-h-11 items-center gap-3 transition-colors hover:text-chrome md:min-h-0">
              <Phone className="size-4 text-accent" aria-hidden /> +39 000 000 0000
            </a>
            <p className="flex items-center gap-3">
              <MapPin className="size-4 text-accent" aria-hidden /> {t('Atelier VOLTERRA, Modena')}
            </p>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-12 border-t border-line pt-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Logo className="text-lg" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel">{t('Precision engineered for those who refuse ordinary.')}</p>
          </div>

          <nav aria-label={t('Footer')} className="md:col-span-4">
            <p className="eyebrow mb-5">{t('Explore')}</p>
            <ul className="grid grid-cols-2 gap-x-8 md:gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="inline-flex min-h-11 items-center text-[0.75rem] font-medium tracking-[0.22em] text-silver uppercase transition-colors hover:text-chrome md:min-h-0">
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">{t('Follow')}</p>
            {/* Placeholders until real profiles exist: shown, but not links */}
            <ul className="space-y-3" aria-label={t('Social channels (coming soon)')}>
              {['Instagram', 'YouTube', 'LinkedIn'].map((name) => (
                <li key={name} className="text-[0.75rem] font-medium tracking-[0.22em] text-steel uppercase" title={t('Coming soon')}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-line pt-8 text-xs text-steel md:flex-row md:items-center md:justify-between">
          <p className="leading-relaxed text-steel/80">{t('© {year} VOLTERRA. A fictional marque — portfolio concept. Photography via Unsplash.', { year })}</p>
          <a href="#top" className="group inline-flex min-h-11 items-center gap-2 tracking-[0.18em] uppercase transition-colors hover:text-chrome">
            {t('Back to top')}
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}
