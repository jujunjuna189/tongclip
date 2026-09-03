import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clipper_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
