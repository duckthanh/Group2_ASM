import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RoomList from './pages/RoomList'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Check localStorage for user session
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
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
      </Routes>
    </Router>
  )
}

export default App

