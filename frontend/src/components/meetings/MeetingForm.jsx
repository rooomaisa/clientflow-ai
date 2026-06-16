import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'

function todayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

const emptyForm = {
  title: '',
  meetingDate: todayInputValue(),
  rawNotes: '',
}

export function toMeetingFormValues(meeting) {
  if (!meeting) {
    return emptyForm
  }

  return {
    title: meeting.title || '',
    meetingDate: meeting.meetingDate || todayInputValue(),
    rawNotes: meeting.rawNotes || '',
  }
}

export default function MeetingForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save meeting' }) {
  const [values, setValues] = useState(toMeetingFormValues(initialValues))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await onSubmit({
        title: values.title.trim(),
        meetingDate: values.meetingDate,
        rawNotes: values.rawNotes.trim(),
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save meeting. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="title"
          label="Meeting title"
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
          required
        />
        <Input
          id="meetingDate"
          label="Meeting date"
          type="date"
          value={values.meetingDate}
          onChange={(event) => updateField('meetingDate', event.target.value)}
          required
        />
      </div>

      <Textarea
        id="rawNotes"
        label="Meeting notes"
        value={values.rawNotes}
        onChange={(event) => updateField('rawNotes', event.target.value)}
        required
        placeholder="Paste your raw meeting notes here. AI will summarize them and suggest follow-up tasks."
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
