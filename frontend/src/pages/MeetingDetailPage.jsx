import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchClient } from '../api/clients'
import { deleteMeeting, fetchMeeting, processMeetingWithAi, updateMeeting } from '../api/meetings'
import AIAnalysisPanel from '../components/meetings/AIAnalysisPanel'
import MeetingForm from '../components/meetings/MeetingForm'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

export default function MeetingDetailPage() {
  const { clientId, meetingId } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [processing, setProcessing] = useState(false)

  async function loadMeeting() {
    try {
      const [clientData, meetingData] = await Promise.all([
        fetchClient(clientId),
        fetchMeeting(meetingId),
      ])
      setClient(clientData)
      setMeeting(meetingData)
      setError('')
    } catch {
      setError('Could not load this meeting.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeeting()
  }, [clientId, meetingId])

  async function handleUpdate(payload) {
    const updated = await updateMeeting(meetingId, payload)
    setMeeting(updated)
    setEditing(false)
  }

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${meeting.title}"? This also removes AI analysis and related tasks.`)
    if (!confirmed) return

    setDeleting(true)
    try {
      await deleteMeeting(meetingId)
      navigate(`/clients/${clientId}`)
    } catch {
      setError('Could not delete this meeting.')
      setDeleting(false)
    }
  }

  async function handleProcessAi() {
    if (meeting.aiAnalysis) {
      const confirmed = window.confirm(
        'Re-process this meeting? Existing AI analysis and auto-created tasks will be replaced.'
      )
      if (!confirmed) return
    }

    setProcessing(true)
    setError('')

    try {
      const analysis = await processMeetingWithAi(meetingId)
      setMeeting((current) => ({ ...current, aiAnalysis: analysis }))
    } catch (err) {
      setError(err.response?.data?.message || 'AI processing failed. Check your OpenAI key and try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <p className="text-slate-600">Loading meeting...</p>
  }

  if (error && !meeting) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        <Link to={`/clients/${clientId}`} className="text-sm font-medium text-brand-700 hover:text-brand-800">
          Back to client
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to={`/clients/${clientId}`}
            className="text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            ← Back to {client?.name || 'client'}
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{meeting.title}</h1>
            {meeting.aiAnalysis ? (
              <Badge tone="emerald">AI processed</Badge>
            ) : (
              <Badge tone="amber">Not processed</Badge>
            )}
          </div>
          <p className="mt-2 text-slate-600">
            Meeting date: {meeting.meetingDate ? formatDate(meeting.meetingDate) : '—'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!editing && (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit meeting
            </Button>
          )}
          <Button onClick={handleProcessAi} disabled={processing}>
            {processing ? 'Processing with AI...' : meeting.aiAnalysis ? 'Re-process with AI' : 'Process with AI'}
          </Button>
          <Button variant="secondary" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete meeting'}
          </Button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Meeting notes</h2>

        {editing ? (
          <div className="mt-4">
            <MeetingForm
              initialValues={meeting}
              submitLabel="Save changes"
              onCancel={() => setEditing(false)}
              onSubmit={handleUpdate}
            />
          </div>
        ) : (
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            {meeting.rawNotes}
          </pre>
        )}
      </section>

      {meeting.aiAnalysis && (
        <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <AIAnalysisPanel analysis={meeting.aiAnalysis} />
        </section>
      )}
    </div>
  )
}
