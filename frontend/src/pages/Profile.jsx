import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GlowEffects from '../components/GlowEffects'
import { userAPI, mfaAPI } from '../services/api'
import './Profile.css'

function Profile({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('info') // info, card, identity, security, password
  const [userInfo, setUserInfo] = useState({
    phoneNumber: '',
    address: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [showQRSetup, setShowQRSetup] = useState(false)
  const [qrCodeData, setQrCodeData] = useState(null)
  const [mfaSecret, setMfaSecret] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      loadUserInfo()
      loadMfaStatus()
    }
  }, [currentUser])

  useEffect(() => {
    // Reset message khi đổi tab
    setMessage('')
    setMfaCode('')
    setShowQRSetup(false)
  }, [activeTab])

  const loadUserInfo = async () => {
    try {
      const data = await userAPI.getUserById(currentUser.id)
      setUserInfo({
        phoneNumber: data.phoneNumber || '',
        address: data.address || ''
      })
    } catch (err) {
      console.error('Error loading user info:', err)
    }
  }

  const loadMfaStatus = async () => {
    try {
      const status = await mfaAPI.getStatus()
      setMfaEnabled(status)
    } catch (err) {
      console.error('Error loading MFA status:', err)
    }
  }

  const handleSetup2FA = async () => {
    setLoading(true)
    setMessage('')
    try {
      const data = await mfaAPI.setupInitiate()
      setQrCodeData(data.qrCodeDataUri)
      setMfaSecret(data.secret)
      setShowQRSetup(true)
    } catch (err) {
      console.error('Error setting up 2FA:', err)
      setMessage('Có lỗi xảy ra khi thiết lập 2FA!')
    } finally {
      setLoading(false)
    }
  }

  const handleEnable2FA = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setMessage('Vui lòng nhập mã 6 số!')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      await mfaAPI.enable(mfaSecret, mfaCode)
      setMessage('Đã bật 2FA thành công!')
      setMfaEnabled(true)
      setShowQRSetup(false)
      setMfaCode('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error enabling 2FA:', err)
      setMessage('Mã OTP không đúng. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setMessage('Vui lòng nhập mã 6 số để tắt 2FA!')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      await mfaAPI.disable(mfaCode)
      setMessage('Đã tắt 2FA thành công!')
      setMfaEnabled(false)
      setMfaCode('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error disabling 2FA:', err)
      setMessage('Mã OTP không đúng. Không thể tắt 2FA!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSetup = () => {
    setShowQRSetup(false)
    setQrCodeData(null)
    setMfaSecret('')
    setMfaCode('')
    setMessage('')
  }

  const handleInfoChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveInfo = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      await userAPI.updateUser(currentUser.id, userInfo)
      setMessage('Cập nhật thông tin thành công!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error updating user:', err)
      setMessage('Có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Mật khẩu mới không khớp!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự!')
      return
    }

    setLoading(true)
    setMessage('')
    
    try {
      await userAPI.changePassword(currentUser.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage('Đổi mật khẩu thành công!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error changing password:', err)
      setMessage(err.response?.data || 'Mật khẩu hiện tại không đúng!')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    navigate('/login')
    return null
  }

  return (
    <div className="bg-gradient">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <GlowEffects />

      <main className="container profile-container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <span className="avatar-icon">👤</span>
                <button className="avatar-edit-btn">✏️</button>
              </div>
              <h2 className="profile-name">{currentUser.username}</h2>
              <p className="profile-update-text">Cập nhật thông tin hồ sơ của bạn</p>
            </div>

            <nav className="profile-menu">
              <button 
                className={`profile-menu-item ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <span className="menu-icon">👤</span>
                Thông tin hồ sơ
              </button>
              <button 
                className={`profile-menu-item ${activeTab === 'card' ? 'active' : ''}`}
                onClick={() => setActiveTab('card')}
              >
                <span className="menu-icon">💳</span>
                Thẻ ngân hàng
              </button>
              <button 
                className={`profile-menu-item ${activeTab === 'identity' ? 'active' : ''}`}
                onClick={() => setActiveTab('identity')}
              >
                <span className="menu-icon">📄</span>
                Danh tính
              </button>
              <button 
                className={`profile-menu-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <span className="menu-icon">🔒</span>
                Bảo mật
              </button>
              <button 
                className={`profile-menu-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <span className="menu-icon">🔑</span>
                Đổi mật khẩu
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {activeTab === 'info' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Thông tin hồ sơ</h2>
                
                {message && (
                  <div className={`message-box ${message.includes('thành công') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSaveInfo} className="profile-form">
                  <div className="form-group-profile">
                    <label>Tên người dùng</label>
                    <input type="text" value={currentUser.username} readOnly />
                  </div>
                  <div className="form-group-profile">
                    <label>Email</label>
                    <input type="email" value={currentUser.email} readOnly />
                  </div>
                  <div className="form-group-profile">
                    <label>Số điện thoại</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      value={userInfo.phoneNumber}
                      onChange={handleInfoChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="form-group-profile">
                    <label>Địa chỉ</label>
                    <input 
                      type="text"
                      name="address"
                      value={userInfo.address}
                      onChange={handleInfoChange}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                  <button type="submit" className="btn-save-profile" disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Xác thực 2 yếu tố</h2>
                
                {message && (
                  <div className={`message-box ${message.includes('thành công') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className="security-option">
                  <div className="security-option-content">
                    <h3>Xác thực 2 yếu tố (2FA)</h3>
                    <p>
                      {mfaEnabled 
                        ? '✅ 2FA đang được bật - Tài khoản của bạn được bảo vệ' 
                        : 'Thêm lớp bảo mật bổ sung cho tài khoản của bạn'}
                    </p>
                  </div>
                  {!mfaEnabled ? (
                    <button 
                      className="btn-2fa" 
                      onClick={handleSetup2FA}
                      disabled={loading || showQRSetup}
                    >
                      {loading ? 'Đang tải...' : 'Bật 2FA'}
                    </button>
                  ) : (
                    <button 
                      className="btn-2fa danger" 
                      onClick={() => setShowQRSetup(true)}
                      disabled={loading}
                    >
                      Tắt 2FA
                    </button>
                  )}
                </div>

                {!showQRSetup && (
                  <div className="security-warning">
                    <div className="warning-icon">⚠️</div>
                    <div className="warning-content">
                      <h4>Tăng cường bảo mật</h4>
                      <p>Bật xác thực hai yếu tố để bảo mật tài khoản của bạn.</p>
                      <ul>
                        <li>Bảo vệ khỏi truy cập trái phép</li>
                        <li>Bảo mật thông tin cá nhân</li>
                        <li>Yên tâm khi sử dụng nền tảng</li>
                      </ul>
                    </div>
                  </div>
                )}

                {showQRSetup && (
                  <div className="qr-section">
                    {!mfaEnabled ? (
                      <>
                        <div className="qr-code-box">
                          {qrCodeData ? (
                            <img src={qrCodeData} alt="QR Code" style={{width: '200px', height: '200px'}} />
                          ) : (
                            <div className="qr-placeholder">
                              <p>QR Code</p>
                              <p style={{fontSize: '12px', color: '#999'}}>Đang tải...</p>
                            </div>
                          )}
                        </div>
                        <div className="qr-instructions">
                          <h4>Hướng dẫn bật 2FA</h4>
                          <ol style={{textAlign: 'left', paddingLeft: '20px', marginBottom: '15px'}}>
                            <li>Tải Google Authenticator hoặc Microsoft Authenticator</li>
                            <li>Quét mã QR bên trái</li>
                            <li>Nhập mã 6 số từ ứng dụng vào ô bên dưới</li>
                          </ol>
                          <input 
                            type="text" 
                            placeholder="Nhập mã 6 số"
                            className="code-input"
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                          />
                          <p className="auth-app-info">Google Authenticator / Microsoft Authenticator</p>
                          <div className="qr-actions">
                            <button 
                              className="btn-qr-action secondary" 
                              onClick={handleSetup2FA}
                              disabled={loading}
                            >
                              Tạo lại mã
                            </button>
                            <button 
                              className="btn-qr-action secondary" 
                              onClick={handleCancelSetup}
                              disabled={loading}
                            >
                              Hủy
                            </button>
                            <button 
                              className="btn-qr-action primary" 
                              onClick={handleEnable2FA}
                              disabled={loading || mfaCode.length !== 6}
                            >
                              {loading ? 'Đang xác thực...' : 'Xác thực'}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="qr-instructions" style={{width: '100%'}}>
                        <h4>Tắt xác thực 2 yếu tố</h4>
                        <p style={{marginBottom: '15px'}}>
                          Để tắt 2FA, vui lòng nhập mã 6 số từ ứng dụng xác thực của bạn
                        </p>
                        <input 
                          type="text" 
                          placeholder="Nhập mã 6 số"
                          className="code-input"
                          value={mfaCode}
                          onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength="6"
                        />
                        <div className="qr-actions">
                          <button 
                            className="btn-qr-action secondary" 
                            onClick={handleCancelSetup}
                            disabled={loading}
                          >
                            Hủy
                          </button>
                          <button 
                            className="btn-qr-action danger" 
                            onClick={handleDisable2FA}
                            disabled={loading || mfaCode.length !== 6}
                          >
                            {loading ? 'Đang xử lý...' : 'Tắt 2FA'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Đổi mật khẩu</h2>
                
                {message && (
                  <div className={`message-box ${message.includes('thành công') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="profile-form">
                  <div className="form-group-profile">
                    <label>Mật khẩu hiện tại</label>
                    <input 
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>
                  <div className="form-group-profile">
                    <label>Mật khẩu mới</label>
                    <input 
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      required
                      minLength="6"
                    />
                  </div>
                  <div className="form-group-profile">
                    <label>Xác nhận mật khẩu mới</label>
                    <input 
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      minLength="6"
                    />
                  </div>
                  <button type="submit" className="btn-save-profile" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Thẻ ngân hàng</h2>
                <div className="empty-state-profile">
                  <p>💳</p>
                  <p>Chưa có thẻ ngân hàng nào</p>
                  <button className="btn-add-card">Thêm thẻ</button>
                </div>
              </div>
            )}

            {activeTab === 'identity' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Danh tính</h2>
                <div className="empty-state-profile">
                  <p>📄</p>
                  <p>Chưa xác thực danh tính</p>
                  <button className="btn-verify">Xác thực ngay</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Profile

