import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import './AuthNew.css'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [success, setSuccess] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!')
      showToast('Mật khẩu xác nhận không khớp!', 'error')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(
        `http://localhost:8080/api/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(password)}`,
        {
          method: 'POST'
        }
      )

      const message = await res.text()

      if (res.ok) {
        setSuccess(true)
        showToast('Mật khẩu đã được đặt lại thành công! ✅', 'success')
        
        // Navigate to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setError(message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.')
        showToast(message || 'Có lỗi xảy ra', 'error')
      }
    } catch (err) {
      const errorMessage = 'Lỗi khi gửi yêu cầu đến máy chủ'
      setError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-new-page">
      {toast && (
        <div className={`toast-new toast-${toast.type}`}>
          <span className="toast-icon-new">{toast.type === 'success' ? '✓' : '⚠'}</span>
          <span>{toast.message}</span>
        </div>
      )}

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
            <h3>ĐẶT LẠI MẬT KHẨU</h3>
            <p>Nhập mật khẩu mới để bảo vệ tài khoản của bạn</p>
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

            {!success ? (
              <>
                <h2 className="auth-new-title">Đặt Lại Mật Khẩu 🔒</h2>
                
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
                    <label className="label-new">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-new"
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      required
                      autoFocus
                      minLength={6}
                    />
                  </div>

                  <div className="form-group-new">
                    <label className="label-new">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-new"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      minLength={6}
                    />
                  </div>

                  <button type="submit" className="btn-new btn-primary-new" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-new"></span>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      'Xác Nhận Đặt Lại Mật Khẩu'
                    )}
                  </button>
                </form>

                <div className="auth-footer-new" style={{ marginTop: '24px' }}>
                  <span>Đã nhớ mật khẩu?</span>
                  <Link to="/login" className="link-new link-bold">Đăng nhập</Link>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '40px',
                  color: 'white'
                }}>
                  ✓
                </div>
                <h2 className="auth-new-title" style={{ marginBottom: '16px' }}>Mật Khẩu Đã Được Đặt Lại!</h2>
                <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.6' }}>
                  Mật khẩu của bạn đã được thay đổi thành công.<br/>
                  Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
                </p>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '12px' }}>
                  Đang chuyển về trang đăng nhập...
                </p>
                <Link 
                  to="/login" 
                  className="btn-new btn-primary-new" 
                  style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}
                >
                  Đăng Nhập Ngay
                </Link>
              </div>
            )}
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

export default ResetPassword