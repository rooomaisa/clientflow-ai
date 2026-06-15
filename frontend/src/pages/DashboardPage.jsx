import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-900">
            ClientFlow <span className="text-brand-600">AI</span>
          </h1>
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-brand-600">Dashboard preview</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Welcome, {user?.name}</h2>
          <p className="mt-3 text-slate-600">
            You are logged in. The full dashboard layout comes in Phase 11.
          </p>
        </div>
      </main>
    </div>
  )
}
