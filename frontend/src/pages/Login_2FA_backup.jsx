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
      
      // Kiß╗âm tra nß║┐u cß║ºn nhß║¡p m├ú OTP
      if (response.mfaRequired) {
        setShowOtpInput(true)
        setError('')
      } else {
        // Login th├ánh c├┤ng, kh├┤ng cß║ºn 2FA
        onLogin(response)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoß║╖c mß║¡t khß║⌐u kh├┤ng ─æ├║ng')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    
    if (otpCode.length !== 6) {
      setError('Vui l├▓ng nhß║¡p m├ú 6 sß╗æ!')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await authAPI.verifyMfa(email, password, otpCode)
      onLogin(response)
      navigate('/')
    } catch (err) {
      setError('M├ú OTP kh├┤ng ─æ├║ng. Vui l├▓ng thß╗¡ lß║íi!')
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
              <h2 className="auth-title">─É─âng nhß║¡p ≡ƒöÉ</h2>
              <p className="auth-subtitle">Ch├áo mß╗½ng bß║ín quay lß║íi!</p>

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
                  <label htmlFor="password" className="form-label">Mß║¡t khß║⌐u</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? '─Éang ─æ─âng nhß║¡p...' : '─É─âng nhß║¡p'}
                </button>
              </form>

              <p className="auth-switch">
                Ch╞░a c├│ t├ái khoß║ún?{' '}
                <Link to="/register" className="auth-link">─É─âng k├╜ ngay</Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="auth-title">X├íc thß╗▒c 2 yß║┐u tß╗æ ≡ƒöÆ</h2>
              <p className="auth-subtitle">Nhß║¡p m├ú tß╗½ ß╗⌐ng dß╗Ñng x├íc thß╗▒c cß╗ºa bß║ín</p>

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
                  <label htmlFor="otpCode" className="form-label">M├ú x├íc thß╗▒c (6 sß╗æ)</label>
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
                  {loading ? '─Éang x├íc thß╗▒c...' : 'X├íc thß╗▒c'}
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
                  Quay lß║íi
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

