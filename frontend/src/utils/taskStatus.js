export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']

export const TASK_STATUS_LABELS = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
}

export const TASK_PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export function taskStatusTone(status) {
  const tones = {
    TODO: 'amber',
    IN_PROGRESS: 'blue',
    DONE: 'slate',
  }

  return tones[status] || 'slate'
}

export function taskPriorityTone(priority) {
  const tones = {
    LOW: 'slate',
    MEDIUM: 'blue',
    HIGH: 'amber',
  }

  return tones[priority] || 'slate'
}
