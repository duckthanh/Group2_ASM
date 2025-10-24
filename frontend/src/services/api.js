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

// Handle token expiration and 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - clear localStorage and reload
      console.error('Token expired or unauthorized. Logging out...')
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Helper function to add user ID header
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id
}

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data  // Returns { id, username, email, phoneNumber, address, role, accessToken, refreshToken }
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

// Saved Rooms API
export const savedRoomAPI = {
  saveRoom: async (roomId) => {
    const response = await api.post(`/saved-rooms/${roomId}`)
    return response.data
  },

  unsaveRoom: async (roomId) => {
    const response = await api.delete(`/saved-rooms/${roomId}`)
    return response.data
  },

  getSavedRooms: async () => {
    const response = await api.get('/saved-rooms')
    return response.data
  },

  checkIfSaved: async (roomId) => {
    const response = await api.get(`/saved-rooms/${roomId}/check`)
    return response.data
  },
}

// Room Reports API
export const roomReportAPI = {
  createReport: async (roomId, reportData) => {
    const response = await api.post(`/reports/rooms/${roomId}`, reportData)
    return response.data
  },

  getAllReports: async () => {
    const response = await api.get('/reports')
    return response.data
  },

  getReportsByStatus: async (status) => {
    const response = await api.get(`/reports/status/${status}`)
    return response.data
  },

  getReportsByRoom: async (roomId) => {
    const response = await api.get(`/reports/rooms/${roomId}`)
    return response.data
  },

  updateReportStatus: async (reportId, status) => {
    const response = await api.put(`/reports/${reportId}/status`, null, {
      params: { status }
    })
    return response.data
  },
}

// Viewing Schedules API
export const viewingScheduleAPI = {
  createSchedule: async (roomId, scheduleData) => {
    const response = await api.post(`/viewing-schedules/rooms/${roomId}`, scheduleData)
    return response.data
  },

  getMySchedules: async () => {
    const response = await api.get('/viewing-schedules/my-schedules')
    return response.data
  },

  getRoomSchedules: async (roomId) => {
    const response = await api.get(`/viewing-schedules/rooms/${roomId}`)
    return response.data
  },

  getSchedulesByStatus: async (status) => {
    const response = await api.get(`/viewing-schedules/status/${status}`)
    return response.data
  },

  updateScheduleStatus: async (scheduleId, status) => {
    const response = await api.put(`/viewing-schedules/${scheduleId}/status`, null, {
      params: { status }
    })
    return response.data
  },

  deleteSchedule: async (scheduleId) => {
    const response = await api.delete(`/viewing-schedules/${scheduleId}`)
    return response.data
  },
}

// My Rooms API
export const myRoomsAPI = {
  // Get all my rooms
  getMyRooms: async (status = null, keyword = null) => {
    const userId = getUserId()
    const params = {}
    if (status) params.status = status
    if (keyword) params.q = keyword
    
    const response = await api.get('/me/rooms', {
      params,
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Get room detail
  getMyRoomDetail: async (bookingId) => {
    const userId = getUserId()
    const response = await api.get(`/me/rooms/${bookingId}`, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Create booking (HOLD or DEPOSIT)
  createBooking: async (bookingData) => {
    const userId = getUserId()
    const response = await api.post('/me/rooms', bookingData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Make payment
  makePayment: async (bookingId, paymentData) => {
    const userId = getUserId()
    const response = await api.post(`/me/rooms/${bookingId}/payments`, paymentData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Get payments
  getPayments: async (bookingId) => {
    const userId = getUserId()
    const response = await api.get(`/me/rooms/${bookingId}/payments`, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Sign contract
  signContract: async (bookingId) => {
    const userId = getUserId()
    const response = await api.post(`/me/rooms/${bookingId}/contract/sign`, {}, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason) => {
    const userId = getUserId()
    const response = await api.post(`/me/rooms/${bookingId}/cancel`, { reason }, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Renew lease
  renewLease: async (bookingId, months) => {
    const userId = getUserId()
    const response = await api.post(`/me/rooms/${bookingId}/renew`, { months }, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // End lease
  endLease: async (bookingId) => {
    const userId = getUserId()
    const response = await api.post(`/me/rooms/${bookingId}/handover`, {}, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Create issue
  createIssue: async (bookingId, issueData) => {
    const userId = getUserId()
    const response = await api.post(`/me/rooms/${bookingId}/issues`, issueData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },

  // Upload document
  uploadDocument: async (bookingId, documentData) => {
    const userId = getUserId()
    const response = await api.post(`/me/rooms/${bookingId}/documents`, documentData, {
      headers: { 'X-User-Id': userId }
    })
    return response.data
  },
}

export default api

