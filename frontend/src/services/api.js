import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:33000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config
    const isTimeout = error?.code === 'ECONNABORTED'
    const isGet = config?.method?.toLowerCase() === 'get'

    if (config && isTimeout && isGet && !config.__retryOnTimeout) {
      config.__retryOnTimeout = true
      config.timeout = 15000
      return api.request(config)
    }

    return Promise.reject(error)
  }
)

export default api
