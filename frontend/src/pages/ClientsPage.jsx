import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Users } from 'lucide-react'
import { createClient, fetchClients } from '../api/clients'
import ClientForm from '../components/clients/ClientForm'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { SkeletonPageHeader, SkeletonTable } from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'
import { CLIENT_STATUS_LABELS, clientStatusTone } from '../utils/clientStatus'

export default function ClientsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function loadClients() {
    try {
      const data = await fetchClients()
      setClients(data)
      setError('')
    } catch {
      setError('Could not load clients. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  async function handleCreate(payload) {
    const created = await createClient(payload)
    toast('Client created successfully')
    setShowForm(false)
    navigate(`/clients/${created.id}`)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonPageHeader />
        <SkeletonTable rows={5} cols={4} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Clients"
        title="Your clients"
        description="Manage client intake details and track their status."
      >
        <Button onClick={() => setShowForm((open) => !open)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          {showForm ? 'Close form' : 'Add client'}
        </Button>
      </PageHeader>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      )}

      {showForm && (
        <section className="card-accent p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">New client</h2>
          <div className="mt-4">
            <ClientForm
              submitLabel="Create client"
              onCancel={() => setShowForm(false)}
              onSubmit={handleCreate}
            />
          </div>
        </section>
      )}

      <section className="card-accent overflow-hidden">
        {clients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No clients yet"
            description="Add your first client to start tracking meetings and tasks."
            actionLabel="Add client"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Client', 'Company', 'Email', 'Status'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {clients.map((client) => (
                  <tr key={client.id} className="transition hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <Link
                        to={`/clients/${client.id}`}
                        className="link-accent font-medium"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client.companyName || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client.email || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge tone={clientStatusTone(client.status)}>
                        {CLIENT_STATUS_LABELS[client.status] || client.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
