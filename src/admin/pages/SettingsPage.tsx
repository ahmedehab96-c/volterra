import { useState } from 'react'
import { useTitle } from '../../router'
import { logout, me } from '../adminApi'
import { Btn, PageHeader, Panel, StateView } from '../ui'
import { useLoad } from '../useLoad'

export default function SettingsPage() {
  useTitle('Settings — VOLTERRA Admin')
  const user = useLoad(me)
  const [busy, setBusy] = useState(false)

  return (
    <>
      <PageHeader title="Settings" intro="Your account and this admin’s connection." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <h2 className="text-sm font-medium text-chrome">Account</h2>
          {user.data ? (
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Name', user.data.name],
                ['Email', user.data.email],
                ['Role', user.data.role],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-steel">{label}</dt>
                  <dd className={`text-chrome ${label === 'Role' ? 'capitalize' : ''}`}>{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <StateView loading={user.loading} error={user.error} onRetry={user.reload} />
          )}
        </Panel>
        <Panel className="p-5">
          <h2 className="text-sm font-medium text-chrome">Session</h2>
          <p className="mt-2 text-sm text-steel">API: {import.meta.env.VITE_API_URL || 'not configured'}</p>
          <p className="mt-1 text-sm text-steel">Signing out revokes this browser’s access token.</p>
          <Btn
            variant="secondary"
            className="mt-4"
            disabled={busy}
            onClick={() => {
              setBusy(true)
              logout().finally(() => location.assign('/admin/login'))
            }}
          >
            {busy ? 'Signing out…' : 'Sign out'}
          </Btn>
        </Panel>
      </div>
    </>
  )
}
