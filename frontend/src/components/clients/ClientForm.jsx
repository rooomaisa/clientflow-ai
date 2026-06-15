import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import { CLIENT_STATUSES, CLIENT_STATUS_LABELS } from '../../utils/clientStatus'

const emptyForm = {
  name: '',
  companyName: '',
  email: '',
  phone: '',
  notes: '',
  status: 'NEW',
}

export function toClientFormValues(client) {
  if (!client) {
    return emptyForm
  }

  return {
    name: client.name || '',
    companyName: client.companyName || '',
    email: client.email || '',
    phone: client.phone || '',
    notes: client.notes || '',
    status: client.status || 'NEW',
  }
}

export default function ClientForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save client' }) {
  const [values, setValues] = useState(toClientFormValues(initialValues))
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
        name: values.name.trim(),
        companyName: values.companyName.trim() || null,
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        notes: values.notes.trim() || null,
        status: values.status,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save client. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="name"
          label="Client name"
          value={values.name}
          onChange={(event) => updateField('name', event.target.value)}
          required
        />
        <Input
          id="companyName"
          label="Company"
          value={values.companyName}
          onChange={(event) => updateField('companyName', event.target.value)}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        <Input
          id="phone"
          label="Phone"
          value={values.phone}
          onChange={(event) => updateField('phone', event.target.value)}
        />
        <Select
          id="status"
          label="Status"
          value={values.status}
          onChange={(event) => updateField('status', event.target.value)}
        >
          {CLIENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {CLIENT_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        id="notes"
        label="Notes"
        value={values.notes}
        onChange={(event) => updateField('notes', event.target.value)}
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
