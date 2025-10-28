import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`
    console.log('JWT Token added to request:', user.accessToken.substring(0, 20) + '...')
  } else {
    console.log('No JWT token found in localStorage')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Helper function to add user ID header
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id
}

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data  // Returns { id, username, role, accessToken, refreshToken, mfaRequired }
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  verifyMfa: async (email, password, code) => {
    const response = await api.post('/auth/mfa/verify', { email, password, code })
    return response.data
  },
}

export const mfaAPI = {
  getStatus: async () => {
    const response = await api.get('/auth/mfa/status')
    return response.data // Returns boolean
  },

  setupInitiate: async () => {
    const response = await api.get('/auth/mfa/setup')
    return response.data // Returns { secret, qrCodeDataUri }
  },

  enable: async (secret, code) => {
    const response = await api.post('/auth/mfa/enable', { secret, code })
    return response.data
  },

  disable: async (code) => {
    const response = await api.post('/auth/mfa/disable', { code })
    return response.data
  },
}

export const roomAPI = {
  getAllRooms: async () => {
    const response = await api.get('/rooms')
    return response.data
  },

  getAvailableRooms: async () => {
    const response = await api.get('/rooms/available')
    return response.data
  },

  getMyRooms: async () => {
    const userId = getUserId()
    const response = await api.get('/rooms/my-rooms', {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },
  
  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },

  createRoom: async (roomData) => {
    const userId = getUserId()
    const response = await api.post('/rooms', roomData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  updateRoom: async (roomId, roomData) => {
    const userId = getUserId()
    const response = await api.put(`/rooms/${roomId}`, roomData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  deleteRoom: async (roomId) => {
    const userId = getUserId()
    const response = await api.delete(`/rooms/${roomId}`, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  searchRooms: async (keyword, location) => {
    const params = {}
    if (keyword) params.keyword = keyword
    if (location) params.location = location
    
    const response = await api.get('/rooms/search', { params })
    return response.data
  },

  filterRooms: async (filterData) => {
    const response = await api.post('/rooms/filter', filterData)
    return response.data
  },
}

export const userAPI = {
  getAllUsers: async () => {
    const userId = getUserId()
    const response = await api.get('/users', {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  deleteUser: async (userId) => {
    const currentUserId = getUserId()
    const response = await api.delete(`/users/${userId}`, {
      headers: { 'X-User-Id': currentUserId }
    })
    return response.data
  },

  updateUserRole: async (userId, role) => {
    const currentUserId = getUserId()
    const response = await api.put(`/users/${userId}/role`, 
      { role },
      { headers: { 'X-User-Id': currentUserId } }
    )
    return response.data
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  changePassword: async (userId, passwordData) => {
    const response = await api.put(`/users/${userId}/change-password`, passwordData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },
}

export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
}


export const bookingAPI = {
  createBooking: async (bookingData) => {
    const userId = getUserId()
    const response = await api.post('/bookings', bookingData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  getMyBookings: async () => {
    const userId = getUserId()
    const response = await api.get('/bookings/my-bookings', {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  getBookingsByRoom: async (roomId) => {
    const response = await api.get(`/bookings/room/${roomId}`)
    return response.data
  },

  confirmBooking: async (bookingId) => {
    const userId = getUserId()
    const response = await api.put(`/bookings/${bookingId}/confirm`, {}, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  cancelBooking: async (bookingId) => {
    const userId = getUserId()
    const response = await api.put(`/bookings/${bookingId}/cancel`, {}, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },
}

export default api

