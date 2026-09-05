import { api } from "./client"

export async function getDocuments() {
  const response = await api.get("/")
  return response.data
}

export async function getDocumentById(id) {
  const response = await api.get(`/${id}`)
  return response.data
}

export async function updateDocument(id, document) {
  const response = await api.put(`/${id}`, document)
  return response.data
}
