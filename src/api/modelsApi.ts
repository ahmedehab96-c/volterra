import { models as localModels, type Model } from '../data/content'
import { apiRequest } from './apiClient'

type ApiModel = {
  id: number
  slug: string
  name: string
  tagline: string | null
  horsepower: number
  torque: number
  acceleration: number
  top_speed: number
  price: number
  description: string
  hero_image: string
  model_3d: string | null
  gallery: { exterior: string[]; interior: string[]; detail: string[] }
}

// API figures and copy win; presentation-only data (notes, highlights, paint hue) stays local
const merge = (local: Model, api: ApiModel): Model => ({
  ...local,
  name: api.name.replace(/^VOLTERRA\s+/i, ''),
  tagline: api.tagline ?? local.tagline,
  description: api.description,
  price: api.price,
  image: api.hero_image || local.image,
  performance: { horsepower: api.horsepower, torque: api.torque, topSpeed: api.top_speed, acceleration: api.acceleration },
  apiId: api.id,
  model3d: api.model_3d ?? local.model3d,
  gallery: api.gallery,
})

/** GET /models — only models the site can present are returned */
export async function fetchModels(signal?: AbortSignal): Promise<Model[]> {
  const data = await apiRequest<ApiModel[]>('/models', { signal })
  return data.flatMap((api) => {
    const local = localModels.find((m) => m.slug === api.slug)
    return local ? [merge(local, api)] : []
  })
}

/** GET /models/{slug} */
export async function fetchModel(slug: string, signal?: AbortSignal): Promise<Model | null> {
  const api = await apiRequest<ApiModel>(`/models/${encodeURIComponent(slug)}`, { signal })
  const local = localModels.find((m) => m.slug === api.slug)
  return local ? merge(local, api) : null
}
