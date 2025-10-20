import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GlowEffects from '../components/GlowEffects'
import { roomAPI } from '../services/api'

function RoomList({ currentUser, onLogout }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')

  useEffect(() => {
    fetchRooms()
  }, [keyword])

  const fetchRooms = async () => {
    setLoading(true)
    try {
      let data
      if (keyword) {
        data = await roomAPI.searchRooms('PHONG_TRO', keyword)
      } else {
        data = await roomAPI.getRoomsByType('PHONG_TRO')
      }
      setRooms(data)
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

      <main className="container room-list-container">
        <div className="page-header">
          <h1>Thuê phòng trọ</h1>
          <p className="subtitle">Khám phá những lựa chọn phù hợp với bạn</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Đang tải...
          </div>
        ) : rooms.length > 0 ? (
          <div className="room-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-image">
                  <img src={room.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} alt={room.title} />
                  <span className="room-badge">
                    {room.roomType === 'PHONG_TRO' ? 'Phòng trọ' :
                     room.roomType === 'NHA_NGUYEN_CAN' ? 'Nhà nguyên căn' :
                     room.roomType === 'CAN_HO' ? 'Căn hộ' : 'Ở ghép'}
                  </span>
                </div>
                <div className="room-content">
                  <h3 className="room-title">{room.title}</h3>
                  <p className="room-address">{room.address}, {room.district}, {room.city}</p>
                  <div className="room-info">
                    {room.area && (
                      <span className="room-area">
                        📐 {room.area} m²
                      </span>
                    )}
                    <span className="room-price">{formatPrice(room.price)} đ/tháng</span>
                  </div>
                  <Link to={`/rooms/${room.id}`} className="btn btn-view">Xem chi tiết</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h3>Không tìm thấy phòng nào</h3>
            <p>Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc!</p>
            <Link to="/rooms/phong-tro" className="btn">Xem tất cả</Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default RoomList

