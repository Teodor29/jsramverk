import { api } from "./client"

export async function getUser() {
  const response = await api.get("/auth/me")
  return response.data
}

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password })
  return response.data
}

export async function register(email, password) {
  const response = await api.post("/auth/register", { email, password })
  return response.data
}
