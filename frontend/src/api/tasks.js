import api from './client'

export async function fetchTasks({ status, priority } = {}) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (priority) params.set('priority', priority)

  const query = params.toString()
  const { data } = await api.get(`/api/tasks${query ? `?${query}` : ''}`)
  return data
}

export async function createTask(payload) {
  const { data } = await api.post('/api/tasks', payload)
  return data
}

export async function updateTask(taskId, payload) {
  const { data } = await api.put(`/api/tasks/${taskId}`, payload)
  return data
}

export async function deleteTask(taskId) {
  await api.delete(`/api/tasks/${taskId}`)
}

export function toTaskPayload(task) {
  return {
    title: task.title,
    description: task.description || null,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate || null,
    clientId: task.clientId || null,
    meetingNoteId: task.meetingNoteId || null,
  }
}
