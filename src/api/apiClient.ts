/** Thin fetch wrapper for the VOLTERRA API. The base URL comes only from VITE_API_URL. */
const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '')

/** Without VITE_API_URL the site runs on local mock data (e.g. the static demo). */
export const apiEnabled = Boolean(BASE)

const TIMEOUT_MS = 8000

export class ApiError extends Error {
  /** 0 when the API is unreachable or not configured */
  readonly status: number
  /** Field errors from a 422 response: { field: [messages] } */
  readonly errors: Record<string, string[]>

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export type Envelope<T> = { success: boolean; data?: T; meta?: unknown; message?: string; errors?: Record<string, string[]> }

type RequestInit = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
  /** Send the admin bearer token (admin calls only; public requests never carry it) */
  auth?: boolean
}

let authToken: string | null = null
export const setAuthToken = (token: string | null) => {
  authToken = token
}

/** Whole response envelope (for `meta` on paginated lists) */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<Envelope<T>> {
  if (!BASE) throw new ApiError('API not configured', 0)
  const timeout = AbortSignal.timeout(TIMEOUT_MS)
  const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout

  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        // FormData (uploads) sets its own multipart boundary
        ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(init.auth && authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: init.body instanceof FormData ? init.body : init.body ? JSON.stringify(init.body) : undefined,
      signal,
    })
  } catch {
    throw new ApiError('API unreachable', 0)
  }

  const json = (await res.json().catch(() => ({}))) as Envelope<T>
  if (!res.ok || json.success === false) throw new ApiError(json.message ?? 'Request failed', res.status, json.errors)
  return json
}

/** The `data` of a successful response */
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  return (await apiFetch<T>(path, init)).data as T
}
