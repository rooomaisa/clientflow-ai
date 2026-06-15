import api from './client'

export async function fetchMeetingsForClient(clientId) {
  const { data } = await api.get(`/api/clients/${clientId}/meetings`)
  return data
}
