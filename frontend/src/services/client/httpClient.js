import axios from 'axios'

// Base API resolution:
// 1. In production (Vercel): Uses VITE_API_BASE_URL (e.g. https://virtualtune-api.onrender.com)
// 2. In local development: Falls back to '/api', proxied cleanly via Vite dev server
const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '').trim()
const cleanBase = rawApiBase.replace(/\/+$/, '')
export const API_BASE = cleanBase
  ? (cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`)
  : '/api'

export const ENABLE_MOCK = true

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach Bearer JWT token automatically to every outgoing request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('vt_auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle 401 Unauthorized globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: dispatch event or handle token expiration
    }
    return Promise.reject(error)
  }
)

export default client

