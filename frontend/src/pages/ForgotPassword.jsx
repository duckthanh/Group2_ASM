import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthNew.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [sent, setSent] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSent(true)
      showToast('Email khôi phục đã được gửi! 📧', 'success')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="auth-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'success' ? '✓' : '⚠'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="auth-container">
        <div className="auth-hero">
          <div className="auth-hero-content">
            <div className="auth-hero-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" fill="#2563EB" opacity="0.1"/>
                <path d="M40 10L15 25V50L40 65L65 50V25L40 10Z" fill="#2563EB"/>
                <path d="M40 22L28 29V51L40 58L52 51V29L40 22Z" fill="white"/>
                <circle cx="40" cy="40" r="8" fill="#2563EB"/>
              </svg>
            </div>
            <h1 className="auth-hero-title">Tìm Trọ</h1>
            <p className="auth-hero-subtitle">
              Đừng lo lắng! <br/>
              Chúng tôi sẽ giúp bạn khôi phục tài khoản
            </p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2 className="auth-title">Quên mật khẩu 🔑</h2>
              <p className="auth-subtitle">Nhập email để nhận liên kết khôi phục</p>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="form-input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </span>
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
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    'Gửi email khôi phục'
                  )}
                </button>
              </form>
            ) : (
              <div className="alert" style={{ 
                background: '#EFF6FF', 
                border: '1px solid #BFDBFE', 
                color: '#1E40AF',
                marginTop: '20px'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <strong>Email đã được gửi!</strong>
                  <p style={{ marginTop: '4px', fontSize: '13px', lineHeight: '1.5' }}>
                    Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
                  </p>
                </div>
              </div>
            )}

            <div className="auth-footer">
              <span className="auth-footer-text">Nhớ mật khẩu rồi?</span>
              <Link to="/login" className="auth-footer-link">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

