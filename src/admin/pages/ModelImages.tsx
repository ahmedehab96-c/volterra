import { ArrowDown, ArrowUp, Trash2, Upload } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { deleteImage, listImages, reorderImages, uploadImage, type AdminModel, type ImageType, type ModelImage } from '../adminApi'
import { Btn, Modal, StateView } from '../ui'
import { errorMessage, fieldErrors, useLoad } from '../useLoad'

const types: { type: ImageType; label: string }[] = [
  { type: 'hero', label: 'Hero' },
  { type: 'exterior', label: 'Exterior' },
  { type: 'interior', label: 'Interior' },
  { type: 'detail', label: 'Details' },
]
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp']
const MAX_MB = 8

/** Upload, delete and reorder a model's gallery (simple up/down ordering) */
export function ModelImages({ model, onClose }: { model: AdminModel; onClose: () => void }) {
  const [type, setType] = useState<ImageType>('hero')
  const images = useLoad(useCallback(() => listImages(model.id), [model.id]))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const shown = (images.data ?? []).filter((i) => i.type === type)

  const run = (task: Promise<unknown>) => {
    setBusy(true)
    setError('')
    task
      .then(images.reload)
      .catch((e) => setError(fieldErrors(e).image ?? fieldErrors(e).type ?? errorMessage(e)))
      .finally(() => setBusy(false))
  }

  const upload = (file: File | undefined) => {
    if (!file) return
    if (!ACCEPT.includes(file.type)) return setError('Use a JPEG, PNG or WebP image.')
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Images can be up to ${MAX_MB} MB.`)
    run(uploadImage(model.id, type, file))
    if (input.current) input.current.value = ''
  }

  const move = (image: ModelImage, dir: -1 | 1) => {
    const ids = shown.map((i) => i.id)
    const from = ids.indexOf(image.id)
    const to = from + dir
    if (to < 0 || to >= ids.length) return
    ;[ids[from], ids[to]] = [ids[to], ids[from]]
    run(reorderImages(model.id, ids))
  }

  return (
    <Modal title={`${model.name} — images`} onClose={onClose} wide>
      <div role="tablist" aria-label="Image type" className="mb-4 flex gap-1 overflow-x-auto">
        {types.map((t) => (
          <button
            key={t.type}
            type="button"
            role="tab"
            aria-selected={t.type === type}
            onClick={() => setType(t.type)}
            className={`h-9 shrink-0 rounded-lg px-3.5 text-sm transition-colors ${t.type === type ? 'bg-white/[0.08] text-chrome' : 'text-steel hover:text-chrome'}`}
          >
            {t.label} <span className="text-steel">{(images.data ?? []).filter((i) => i.type === t.type).length}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input ref={input} type="file" accept={ACCEPT.join(',')} className="sr-only" id="model-image-upload" onChange={(e) => upload(e.target.files?.[0])} />
        <Btn onClick={() => input.current?.click()} disabled={busy}>
          <Upload className="size-4" aria-hidden /> {busy ? 'Working…' : `Upload ${types.find((t) => t.type === type)!.label.toLowerCase()} image`}
        </Btn>
        <p className="text-xs text-steel">JPEG, PNG or WebP, up to {MAX_MB} MB.{type === 'hero' && ' The first hero image replaces the static hero on the site.'}</p>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-accent-soft">
          {error}
        </p>
      )}

      {shown.length ? (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shown.map((image, index) => (
            <li key={image.id} className="overflow-hidden rounded-lg border border-line bg-ink">
              <img src={image.url} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="flex items-center justify-between p-1.5">
                <span className="pl-1.5 text-xs text-steel">#{index + 1}</span>
                <div className="flex">
                  <Btn variant="ghost" className="h-8 px-2" disabled={busy || index === 0} onClick={() => move(image, -1)} aria-label="Move earlier">
                    <ArrowUp className="size-4" />
                  </Btn>
                  <Btn variant="ghost" className="h-8 px-2" disabled={busy || index === shown.length - 1} onClick={() => move(image, 1)} aria-label="Move later">
                    <ArrowDown className="size-4" />
                  </Btn>
                  <Btn variant="ghost" className="h-8 px-2" disabled={busy} onClick={() => run(deleteImage(image.id))} aria-label="Delete image">
                    <Trash2 className="size-4" />
                  </Btn>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <StateView loading={images.loading} error={images.error} empty="No images of this type yet." onRetry={images.reload} />
      )}
    </Modal>
  )
}
