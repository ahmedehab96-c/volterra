import { apiRequest } from './apiClient'

export type OptionType = 'exterior_color' | 'wheels' | 'interior'
export type ApiOption = { id: number; type: OptionType; code: string; name: string; price: number }
export type Quote = { base_price: number; options_total: number; estimated_price: number }

/** GET /options — active configurator options with their prices */
export const fetchOptions = (signal?: AbortSignal) => apiRequest<ApiOption[]>('/options', { signal })

/** POST /configurations/calculate — the server is the source of truth for prices */
export const calculatePrice = (ids: { model_id: number; exterior_color_id: number; wheel_id: number; interior_id: number }, signal?: AbortSignal) =>
  apiRequest<Quote>('/configurations/calculate', { method: 'POST', body: ids, signal })
