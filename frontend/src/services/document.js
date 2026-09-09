import { api } from "./client"

export async function getDocuments() {
  const response = await api.get("/docs")
  return response.data
}

export async function getDocumentById(id) {
  const response = await api.get(`/docs/${id}`)
  return response.data
}

export async function updateDocument(id, document) {
  const response = await api.put(`/docs/${id}`, document)
  return response.data
}

export async function createDocument(document) {
  const response = await api.post("/docs", document)
  return response.data
}

export async function shareDocument(id, email) {
  const response = await api.post(`/docs/share/${id}`, { email })
  return response.data
}
