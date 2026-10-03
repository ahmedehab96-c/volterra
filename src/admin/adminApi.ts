import { ApiError, apiFetch, setAuthToken } from '../api/apiClient'

/** Admin API: Sanctum bearer token kept in localStorage for this browser only. */

export type Role = 'admin' | 'editor'
export type AdminUser = { id: number; name: string; email: string; role: Role }
export type Status = 'active' | 'inactive'
export type AdminModel = {
  id: number
  name: string
  slug: string
  tagline: string | null
  description: string
  horsepower: number
  torque: number
  acceleration: number
  top_speed: number
  base_price: number
  hero_image: string
  model_3d: string | null
  status: Status
}
export type ModelInput = Omit<AdminModel, 'id'>
export type OptionType = 'exterior_color' | 'wheels' | 'interior'
export type AdminOption = { id: number; type: OptionType; code: string; name: string; price: number; status: Status }
export type OptionInput = Omit<AdminOption, 'id'>
export type InquiryStatus = 'new' | 'contacted' | 'closed'
export type AdminInquiry = {
  id: number
  reference: string
  name: string
  email: string
  phone: string
  country: string
  model: string
  exterior_color: string
  wheels: string
  interior: string
  estimated_price: number | null
  message: string | null
  status: InquiryStatus
  internal_notes: string | null
  model_name?: string | null
  configuration?: { exterior_color: string; wheels: string; interior: string }
  created_at: string
}
export type PageMeta = { current_page: number; last_page: number; total: number }
export type Stats = { total_models: number; active_models: number; total_inquiries: number; new_inquiries: number }

const KEY = 'volterra-admin-token'
const readToken = () => {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}
const saveToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(KEY, token)
    else localStorage.removeItem(KEY)
  } catch {
    // storage unavailable: the session lasts for this page only
  }
  setAuthToken(token)
}
setAuthToken(readToken())

export const hasSession = () => Boolean(readToken())

let onUnauthorized = () => {}
/** Called when the API rejects the token (expired or revoked) */
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler
}

async function call<T>(path: string, init: Parameters<typeof apiFetch>[1] = {}) {
  try {
    return await apiFetch<T>(path, { ...init, auth: true })
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      saveToken(null)
      onUnauthorized()
    }
    throw e
  }
}
const data = async <T>(path: string, init?: Parameters<typeof apiFetch>[1]) => (await call<T>(path, init)).data as T

// Auth
export async function login(email: string, password: string) {
  const res = await apiFetch<{ token: string; user: AdminUser }>('/login', { method: 'POST', body: { email, password } })
  saveToken(res.data!.token)
  return res.data!.user
}
export async function logout() {
  try {
    await call('/logout', { method: 'POST' })
  } finally {
    saveToken(null)
  }
}
export const me = () => data<AdminUser>('/user')

// Dashboard
export const getStats = () => data<Stats>('/admin/dashboard')

// Models
export const listModels = () => data<AdminModel[]>('/admin/models')
export const createModel = (input: ModelInput) => data<AdminModel>('/admin/models', { method: 'POST', body: input })
export const updateModel = (id: number, input: Partial<ModelInput>) => data<AdminModel>(`/admin/models/${id}`, { method: 'PUT', body: input })
export const deleteModel = (id: number) => call(`/admin/models/${id}`, { method: 'DELETE' })

// Configuration options
export const listOptions = (type: OptionType) => data<AdminOption[]>(`/admin/options?type=${type}`)
export const createOption = (input: OptionInput) => data<AdminOption>('/admin/options', { method: 'POST', body: input })
export const updateOption = (id: number, input: Partial<OptionInput>) => data<AdminOption>(`/admin/options/${id}`, { method: 'PUT', body: input })
export const deleteOption = (id: number) => call(`/admin/options/${id}`, { method: 'DELETE' })

// Inquiries
export async function listInquiries(params: { q?: string; status?: string; model?: string; page?: number }) {
  const query = new URLSearchParams(Object.entries(params).flatMap(([k, v]) => (v ? [[k, String(v)]] : [])))
  const res = await call<AdminInquiry[]>(`/admin/inquiries?${query}`)
  return { items: res.data ?? [], meta: res.meta as PageMeta }
}
export const getInquiry = (id: number) => data<AdminInquiry>(`/admin/inquiries/${id}`)
export const updateInquiry = (id: number, changes: { status?: InquiryStatus; internal_notes?: string | null }) =>
  data<AdminInquiry>(`/admin/inquiries/${id}`, { method: 'PATCH', body: changes })

// Gallery images
export type ImageType = 'hero' | 'exterior' | 'interior' | 'detail'
export type ModelImage = { id: number; type: ImageType; url: string; sort_order: number }
export const listImages = (modelId: number) => data<ModelImage[]>(`/admin/models/${modelId}/images`)
export function uploadImage(modelId: number, type: ImageType, file: File) {
  const body = new FormData()
  body.append('type', type)
  body.append('image', file)
  return data<ModelImage>(`/admin/models/${modelId}/images`, { method: 'POST', body })
}
export const reorderImages = (modelId: number, ids: number[]) =>
  data<ModelImage[]>(`/admin/models/${modelId}/images/order`, { method: 'PUT', body: { ids } })
export const deleteImage = (id: number) => call(`/admin/images/${id}`, { method: 'DELETE' })
