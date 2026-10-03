import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react'

/** Minimal History API router: plain <a href> links keep working, same-origin clicks become client navigations. */

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

/** Current pathname without a trailing slash */
const getPath = () => location.pathname.replace(/\/+$/, '') || '/'

export const usePath = () => useSyncExternalStore(subscribe, getPath)

export function navigate(to: string, { replace = false } = {}) {
  if (replace) history.replaceState(null, '', to)
  else history.pushState(null, '', to)
  emit()
}

/** Document-level click handler: routes same-origin links, leaves in-page anchors, new tabs and mailto/tel alone. */
export function interceptLinks(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = (e.target as Element | null)?.closest?.('a')
  if (!a || a.target || a.hasAttribute('download')) return
  const url = new URL(a.href, location.href)
  if (url.origin !== location.origin) return
  if (url.pathname === location.pathname && url.search === location.search) {
    if (url.hash) return // native in-page anchor
    e.preventDefault()
    window.scrollTo({ top: 0 })
    return
  }
  e.preventDefault()
  navigate(url.pathname + url.search + url.hash)
}

/** After a route change: jump to the hash target (or the top) and move focus to the new content. */
export function useRouteScroll(path: string) {
  const first = useRef(true)
  useLayoutEffect(() => {
    const initial = first.current
    first.current = false
    if (initial && !location.hash) return
    if (!initial) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('main')?.focus({ preventScroll: true })
    }
    // Lazy pages mount a few frames later, so look for the hash target for up to ~1s
    let frame = 0
    let tries = 0
    const find = () => {
      const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (el) el.scrollIntoView({ behavior: 'instant' })
      else if (location.hash && tries++ < 60) frame = requestAnimationFrame(find)
    }
    frame = requestAnimationFrame(find)
    return () => cancelAnimationFrame(frame)
  }, [path])
}

const setMeta = (selector: string, content: string) => document.querySelector(selector)?.setAttribute('content', content)

/** Per-page title and description, mirrored into the Open Graph / Twitter tags for crawlers that run JavaScript */
export function useTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[name="twitter:title"]', title)
    if (!description) return
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[name="twitter:description"]', description)
  }, [title, description])
}
