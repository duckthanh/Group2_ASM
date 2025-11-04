import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GlowEffects from '../components/GlowEffects'
import { userAPI, savedRoomAPI, mfaAPI } from '../services/api'
import toast from 'react-hot-toast'
import './Profile.css'

function Profile({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('info') // info, card, identity, security, password, saved-rooms
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [savedRooms, setSavedRooms] = useState([])
  const [loadingSavedRooms, setLoadingSavedRooms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // 2FA States
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [showQrSetup, setShowQrSetup] = useState(false)
  const [qrCodeDataUri, setQrCodeDataUri] = useState('')
  const [mfaSecret, setMfaSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loadingMfa, setLoadingMfa] = useState(false)
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)
  const [disableCode, setDisableCode] = useState('')
  
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
    // Load saved rooms khi vào tab saved-rooms
    if (activeTab === 'saved-rooms') {
      loadSavedRooms()
    }
    // Load MFA status khi vào tab security
    if (activeTab === 'security') {
      loadMfaStatus()
    }
  }, [activeTab])

  const loadSavedRooms = async () => {
    setLoadingSavedRooms(true)
    try {
      const data = await savedRoomAPI.getSavedRooms()
      setSavedRooms(data)
    } catch (err) {
      console.error('Error loading saved rooms:', err)
      toast.error('Không thể tải danh sách phòng đã lưu')
    } finally {
      setLoadingSavedRooms(false)
    }
  }

  const handleUnsaveRoom = async (roomId) => {
    try {
      await savedRoomAPI.unsaveRoom(roomId)
      toast.success('Đã bỏ lưu phòng')
      loadSavedRooms() // Reload list
    } catch (err) {
      console.error('Error unsaving room:', err)
      toast.error('Có lỗi xảy ra')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const loadUserInfo = async () => {
    try {
      const data = await userAPI.getUserById(currentUser.id)
      setUserInfo({
        username: data.username || currentUser.username || '',
        email: data.email || currentUser.email || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || ''
      })
    } catch (err) {
      console.error('Error loading user info:', err)
    }
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
      const response = await userAPI.updateUser(currentUser.id, userInfo)
      
      // Update localStorage and current user state
      const updatedUser = {
        ...currentUser,
        username: userInfo.username,
        email: userInfo.email
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      setMessage('Cập nhật thông tin thành công!')
      toast.success('Cập nhật thông tin thành công!')
      
      // Reload page to reflect changes in Navbar
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error('Error updating user:', err)
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!'
      setMessage(errorMsg)
      toast.error(errorMsg)
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

  // ==================== 2FA Functions ====================

  const loadMfaStatus = async () => {
    try {
      const status = await mfaAPI.getStatus()
      setMfaEnabled(status)
    } catch (err) {
      console.error('Error loading MFA status:', err)
    }
  }

  const handleInitiateMfaSetup = async () => {
    setLoadingMfa(true)
    try {
      // Check if user has valid token
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.accessToken) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
        setTimeout(() => {
          onLogout()
          navigate('/login')
        }, 2000)
        return
      }
      
      const response = await mfaAPI.setupInitiate()
      setMfaSecret(response.secret)
      setQrCodeDataUri(response.qrCodeDataUri)
      setShowQrSetup(true)
      toast.success('Quét mã QR bằng Google Authenticator')
    } catch (err) {
      console.error('Error initiating MFA setup:', err)
      if (err.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
        setTimeout(() => {
          onLogout()
          navigate('/login')
        }, 2000)
      } else {
        toast.error('Không thể tạo mã QR. Vui lòng thử lại!')
      }
    } finally {
      setLoadingMfa(false)
    }
  }

  const handleEnableMfa = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Vui lòng nhập mã xác minh 6 số')
      return
    }

    setLoadingMfa(true)
    try {
      await mfaAPI.enable(mfaSecret, verificationCode)
      toast.success('Đã bật 2FA thành công!')
      setMfaEnabled(true)
      setShowQrSetup(false)
      setVerificationCode('')
      setQrCodeDataUri('')
      setMfaSecret('')
    } catch (err) {
      console.error('Error enabling MFA:', err)
      toast.error('Mã xác minh không đúng. Vui lòng thử lại!')
    } finally {
      setLoadingMfa(false)
    }
  }

  const handleCancelMfaSetup = () => {
    setShowQrSetup(false)
    setVerificationCode('')
    setQrCodeDataUri('')
    setMfaSecret('')
  }

  const handleRegenerateQr = async () => {
    await handleInitiateMfaSetup()
  }

  const handleDisableMfa = async () => {
    if (!disableCode || disableCode.length !== 6) {
      toast.error('Vui lòng nhập mã xác minh 6 số')
      return
    }

    setLoadingMfa(true)
    try {
      await mfaAPI.disable(disableCode)
      toast.success('Đã tắt 2FA thành công!')
      setMfaEnabled(false)
      setShowDisableConfirm(false)
      setDisableCode('')
    } catch (err) {
      console.error('Error disabling MFA:', err)
      toast.error('Mã xác minh không đúng. Vui lòng thử lại!')
    } finally {
      setLoadingMfa(false)
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
              <p className="profile-update-text">Cập nhật thông tin cá nhân của bạn</p>
            </div>

            <nav className="profile-menu">
              <button 
                className={`profile-menu-item ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <span className="menu-icon">👤</span>
                Thông tin cá nhân
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
              <button 
                className={`profile-menu-item ${activeTab === 'saved-rooms' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved-rooms')}
              >
                <span className="menu-icon">❤️</span>
                Phòng đã lưu
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {activeTab === 'info' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Thông tin cá nhân</h2>
                
                {message && (
                  <div className={`message-box ${message.includes('thành công') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSaveInfo} className="profile-form">
                  <div className="form-group-profile">
                    <label>Tên người dùng</label>
                    <input 
                      type="text" 
                      name="username"
                      value={userInfo.username}
                      onChange={handleInfoChange}
                      placeholder="Nhập tên người dùng"
                      required
                    />
                  </div>
                  <div className="form-group-profile">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={userInfo.email}
                      onChange={handleInfoChange}
                      placeholder="Nhập email"
                      required
                    />
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
                
                <div className="security-option">
                  <div className="security-option-content">
                    <h3>Xác thực 2 yếu tố</h3>
                    <p>Thêm lớp bảo mật bổ sung</p>
                    {mfaEnabled && (
                      <span style={{color: '#4CAF50', fontSize: '14px', marginTop: '5px', display: 'block'}}>
                        ✓ Đã bật
                      </span>
                    )}
                  </div>
                  {!mfaEnabled ? (
                    <button 
                      className="btn-2fa" 
                      onClick={handleInitiateMfaSetup}
                      disabled={loadingMfa}
                    >
                      {loadingMfa ? 'Đang xử lý...' : 'Bật 2FA'}
                    </button>
                  ) : (
                    <button 
                      className="btn-2fa" 
                      onClick={() => setShowDisableConfirm(true)}
                      style={{background: '#f44336'}}
                    >
                      Tắt 2FA
                    </button>
                  )}
                </div>

                {!mfaEnabled && !showQrSetup && (
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

                {mfaEnabled && !showDisableConfirm && (
                  <div className="security-warning" style={{background: '#e8f5e9', border: '1px solid #4CAF50'}}>
                    <div className="warning-icon">✓</div>
                    <div className="warning-content">
                      <h4>2FA đã được kích hoạt</h4>
                      <p>Tài khoản của bạn được bảo vệ bằng xác thực 2 yếu tố.</p>
                      <p style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
                        Bạn sẽ cần nhập mã xác minh từ ứng dụng Authenticator mỗi khi đăng nhập.
                      </p>
                    </div>
                  </div>
                )}

                {showQrSetup && qrCodeDataUri && (
                  <div className="qr-section">
                    <div className="qr-code-box">
                      <img 
                        src={qrCodeDataUri} 
                        alt="QR Code for 2FA" 
                        style={{width: '100%', height: 'auto', maxWidth: '250px'}}
                      />
                    </div>
                    <div className="qr-instructions">
                      <h4>Nhập mã xác minh</h4>
                      <input 
                        type="text" 
                        placeholder="123456"
                        className="code-input"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength="6"
                      />
                      <p className="auth-app-info">
                        Quét mã QR bằng Google Authenticator hoặc Microsoft Authenticator, 
                        sau đó nhập mã 6 số hiển thị trong ứng dụng.
                      </p>
                      <div className="qr-actions">
                        <button 
                          className="btn-qr-action secondary" 
                          onClick={handleRegenerateQr}
                          disabled={loadingMfa}
                        >
                          Tạo lại mã
                        </button>
                        <button 
                          className="btn-qr-action secondary" 
                          onClick={handleCancelMfaSetup}
                          disabled={loadingMfa}
                        >
                          Hủy
                        </button>
                        <button 
                          className="btn-qr-action primary" 
                          onClick={handleEnableMfa}
                          disabled={loadingMfa || verificationCode.length !== 6}
                        >
                          {loadingMfa ? 'Đang xác thực...' : 'Xác thực'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {showDisableConfirm && (
                  <div className="qr-section" style={{background: '#fff3e0', padding: '20px', borderRadius: '8px'}}>
                    <div style={{marginBottom: '20px'}}>
                      <h4 style={{color: '#f57c00', marginBottom: '10px'}}>Tắt xác thực 2 yếu tố</h4>
                      <p style={{color: '#666', marginBottom: '15px'}}>
                        Nhập mã xác minh từ ứng dụng Authenticator để tắt 2FA
                      </p>
                      <input 
                        type="text" 
                        placeholder="123456"
                        className="code-input"
                        value={disableCode}
                        onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength="6"
                        style={{width: '100%', marginBottom: '15px'}}
                      />
                      <div className="qr-actions">
                        <button 
                          className="btn-qr-action secondary" 
                          onClick={() => {
                            setShowDisableConfirm(false)
                            setDisableCode('')
                          }}
                          disabled={loadingMfa}
                        >
                          Hủy
                        </button>
                        <button 
                          className="btn-qr-action primary" 
                          onClick={handleDisableMfa}
                          disabled={loadingMfa || disableCode.length !== 6}
                          style={{background: '#f44336'}}
                        >
                          {loadingMfa ? 'Đang xử lý...' : 'Xác nhận tắt'}
                        </button>
                      </div>
                    </div>
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

            {activeTab === 'saved-rooms' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Phòng đã lưu</h2>
                
                {loadingSavedRooms ? (
                  <div className="loading-saved-rooms">
                    <p>Đang tải...</p>
                  </div>
                ) : savedRooms.length === 0 ? (
                  <div className="empty-state-profile">
                    <p>❤️</p>
                    <p>Chưa có phòng nào được lưu</p>
                    <Link to="/rooms/phong-tro" className="btn-browse-rooms">
                      Tìm phòng ngay
                    </Link>
                  </div>
                ) : (
                  <div className="saved-rooms-grid">
                    {savedRooms.map((item) => (
                      <div key={item.id} className="saved-room-card">
                        <Link to={`/room/${item.room.id}`} className="saved-room-image-link">
                          <img 
                            src={item.room.imageUrl || 'https://via.placeholder.com/400x300?text=Phòng+Trọ'} 
                            alt={item.room.name}
                            className="saved-room-image"
                          />
                        </Link>
                        <div className="saved-room-info">
                          <Link to={`/room/${item.room.id}`} className="saved-room-title-link">
                            <h3 className="saved-room-title">{item.room.name}</h3>
                          </Link>
                          <p className="saved-room-location">📍 {item.room.location}</p>
                          <p className="saved-room-price">{formatPrice(item.room.price)}đ/tháng</p>
                          <p className="saved-room-date">Lưu ngày: {new Date(item.savedAt).toLocaleDateString('vi-VN')}</p>
                          <div className="saved-room-actions">
                            <Link to={`/room/${item.room.id}`} className="btn-view-saved-room">
                              Xem chi tiết
                            </Link>
                            <button 
                              className="btn-unsave-room"
                              onClick={() => handleUnsaveRoom(item.room.id)}
                            >
                              ❌ Bỏ lưu
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

