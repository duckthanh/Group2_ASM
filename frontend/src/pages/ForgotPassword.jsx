import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AuthNew.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ')
      return
    }

    setLoading(true)

    try {
      // Call real API
      const res = await fetch(`http://localhost:8080/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: "POST"
      })

      const message = await res.text()

      if (res.ok) {
        setSuccess(true)
        showToast(message || 'Email đặt lại mật khẩu đã được gửi! 📧', 'success')

        // Navigate back to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setError(message || 'Không tìm thấy email này trong hệ thống')
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
            <h3>KHÔI PHỤC MẬT KHẨU</h3>
            <p>Nhập email của bạn để nhận link đặt lại mật khẩu</p>
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
                <h2 className="auth-new-title">Quên Mật Khẩu?</h2>

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
                      placeholder="Nhập email của bạn"
                      required
                      autoFocus
                    />
                  </div>

                  <button type="submit" className="btn-new btn-primary-new" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-new"></span>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      'Gửi Email Khôi Phục'
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
                  fontSize: '40px'
                }}>
                  ✓
                </div>
                <h2 className="auth-new-title" style={{ marginBottom: '16px' }}>Email Đã Được Gửi!</h2>
                <p style={{ color: '#64748B', fontSize: '15px', lineHeight: '1.6' }}>
                  Vui lòng kiểm tra email <strong>{email}</strong> để đặt lại mật khẩu của bạn.
                </p>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '12px' }}>
                  Đang chuyển về trang đăng nhập...
                </p>
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

export default ForgotPassword
