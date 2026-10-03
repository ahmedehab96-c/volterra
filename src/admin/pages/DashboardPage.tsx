import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'
import { useTitle } from '../../router'
import { getStats, listInquiries } from '../adminApi'
import { Badge, PageHeader, Panel, StateView, tdClass, thClass } from '../ui'
import { useLoad } from '../useLoad'

const cards = [
  { key: 'total_models', label: 'Total models', href: '/admin/models' },
  { key: 'active_models', label: 'Active models', href: '/admin/models' },
  { key: 'total_inquiries', label: 'Total inquiries', href: '/admin/inquiries' },
  { key: 'new_inquiries', label: 'New inquiries', href: '/admin/inquiries' },
] as const

export default function DashboardPage() {
  useTitle('Dashboard — VOLTERRA Admin')
  const stats = useLoad(getStats)
  const recent = useLoad(useCallback(() => listInquiries({ page: 1 }), []))

  return (
    <>
      <PageHeader title="Dashboard" intro="The range and incoming requests at a glance." />
      {stats.error ? (
        <Panel>
          <StateView error={stats.error} onRetry={stats.reload} />
        </Panel>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {cards.map((c) => (
            <a key={c.key} href={c.href} className="rounded-xl border border-line bg-carbon p-5 transition-colors hover:border-white/20">
              <p className="text-xs text-steel">{c.label}</p>
              <p className="mt-2 text-3xl font-semibold text-chrome tabular-nums">{stats.data ? stats.data[c.key] : '—'}</p>
            </a>
          ))}
        </div>
      )}

      <Panel className="mt-6">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-sm font-medium text-chrome">Latest inquiries</h2>
          <a href="/admin/inquiries" className="inline-flex items-center gap-1 text-xs text-steel hover:text-chrome">
            View all <ArrowRight className="size-3.5" aria-hidden />
          </a>
        </div>
        {recent.data?.items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className={thClass}>Customer</th>
                  <th className={thClass}>Model</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.data.items.slice(0, 5).map((i) => (
                  <tr key={i.id} className="border-b border-line last:border-0">
                    <td className={`${tdClass} text-chrome`}>{i.name}</td>
                    <td className={tdClass}>{i.model}</td>
                    <td className={tdClass}>
                      <Badge value={i.status} />
                    </td>
                    <td className={`${tdClass} text-steel`}>{new Date(i.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <StateView loading={recent.loading} error={recent.error} empty="No inquiries yet." onRetry={recent.reload} />
        )}
      </Panel>
    </>
  )
}
