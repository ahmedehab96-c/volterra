import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useCallback, useState, type FormEvent } from 'react'
import { formatPrice } from '../../data/content'
import { useTitle } from '../../router'
import { createOption, deleteOption, listOptions, updateOption, type AdminOption, type OptionType, type Status } from '../adminApi'
import { Badge, Btn, ConfirmDelete, Field, inputClass, Modal, PageHeader, Panel, StateView, tdClass, thClass } from '../ui'
import { errorMessage, fieldErrors, useLoad } from '../useLoad'

const tabs: { type: OptionType; label: string }[] = [
  { type: 'exterior_color', label: 'Exterior colors' },
  { type: 'wheels', label: 'Wheels' },
  { type: 'interior', label: 'Interiors' },
]

export default function OptionsPage() {
  useTitle('Configurations — VOLTERRA Admin')
  const [type, setType] = useState<OptionType>('exterior_color')
  const options = useLoad(useCallback(() => listOptions(type), [type]))
  const [editing, setEditing] = useState<AdminOption | 'new' | null>(null)
  const [removing, setRemoving] = useState<AdminOption | null>(null)
  const [notice, setNotice] = useState('')

  const toggle = (o: AdminOption) =>
    updateOption(o.id, { status: o.status === 'active' ? 'inactive' : 'active' })
      .then(options.reload)
      .catch((e) => setNotice(errorMessage(e)))

  return (
    <>
      <PageHeader
        title="Configurations"
        intro="Options and prices offered in the configurator. Inactive options are rejected by the API."
        action={
          <Btn onClick={() => setEditing('new')}>
            <Plus className="size-4" aria-hidden /> Add option
          </Btn>
        }
      />
      <div role="tablist" aria-label="Option type" className="mb-4 flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.type}
            type="button"
            role="tab"
            aria-selected={t.type === type}
            onClick={() => setType(t.type)}
            className={`h-9 shrink-0 rounded-lg px-3.5 text-sm transition-colors ${t.type === type ? 'bg-white/[0.08] text-chrome' : 'text-steel hover:text-chrome'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {notice && (
        <p role="alert" className="mb-4 text-sm text-accent-soft">
          {notice}
        </p>
      )}
      <Panel>
        {options.data?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className={thClass}>Name</th>
                  <th className={thClass}>Code</th>
                  <th className={`${thClass} text-right`}>Price</th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {options.data.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-0 hover:bg-white/[0.02]">
                    <td className={`${tdClass} font-medium text-chrome`}>{o.name}</td>
                    <td className={`${tdClass} text-steel`}>{o.code}</td>
                    <td className={`${tdClass} text-right tabular-nums`}>{o.price ? `+${formatPrice(o.price)}` : 'Included'}</td>
                    <td className={tdClass}>
                      <Badge value={o.status} />
                    </td>
                    <td className={`${tdClass} text-right whitespace-nowrap`}>
                      <Btn variant="ghost" onClick={() => toggle(o)}>
                        {o.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Btn>
                      <Btn variant="ghost" onClick={() => setEditing(o)} aria-label={`Edit ${o.name}`}>
                        <Pencil className="size-4" />
                      </Btn>
                      <Btn variant="ghost" onClick={() => setRemoving(o)} aria-label={`Delete ${o.name}`}>
                        <Trash2 className="size-4" />
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <StateView loading={options.loading} error={options.error} empty="No options of this type yet." onRetry={options.reload} />
        )}
      </Panel>

      {editing && (
        <OptionForm
          type={type}
          option={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            options.reload()
          }}
        />
      )}
      {removing && (
        <ConfirmDelete
          name={removing.name}
          onClose={() => setRemoving(null)}
          onConfirm={() =>
            deleteOption(removing.id).then(() => {
              setRemoving(null)
              options.reload()
            })
          }
        />
      )}
    </>
  )
}

function OptionForm({ type, option, onClose, onSaved }: { type: OptionType; option: AdminOption | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: option?.name ?? '', code: option?.code ?? '', price: String(option?.price ?? 0), status: option?.status ?? 'active' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const found: Record<string, string> = {}
    if (!form.name.trim()) found.name = 'Name is required.'
    if (!/^[a-z0-9-]+$/.test(form.code)) found.code = 'Use lowercase letters, numbers and dashes.'
    const price = Number(form.price)
    if (form.price === '' || !Number.isInteger(price) || price < 0) found.price = 'Enter a whole number of euros (0 or more).'
    setErrors(found)
    if (Object.keys(found).length) return
    const input = { type, name: form.name.trim(), code: form.code, price, status: form.status as Status }
    setBusy(true)
    ;(option ? updateOption(option.id, input) : createOption(input))
      .then(onSaved)
      .catch((err) => {
        const fields = fieldErrors(err)
        setErrors(Object.keys(fields).length ? fields : { form: errorMessage(err) })
        setBusy(false)
      })
  }

  return (
    <Modal title={option ? `Edit ${option.name}` : `Add ${tabs.find((t) => t.type === type)!.label.toLowerCase().replace(/s$/, '')}`} onClose={onClose}>
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          {(p) => <input {...p} className={inputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />}
        </Field>
        <Field label="Code" error={errors.code} hint="Used by the site, e.g. blu">
          {(p) => <input {...p} className={inputClass} value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />}
        </Field>
        <Field label="Price (EUR)" error={errors.price}>
          {(p) => <input {...p} inputMode="numeric" className={inputClass} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />}
        </Field>
        <Field label="Status">
          {(p) => (
            <select {...p} className={inputClass} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}
        </Field>
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
            {busy ? 'Saving…' : 'Save'}
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
