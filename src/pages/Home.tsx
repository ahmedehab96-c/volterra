import { useT } from '../i18n'
import { CinematicBand } from '../components/ui/CinematicBand'
import { useTitle } from '../router'
import { Anatomy } from '../sections/Anatomy'
import { Configurator } from '../sections/Configurator'
import { Design } from '../sections/Design'
import { FinalCta } from '../sections/FinalCta'
import { Gallery } from '../sections/Gallery'
import { Hero } from '../sections/Hero'
import { Interior } from '../sections/Interior'
import { Models } from '../sections/Models'
import { Performance } from '../sections/Performance'
import { Technology } from '../sections/Technology'

export function Home() {
  const t = useT()
  useTitle(t('VOLTERRA — Drive The Impossible'), t('An immersive automotive experience combining performance, design, and interactive technology.'))
  return (
    <>
      <Hero />
      {/* Story: arrival → light → design → performance → anatomy → technology → interior → configure */}
      <CinematicBand
        image="/assets/images/exterior/coupe-country-road-sunset.webp"
        alt="White sports car on an open country road at sunset"
        eyebrow={t('Grand touring')}
        title={t('Made for the long way round')}
        body={t('Every road is a test track when the car was built to read it.')}
        focus="50% 60%"
      />
      <CinematicBand
        id="light"
        image="/assets/images/details/headlight-led.webp"
        alt="Close-up of a sharp LED headlight on a white supercar"
        eyebrow={t('Lighting')}
        title={t('Light without compromise')}
        body={t('Adaptive illumination engineered for every road.')}
        focus="62% 55%"
        sweep
      />
      <Design />
      <Performance />
      <Anatomy />
      <Technology />
      <Interior />
      <CinematicBand
        image="/assets/images/exterior/sedan-highway-dusk.webp"
        alt="Black four-door sports car accelerating on a highway"
        eyebrow={t('Your build')}
        title={t('Built once. For you.')}
        focus="50% 55%"
      />
      <Configurator />
      <Gallery />
      <Models />
      <FinalCta />
    </>
  )
}
