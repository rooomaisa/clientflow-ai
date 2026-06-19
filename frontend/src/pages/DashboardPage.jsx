import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, CheckSquare, UserPlus, Users } from 'lucide-react'
import { fetchDashboardOverview } from '../api/dashboard'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { SkeletonList, SkeletonPageHeader, SkeletonStatCards } from '../components/ui/Skeleton'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../context/AuthContext'
import { CLIENT_STATUS_LABELS, clientStatusTone } from '../utils/clientStatus'
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS, taskStatusTone } from '../utils/taskStatus'

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
    return (
      <div className="space-y-8">
        <SkeletonPageHeader />
        <SkeletonStatCards />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <SkeletonList rows={3} />
          </div>
          <div className="card p-6">
            <SkeletonList rows={3} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
    )
  }

  const { stats, recentClients, recentTasks } = overview

  return (
    <div className="space-y-8">
      <PageHeader
        label="Dashboard"
        title={`Welcome back, ${user?.name?.split(' ')[0] || user?.name}`}
        description="Here is a quick overview of your client workflow."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total clients" value={stats.totalClients} icon={Users} accent="violet" />
        <StatCard label="Active clients" value={stats.activeClients} icon={UserPlus} accent="orange" />
        <StatCard label="Open tasks" value={stats.openTasks} icon={CheckSquare} accent="violet" />
        <StatCard
          label="Meetings processed with AI"
          value={stats.aiProcessedCount}
          icon={Brain}
          accent="orange"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card-accent p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">Recent clients</h2>
          {recentClients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No clients yet"
              description="Add your first client to start tracking meetings and tasks."
              actionLabel="Add client"
              actionTo="/clients"
            />
          ) : (
            <ul className="mt-4 space-y-2">
              {recentClients.map((client) => (
                <li
                  key={client.id}
                  className="app-list-item flex items-center justify-between"
                >
                  <Link to={`/clients/${client.id}`} className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 hover:text-violet-700">{client.name}</p>
                    <p className="text-sm text-slate-500">{client.companyName || 'No company'}</p>
                  </Link>
                  <Badge tone={clientStatusTone(client.status)}>
                    {CLIENT_STATUS_LABELS[client.status] || client.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="card-accent p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">Recent tasks</h2>
          {recentTasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks yet"
              description="Tasks appear here after AI processing or when you add one manually."
              actionLabel="View tasks"
              actionTo="/tasks"
            />
          ) : (
            <ul className="mt-4 space-y-2">
              {recentTasks.map((task) => (
                <li
                  key={task.id}
                  className="app-list-item flex items-center justify-between"
                >
                  <Link to="/tasks" className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 hover:text-violet-700">{task.title}</p>
                    <p className="text-sm text-slate-500">
                      {TASK_PRIORITY_LABELS[task.priority] || task.priority} priority
                    </p>
                  </Link>
                  <Badge tone={taskStatusTone(task.status)}>
                    {TASK_STATUS_LABELS[task.status] || task.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}
