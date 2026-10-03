import type { CarConfig } from '../state/carConfig'
import { apiRequest } from './apiClient'

export type SavedConfiguration = { id: number; reference: string; estimated_price: number }

/** POST /configurations — the server validates the options and computes the estimate */
export const saveConfiguration = ({ model, color, wheels, interior }: CarConfig) =>
  apiRequest<SavedConfiguration>('/configurations', {
    method: 'POST',
    body: { model: model.slug, exterior_color: color.id, wheels: wheels.id, interior: interior.id },
  })
