import axios from "axios"
import { getToken } from "./token"

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://jsramverk-editor-teli21-g8dfgkbabgfygce2.swedencentral-01.azurewebsites.net/api",
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
