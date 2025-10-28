import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navbar({ currentUser, onLogout }) {
  const [keyword, setKeyword] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/rooms/phong-tro?keyword=${keyword}`)
    } else {
      navigate('/rooms/phong-tro')
    }
  }

  const handleProfileClick = () => {
    setShowUserDropdown(false)
    navigate('/profile')
  }

  const handleLogout = () => {
    setShowUserDropdown(false)
    onLogout()
  }

  const handleContactClick = (e) => {
    e.preventDefault()
    
    // Nếu đang ở trang chủ, scroll xuống phần liên hệ
    if (location.pathname === '/') {
      const contactSection = document.querySelector('.contact-section')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // Nếu đang ở trang khác, chuyển về trang chủ với hash #contact
      navigate('/#contact')
      // Sau khi navigate, scroll xuống
      setTimeout(() => {
        const contactSection = document.querySelector('.contact-section')
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const handleAboutClick = (e) => {
    e.preventDefault()
    
    // Nếu đang ở trang chủ, scroll xuống phần giới thiệu
    if (location.pathname === '/') {
      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // Nếu đang ở trang khác, chuyển về trang chủ với hash #about
      navigate('/#about')
      // Sau khi navigate, scroll xuống
      setTimeout(() => {
        const aboutSection = document.getElementById('about')
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">✨ Tìm Trọ</Link>
        <nav className="nav-menu">
          <div className="main-menu">
            <Link to="/" className="nav-link">Trang chủ</Link>
            <Link to="/rooms/phong-tro" className="nav-link">Danh sách trọ</Link>
            <a href="#about" onClick={handleAboutClick} className="nav-link">Giới thiệu</a>
            <a href="#contact" onClick={handleContactClick} className="nav-link">Liên hệ</a>
          </div>
          
          {!currentUser ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">Đăng nhập</Link>
              <Link to="/register" className="btn">Đăng ký</Link>
            </div>
          ) : (
            <div className="user-info-dropdown">
              <button 
                className="user-name-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                👤 <span>{currentUser.username}</span>
                {currentUser.role === 'ADMIN' && (
                  <span className="admin-badge">ADMIN</span>
                )}
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {showUserDropdown && (
                <div className="user-dropdown-menu">
                  <button onClick={handleProfileClick} className="dropdown-item">
                    <span className="dropdown-icon">👤</span>
                    Hồ sơ của tôi
                  </button>
                  {currentUser.role === 'ADMIN' && (
                    <Link to="/admin/users" className="dropdown-item">
                      <span className="dropdown-icon">👥</span>
                      Quản lý người dùng
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <span className="dropdown-icon">🚪</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar

