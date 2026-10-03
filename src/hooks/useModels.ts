import { useEffect, useState } from 'react'
import { apiEnabled } from '../api/apiClient'
import { fetchModel, fetchModels } from '../api/modelsApi'
import { models as localModels, type Model } from '../data/content'

/** loading: API request in flight · ready: API data · offline: local data (API unset or unreachable) */
export type DataStatus = 'loading' | 'ready' | 'offline'

let cached: Model[] | null = null

/** The model range: renders local data at once, then swaps in API data when it arrives. Never leaves the page empty. */
export function useModels() {
  const [state, setState] = useState<{ models: Model[]; status: DataStatus }>(() =>
    cached ? { models: cached, status: 'ready' } : { models: localModels, status: apiEnabled ? 'loading' : 'offline' },
  )

  useEffect(() => {
    if (cached || !apiEnabled) return
    const controller = new AbortController()
    fetchModels(controller.signal)
      .then((models) => {
        cached = models
        setState({ models, status: 'ready' })
      })
      .catch(() => !controller.signal.aborted && setState({ models: localModels, status: 'offline' }))
    return () => controller.abort()
  }, [])

  return state
}

/** One model by slug, with the same local-first fallback. `model` is null only when neither source knows it. */
export function useModel(slug: string) {
  const local = localModels.find((m) => m.slug === slug) ?? null
  const [state, setState] = useState<{ slug: string; model: Model | null; status: DataStatus }>({
    slug,
    model: local,
    status: apiEnabled ? 'loading' : 'offline',
  })

  useEffect(() => {
    if (!apiEnabled) return
    const controller = new AbortController()
    fetchModel(slug, controller.signal)
      .then((model) => setState({ slug, model: model ?? local, status: 'ready' }))
      .catch(() => !controller.signal.aborted && setState({ slug, model: local, status: 'offline' }))
    return () => controller.abort()
  }, [slug, local])

  // A new slug shows its local data immediately while its request runs
  return state.slug === slug ? state : { slug, model: local, status: (apiEnabled ? 'loading' : 'offline') as DataStatus }
}
