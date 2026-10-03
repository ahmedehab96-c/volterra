import { Images, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { formatPrice } from '../../data/content'
import { useTitle } from '../../router'
import { createModel, deleteModel, listModels, updateModel, type AdminModel, type ModelInput } from '../adminApi'
import { Badge, Btn, ConfirmDelete, Field, inputClass, Modal, PageHeader, Panel, StateView, tdClass, thClass } from '../ui'
import { errorMessage, fieldErrors, useLoad } from '../useLoad'
import { ModelImages } from './ModelImages'

export default function ModelsPage() {
  useTitle('Models — VOLTERRA Admin')
  const models = useLoad(listModels)
  const [editing, setEditing] = useState<AdminModel | 'new' | null>(null)
  const [removing, setRemoving] = useState<AdminModel | null>(null)
  const [gallery, setGallery] = useState<AdminModel | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [notice, setNotice] = useState('')

  const toggle = (m: AdminModel) => {
    setBusyId(m.id)
    updateModel(m.id, { status: m.status === 'active' ? 'inactive' : 'active' })
      .then(() => models.reload())
      .catch((e) => setNotice(errorMessage(e)))
      .finally(() => setBusyId(null))
  }

  return (
    <>
      <PageHeader
        title="Models"
        intro="Inactive models are hidden from the public site."
        action={
          <Btn onClick={() => setEditing('new')}>
            <Plus className="size-4" aria-hidden /> Add model
          </Btn>
        }
      />
      {notice && (
        <p role="alert" className="mb-4 text-sm text-accent-soft">
          {notice}
        </p>
      )}
      <Panel>
        {models.data?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className={thClass}>Model</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>HP</th>
                  <th className={`${thClass} text-right`}>Top speed</th>
                  <th className={`${thClass} text-right`}>Price</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.data.map((m) => (
                  <tr key={m.id} className="border-b border-line last:border-0 hover:bg-white/[0.02]">
                    <td className={tdClass}>
                      <p className="font-medium text-chrome">{m.name}</p>
                      <p className="text-xs text-steel">/{m.slug}</p>
                    </td>
                    <td className={tdClass}>
                      <Badge value={m.status} />
                    </td>
                    <td className={`${tdClass} text-right tabular-nums`}>{m.horsepower.toLocaleString('en-US')}</td>
                    <td className={`${tdClass} text-right tabular-nums`}>{m.top_speed} km/h</td>
                    <td className={`${tdClass} text-right tabular-nums`}>{formatPrice(m.base_price)}</td>
                    <td className={`${tdClass} text-right whitespace-nowrap`}>
                      <Btn variant="ghost" onClick={() => toggle(m)} disabled={busyId === m.id}>
                        {m.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Btn>
                      <Btn variant="ghost" onClick={() => setGallery(m)} aria-label={`Images of ${m.name}`}>
                        <Images className="size-4" />
                      </Btn>
                      <Btn variant="ghost" onClick={() => setEditing(m)} aria-label={`Edit ${m.name}`}>
                        <Pencil className="size-4" />
                      </Btn>
                      <Btn variant="ghost" onClick={() => setRemoving(m)} aria-label={`Delete ${m.name}`}>
                        <Trash2 className="size-4" />
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <StateView loading={models.loading} error={models.error} empty="No models yet. Add the first one." onRetry={models.reload} />
        )}
      </Panel>

      {editing && (
        <ModelForm
          model={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            models.reload()
          }}
        />
      )}
      {gallery && <ModelImages model={gallery} onClose={() => setGallery(null)} />}
      {removing && (
        <ConfirmDelete
          name={removing.name}
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            deleteModel(removing.id).then(() => {
              setRemoving(null)
              models.reload()
            })
          }
        />
      )}
    </>
  )
}

const empty: Record<keyof ModelInput, string> = {
  name: '', slug: '', tagline: '', description: '', horsepower: '', torque: '', acceleration: '', top_speed: '', base_price: '', hero_image: '/assets/images/models/', model_3d: '', status: 'active',
}

const numberRules: [keyof ModelInput, string, number, number][] = [
  ['horsepower', 'Horsepower', 1, 3000],
  ['torque', 'Torque (NM)', 1, 5000],
  ['acceleration', '0–100 km/h (s)', 1, 20],
  ['top_speed', 'Top speed (km/h)', 50, 600],
  ['base_price', 'Base price (EUR)', 0, 100000000],
]

/** Mirrors the API rules so most mistakes are caught before a request */
function validate(f: Record<keyof ModelInput, string>) {
  const e: Record<string, string> = {}
  if (!f.name.trim()) e.name = 'Name is required.'
  if (!/^[a-z0-9-]+$/.test(f.slug)) e.slug = 'Use lowercase letters, numbers and dashes.'
  if (!f.description.trim()) e.description = 'Description is required.'
  if (!f.hero_image.trim()) e.hero_image = 'Image path is required.'
  if (f.model_3d.trim() && !/\.(glb|gltf)(\?.*)?$/i.test(f.model_3d.trim())) e.model_3d = 'Use a .glb or .gltf file URL or path.'
  for (const [key, , min, max] of numberRules) {
    const n = Number(f[key])
    if (f[key] === '' || Number.isNaN(n) || n < min || n > max) e[key] = `Enter a number from ${min.toLocaleString('en-US')} to ${max.toLocaleString('en-US')}.`
    else if (key !== 'acceleration' && !Number.isInteger(n)) e[key] = 'Use a whole number.'
  }
  return e
}

function ModelForm({ model, onClose, onSaved }: { model: AdminModel | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Record<keyof ModelInput, string>>(() =>
    model ? (Object.fromEntries(Object.keys(empty).map((k) => [k, String(model[k as keyof ModelInput] ?? '')])) as Record<keyof ModelInput, string>) : empty,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const set = (key: keyof ModelInput) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    const input: ModelInput = {
      ...form,
      tagline: form.tagline.trim() || null,
      model_3d: form.model_3d.trim() || null,
      horsepower: Number(form.horsepower),
      torque: Number(form.torque),
      acceleration: Number(form.acceleration),
      top_speed: Number(form.top_speed),
      base_price: Number(form.base_price),
      status: form.status as ModelInput['status'],
    }
    setBusy(true)
    ;(model ? updateModel(model.id, input) : createModel(input))
      .then(onSaved)
      .catch((err) => {
        const fields = fieldErrors(err)
        setErrors(Object.keys(fields).length ? fields : { form: errorMessage(err) })
        setBusy(false)
      })
  }

  const text = (key: keyof ModelInput, label: string, extra: Record<string, unknown> = {}) => (
    <Field label={label} error={errors[key]}>
      {(p) => <input {...p} {...extra} className={inputClass} value={form[key]} onChange={(e) => set(key)(e.target.value)} />}
    </Field>
  )

  return (
    <Modal title={model ? `Edit ${model.name}` : 'Add model'} onClose={onClose} wide>
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        {text('name', 'Name', { placeholder: 'VOLTERRA R' })}
        {text('slug', 'Slug', { placeholder: 'volterra-r' })}
        <div className="sm:col-span-2">{text('tagline', 'Tagline (optional)')}</div>
        <div className="sm:col-span-2">
          <Field label="Description" error={errors.description}>
            {(p) => <textarea {...p} rows={3} className={`${inputClass} h-auto py-2`} value={form.description} onChange={(e) => set('description')(e.target.value)} />}
          </Field>
        </div>
        {numberRules.map(([key, label]) => (
          <div key={key}>{text(key, label, { inputMode: 'decimal' })}</div>
        ))}
        <Field label="Status">
          {(p) => (
            <select {...p} className={inputClass} value={form.status} onChange={(e) => set('status')(e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}
        </Field>
        <div className="sm:col-span-2">{text('hero_image', 'Hero image path (an uploaded hero image takes priority)')}</div>
        <div className="sm:col-span-2">{text('model_3d', '3D model (optional .glb / .gltf URL or path)', { placeholder: '/models/volterra-gt.glb' })}</div>
        {errors.form && (
          <p role="alert" className="text-sm text-accent-soft sm:col-span-2">
            {errors.form}
          </p>
        )}
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Btn variant="secondary" onClick={onClose}>
            Cancel
          </Btn>
          <Btn type="submit" disabled={busy}>
            {busy ? 'Saving…' : model ? 'Save changes' : 'Add model'}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
