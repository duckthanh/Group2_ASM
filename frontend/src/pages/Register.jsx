import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { customToast } from '../utils/customToast.jsx'
import { authAPI } from '../services/api'
import './AuthNew.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
<<<<<<< HEAD
  const [toast, setToast] = useState(null)
  
  const navigate = useNavigate()

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

=======
  
  const navigate = useNavigate()

>>>>>>> origin/phong28
  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value || value.trim().length < 2) {
          return 'Vui lòng nhập tên hợp lệ (tối thiểu 2 ký tự).'
        }
        if (value.trim().length > 40) {
          return 'Tên không được vượt quá 40 ký tự.'
        }
        return ''
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Email không hợp lệ.'
        }
        return ''
        
      case 'phoneNumber':
        const phoneRegex = /^[0-9]{9,11}$/
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'SĐT không hợp lệ (9-11 số).'
        }
        return ''
        
      case 'address':
        if (!value || value.trim().length < 5) {
          return 'Vui lòng nhập địa chỉ chi tiết hơn.'
        }
        return ''
        
      case 'password':
        if (value.length < 6) {
          return 'Mật khẩu tối thiểu 6 ký tự.'
        }
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
          return 'Mật khẩu phải bao gồm cả chữ và số.'
        }
        return ''
        
      case 'confirmPassword':
        if (value !== formData.password) {
          return 'Mật khẩu xác nhận không khớp.'
        }
        return ''
        
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') { // Skip confirmPassword for backend
        const error = validateField(key, formData[key])
        if (error) newErrors[key] = error
      }
    })

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registerData } = formData
      
      await authAPI.register(registerData)
      
      // Auto login
      const loginResponse = await authAPI.login(formData.email, formData.password)
      localStorage.setItem('user', JSON.stringify(loginResponse))
      
<<<<<<< HEAD
      showToast('Đăng ký thành công! 🎉', 'success')
=======
      customToast.success('Đăng ký thành công! 🎉')
>>>>>>> origin/phong28
      
      setTimeout(() => {
        window.location.href = '/profile'
      }, 1500)
      
    } catch (err) {
<<<<<<< HEAD
      const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra'
      
      if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setErrors(prev => ({ ...prev, email: 'Email đã được sử dụng.' }))
      } else {
        showToast(errorMessage, 'error')
=======
      console.log('=== REGISTER ERROR DEBUG ===')
      console.log('Full error:', err)
      console.log('Error response:', err.response)
      console.log('Error response data:', err.response?.data)
      console.log('Error response data (stringified):', JSON.stringify(err.response?.data, null, 2))
      console.log('Error message:', err.response?.data?.message)
      console.log('Error error:', err.response?.data?.error)
      console.log('Status code:', err.response?.status)
      console.log('===========================')
      
      const errorData = err.response?.data
      const errorMessage = errorData?.message || errorData?.error || errorData?.details || 'Đã có lỗi xảy ra'
      const statusCode = err.response?.status
      
      // Convert error data to string for checking
      const errorString = JSON.stringify(errorData || {}).toLowerCase()
      const messageString = String(errorMessage).toLowerCase()
      
      // Check for duplicate email - common patterns
      if (statusCode === 500 || statusCode === 400 || statusCode === 409) {
        // Check if email already exists
        if (messageString.includes('email') || 
            errorString.includes('email') ||
            messageString.includes('already') || 
            messageString.includes('exist') ||
            messageString.includes('duplicate') ||
            messageString.includes('unique') ||
            messageString.includes('constraint') ||
            errorString.includes('email_unique') ||
            errorString.includes('uk_email')) {
          setErrors(prev => ({ ...prev, email: 'Email này đã được đăng ký.' }))
          customToast.error('Email này đã có tài khoản. Vui lòng đăng nhập! 🔑')
        } 
        // Check if phone number already exists
        else if (messageString.includes('phone') || 
                 errorString.includes('phone') ||
                 messageString.includes('số điện thoại')) {
          setErrors(prev => ({ ...prev, phoneNumber: 'Số điện thoại đã được sử dụng.' }))
          customToast.error('Số điện thoại này đã có tài khoản!')
        }
        // Check if username already exists
        else if (messageString.includes('username') || 
                 errorString.includes('username')) {
          setErrors(prev => ({ ...prev, username: 'Tên này đã được sử dụng.' }))
          customToast.error('Tên người dùng đã tồn tại!')
        }
        // If we can't determine the field but it's clearly a duplicate error
        else if (errorString.includes('duplicate') || 
                 errorString.includes('unique') || 
                 errorString.includes('constraint')) {
          customToast.error('Thông tin này đã được sử dụng. Email hoặc số điện thoại có thể đã tồn tại!')
        }
        // Generic server error
        else {
          customToast.error(errorMessage)
        }
      }
      // Other errors
      else {
        customToast.error(errorMessage)
>>>>>>> origin/phong28
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-new-page">
<<<<<<< HEAD
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
            <h3>HƠN <span className="highlight">50.000</span> CHỦ TRỌ</h3>
            <p>Tin tưởng và sử dụng dịch vụ của timtro.com</p>
          </div>
        </div>
=======
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
>>>>>>> origin/phong28

        {/* Right Side - Form */}
        <div className="auth-new-right">
          <div className="auth-form-box">
            <h2 className="auth-new-title">Đăng Ký Tài Khoản Mới</h2>

            <form onSubmit={handleSubmit} className="auth-new-form">
              <div className="form-group-new">
                <label className="label-new">Họ và Tên</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`input-new ${errors.username ? 'input-error-new' : ''}`}
                  placeholder="Nhập vào Họ và Tên"
                  required
                />
                {errors.username && <span className="error-text-new">{errors.username}</span>}
              </div>

              <div className="form-group-new">
                <label className="label-new">Email / Số điện thoại</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-new ${errors.email ? 'input-error-new' : ''}`}
                  placeholder="Nhập vào Email hoặc Số điện thoại"
                  required
                />
                {errors.email && <span className="error-text-new">{errors.email}</span>}
              </div>

              <div className="form-row-new">
                <div className="form-group-new">
                  <label className="label-new">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`input-new ${errors.phoneNumber ? 'input-error-new' : ''}`}
                    placeholder="Số điện thoại"
                    required
                  />
                  {errors.phoneNumber && <span className="error-text-new">{errors.phoneNumber}</span>}
                </div>

                <div className="form-group-new">
                  <label className="label-new">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`input-new ${errors.address ? 'input-error-new' : ''}`}
                    placeholder="Địa chỉ"
                    required
                  />
                  {errors.address && <span className="error-text-new">{errors.address}</span>}
                </div>
              </div>

              <div className="form-group-new">
                <label className="label-new">Mật khẩu</label>
                <div className="password-wrapper-new">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-new ${errors.password ? 'input-error-new' : ''}`}
                    placeholder="Nhập vào mật khẩu"
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
                {errors.password && <span className="error-text-new">{errors.password}</span>}
              </div>

              <div className="form-group-new">
                <label className="label-new">Xác nhận mật khẩu</label>
                <div className="password-wrapper-new">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-new ${errors.confirmPassword ? 'input-error-new' : ''}`}
                    placeholder="Nhập vào mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-new"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && <span className="error-text-new">{errors.confirmPassword}</span>}
              </div>

              <div className="form-footer-text">
                <span>Bạn đã có tài khoản? </span>
                <Link to="/login" className="link-new link-bold">Đăng nhập</Link>
              </div>

              <button type="submit" className="btn-new btn-register-new" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-new"></span>
                    <span>Đang đăng ký...</span>
                  </>
                ) : (
                  'Đăng ký'
                )}
              </button>

              <div className="terms-text">
                Bằng cách tiếp tục, bạn đồng ý với <Link to="/terms" className="link-new">Điều khoản & Cam kết</Link> của 
                Tìm Trọ và xác nhận rằng bạn đã đọc <Link to="/privacy" className="link-new">Chính sách bảo mật</Link> của 
                chúng tôi.
              </div>
            </form>

            <div className="divider-new">
              <span>Hoặc đăng ký bằng</span>
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

export default Register
