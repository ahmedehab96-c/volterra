import { useEffect, useState, useSyncExternalStore } from 'react'
import { apiEnabled } from '../api/apiClient'
import { fetchModels } from '../api/modelsApi'
import { calculatePrice, fetchOptions, type ApiOption, type OptionType, type Quote } from '../api/pricingApi'
import type { Model } from '../data/content'
import { configTotal, type CarConfig } from '../state/carConfig'

/**
 * Server catalog for pricing: option ids/prices/availability and model ids, loaded once per visit.
 * Until it loads (or when the API is offline) everything falls back to the local data.
 */
type Catalog = { options: Map<string, ApiOption>; models: Map<string, Model> }

let catalog: Catalog | null = null
let started = false
const listeners = new Set<() => void>()
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

function load() {
  if (started || !apiEnabled) return
  started = true
  Promise.all([fetchOptions(), fetchModels()])
    .then(([options, models]) => {
      catalog = {
        options: new Map(options.map((o) => [`${o.type}:${o.code}`, o])),
        models: new Map(models.map((m) => [m.slug, m])),
      }
      listeners.forEach((l) => l())
    })
    .catch(() => {
      started = false // offline: retry on a later mount
    })
}

export function useCatalog() {
  useEffect(load, [])
  const current = useSyncExternalStore(subscribe, () => catalog)
  return {
    ready: Boolean(current),
    /** Server price of an option, or the local one */
    optionPrice: (type: OptionType, code: string, fallback: number) => current?.options.get(`${type}:${code}`)?.price ?? fallback,
    /** False only when the server says the option is not offered (inactive or removed) */
    isAvailable: (type: OptionType, code: string) => !current || current.options.has(`${type}:${code}`),
    /** Server version of a model (price, 3D asset, gallery) */
    model: (slug: string) => current?.models.get(slug),
  }
}

/** Estimated price for a configuration: the server's quote when available, the local estimate otherwise. */
export function useEstimate(config: CarConfig): { price: number; quote: Quote | null } {
  useEffect(load, [])
  const current = useSyncExternalStore(subscribe, () => catalog)
  const [result, setResult] = useState<{ key: string; quote: Quote } | null>(null)

  const ids = current && {
    model_id: current.models.get(config.model.slug)?.apiId,
    exterior_color_id: current.options.get(`exterior_color:${config.color.id}`)?.id,
    wheel_id: current.options.get(`wheels:${config.wheels.id}`)?.id,
    interior_id: current.options.get(`interior:${config.interior.id}`)?.id,
  }
  const key = ids ? JSON.stringify(ids) : ''
  const complete = ids && Object.values(ids).every((v) => typeof v === 'number')

  useEffect(() => {
    if (!complete) return
    const controller = new AbortController()
    // Short debounce: quick option changes produce one request
    const timer = window.setTimeout(() => {
      calculatePrice(JSON.parse(key), controller.signal)
        .then((quote) => setResult({ key, quote }))
        .catch(() => undefined) // keep showing the local estimate
    }, 150)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [key, complete])

  const quote = result?.key === key ? result.quote : null
  return { price: quote?.estimated_price ?? configTotal(config), quote }
}
