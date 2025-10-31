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
    // Reset message khi ─æß╗òi tab
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
      setMessage('C├│ lß╗ùi xß║úy ra khi thiß║┐t lß║¡p 2FA!')
    } finally {
      setLoading(false)
    }
  }

  const handleEnable2FA = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setMessage('Vui l├▓ng nhß║¡p m├ú 6 sß╗æ!')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      await mfaAPI.enable(mfaSecret, mfaCode)
      setMessage('─É├ú bß║¡t 2FA th├ánh c├┤ng!')
      setMfaEnabled(true)
      setShowQRSetup(false)
      setMfaCode('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error enabling 2FA:', err)
      setMessage('M├ú OTP kh├┤ng ─æ├║ng. Vui l├▓ng thß╗¡ lß║íi!')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setMessage('Vui l├▓ng nhß║¡p m├ú 6 sß╗æ ─æß╗â tß║»t 2FA!')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      await mfaAPI.disable(mfaCode)
      setMessage('─É├ú tß║»t 2FA th├ánh c├┤ng!')
      setMfaEnabled(false)
      setMfaCode('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error disabling 2FA:', err)
      setMessage('M├ú OTP kh├┤ng ─æ├║ng. Kh├┤ng thß╗â tß║»t 2FA!')
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
      setMessage('Cß║¡p nhß║¡t th├┤ng tin th├ánh c├┤ng!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error updating user:', err)
      setMessage('C├│ lß╗ùi xß║úy ra. Vui l├▓ng thß╗¡ lß║íi!')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Mß║¡t khß║⌐u mß╗¢i kh├┤ng khß╗¢p!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Mß║¡t khß║⌐u mß╗¢i phß║úi c├│ ├¡t nhß║Ñt 6 k├╜ tß╗▒!')
      return
    }

    setLoading(true)
    setMessage('')
    
    try {
      await userAPI.changePassword(currentUser.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage('─Éß╗òi mß║¡t khß║⌐u th├ánh c├┤ng!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Error changing password:', err)
      setMessage(err.response?.data || 'Mß║¡t khß║⌐u hiß╗çn tß║íi kh├┤ng ─æ├║ng!')
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
                <span className="avatar-icon">≡ƒæñ</span>
                <button className="avatar-edit-btn">Γ£Å∩╕Å</button>
              </div>
              <h2 className="profile-name">{currentUser.username}</h2>
              <p className="profile-update-text">Cß║¡p nhß║¡t th├┤ng tin hß╗ô s╞í cß╗ºa bß║ín</p>
            </div>

            <nav className="profile-menu">
              <button 
                className={`profile-menu-item ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <span className="menu-icon">≡ƒæñ</span>
                Th├┤ng tin hß╗ô s╞í
              </button>
              <button 
                className={`profile-menu-item ${activeTab === 'card' ? 'active' : ''}`}
                onClick={() => setActiveTab('card')}
              >
                <span className="menu-icon">≡ƒÆ│</span>
                Thß║╗ ng├ón h├áng
              </button>
              <button 
                className={`profile-menu-item ${activeTab === 'identity' ? 'active' : ''}`}
                onClick={() => setActiveTab('identity')}
              >
                <span className="menu-icon">≡ƒôä</span>
                Danh t├¡nh
              </button>
              <button 
                className={`profile-menu-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <span className="menu-icon">≡ƒöÆ</span>
                Bß║úo mß║¡t
              </button>
              <button 
                className={`profile-menu-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <span className="menu-icon">≡ƒöæ</span>
                ─Éß╗òi mß║¡t khß║⌐u
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {activeTab === 'info' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Th├┤ng tin hß╗ô s╞í</h2>
                
                {message && (
                  <div className={`message-box ${message.includes('th├ánh c├┤ng') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSaveInfo} className="profile-form">
                  <div className="form-group-profile">
                    <label>T├¬n ng╞░ß╗¥i d├╣ng</label>
                    <input type="text" value={currentUser.username} readOnly />
                  </div>
                  <div className="form-group-profile">
                    <label>Email</label>
                    <input type="email" value={currentUser.email} readOnly />
                  </div>
                  <div className="form-group-profile">
                    <label>Sß╗æ ─æiß╗çn thoß║íi</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      value={userInfo.phoneNumber}
                      onChange={handleInfoChange}
                      placeholder="Nhß║¡p sß╗æ ─æiß╗çn thoß║íi"
                    />
                  </div>
                  <div className="form-group-profile">
                    <label>─Éß╗ïa chß╗ë</label>
                    <input 
                      type="text"
                      name="address"
                      value={userInfo.address}
                      onChange={handleInfoChange}
                      placeholder="Nhß║¡p ─æß╗ïa chß╗ë"
                    />
                  </div>
                  <button type="submit" className="btn-save-profile" disabled={loading}>
                    {loading ? '─Éang l╞░u...' : 'L╞░u thay ─æß╗òi'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="profile-section">
                <h2 className="section-title-profile">X├íc thß╗▒c 2 yß║┐u tß╗æ</h2>
                
                {message && (
                  <div className={`message-box ${message.includes('th├ánh c├┤ng') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className="security-option">
                  <div className="security-option-content">
                    <h3>X├íc thß╗▒c 2 yß║┐u tß╗æ (2FA)</h3>
                    <p>
                      {mfaEnabled 
                        ? 'Γ£à 2FA ─æang ─æ╞░ß╗úc bß║¡t - T├ái khoß║ún cß╗ºa bß║ín ─æ╞░ß╗úc bß║úo vß╗ç' 
                        : 'Th├¬m lß╗¢p bß║úo mß║¡t bß╗ò sung cho t├ái khoß║ún cß╗ºa bß║ín'}
                    </p>
                  </div>
                  {!mfaEnabled ? (
                    <button 
                      className="btn-2fa" 
                      onClick={handleSetup2FA}
                      disabled={loading || showQRSetup}
                    >
                      {loading ? '─Éang tß║úi...' : 'Bß║¡t 2FA'}
                    </button>
                  ) : (
                    <button 
                      className="btn-2fa danger" 
                      onClick={() => setShowQRSetup(true)}
                      disabled={loading}
                    >
                      Tß║»t 2FA
                    </button>
                  )}
                </div>

                {!showQRSetup && (
                  <div className="security-warning">
                    <div className="warning-icon">ΓÜá∩╕Å</div>
                    <div className="warning-content">
                      <h4>T─âng c╞░ß╗¥ng bß║úo mß║¡t</h4>
                      <p>Bß║¡t x├íc thß╗▒c hai yß║┐u tß╗æ ─æß╗â bß║úo mß║¡t t├ái khoß║ún cß╗ºa bß║ín.</p>
                      <ul>
                        <li>Bß║úo vß╗ç khß╗Åi truy cß║¡p tr├íi ph├⌐p</li>
                        <li>Bß║úo mß║¡t th├┤ng tin c├í nh├ón</li>
                        <li>Y├¬n t├óm khi sß╗¡ dß╗Ñng nß╗ün tß║úng</li>
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
                              <p style={{fontSize: '12px', color: '#999'}}>─Éang tß║úi...</p>
                            </div>
                          )}
                        </div>
                        <div className="qr-instructions">
                          <h4>H╞░ß╗¢ng dß║½n bß║¡t 2FA</h4>
                          <ol style={{textAlign: 'left', paddingLeft: '20px', marginBottom: '15px'}}>
                            <li>Tß║úi Google Authenticator hoß║╖c Microsoft Authenticator</li>
                            <li>Qu├⌐t m├ú QR b├¬n tr├íi</li>
                            <li>Nhß║¡p m├ú 6 sß╗æ tß╗½ ß╗⌐ng dß╗Ñng v├áo ├┤ b├¬n d╞░ß╗¢i</li>
                          </ol>
                          <input 
                            type="text" 
                            placeholder="Nhß║¡p m├ú 6 sß╗æ"
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
                              Tß║ío lß║íi m├ú
                            </button>
                            <button 
                              className="btn-qr-action secondary" 
                              onClick={handleCancelSetup}
                              disabled={loading}
                            >
                              Hß╗ºy
                            </button>
                            <button 
                              className="btn-qr-action primary" 
                              onClick={handleEnable2FA}
                              disabled={loading || mfaCode.length !== 6}
                            >
                              {loading ? '─Éang x├íc thß╗▒c...' : 'X├íc thß╗▒c'}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="qr-instructions" style={{width: '100%'}}>
                        <h4>Tß║»t x├íc thß╗▒c 2 yß║┐u tß╗æ</h4>
                        <p style={{marginBottom: '15px'}}>
                          ─Éß╗â tß║»t 2FA, vui l├▓ng nhß║¡p m├ú 6 sß╗æ tß╗½ ß╗⌐ng dß╗Ñng x├íc thß╗▒c cß╗ºa bß║ín
                        </p>
                        <input 
                          type="text" 
                          placeholder="Nhß║¡p m├ú 6 sß╗æ"
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
                            Hß╗ºy
                          </button>
                          <button 
                            className="btn-qr-action danger" 
                            onClick={handleDisable2FA}
                            disabled={loading || mfaCode.length !== 6}
                          >
                            {loading ? '─Éang xß╗¡ l├╜...' : 'Tß║»t 2FA'}
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
                <h2 className="section-title-profile">─Éß╗òi mß║¡t khß║⌐u</h2>
                
                {message && (
                  <div className={`message-box ${message.includes('th├ánh c├┤ng') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="profile-form">
                  <div className="form-group-profile">
                    <label>Mß║¡t khß║⌐u hiß╗çn tß║íi</label>
                    <input 
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhß║¡p mß║¡t khß║⌐u hiß╗çn tß║íi"
                      required
                    />
                  </div>
                  <div className="form-group-profile">
                    <label>Mß║¡t khß║⌐u mß╗¢i</label>
                    <input 
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhß║¡p mß║¡t khß║⌐u mß╗¢i (tß╗æi thiß╗âu 6 k├╜ tß╗▒)"
                      required
                      minLength="6"
                    />
                  </div>
                  <div className="form-group-profile">
                    <label>X├íc nhß║¡n mß║¡t khß║⌐u mß╗¢i</label>
                    <input 
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhß║¡p lß║íi mß║¡t khß║⌐u mß╗¢i"
                      required
                      minLength="6"
                    />
                  </div>
                  <button type="submit" className="btn-save-profile" disabled={loading}>
                    {loading ? '─Éang xß╗¡ l├╜...' : '─Éß╗òi mß║¡t khß║⌐u'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Thß║╗ ng├ón h├áng</h2>
                <div className="empty-state-profile">
                  <p>≡ƒÆ│</p>
                  <p>Ch╞░a c├│ thß║╗ ng├ón h├áng n├áo</p>
                  <button className="btn-add-card">Th├¬m thß║╗</button>
                </div>
              </div>
            )}

            {activeTab === 'identity' && (
              <div className="profile-section">
                <h2 className="section-title-profile">Danh t├¡nh</h2>
                <div className="empty-state-profile">
                  <p>≡ƒôä</p>
                  <p>Ch╞░a x├íc thß╗▒c danh t├¡nh</p>
                  <button className="btn-verify">X├íc thß╗▒c ngay</button>
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

