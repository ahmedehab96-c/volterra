import { Mail, Phone, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { formatPrice } from '../../data/content'
import { useTitle } from '../../router'
import { getInquiry, listInquiries, listModels, updateInquiry, type AdminInquiry, type InquiryStatus } from '../adminApi'
import { Badge, Btn, Field, inputClass, Modal, PageHeader, Panel, StateView, tdClass, thClass } from '../ui'
import { errorMessage, useLoad } from '../useLoad'

const statuses: InquiryStatus[] = ['new', 'contacted', 'closed']

export default function InquiriesPage() {
  useTitle('Inquiries — VOLTERRA Admin')
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [model, setModel] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState<AdminInquiry | null>(null)

  // Search waits for a pause in typing
  useEffect(() => {
    const t = window.setTimeout(() => {
      setQ(search.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(t)
  }, [search])

  const list = useLoad(useCallback(() => listInquiries({ q, status, model, page }), [q, status, model, page]))
  const models = useLoad(listModels)
  const meta = list.data?.meta

  return (
    <>
      <PageHeader title="Inquiries" intro="Newest first. Open a request to see the full details and update its status." />
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search inquiries</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-steel" aria-hidden />
          <input className={`${inputClass} pl-9`} placeholder="Search name, email, phone or country" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select aria-label="Filter by status" className={inputClass} value={status} onChange={(e) => (setStatus(e.target.value), setPage(1))}>
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <select aria-label="Filter by model" className={inputClass} value={model} onChange={(e) => (setModel(e.target.value), setPage(1))}>
          <option value="">All models</option>
          {models.data?.map((m) => (
            <option key={m.id} value={m.slug}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <Panel>
        {list.data?.items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className={thClass}>Customer</th>
                  <th className={thClass}>Model</th>
                  <th className={thClass}>Country</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Date</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.data.items.map((i) => (
                  <tr key={i.id} onClick={() => setOpen(i)} className="cursor-pointer border-b border-line last:border-0 hover:bg-white/[0.02]">
                    <td className={tdClass}>
                      <p className="font-medium text-chrome">{i.name}</p>
                      <p className="text-xs text-steel">{i.email}</p>
                    </td>
                    <td className={tdClass}>{i.model}</td>
                    <td className={tdClass}>{i.country}</td>
                    <td className={tdClass}>
                      <Badge value={i.status} />
                    </td>
                    <td className={`${tdClass} whitespace-nowrap text-steel`}>{new Date(i.created_at).toLocaleDateString()}</td>
                    <td className={`${tdClass} text-right`}>
                      <Btn variant="secondary" onClick={(e) => (e.stopPropagation(), setOpen(i))}>
                        View
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <StateView loading={list.loading} error={list.error} empty={q || status || model ? 'No inquiries match these filters.' : 'No inquiries yet.'} onRetry={list.reload} />
        )}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-steel">
            <span>
              Page {meta.current_page} of {meta.last_page} · {meta.total} inquiries
            </span>
            <div className="flex gap-2">
              <Btn variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Btn>
              <Btn variant="secondary" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>
                Next
              </Btn>
            </div>
          </div>
        )}
      </Panel>

      {open && (
        <InquiryDetails
          inquiry={open}
          onClose={() => setOpen(null)}
          onUpdated={(updated) => {
            setOpen(updated)
            list.reload()
          }}
        />
      )}
    </>
  )
}

function InquiryDetails({ inquiry, onClose, onUpdated }: { inquiry: AdminInquiry; onClose: () => void; onUpdated: (i: AdminInquiry) => void }) {
  // The list row is shown at once; the full record adds option names and the model name
  const full = useLoad(useCallback(() => getInquiry(inquiry.id), [inquiry.id]))
  const current = full.data ?? inquiry
  const [notes, setNotes] = useState<string | null>(null)
  const [busy, setBusy] = useState<'status' | 'notes' | null>(null)
  const [message, setMessage] = useState('')
  const draft = notes ?? current.internal_notes ?? ''

  const save = (changes: { status?: InquiryStatus; internal_notes?: string | null }, kind: 'status' | 'notes') => {
    setBusy(kind)
    setMessage('')
    updateInquiry(inquiry.id, changes)
      .then((updated) => {
        full.setData(updated)
        onUpdated(updated)
        if (kind === 'notes') {
          setNotes(null)
          setMessage('Notes saved.')
        }
      })
      .catch((e) => setMessage(errorMessage(e)))
      .finally(() => setBusy(null))
  }

  const c = current.configuration
  const sections: [string, [string, string][]][] = [
    ['Customer', [['Name', current.name], ['Country', current.country], ['Reference', current.reference]]],
    ['Vehicle', [['Model', current.model_name ?? current.model], ['Exterior', c?.exterior_color ?? current.exterior_color], ['Wheels', c?.wheels ?? current.wheels], ['Interior', c?.interior ?? current.interior]]],
    ['Request', [['Estimated price', current.estimated_price ? formatPrice(current.estimated_price) : '—'], ['Received', new Date(current.created_at).toLocaleString()]]],
  ]

  return (
    <Modal title={current.name} onClose={onClose} wide>
      <p className="mb-2 text-xs font-medium tracking-wide text-steel uppercase">Contact</p>
      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${current.email}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm text-chrome hover:border-white/40">
          <Mail className="size-4" aria-hidden /> {current.email}
        </a>
        <a href={`tel:${current.phone.replace(/\s/g, '')}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm text-chrome hover:border-white/40">
          <Phone className="size-4" aria-hidden /> {current.phone}
        </a>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {sections.map(([title, rows]) => (
          <div key={title}>
            <p className="mb-2 text-xs font-medium tracking-wide text-steel uppercase">{title}</p>
            <dl className="space-y-1.5 text-sm">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-steel">{label}</dt>
                  <dd className="text-chrome">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      {current.message && <p className="mt-4 rounded-lg bg-white/[0.03] p-4 text-sm whitespace-pre-line text-silver">{current.message}</p>}

      <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-[12rem_1fr]">
        <Field label="Status">
          {(p) => (
            <select {...p} className={inputClass} value={current.status} disabled={busy !== null} onChange={(e) => save({ status: e.target.value as InquiryStatus }, 'status')}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          )}
        </Field>
        <div>
          <Field label="Internal notes" hint="Visible to staff only.">
            {(p) => <textarea {...p} rows={3} maxLength={2000} className={`${inputClass} h-auto py-2`} value={draft} onChange={(e) => setNotes(e.target.value)} />}
          </Field>
          <div className="mt-2 flex items-center gap-3">
            <Btn variant="secondary" disabled={busy !== null || notes === null} onClick={() => save({ internal_notes: draft.trim() || null }, 'notes')}>
              {busy === 'notes' ? 'Saving…' : 'Save notes'}
            </Btn>
            {message && (
              <p role="status" className="text-xs text-steel">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
