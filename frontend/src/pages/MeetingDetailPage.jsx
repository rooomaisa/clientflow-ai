import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles, Trash2 } from 'lucide-react'
import { fetchClient } from '../api/clients'
import { deleteMeeting, fetchMeeting, processMeetingWithAi, updateMeeting } from '../api/meetings'
import AIAnalysisPanel from '../components/meetings/AIAnalysisPanel'
import AIProcessingLoader from '../components/meetings/AIProcessingLoader'
import MeetingForm from '../components/meetings/MeetingForm'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { SkeletonPageHeader } from '../components/ui/Skeleton'
import { useToast } from '../components/ui/Toast'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

function previewNotes(notes, maxLength = 280) {
  if (!notes) return ''
  if (notes.length <= maxLength) return notes
  return `${notes.slice(0, maxLength).trimEnd()}…`
}

export default function MeetingDetailPage() {
  const { clientId, meetingId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const aiSectionRef = useRef(null)
  const [client, setClient] = useState(null)
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [notesExpanded, setNotesExpanded] = useState(false)

  async function loadMeeting() {
    try {
      const [clientData, meetingData] = await Promise.all([
        fetchClient(clientId),
        fetchMeeting(meetingId),
      ])
      setClient(clientData)
      setMeeting(meetingData)
      setNotesExpanded(!meetingData.aiAnalysis)
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
    toast('Meeting updated')
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${meeting.title}"? This also removes AI analysis and related tasks.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      await deleteMeeting(meetingId)
      toast('Meeting deleted')
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
      setNotesExpanded(false)
      setEditing(false)
      toast('AI analysis complete')
      window.setTimeout(() => {
        aiSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    } catch (err) {
      setError(err.response?.data?.message || 'AI processing failed. Check your OpenAI key and try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonPageHeader />
        <div className="card h-48 animate-pulse" />
      </div>
    )
  }

  if (error && !meeting) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        <Link
          to={`/clients/${clientId}`}
          className="link-accent inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
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
            className="link-accent inline-flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {client?.name || 'client'}
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="page-header-title">{meeting.title}</h1>
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
          <Button
            variant={meeting.aiAnalysis ? 'primary' : 'ai'}
            onClick={handleProcessAi}
            disabled={processing}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {processing
              ? 'Processing…'
              : meeting.aiAnalysis
                ? 'Re-process with AI'
                : 'Process with AI'}
          </Button>
          <Button variant="secondary" onClick={handleDelete} disabled={deleting} className="gap-2">
            <Trash2 className="h-4 w-4" />
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      )}

      {processing && <AIProcessingLoader />}

      {meeting.aiAnalysis && !processing && (
        <section
          ref={aiSectionRef}
          className="card-accent scroll-mt-24 border-violet-200/60 bg-gradient-to-br from-violet-50/30 to-white p-6 shadow-glow"
        >
          <AIAnalysisPanel analysis={meeting.aiAnalysis} />
        </section>
      )}

      <section className="card-accent p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            {meeting.aiAnalysis ? 'Original meeting notes' : 'Meeting notes'}
          </h2>
          {meeting.aiAnalysis && !editing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setNotesExpanded((current) => !current)}
              className="gap-1.5"
            >
              {notesExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide notes
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show full notes
                </>
              )}
            </Button>
          )}
        </div>

        {editing ? (
          <div className="mt-4">
            <MeetingForm
              initialValues={meeting}
              submitLabel="Save changes"
              onCancel={() => setEditing(false)}
              onSubmit={handleUpdate}
            />
          </div>
        ) : meeting.aiAnalysis && !notesExpanded ? (
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-500">
            {previewNotes(meeting.rawNotes)}
          </pre>
        ) : (
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-700">
            {meeting.rawNotes}
          </pre>
        )}
      </section>
    </div>
  )
}
