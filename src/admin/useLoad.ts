import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/apiClient'

/** Human message for an API failure; never a stack trace */
export function errorMessage(e: unknown) {
  if (e instanceof ApiError) {
    if (e.status === 0) return 'Can’t reach the API. Check that the server is running and VITE_API_URL is set.'
    if (e.status === 403) return 'Your account doesn’t have access to this.'
    return e.message
  }
  return 'Something went wrong. Please try again.'
}

/** First error per field from a 422 response */
export const fieldErrors = (e: unknown): Record<string, string> =>
  e instanceof ApiError ? Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v[0]])) : {}

/** Loads data for a view; `reload` refetches while keeping the current data on screen. */
export function useLoad<T>(load: () => Promise<T>) {
  const [state, setState] = useState<{ data?: T; error?: string; loading: boolean }>({ loading: true })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let alive = true
    load()
      .then((data) => alive && setState({ data, loading: false }))
      .catch((e) => alive && setState((s) => ({ ...s, error: errorMessage(e), loading: false })))
    return () => {
      alive = false
    }
  }, [load, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const setData = useCallback((data: T) => setState({ data, loading: false }), [])
  return { ...state, reload, setData }
}
