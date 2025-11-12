import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RoomList from "./pages/RoomList";
import RoomDetail from "./pages/RoomDetail";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import MyRooms from "./pages/MyRooms";
import MyRoomDetail from "./pages/MyRoomDetail";
import BookingRequests from "./pages/BookingRequests";
import AdminRevenue from "./pages/AdminRevenue";
import MyRoomAnalytics from "./pages/MyRoomAnalytics";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user session
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Đang tải...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            fontSize: "14px",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            cursor: "pointer",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
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
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              currentUser ? <Navigate to="/" replace /> : <Register />
            }
          />
          <Route
            path="/forgot-password"
            element={
              currentUser ? <Navigate to="/" replace /> : <ForgotPassword />
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
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
              currentUser ? (
                <Profile currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/account/rooms"
            element={
              currentUser ? (
                <MyRooms currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/account/rooms/:bookingId"
            element={
              currentUser ? (
                <MyRoomDetail
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/landlord/booking-requests"
            element={
              currentUser ? (
                <BookingRequests
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/users"
            element={
              currentUser && currentUser.role === "ADMIN" ? (
                <UserManagement
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              currentUser && currentUser.role === "ADMIN" ? (
                <Dashboard currentUser={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin/revenue"
            element={
              currentUser && currentUser.role === "ADMIN" ? (
                <AdminRevenue
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/revenue/:userId"
            element={
              <MyRoomAnalytics
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
