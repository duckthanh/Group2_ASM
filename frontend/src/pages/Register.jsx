import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import GlowEffects from '../components/GlowEffects'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const registerResponse = await authAPI.register(formData)
      
      // Auto login để lấy JWT token
      const loginResponse = await authAPI.login(formData.email, formData.password)
      
      // Lưu thông tin user + JWT token
      localStorage.setItem('user', JSON.stringify(loginResponse))
      
      // Chuyển đến trang profile
      window.location.href = '/profile'
    } catch (err) {
      setError(err.response?.data?.message || 'Email đã tồn tại hoặc thông tin không hợp lệ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient">
      <GlowEffects />
      
      <div className="container auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Đăng ký ✨</h2>
          <p className="auth-subtitle">Tạo tài khoản mới để bắt đầu</p>

          {error && (
            <div className="error-message" style={{
              background: 'rgba(255, 107, 157, 0.1)',
              border: '1px solid rgba(255, 107, 157, 0.3)',
              color: '#ff9aa2',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Tên người dùng</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="0912345678"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Số nhà, đường, quận, thành phố"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-link">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

