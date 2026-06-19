import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Plus } from 'lucide-react'
import { fetchClients } from '../api/clients'
import { createTask, deleteTask, fetchTasks, toTaskPayload, updateTask } from '../api/tasks'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import Select from '../components/ui/Select'
import { SkeletonPageHeader, SkeletonTable } from '../components/ui/Skeleton'
import Textarea from '../components/ui/Textarea'
import { useToast } from '../components/ui/Toast'
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
  const { toast } = useToast()
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
      toast('Task created')
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
      toast('Task status updated')
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
      toast('Task deleted')
    } catch {
      setError('Could not delete task.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonPageHeader />
        <SkeletonTable rows={5} cols={6} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Tasks"
        title="Your tasks"
        description="Track follow-ups from meetings and update progress as you go."
      >
        <Button onClick={() => setShowForm((open) => !open)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? 'Close form' : 'Add task'}
        </Button>
      </PageHeader>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      )}

      <section className="card-accent grid gap-4 p-6 md:grid-cols-2">
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
        <section className="card-accent p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">New task</h2>
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
                {submitting ? 'Creating…' : 'Create task'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </section>
      )}

      <section className="card-accent overflow-hidden">
        {tasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No tasks match these filters"
            description="Tasks appear here after AI processing or when you add one manually."
            actionLabel="Add task"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  {['Task', 'Client', 'Priority', 'Status', 'Due', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className={`px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                        header === 'Actions' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.map((task) => (
                  <tr key={task.id} className="transition hover:bg-slate-50/80">
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
                          className="link-accent font-medium"
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
                        className="input-base !py-2"
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
                      <Button variant="secondary" size="sm" onClick={() => handleDelete(task)}>
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
