import { useSyncExternalStore } from 'react'
import { ar } from './ar'

/** Tiny static i18n: English strings are the keys, Arabic lives in ./ar. Arabic is the default. */
export type Lang = 'ar' | 'en'

const KEY = 'volterra-lang'
const listeners = new Set<() => void>()

const stored = (): Lang => {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'ar'
  } catch {
    return 'ar'
  }
}

let lang: Lang = stored()

const apply = () => {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}
apply()

export function setLang(next: Lang) {
  if (next === lang) return
  lang = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    // storage unavailable: the choice lasts for this visit
  }
  apply()
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useLang = () => useSyncExternalStore(subscribe, () => lang)

/** Translate an English UI string; `{name}` placeholders are filled from `vars`. Untranslated text stays English. */
export function translate(text: string, vars?: Record<string, string | number>, to: Lang = lang) {
  let out = text
  if (to === 'ar') {
    const hit = ar[text] ?? arUnits(text)
    if (hit) out = hit
    else if (import.meta.env.DEV && text.trim()) ((window as unknown as { __missingAr?: Set<string> }).__missingAr ??= new Set()).add(text)
  }
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v))
  return out
}

// Measurements built at runtime ("1,020 HP", "310 km/h", "2.1 s") get Arabic units
const UNITS: [RegExp, string][] = [
  [/(\d)\s?HP\b/gi, '$1 حصان'],
  [/(\d)\s?km\/h\b/gi, '$1 كم/س'],
  [/(\d)\s?kg\b/gi, '$1 كغ'],
  [/(\d)\s?km\b/gi, '$1 كم'],
  [/(\d)\s?s$/, '$1 ث'],
]
function arUnits(text: string) {
  if (!/^[\d.,\s]+[a-z/]+$/i.test(text)) return undefined
  const out = UNITS.reduce((acc, [re, to]) => acc.replace(re, to), text)
  return out === text ? undefined : out
}

export type T = (text: string, vars?: Record<string, string | number>) => string

/** Re-renders the component when the language changes */
export function useT(): T {
  const current = useLang()
  return (text, vars) => translate(text, vars, current)
}
