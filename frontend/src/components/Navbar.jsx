import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar({ currentUser, onLogout }) {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/rooms/phong-tro?keyword=${keyword}`)
    } else {
      navigate('/rooms/phong-tro')
    }
  }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">✨ Tìm Trọ</Link>
        <nav className="nav-menu">
          <div className="main-menu">
            <Link to="/rooms/phong-tro" className="nav-link">Thuê phòng trọ</Link>
            
            <form onSubmit={handleSearch} className="nav-search-form">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm"
                className="nav-search-input"
              />
              <button type="submit" className="btn-nav-search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
          
          {!currentUser ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">Đăng nhập</Link>
              <Link to="/register" className="btn">Đăng ký</Link>
            </div>
          ) : (
            <div className="user-info">
              <span className="user-name">
                👤 <span>{currentUser.username}</span>
              </span>
              <button onClick={onLogout} className="btn btn-ghost btn-logout">Đăng xuất</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar

