import { useEffect, useState } from 'react'

/** Static hosts and the dev server answer missing files with index.html, so check the content type too */
const probes = new Map<string, Promise<boolean>>()
const exists = (url: string) => {
  if (!probes.has(url))
    probes.set(
      url,
      fetch(url, { method: 'HEAD' })
        .then((r) => r.ok && !(r.headers.get('content-type') ?? '').includes('text/html'))
        .catch(() => false),
    )
  return probes.get(url)!
}

/**
 * 3D asset for a model: the API's model_3d when set, otherwise a local file
 * (/models/{slug}.glb, then the shared /models/car.glb). Null means "use the photo".
 */
export function useModel3D(slug: string, apiSrc?: string | null) {
  const [found, setFound] = useState<{ slug: string; src: string | null } | null>(null)

  useEffect(() => {
    if (apiSrc) return
    let alive = true
    const candidates = [`/models/${slug}.glb`, '/models/car.glb']
    ;(async () => {
      for (const url of candidates) if (await exists(url)) return url
      return null
    })().then((src) => alive && setFound({ slug, src }))
    return () => {
      alive = false
    }
  }, [slug, apiSrc])

  return apiSrc ?? (found?.slug === slug ? found.src : null)
}
