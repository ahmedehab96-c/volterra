import { motion, MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { LoadingLine } from './components/ui/LoadingLine'
import { Preloader } from './components/ui/Preloader'
import { Button } from './components/ui/Button'
import { buttonStyles } from './components/ui/buttonStyles'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { interceptLinks, usePath, useRouteScroll } from './router'
import { trackPageView } from './utils/analytics'

// Secondary pages load on demand; the home page ships in the main bundle
const ModelsPage = lazy(() => import('./pages/ModelsPage').then((m) => ({ default: m.ModelsPage })))
const ModelDetail = lazy(() => import('./pages/ModelDetail').then((m) => ({ default: m.ModelDetail })))
const ConfigurePage = lazy(() => import('./pages/ConfigurePage').then((m) => ({ default: m.ConfigurePage })))

function Route({ path }: { path: string }) {
  if (path === '/') return <Home />
  if (path === '/models') return <ModelsPage />
  if (path === '/configure') return <ConfigurePage />
  const model = path.match(/^\/models\/([\w-]+)$/)
  if (model) return <ModelDetail slug={model[1]} />
  return <NotFound />
}

export default function App() {
  const path = usePath()
  useRouteScroll(path)

  useEffect(() => {
    trackPageView(path)
  }, [path])

  useEffect(() => {
    document.addEventListener('click', interceptLinks)
    return () => document.removeEventListener('click', interceptLinks)
  }, [])

  return (
    // "user" disables transform/layout animations when prefers-reduced-motion is set
    <MotionConfig reducedMotion="user">
      <Preloader />
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-chrome px-5 py-3 text-sm text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <ErrorBoundary key={path} fallback={<RouteError />}>
          <Suspense
            fallback={
              <div className="grid min-h-[100svh] place-items-center bg-ink">
                <LoadingLine />
              </div>
            }
          >
            {/* Soft fade between routes */}
            <motion.div key={path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
              <Route path={path} />
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </MotionConfig>
  )
}

/** Friendly page-level fallback, e.g. when a page fails to download on a flaky connection */
function RouteError() {
  return (
    <section id="top" className="grid min-h-[80svh] place-items-center bg-ink px-5 pt-24 text-center">
      <div>
        <p className="eyebrow">Connection interrupted</p>
        <h1 className="mt-6 font-wide text-[clamp(1.75rem,5vw,3.5rem)] leading-none font-bold tracking-[-0.03em] text-chrome uppercase">This page didn’t load</h1>
        <p className="mx-auto mt-6 max-w-sm text-steel">Please check your connection and try again.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => location.reload()}
            className={buttonStyles()}
          >
            Try again
          </button>
          <Button href="/" variant="ghost" icon={false}>
            Home
          </Button>
        </div>
      </div>
    </section>
  )
}
