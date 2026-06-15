import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteClient, fetchClient, updateClient } from '../api/clients'
import { fetchMeetingsForClient } from '../api/meetings'
import ClientForm from '../components/clients/ClientForm'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CLIENT_STATUS_LABELS, clientStatusTone } from '../utils/clientStatus'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

export default function ClientDetailPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function loadClient() {
    try {
      const [clientData, meetingData] = await Promise.all([
        fetchClient(clientId),
        fetchMeetingsForClient(clientId),
      ])
      setClient(clientData)
      setMeetings(meetingData)
      setError('')
    } catch {
      setError('Could not load this client.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClient()
  }, [clientId])

  async function handleUpdate(payload) {
    const updated = await updateClient(clientId, payload)
    setClient(updated)
    setEditing(false)
  }

  async function handleDelete() {
    const confirmed = window.confirm(`Delete ${client.name}? This also removes their meetings and related tasks.`)
    if (!confirmed) return

    setDeleting(true)
    try {
      await deleteClient(clientId)
      navigate('/clients')
    } catch {
      setError('Could not delete this client.')
      setDeleting(false)
    }
  }

  if (loading) {
    return <p className="text-slate-600">Loading client...</p>
  }

  if (error && !client) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        <Link to="/clients" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          Back to clients
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/clients" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            ← Back to clients
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>
            <Badge tone={clientStatusTone(client.status)}>
              {CLIENT_STATUS_LABELS[client.status] || client.status}
            </Badge>
          </div>
          <p className="mt-2 text-slate-600">{client.companyName || 'No company listed'}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!editing && (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit client
            </Button>
          )}
          <Button variant="secondary" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete client'}
          </Button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Client details</h2>

        {editing ? (
          <div className="mt-4">
            <ClientForm
              initialValues={client}
              submitLabel="Save changes"
              onCancel={() => setEditing(false)}
              onSubmit={handleUpdate}
            />
          </div>
        ) : (
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="mt-1 text-slate-900">{client.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Phone</dt>
              <dd className="mt-1 text-slate-900">{client.phone || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-slate-500">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap text-slate-900">{client.notes || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Created</dt>
              <dd className="mt-1 text-slate-900">{formatDate(client.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Last updated</dt>
              <dd className="mt-1 text-slate-900">{formatDate(client.updatedAt)}</dd>
            </div>
          </dl>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Meeting notes</h2>
            <p className="mt-1 text-sm text-slate-500">Full meeting management arrives in Phase 13.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {meetings.length} total
          </span>
        </div>

        {meetings.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No meeting notes yet for this client.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {meetings.map((meeting) => (
              <li
                key={meeting.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{meeting.title}</p>
                  <p className="text-sm text-slate-500">
                    {meeting.meetingDate ? formatDate(meeting.meetingDate) : 'No date set'}
                  </p>
                </div>
                {meeting.aiAnalysis ? (
                  <Badge tone="emerald">AI processed</Badge>
                ) : (
                  <Badge tone="amber">Not processed</Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
