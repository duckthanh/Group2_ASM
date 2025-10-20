import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GlowEffects from '../components/GlowEffects'
import { roomAPI } from '../services/api'

function Home({ currentUser, onLogout }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      fetchRooms()
    }
  }, [currentUser])

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const data = await roomAPI.getAllRooms()
      setRooms(data.slice(0, 6)) // Lấy 6 phòng đầu tiên
    } catch (err) {
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  return (
    <div className="bg-gradient">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <GlowEffects />

      {!currentUser ? (
        <main className="container">
          <section className="hero">
            <div className="hero-content">
              <h1>🌙 Nơi bắt đầu hành trình trọ mộng mơ</h1>
              <p>Khám phá hàng nghìn phòng trọ phù hợp ngân sách sinh viên, vị trí thuận tiện gần trường, và không gian sống đầy cảm hứng. Hãy để chúng tôi đồng hành cùng bạn tìm được "tổ ấm" hoàn hảo.</p>
              <div className="actions">
                <Link to="/register" className="btn btn-lg">✨ Bắt đầu ngay</Link>
                <Link to="/login" className="btn btn-lg btn-ghost">Đã có tài khoản</Link>
              </div>
            </div>

            <div className="features">
              <div className="card">
                <h3>🔍 Tìm kiếm thông minh</h3>
                <p>Lọc theo giá, khoảng cách tới trường, mức độ an ninh và đầy đủ tiện ích. Tìm trọ chưa bao giờ dễ dàng đến thế.</p>
              </div>
              <div className="card">
                <h3>⭐ Đánh giá minh bạch</h3>
                <p>Nhận xét chân thực từ cộng đồng sinh viên giúp bạn đưa ra quyết định tự tin và chính xác nhất.</p>
              </div>
              <div className="card">
                <h3>💾 Lưu & so sánh</h3>
                <p>Lưu các phòng yêu thích, so sánh nhanh chóng để chọn lựa phương án phù hợp nhất với bạn.</p>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="container room-list-container">
          <div className="page-header">
            <h1>🏠 Phòng trọ dành cho bạn</h1>
            <p className="subtitle">Khám phá những lựa chọn phù hợp nhất</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Đang tải...
            </div>
          ) : rooms.length > 0 ? (
            <div className="home-room-grid">
              {rooms.map((room) => (
                <div key={room.id} className="home-room-card">
                  <div className="home-room-image">
                    <img src={room.imageUrl || 'https://via.placeholder.com/400x300?text=Phòng+Trọ'} alt={room.title} />
                    <span className="home-room-badge">
                      {room.roomType === 'PHONG_TRO' ? 'Phòng trọ' :
                       room.roomType === 'NHA_NGUYEN_CAN' ? 'Nhà nguyên căn' :
                       room.roomType === 'CAN_HO' ? 'Căn hộ' : 'Ở ghép'}
                    </span>
                  </div>
                  <div className="home-room-content">
                    <h3 className="home-room-title">{room.title}</h3>
                    <p className="home-room-address">{room.address}, {room.district}, {room.city}</p>
                    {room.area && (
                      <div className="home-room-area">
                        📐 {room.area} m²
                      </div>
                    )}
                    
                    <div className="home-room-actions">
                      <Link to={`/rooms/${room.id}`} className="btn btn-detail">Chi tiết</Link>
                      <a href="#" className="btn btn-contact">Liên hệ</a>
                    </div>
                    
                    <div className="home-room-price">{formatPrice(room.price)} đ/tháng</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>Chưa có phòng nào</h3>
              <p>Hiện tại chưa có phòng trọ nào. Vui lòng quay lại sau!</p>
              <Link to="/rooms/phong-tro" className="btn">Xem tất cả phòng trọ</Link>
            </div>
          )}
        </main>
      )}

      <Footer />
    </div>
  )
}

export default Home

