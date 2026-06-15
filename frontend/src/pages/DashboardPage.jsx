import { useEffect, useState } from 'react'
import { fetchDashboardOverview } from '../api/dashboard'
import Badge from '../components/ui/Badge'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchDashboardOverview()
        setOverview(data)
      } catch {
        setError('Could not load dashboard data. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return <p className="text-slate-600">Loading dashboard...</p>
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
    )
  }

  const { stats, recentClients, recentTasks } = overview

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-brand-600">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Welcome back, {user?.name}</h1>
        <p className="mt-2 text-slate-600">Here is a quick overview of your client workflow.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total clients" value={stats.totalClients} />
        <StatCard label="Active clients" value={stats.activeClients} />
        <StatCard label="Open tasks" value={stats.openTasks} />
        <StatCard label="Meetings processed with AI" value={stats.aiProcessedCount} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent clients</h2>
          {recentClients.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No clients yet. Add your first client in Phase 12.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentClients.map((client) => (
                <li
                  key={client.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{client.name}</p>
                    <p className="text-sm text-slate-500">{client.companyName || 'No company'}</p>
                  </div>
                  <Badge tone="emerald">{client.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent tasks</h2>
          {recentTasks.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No tasks yet. They will appear after AI processing or manual creation.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="text-sm text-slate-500">{task.priority} priority</p>
                  </div>
                  <Badge tone={task.status === 'DONE' ? 'slate' : 'amber'}>{task.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}
