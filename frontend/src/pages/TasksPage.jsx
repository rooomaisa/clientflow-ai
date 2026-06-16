import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchClients } from '../api/clients'
import { createTask, deleteTask, fetchTasks, toTaskPayload, updateTask } from '../api/tasks'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  taskPriorityTone,
} from '../utils/taskStatus'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

const emptyForm = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '',
  clientId: '',
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formValues, setFormValues] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)

  const clientNames = useMemo(
    () => Object.fromEntries(clients.map((client) => [client.id, client.name])),
    [clients]
  )

  async function loadTasks() {
    try {
      const data = await fetchTasks({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      })
      setTasks(data)
      setError('')
    } catch {
      setError('Could not load tasks. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadPageData() {
      setLoading(true)
      try {
        const [taskData, clientData] = await Promise.all([
          fetchTasks({
            status: statusFilter || undefined,
            priority: priorityFilter || undefined,
          }),
          fetchClients(),
        ])
        setTasks(taskData)
        setClients(clientData)
        setError('')
      } catch {
        setError('Could not load tasks. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }

    loadPageData()
  }, [statusFilter, priorityFilter])

  function updateFormField(field, value) {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  async function handleCreate(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await createTask({
        title: formValues.title.trim(),
        description: formValues.description.trim() || null,
        status: formValues.status,
        priority: formValues.priority,
        dueDate: formValues.dueDate || null,
        clientId: formValues.clientId ? Number(formValues.clientId) : null,
        meetingNoteId: null,
      })
      setFormValues(emptyForm)
      setShowForm(false)
      await loadTasks()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusChange(task, newStatus) {
    setUpdatingTaskId(task.id)
    setError('')

    try {
      const updated = await updateTask(task.id, {
        ...toTaskPayload(task),
        status: newStatus,
      })
      setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setError('Could not update task status.')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  async function handleDelete(task) {
    const confirmed = window.confirm(`Delete task "${task.title}"?`)
    if (!confirmed) return

    try {
      await deleteTask(task.id)
      setTasks((current) => current.filter((item) => item.id !== task.id))
    } catch {
      setError('Could not delete task.')
    }
  }

  if (loading) {
    return <p className="text-slate-600">Loading tasks...</p>
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">Tasks</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Your tasks</h1>
          <p className="mt-2 text-slate-600">Track follow-ups from meetings and update progress as you go.</p>
        </div>
        <Button onClick={() => setShowForm((open) => !open)}>
          {showForm ? 'Close form' : 'Add task'}
        </Button>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      )}

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <Select
          id="statusFilter"
          label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All statuses</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>

        <Select
          id="priorityFilter"
          label="Filter by priority"
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
        >
          <option value="">All priorities</option>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {TASK_PRIORITY_LABELS[priority]}
            </option>
          ))}
        </Select>
      </section>

      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">New task</h2>
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="title"
                label="Title"
                value={formValues.title}
                onChange={(event) => updateFormField('title', event.target.value)}
                required
              />
              <Select
                id="clientId"
                label="Client"
                value={formValues.clientId}
                onChange={(event) => updateFormField('clientId', event.target.value)}
              >
                <option value="">No client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
              <Select
                id="status"
                label="Status"
                value={formValues.status}
                onChange={(event) => updateFormField('status', event.target.value)}
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
              <Select
                id="priority"
                label="Priority"
                value={formValues.priority}
                onChange={(event) => updateFormField('priority', event.target.value)}
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {TASK_PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </Select>
              <Input
                id="dueDate"
                label="Due date"
                type="date"
                value={formValues.dueDate}
                onChange={(event) => updateFormField('dueDate', event.target.value)}
              />
            </div>

            <Textarea
              id="description"
              label="Description"
              value={formValues.description}
              onChange={(event) => updateFormField('description', event.target.value)}
            />

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create task'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {tasks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No tasks match these filters.</p>
            <p className="mt-2 text-sm text-slate-500">
              Tasks appear here after AI processing or when you add one manually.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Due
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      {task.description && (
                        <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {task.clientId ? (
                        <Link
                          to={`/clients/${task.clientId}`}
                          className="font-medium text-brand-700 hover:text-brand-800"
                        >
                          {clientNames[task.clientId] || `Client #${task.clientId}`}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={taskPriorityTone(task.priority)}>
                        {TASK_PRIORITY_LABELS[task.priority] || task.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        disabled={updatingTaskId === task.id}
                        onChange={(event) => handleStatusChange(task, event.target.value)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-600 focus:border-brand-600 focus:ring-2"
                      >
                        {TASK_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {TASK_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(task.dueDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="secondary" onClick={() => handleDelete(task)}>
                        Delete
                      </Button>
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
