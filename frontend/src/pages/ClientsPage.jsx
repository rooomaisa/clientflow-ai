import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClient, fetchClients } from '../api/clients'
import ClientForm from '../components/clients/ClientForm'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CLIENT_STATUS_LABELS, clientStatusTone } from '../utils/clientStatus'

export default function ClientsPage() {
  const navigate = useNavigate()
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
    setShowForm(false)
    navigate(`/clients/${created.id}`)
  }

  if (loading) {
    return <p className="text-slate-600">Loading clients...</p>
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">Clients</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Your clients</h1>
          <p className="mt-2 text-slate-600">Manage client intake details and track their status.</p>
        </div>
        <Button onClick={() => setShowForm((open) => !open)}>
          {showForm ? 'Close form' : 'Add client'}
        </Button>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      )}

      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">New client</h2>
          <div className="mt-4">
            <ClientForm
              submitLabel="Create client"
              onCancel={() => setShowForm(false)}
              onSubmit={handleCreate}
            />
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {clients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No clients yet.</p>
            <p className="mt-2 text-sm text-slate-500">Add your first client to start tracking meetings and tasks.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/clients/${client.id}`}
                        className="font-medium text-brand-700 hover:text-brand-800"
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
