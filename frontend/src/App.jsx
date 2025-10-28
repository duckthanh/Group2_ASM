import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RoomList from './pages/RoomList'
import RoomDetail from './pages/RoomDetail'
import Profile from './pages/Profile'
import UserManagement from './pages/UserManagement'
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
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  )
}

export default App

