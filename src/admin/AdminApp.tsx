import { Car, Inbox, LayoutDashboard, LogOut, Menu, Settings, SlidersHorizontal, X } from 'lucide-react'
import { lazy, Suspense, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { apiEnabled } from '../api/apiClient'
import { Wordmark } from '../components/layout/Logo'
import { LoadingLine } from '../components/ui/LoadingLine'
import { navigate, useTitle } from '../router'
import { hasSession, login, logout, me, setUnauthorizedHandler, type AdminUser } from './adminApi'
import { Btn, Field, inputClass } from './ui'
import { errorMessage, fieldErrors } from './useLoad'

const Dashboard = lazy(() => import('./pages/DashboardPage'))
const Models = lazy(() => import('./pages/ModelsPage'))
const Options = lazy(() => import('./pages/OptionsPage'))
const Inquiries = lazy(() => import('./pages/InquiriesPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, page: Dashboard },
  { href: '/admin/models', label: 'Models', icon: Car, page: Models },
  { href: '/admin/configurations', label: 'Configurations', icon: SlidersHorizontal, page: Options },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox, page: Inquiries },
  { href: '/admin/settings', label: 'Settings', icon: Settings, page: SettingsPage },
]

const FullLoading = () => (
  <div className="grid min-h-svh place-items-center bg-ink">
    <LoadingLine />
  </div>
)

/** Admin area: its own shell, separate from the public site. Every view needs a signed-in admin or editor. */
export default function AdminApp({ path }: { path: string }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [checking, setChecking] = useState(hasSession)
  const onLogin = path === '/admin/login'

  // Keep the admin out of search results
  useEffect(() => {
    const meta = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex, nofollow' })
    document.head.append(meta)
    return () => meta.remove()
  }, [])

  // An expired or revoked token sends the user back to sign in
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      navigate('/admin/login', { replace: true })
    })
  }, [])

  // Restore a saved session once
  useEffect(() => {
    if (!checking) return
    me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecking(false))
  }, [checking])

  // Route guard
  useEffect(() => {
    if (checking) return
    if (!user && !onLogin) navigate('/admin/login', { replace: true })
    else if (user && onLogin) navigate('/admin', { replace: true })
  }, [checking, user, onLogin])

  if (checking) return <FullLoading />
  if (onLogin) return <LoginPage onLogin={setUser} />
  if (!user) return <FullLoading />

  const Page = nav.find((n) => n.href === path)?.page
  const signOut = () => logout().finally(() => setUser(null))

  return (
    <Layout path={path} user={user} onLogout={signOut}>
      <Suspense fallback={<LoadingLine />}>{Page ? <Page /> : <NotFoundView />}</Suspense>
    </Layout>
  )
}

function LoginPage({ onLogin }: { onLogin: (user: AdminUser) => void }) {
  useTitle('Sign in — VOLTERRA Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const local: Record<string, string> = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) local.email = 'Enter a valid email address.'
    if (!password) local.password = 'Enter your password.'
    setErrors(local)
    if (Object.keys(local).length) return
    setBusy(true)
    login(email, password)
      .then(onLogin)
      .catch((err) => {
        const fields = fieldErrors(err)
        setErrors(Object.keys(fields).length ? fields : { form: errorMessage(err) })
        setBusy(false)
      })
  }

  return (
    <main id="main" tabIndex={-1} className="grid min-h-svh place-items-center bg-ink px-5 outline-none">
      <form onSubmit={submit} noValidate className="w-full max-w-sm rounded-2xl border border-line bg-carbon p-7">
        <Wordmark className="text-base" />
        <h1 className="mt-6 text-lg font-semibold text-chrome">Sign in to the admin</h1>
        <p className="mt-1 text-sm text-steel">Staff access only.</p>
        {!apiEnabled && <p className="mt-4 rounded-lg bg-accent/10 p-3 text-xs text-accent-soft">VITE_API_URL is not set, so the admin can’t reach the API.</p>}
        <div className="mt-6 space-y-4">
          <Field label="Email" error={errors.email}>
            {(p) => <input {...p} type="email" autoComplete="username" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />}
          </Field>
          <Field label="Password" error={errors.password}>
            {(p) => <input {...p} type="password" autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />}
          </Field>
        </div>
        {errors.form && (
          <p role="alert" className="mt-4 text-sm text-accent-soft">
            {errors.form}
          </p>
        )}
        <Btn type="submit" disabled={busy} className="mt-6 h-10 w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </Btn>
        <a href="/" className="mt-5 block text-center text-xs text-steel hover:text-chrome">
          ← Back to the website
        </a>
      </form>
    </main>
  )
}

function Layout({ path, user, onLogout, children }: { path: string; user: AdminUser; onLogout: () => void; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col gap-1 p-4">
      <a href="/admin" className="mb-6 flex items-baseline gap-2 px-2 pt-1" onClick={close}>
        <Wordmark className="text-sm" />
        <span className="text-[0.625rem] tracking-[0.2em] text-steel uppercase">Admin</span>
      </a>
      {nav.map(({ href, label, icon: Icon }) => {
        const on = href === path
        return (
          <a
            key={href}
            href={href}
            onClick={close}
            aria-current={on ? 'page' : undefined}
            className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${on ? 'bg-white/[0.07] text-chrome' : 'text-steel hover:bg-white/[0.04] hover:text-chrome'}`}
          >
            <Icon className={`size-4 ${on ? 'text-accent-soft' : ''}`} aria-hidden />
            {label}
          </a>
        )
      })}
      <div className="mt-auto border-t border-line pt-4">
        <p className="truncate px-3 text-sm text-chrome">{user.name}</p>
        <p className="truncate px-3 text-xs text-steel capitalize">{user.role}</p>
        <button type="button" onClick={onLogout} className="mt-3 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-steel hover:bg-white/[0.04] hover:text-chrome">
          <LogOut className="size-4" aria-hidden />
          Logout
        </button>
      </div>
    </nav>
  )

  return (
    <div className="min-h-svh bg-ink text-silver lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-svh border-r border-line bg-carbon lg:block">{sidebar}</aside>

      {/* Mobile: top bar with a drawer */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-carbon/95 px-4 backdrop-blur lg:hidden">
        <Wordmark className="text-sm" />
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="grid size-10 place-items-center rounded-lg text-chrome">
          <Menu className="size-5" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={close}>
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-line bg-carbon" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={close} aria-label="Close menu" className="absolute top-4 right-3 grid size-9 place-items-center rounded-lg text-steel">
              <X className="size-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main id="main" tabIndex={-1} className="min-w-0 px-4 py-6 outline-none md:px-8 md:py-8">
        {children}
      </main>
    </div>
  )
}

function NotFoundView() {
  return (
    <div className="py-20 text-center">
      <p className="text-sm text-steel">This admin page doesn’t exist.</p>
      <a href="/admin" className="mt-3 inline-block text-sm text-chrome underline">
        Back to the dashboard
      </a>
    </div>
  )
}
