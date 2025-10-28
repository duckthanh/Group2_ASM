import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import GlowEffects from '../components/GlowEffects'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(email, password)
      
      // Kiểm tra nếu cần nhập mã OTP
      if (response.mfaRequired) {
        setShowOtpInput(true)
        setError('')
      } else {
        // Login thành công, không cần 2FA
        onLogin(response)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập mã 6 số!')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await authAPI.verifyMfa(email, password, otpCode)
      onLogin(response)
      navigate('/')
    } catch (err) {
      setError('Mã OTP không đúng. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setShowOtpInput(false)
    setOtpCode('')
    setError('')
  }

  return (
    <div className="bg-gradient">
      <GlowEffects />
      
      <div className="container auth-container">
        <div className="auth-card">
          {!showOtpInput ? (
            <>
              <h2 className="auth-title">Đăng nhập 🔐</h2>
              <p className="auth-subtitle">Chào mừng bạn quay lại!</p>

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
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              <p className="auth-switch">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="auth-link">Đăng ký ngay</Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="auth-title">Xác thực 2 yếu tố 🔒</h2>
              <p className="auth-subtitle">Nhập mã từ ứng dụng xác thực của bạn</p>

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

              <form onSubmit={handleOtpSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="otpCode" className="form-label">Mã xác thực (6 số)</label>
                  <input
                    type="text"
                    id="otpCode"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="form-input"
                    placeholder="123456"
                    maxLength="6"
                    required
                    style={{
                      fontSize: '24px',
                      letterSpacing: '8px',
                      textAlign: 'center'
                    }}
                  />
                  <p style={{
                    fontSize: '12px',
                    color: '#999',
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    Google Authenticator / Microsoft Authenticator
                  </p>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading || otpCode.length !== 6}>
                  {loading ? 'Đang xác thực...' : 'Xác thực'}
                </button>

                <button 
                  type="button" 
                  onClick={handleBackToLogin}
                  className="btn btn-block"
                  style={{
                    marginTop: '10px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  disabled={loading}
                >
                  Quay lại
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login

