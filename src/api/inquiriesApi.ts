import type { CarConfig } from '../state/carConfig'
import { apiRequest } from './apiClient'

export type InquiryContact = { name: string; email: string; phone: string; country: string; message?: string }
export type SavedInquiry = { id: number; reference: string; estimated_price: number | null }

/** POST /inquiries — contact details plus the selected model and configuration */
export const submitInquiry = (contact: InquiryContact, { model, color, wheels, interior }: CarConfig) =>
  apiRequest<SavedInquiry>('/inquiries', {
    method: 'POST',
    body: { ...contact, model: model.slug, exterior_color: color.id, wheels: wheels.id, interior: interior.id },
  })
