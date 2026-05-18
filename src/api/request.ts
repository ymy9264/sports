import axios from 'axios'
import router from '@/router'

const request = axios.create()

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('loginInfo')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('loginInfo')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request