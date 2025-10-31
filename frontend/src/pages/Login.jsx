import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { customToast } from '../utils/customToast.jsx'
import { authAPI } from '../services/api'
import './AuthNew.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  // Load remembered email when component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const savedRememberMe = localStorage.getItem('rememberMe')
    
    if (savedEmail && savedRememberMe === 'true') {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự.')
      return
    }

    setLoading(true)

    try {
      const user = await authAPI.login(email, password)
      
      // Save or remove email based on rememberMe checkbox
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('rememberedEmail')
      }
      
      onLogin(user)
      customToast.success('Đăng nhập thành công! 🎉')
      
      const from = location.state?.from?.pathname || '/'
      setTimeout(() => navigate(from), 1000)
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Email hoặc mật khẩu không đúng'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-new-page">
      <div className="auth-new-container">
        {/* Left Side - Illustration */}
        <div className="auth-new-left">
          <div className="auth-illustration">
            <div className="phone-mockup">
              <div className="phone-content">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 7.5L11.25 18.75V37.5L30 48.75L48.75 37.5V18.75L30 7.5Z" fill="#2563EB"/>
                  <path d="M30 16.5L21 22.5V37.5L30 43.5L39 37.5V22.5L30 16.5Z" fill="white"/>
                </svg>
                <h2>TÌM TRỌ</h2>
              </div>
            </div>
            
            {/* Floating Avatars */}
            <div className="avatar-float avatar-1">
              <div className="avatar-circle"></div>
            </div>
            <div className="avatar-float avatar-2">
              <div className="avatar-circle"></div>
            </div>
            <div className="avatar-float avatar-3">
              <div className="avatar-circle"></div>
            </div>
            <div className="avatar-float avatar-4">
              <div className="avatar-circle"></div>
            </div>
            <div className="avatar-float avatar-5">
              <div className="avatar-circle"></div>
            </div>
            <div className="avatar-float avatar-6">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="#4ADE80">
                <path d="M20 2L18 12L8 10L20 20L22 10L32 12L20 2Z"/>
                <ellipse cx="20" cy="32" rx="6" ry="4" fill="#4ADE80"/>
              </svg>
            </div>
            <div className="avatar-float avatar-7">
              <svg width="40" height="50" viewBox="0 0 40 50" fill="#10B981">
                <rect x="15" y="30" width="10" height="20" rx="2" fill="#8B4513"/>
                <path d="M8 30C8 22 12 18 20 15C28 18 32 22 32 30H8Z" fill="#10B981"/>
                <ellipse cx="20" cy="15" rx="8" ry="10" fill="#10B981"/>
              </svg>
            </div>
          </div>

          <div className="auth-stats">
            <h3>HƠN <span className="highlight">50.000</span> CHỦ TRỌ</h3>
            <p>Tin tưởng và sử dụng dịch vụ của timtro.com</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-new-right">
          <div className="auth-form-box">
            <div className="auth-logo-top">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <path d="M25 6L10 15V30L25 39L40 30V15L25 6Z" fill="#2563EB"/>
                <path d="M25 14L18 18V32L25 36L32 32V18L25 14Z" fill="white"/>
              </svg>
            </div>

            <h2 className="auth-new-title">Chào Mừng Bạn Đến Với Tìm Trọ</h2>
            
            {error && (
              <div className="alert-new alert-error-new">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-new-form">
              <div className="form-group-new">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-new"
                  placeholder="Email hoặc Số điện thoại"
                  required
                />
              </div>

              <div className="form-group-new">
                <div className="password-wrapper-new">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-new"
                    placeholder="Mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-new"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-options-new">
                <label className="checkbox-new">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Ghi nhớ tôi</span>
                </label>
                <Link to="/forgot-password" className="link-new">Quên mật khẩu?</Link>
              </div>

              <button type="submit" className="btn-new btn-primary-new" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-new"></span>
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            <div className="divider-new">
              <span>Hoặc đăng nhập bằng</span>
            </div>

            <div className="social-login-new">
              <button className="social-btn-new google-btn-new" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button className="social-btn-new facebook-btn-new" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="social-btn-new tiktok-btn-new" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </button>
            </div>

            <div className="auth-footer-new">
              <span>Chưa có tài khoản?</span>
              <Link to="/register" className="link-new link-bold">Đăng ký tài khoản</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-bottom-links">
        <Link to="/terms" className="bottom-link">Điều khoản</Link>
        <span className="divider-dot">|</span>
        <Link to="/help" className="bottom-link">Trợ giúp</Link>
      </div>
    </div>
  )
}

export default Login
