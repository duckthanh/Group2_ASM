import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import RoomList from './pages/RoomList'
import RoomDetail from './pages/RoomDetail'
import Profile from './pages/Profile'
import UserManagement from './pages/UserManagement'
import MyRooms from './pages/MyRooms'
import MyRoomDetail from './pages/MyRoomDetail'
import BookingRequests from './pages/BookingRequests'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Check localStorage for user session
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('user')
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            color: '#0F172A',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            border: '1px solid #E2E8F0',
            fontSize: '15px',
            fontWeight: '500',
            maxWidth: '500px',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
      />
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={<Home currentUser={currentUser} onLogout={handleLogout} />} 
          />
          <Route 
            path="/login" 
            element={
              currentUser ? 
              <Navigate to="/" replace /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              currentUser ? 
              <Navigate to="/" replace /> : 
              <Register />
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              currentUser ? 
              <Navigate to="/" replace /> : 
              <ForgotPassword />
            } 
          />
          <Route
            path="/rooms/phong-tro"
            element={<RoomList currentUser={currentUser} onLogout={handleLogout} />}
          />
          <Route
            path="/room/:id"
            element={<RoomDetail currentUser={currentUser} onLogout={handleLogout} />}
          />
          <Route
            path="/profile"
            element={
              currentUser ?
              <Profile currentUser={currentUser} onLogout={handleLogout} /> :
              <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin/users"
            element={
              currentUser && currentUser.role === 'ADMIN' ?
              <UserManagement currentUser={currentUser} onLogout={handleLogout} /> :
              <Navigate to="/" replace />
            }
          />
          <Route
            path="/account/rooms"
            element={
              currentUser ?
              <MyRooms currentUser={currentUser} onLogout={handleLogout} /> :
              <Navigate to="/login" replace />
            }
          />
          <Route
            path="/account/rooms/:bookingId"
            element={
              currentUser ?
              <MyRoomDetail currentUser={currentUser} onLogout={handleLogout} /> :
              <Navigate to="/login" replace />
            }
          />
          <Route
            path="/landlord/booking-requests"
            element={
              currentUser ?
              <BookingRequests currentUser={currentUser} onLogout={handleLogout} /> :
              <Navigate to="/login" replace />
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App

