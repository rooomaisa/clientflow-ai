import api from './client'

export async function fetchClients() {
  const { data } = await api.get('/api/clients')
  return data
}

export async function fetchClient(id) {
  const { data } = await api.get(`/api/clients/${id}`)
  return data
}

export async function createClient(payload) {
  const { data } = await api.post('/api/clients', payload)
  return data
}

export async function updateClient(id, payload) {
  const { data } = await api.put(`/api/clients/${id}`, payload)
  return data
}

export async function deleteClient(id) {
  await api.delete(`/api/clients/${id}`)
}
