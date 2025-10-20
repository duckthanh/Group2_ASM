import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data  // Returns { id, username, email }
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
}

export const roomAPI = {
  getAllRooms: async () => {
    const response = await api.get('/rooms')
    return response.data
  },
  
  getRoomsByType: async (type) => {
    const response = await api.get(`/rooms/type/${type}`)
    return response.data
  },
  
  searchRooms: async (type, keyword) => {
    const response = await api.get(`/rooms/search`, {
      params: { type, keyword }
    })
    return response.data
  },
  
  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },
}

export default api

