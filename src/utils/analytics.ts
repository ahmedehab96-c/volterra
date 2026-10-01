/**
 * Optional analytics integration point. Nothing is sent until a provider is registered, e.g. for Google Analytics:
 *
 *   setAnalyticsProvider({
 *     page: (path) => window.gtag?.('event', 'page_view', { page_path: path }),
 *     event: (name, props) => window.gtag?.('event', name, props),
 *   })
 *
 * Keep any measurement ID in a VITE_-prefixed env variable, never hardcoded.
 */
export type AnalyticsProps = Record<string, string | number | boolean | undefined>

type Provider = {
  page: (path: string) => void
  event: (name: string, props?: AnalyticsProps) => void
}

let provider: Provider | null = null

export const setAnalyticsProvider = (p: Provider | null) => {
  provider = p
}

// Tracking must never break the site
const safely = (fn: () => void) => {
  try {
    fn()
  } catch {
    // ignore provider errors
  }
}

export const trackPageView = (path: string) => provider && safely(() => provider!.page(path))
export const trackEvent = (name: string, props?: AnalyticsProps) => provider && safely(() => provider!.event(name, props))
