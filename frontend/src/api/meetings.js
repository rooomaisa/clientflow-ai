import api from './client'

export async function fetchMeetingsForClient(clientId) {
  const { data } = await api.get(`/api/clients/${clientId}/meetings`)
  return data
}

export async function fetchMeeting(meetingId) {
  const { data } = await api.get(`/api/meetings/${meetingId}`)
  return data
}

export async function createMeeting(clientId, payload) {
  const { data } = await api.post(`/api/clients/${clientId}/meetings`, payload)
  return data
}

export async function updateMeeting(meetingId, payload) {
  const { data } = await api.put(`/api/meetings/${meetingId}`, payload)
  return data
}

export async function deleteMeeting(meetingId) {
  await api.delete(`/api/meetings/${meetingId}`)
}

export async function processMeetingWithAi(meetingId) {
  const { data } = await api.post(`/api/meetings/${meetingId}/process-ai`)
  return data
}
