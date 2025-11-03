import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { roomAPI, savedRoomAPI } from '../services/api'
import toast from 'react-hot-toast'
import '../styles/Contact.css'
import '../styles/About.css'

function Home({ currentUser, onLogout }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('rent') // 'rent' or 'roommate'
  const [searchKeyword, setSearchKeyword] = useState('')
  const [savedRooms, setSavedRooms] = useState({}) // Track saved status { roomId: true/false }
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRooms()
    if (currentUser) {
      checkSavedRooms()
    }
    
    // Xử lý scroll xuống phần liên hệ hoặc giới thiệu nếu có hash
    const hash = window.location.hash
    if (hash === '#contact' || hash === '#about') {
      setTimeout(() => {
        const section = document.getElementById(hash.replace('#', ''))
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [currentUser])

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const data = await roomAPI.getAvailableRooms()
      setRooms(data.slice(0, 6)) // Lấy 6 phòng nổi bật
    } catch (err) {
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkSavedRooms = async () => {
    try {
      const savedRoomsList = await savedRoomAPI.getSavedRooms()
      const savedMap = {}
      savedRoomsList.forEach(item => {
        savedMap[item.roomId] = true
      })
      setSavedRooms(savedMap)
    } catch (err) {
      console.error('Error checking saved rooms:', err)
    }
  }

  const handleSaveRoom = async (e, roomId) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để lưu phòng')
      navigate('/login')
      return
    }

    try {
      if (savedRooms[roomId]) {
        await savedRoomAPI.unsaveRoom(roomId)
        setSavedRooms(prev => ({ ...prev, [roomId]: false }))
        toast.success('Đã bỏ lưu phòng')
      } else {
        await savedRoomAPI.saveRoom(roomId)
        setSavedRooms(prev => ({ ...prev, [roomId]: true }))
        toast.success('Đã lưu phòng')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message
      if (errorMessage === 'Room already saved') {
        toast.error('Bạn đã lưu phòng này rồi!')
      } else {
        toast.error(errorMessage || 'Có lỗi xảy ra')
      }
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (activeTab === 'rent') {
      // Nếu có search keyword, chuyển sang trang tìm trọ kèm params
      if (searchKeyword) {
        navigate(`/rooms/phong-tro?keyword=${searchKeyword}`)
      } else {
        navigate('/rooms/phong-tro')
      }
    }
    // Tìm bạn ở ghép có thể thêm sau
  }

  const handleContactFormChange = (e) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // TODO: Gửi form đến backend hoặc email service
    console.log('Contact form submitted:', contactForm)
    
    // Hiển thị thông báo thành công
    setShowSuccessMessage(true)
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      message: ''
    })
    
    // Ẩn thông báo sau 5 giây
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 5000)
  }

  // top 9 booked room
  const [topRooms, setTopRooms] = useState([])

  useEffect(() => {
    fetchRooms()
    fetchTopBookedRooms()
    if (currentUser) checkSavedRooms()
    const hash = window.location.hash
    if (hash === '#contact' || hash === '#about') {
      setTimeout(() => {
        const section = document.getElementById(hash.replace('#', ''))
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [currentUser])

//  Fetch Top 9 Most Booked Rooms
  const fetchTopBookedRooms = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/analytics/top-booked-rooms')
      const data = await res.json()
      setTopRooms(data)
    } catch (err) {
      console.error('Error fetching top booked rooms:', err)
    }
  }

  return (
    <div className="bg-gradient">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <main className="container">
        {/* Hero Section */}
        <section className="hero-modern">
          <h1 className="hero-title">Tìm phòng trọ hoàn hảo cho bạn</h1>
          <p className="hero-subtitle">Kết nối với hàng ngàn chủ trọ uy tín trong khu vực Hòa Lạc</p>

          {/* Search Box */}
          <div className="search-box-modern">
            <div className="search-tabs">
              <button
                  className={`search-tab ${activeTab === 'rent' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rent')}
              >
                Phòng trọ cho thuê
              </button>
              <button
                  className={`search-tab ${activeTab === 'roommate' ? 'active' : ''}`}
                  onClick={() => setActiveTab('roommate')}
              >
                Tìm bạn ở ghép
              </button>
            </div>

            <form onSubmit={handleSearch} className="search-form-modern">
              <div className="search-input-wrapper">
                <span className="search-icon">📍</span>
                <input
                    type="text"
                    placeholder="Tìm theo địa chỉ, quận, thành phố..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="search-input-modern"
                />
              </div>
              <button type="submit" className="btn-search-modern">
                🔍 Tìm kiếm
              </button>
            </form>
          </div>
        </section>

        {/* Featured Rooms */}
        <section className="featured-section">
          <h2 className="section-title">Phòng trọ nổi bật</h2>
          <p className="section-subtitle">Khám phá hàng nghìn lựa chọn phòng trọ chất lượng với giá cả phù hợp</p>

          {loading ? (
              <div style={{textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)'}}>
                Đang tải...
              </div>
          ) : rooms.length > 0 ? (
              <div className="home-room-grid">
                {rooms.map((room) => (
                    <div key={room.id} className="home-room-card-new">
                      <div className="home-room-image-new">
                        <img src={room.imageUrl || 'https://via.placeholder.com/400x300?text=Phòng+Trọ'}
                             alt={room.name}/>
                        <button
                            className="btn-favorite"
                            onClick={(e) => handleSaveRoom(e, room.id)}
                            style={{
                              background: savedRooms[room.id] ? '#EF4444' : 'rgba(255, 255, 255, 0.9)',
                              color: savedRooms[room.id] ? 'white' : '#EF4444'
                            }}
                        >
                          <Heart
                              size={18}
                              fill={savedRooms[room.id] ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button className="btn-share">📤</button>
                      </div>
                      <div className="home-room-content-new">
                        <h3 className="home-room-title-new">{room.name}</h3>
                        <p className="home-room-location-new">📍 {room.location}</p>
                        <div className="home-room-price-new">
                          {formatPrice(room.price)} đ/tháng
                        </div>
                        <div style={{marginTop: '12px'}}>
                          <Link to={`/room/${room.id}`} className="btn-view-detail">
                            👁️ Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="empty-state">
                <div className="empty-icon">🏠</div>
                <h3>Chưa có phòng trọ nổi bật</h3>
                <p>Hiện tại chưa có phòng trọ nào.</p>
              </div>
          )}
        </section>

        <section className="featured-section">
          <h2 className="section-title">Best Choice 🏆</h2>
          <p className="section-subtitle">Những lựa chọn hàng đầu được các khách hàng tin tưởng</p>
          {topRooms.length > 0 ? (
              <div className="home-room-grid">
                {topRooms.map((room) => (
                    <div key={room.id} className="home-room-card-new">
                      <div className="home-room-image-new">
                        <img src={room.imageUrl || 'https://via.placeholder.com/400x300?text=Phòng+Trọ'}
                             alt={room.name}/>
                        <button
                            className="btn-favorite"
                            onClick={(e) => handleSaveRoom(e, room.id)}
                            style={{
                              background: savedRooms[room.id] ? '#EF4444' : 'rgba(255, 255, 255, 0.9)',
                              color: savedRooms[room.id] ? 'white' : '#EF4444'
                            }}
                        >
                          <Heart size={18} fill={savedRooms[room.id] ? 'currentColor' : 'none'}/>
                        </button>
                        <button className="btn-share">📤</button>
                        <div className="top-room-ribbon">🔥 #{topRooms.indexOf(room) + 1}</div>
                      </div>

                      <div className="home-room-content-new">
                        <h3 className="home-room-title-new">{room.name}</h3>
                        <p className="home-room-location-new">📍 {room.location}</p>
                        <div className="home-room-price-new">{formatPrice(room.price)} đ/tháng</div>
                       

                        <div style={{marginTop: '12px'}}>
                          <Link to={`/room/${room.id}`} className="btn-view-detail">
                            👁️ Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="empty-state">
                <div className="empty-icon">⭐</div>
                <h3>Chưa có dữ liệu thống kê</h3>
                <p>Hệ thống đang thu thập dữ liệu đặt phòng...</p>
              </div>
          )}
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          {/* Hero Section */}
          <div className="about-hero">
            <h1 className="about-hero-title">Tìm Trọ – Kết nối nhanh, rõ ràng, an toàn</h1>
            <p className="about-hero-subtitle">
              Giúp sinh viên và người đi làm tìm được nơi ở ưng ý chỉ với vài cú nhấp chuột
            </p>
            <div className="about-hero-illustration">
              <div className="illustration-icon">🏠</div>
              <div className="illustration-icon">📱</div>
              <div className="illustration-icon">🗺️</div>
            </div>
          </div>

          {/* About Us */}
          <div className="about-us">
            <h2 className="about-section-title">Về chúng tôi</h2>
            <p className="about-description">
              <strong>Tìm Trọ</strong> được xây dựng với mục tiêu tạo ra nền tảng đơn giản, minh bạch và tin cậy
              cho việc thuê trọ. Chúng tôi hiểu rằng việc tìm kiếm một nơi ở phù hợp là một trong những
              nhu cầu thiết yếu nhất của sinh viên và người đi làm. Với Tìm Trọ, chúng tôi mong muốn
              giúp bạn tiết kiệm thời gian và tìm được nơi ở ưng ý một cách nhanh chóng nhất.
            </p>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-icon">📅</div>
                <div className="timeline-content">
                  <h3>2024</h3>
                  <p>Năm thành lập</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-icon">👥</div>
                <div className="timeline-content">
                  <h3>5,000+</h3>
                  <p>Người dùng</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-icon">✅</div>
                <div className="timeline-content">
                  <h3>10,000+</h3>
                  <p>Tin đã xác thực</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="core-values">
            <h2 className="about-section-title">Giá trị cốt lõi</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🔍</div>
                <h3 className="value-title">Minh bạch</h3>
                <p className="value-description">
                  Thông tin rõ ràng, xác thực. Mọi phòng trọ đều được kiểm duyệt kỹ lưỡng
                  trước khi đăng tải để đảm bảo tính chính xác.
                </p>
              </div>

              <div className="value-card">
                <div className="value-icon">⚡</div>
                <h3 className="value-title">Nhanh chóng</h3>
                <p className="value-description">
                  Bộ lọc thông minh, thao tác đơn giản. Tìm kiếm và thuê phòng chỉ trong
                  vài phút với giao diện trực quan.
                </p>
              </div>

              <div className="value-card">
                <div className="value-icon">🛡️</div>
                <h3 className="value-title">An toàn</h3>
                <p className="value-description">
                  Kiểm duyệt tin, tránh lừa đảo. Chúng tôi cam kết bảo vệ quyền lợi
                  của người thuê và chủ trọ.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="how-it-works">
            <h2 className="about-section-title">Quy trình hoạt động</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon">🔍</div>
                <h3 className="step-title">Tìm kiếm & lọc</h3>
                <p className="step-description">
                  Sử dụng bộ lọc thông minh để tìm kiếm phòng trọ theo nhu cầu của bạn:
                  vị trí, giá cả, diện tích, tiện ích.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon">📋</div>
                <h3 className="step-title">Xem chi tiết</h3>
                <p className="step-description">
                  Xem thông tin minh bạch: ảnh thật, địa chỉ rõ ràng, thông tin liên hệ
                  chủ trọ, mô tả đầy đủ.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon">✅</div>
                <h3 className="step-title">Đặt cọc/Thuê ngay</h3>
                <p className="step-description">
                  Liên hệ trực tiếp với chủ trọ, đặt cọc hoặc thuê ngay với quy trình
                  đơn giản và nhanh chóng.
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="highlights">
            <h2 className="about-section-title">Số liệu nổi bật</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">10,000+</div>
                <p className="stat-label">Phòng trọ đã đăng ký</p>
                <div className="stat-icon">🏠</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">5,000+</div>
                <p className="stat-label">Người thuê đang tin dùng</p>
                <div className="stat-icon">👥</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">36%</div>
                <p className="stat-label">Tin đã xác thực</p>
                <div className="stat-icon">✅</div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="team-section">
            <h2 className="about-section-title">Đội ngũ phát triển</h2>
            <p className="team-description">
              Chúng tôi là những sinh viên đam mê công nghệ, mong muốn tạo ra trải nghiệm tốt nhất
              cho cộng đồng người tìm trọ tại khu vực Hòa Lạc và các địa phương khác.
            </p>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">👨‍💻</div>
                <h3 className="member-name">Nhóm phát triển</h3>
                <p className="member-role">Full-stack Developers</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">🎨</div>
                <h3 className="member-name">Nhóm thiết kế</h3>
                <p className="member-role">UI/UX Designers</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">📊</div>
                <h3 className="member-name">Nhóm quản lý</h3>
                <p className="member-role">Product Managers</p>
              </div>
            </div>

            <div className="team-commitment">
              <h3 className="commitment-title">Cam kết của chúng tôi</h3>
              <p className="commitment-text">
                🎯 Luôn lắng nghe và cải thiện dựa trên phản hồi của người dùng<br/>
                💡 Không ngừng đổi mới và phát triển tính năng mới<br/>
                🤝 Xây dựng cộng đồng thuê trọ lành mạnh và tin cậy<br/>
                🌟 Mang đến trải nghiệm tốt nhất cho mọi người dùng
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="contact-header">
            <h2 className="contact-title">Liên hệ với Tìm Trọ</h2>
            <p className="contact-subtitle">
              Hỗ trợ khách hàng • Hợp tác đối tác • Góp ý sản phẩm
            </p>
          </div>

          <div className="contact-content">
            {/* Contact Info Cards */}
            <div className="contact-info-section">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email hỗ trợ</h3>
                <p>support@timtro.vn</p>
                <a href="mailto:support@timtro.vn" className="contact-link">Gửi email</a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Hotline</h3>
                <p>0987 123 123</p>
                <p className="contact-note">(Giờ hành chính)</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h3>Địa chỉ văn phòng</h3>
                <p>Khu vực Hòa Lạc, Hà Nội</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                  Xem bản đồ
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">💬</div>
                <h3>Mạng xã hội</h3>
                <div className="social-links">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                     className="social-btn facebook">
                    Facebook
                  </a>
                  <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="social-btn zalo">
                    Zalo
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section">
              <h3 className="form-title">📩 Gửi tin nhắn cho chúng tôi</h3>

              {showSuccessMessage && (
                  <div className="success-message">
                    ✅ Cảm ơn bạn, chúng tôi sẽ phản hồi sớm!
                  </div>
              )}

              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group-contact">
                  <label htmlFor="name">Họ và tên</label>
                  <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactFormChange}
                      placeholder="Nhập họ và tên của bạn"
                      required
                  />
                </div>

                <div className="form-group-contact">
                  <label htmlFor="email">Email</label>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      placeholder="Nhập địa chỉ email của bạn"
                      required
                  />
                </div>

                <div className="form-group-contact">
                  <label htmlFor="message">Nội dung</label>
                  <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactFormChange}
                      placeholder="Nhập nội dung tin nhắn..."
                      rows="5"
                      required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit-contact">
                  📩 Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="social-media-section">
            <h3>Kết nối với chúng tôi</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="social-icon facebook-icon" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon github-icon"
                 title="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="social-icon linkedin-icon" title="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  )
}

export default Home

