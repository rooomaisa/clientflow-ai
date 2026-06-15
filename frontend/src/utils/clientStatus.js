export const CLIENT_STATUSES = [
  'NEW',
  'ACTIVE',
  'WAITING_FOR_REPLY',
  'COMPLETED',
  'ARCHIVED',
]

export const CLIENT_STATUS_LABELS = {
  NEW: 'New',
  ACTIVE: 'Active',
  WAITING_FOR_REPLY: 'Waiting for reply',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
}

export function clientStatusTone(status) {
  const tones = {
    NEW: 'blue',
    ACTIVE: 'emerald',
    WAITING_FOR_REPLY: 'amber',
    COMPLETED: 'slate',
    ARCHIVED: 'slate',
  }

  return tones[status] || 'slate'
}
