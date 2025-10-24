import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GlowEffects from '../components/GlowEffects'
import RentRoom from '../components/RentRoom'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { roomAPI } from '../services/api'

function RoomDetail({ currentUser, onLogout }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRentModal, setShowRentModal] = useState(false)
  const [isDeposit, setIsDeposit] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchRoom()
  }, [id])

  const fetchRoom = async () => {
    setLoading(true)
    try {
      const data = await roomAPI.getRoomById(id)
      console.log('=== ROOM DETAIL DEBUG ===')
      console.log('Received room data:', data)
      console.log('roomType:', data.roomType)
      console.log('area:', data.area)
      console.log('capacity:', data.capacity)
      console.log('amenities:', data.amenities)
      console.log('availability:', data.availability)
      console.log('isAvailable:', data.isAvailable)
      console.log('=========================')
      setRoom(data)
    } catch (err) {
      console.error('Error fetching room:', err)
      navigate('/rooms/phong-tro')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const handleRentRoom = (deposit = false) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thuê phòng')
      navigate('/login')
      return
    }
    setIsDeposit(deposit)
    setShowRentModal(true)
  }

  const handleViewRentOptions = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để xem các tùy chọn thuê phòng')
      navigate('/login')
      return
    }
    setShowRentModal(true)
  }

  const handleDeleteRoom = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await roomAPI.deleteRoom(room.id)
      alert('Xóa phòng trọ thành công!')
      navigate('/rooms/phong-tro')
    } catch (err) {
      console.error('Error deleting room:', err)
      alert('Có lỗi khi xóa phòng trọ: ' + (err.response?.data?.message || err.message))
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const canManageRoom = () => {
    console.log('=== ROOM DETAIL CAN MANAGE DEBUG ===')
    console.log('currentUser:', currentUser)
    console.log('room:', room)
    console.log('room.ownerId:', room?.ownerId)
    console.log('currentUser.id:', currentUser?.id)
    console.log('currentUser.role:', currentUser?.role)

    if (!currentUser) {
      console.log('No currentUser -> false')
      return false
    }
    if (currentUser.role === 'ADMIN') {
      console.log('User is ADMIN -> true')
      return true
    }
    const canManage = room && room.ownerId === currentUser.id
    console.log('User is owner?', canManage)
    console.log('===================================')
    return canManage
  }

  // Parse amenities từ string sang array
  const amenitiesList = room && room.amenities ? room.amenities.split(', ') : []

  if (loading) {
    return (
      <div className="bg-gradient">
        <Navbar currentUser={currentUser} onLogout={onLogout} />
        <GlowEffects />
        <main className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>
            Đang tải thông tin phòng...
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="bg-gradient">
        <Navbar currentUser={currentUser} onLogout={onLogout} />
        <GlowEffects />
        <main className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>
            Không tìm thấy phòng trọ
          </div>
          <Link to="/rooms/phong-tro" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '600'
          }}>
            Quay lại danh sách
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-gradient">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <GlowEffects />

      <main className="container" style={{ padding: '100px 0' }}>
        {/* Back button */}
        <Link to="/rooms/phong-tro" className="back-link">
          ← Quay lại danh sách phòng
        </Link>

        {/* Room Detail Container */}
        <div className="room-detail-container">
          {/* Hình ảnh */}
          <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
            <img
              src={room.imageUrl || 'https://via.placeholder.com/900x500?text=Phòng+Trọ'}
              alt={room.name}
              className="room-detail-image"
            />
            {room.isAvailable && (
              <span className="room-detail-badge">
                Còn trống
              </span>
            )}
          </div>

          {/* Content */}
          <div className="room-detail-content">
            {/* Thông tin cơ bản */}
            <div className="room-detail-header">
              <h1 className="room-detail-title">{room.name}</h1>
              <div className="room-detail-price">
                <span className="room-detail-price-value">{formatPrice(room.price)}</span>
                <span className="room-detail-price-unit">đ/tháng</span>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="room-detail-info-grid">
              <div className="room-detail-info-item">
                <span className="room-detail-info-icon">📍</span>
                <div>
                  <p className="room-detail-info-label">Vị trí</p>
                  <p className="room-detail-info-value">{room.location}</p>
                </div>
              </div>

              <div className="room-detail-info-item">
                <span className="room-detail-info-icon">📞</span>
                <div>
                  <p className="room-detail-info-label">Liên hệ</p>
                  <p className="room-detail-info-value">{room.contact}</p>
                </div>
              </div>

              <div className="room-detail-info-item">
                <span className="room-detail-info-icon">👤</span>
                <div>
                  <p className="room-detail-info-label">Chủ trọ</p>
                  <p className="room-detail-info-value">{room.ownerUsername}</p>
                </div>
              </div>

              <div className="room-detail-info-item">
                <span className="room-detail-info-icon">🏠</span>
                <div>
                  <p className="room-detail-info-label">Loại hình</p>
                  <p className="room-detail-info-value">{room.roomType || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="room-detail-info-item">
                <span className="room-detail-info-icon">📐</span>
                <div>
                  <p className="room-detail-info-label">Diện tích</p>
                  <p className="room-detail-info-value">
                    {room.area ? `${room.area} m²` : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>

              <div className="room-detail-info-item">
                <span className="room-detail-info-icon">👥</span>
                <div>
                  <p className="room-detail-info-label">Sức chứa</p>
                  <p className="room-detail-info-value">
                    {room.capacity ? `${room.capacity} người` : 'Chưa cập nhật'}
                  </p>
                </div>
              </div>

              <div className="room-detail-info-item">
                <span className="room-detail-info-icon">⏰</span>
                <div>
                  <p className="room-detail-info-label">Phòng trống</p>
                  <p className={`room-detail-info-value ${room.isAvailable ? 'available' : 'unavailable'}`}>
                    {room.isAvailable ? 'Còn trống' : 'Đã cho thuê'}
                  </p>
                </div>
              </div>

              <div className="room-detail-info-item">
                <span className="room-detail-info-icon">📅</span>
                <div>
                  <p className="room-detail-info-label">Tình trạng chi tiết</p>
                  <p className="room-detail-info-value">{room.availability || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div className="room-detail-section">
              <h3 className="room-detail-section-title">Mô tả chi tiết</h3>
              <p className={`room-detail-description ${!room.detail ? 'placeholder-text' : ''}`}>
                {room.detail || 'Chưa có mô tả chi tiết'}
              </p>
            </div>

            {/* Tiện nghi */}
            <div className="room-detail-section">
              <h3 className="room-detail-section-title">Tiện nghi</h3>
              {amenitiesList.length > 0 ? (
                <div className="room-detail-amenities-grid">
                  {amenitiesList.map((amenity, index) => (
                    <div key={index} className="room-detail-amenity-item">
                      <span className="room-detail-amenity-icon">✓</span>
                      <span className="room-detail-amenity-text">{amenity.trim()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="room-detail-description placeholder-text">Chưa cập nhật tiện nghi</p>
              )}
            </div>

            {/* Thông tin bổ sung */}
            {(room.createdAt || room.updatedAt) && (
              <div className="room-detail-section">
                <h3 className="room-detail-section-title">Thông tin khác</h3>
                <div className="room-detail-info-grid">
                  {room.createdAt && (
                    <div className="room-detail-info-item">
                      <span className="room-detail-info-icon">📅</span>
                      <div>
                        <p className="room-detail-info-label">Ngày tạo</p>
                        <p className="room-detail-info-value">
                          {new Date(room.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  )}
                  {room.updatedAt && (
                    <div className="room-detail-info-item">
                      <span className="room-detail-info-icon">🔄</span>
                      <div>
                        <p className="room-detail-info-label">Cập nhật cuối</p>
                        <p className="room-detail-info-value">
                          {new Date(room.updatedAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="room-detail-actions">
              {/* Nút Thuê ngay và Đặt cọc - luôn hiển thị */}
              <div className="room-detail-buttons">
                <button
                  className="btn-room-detail-rent"
                  onClick={() => handleRentRoom(false)}
                >
                  🏠 Thuê ngay
                </button>
                <button
                  className="btn-room-detail-deposit"
                  onClick={() => handleRentRoom(true)}
                >
                  💰 Đặt cọc
                </button>
              </div>

              {/* Nút Xóa phòng - chỉ hiển thị cho admin/chủ phòng */}
              {canManageRoom() && (
                <div className="room-detail-buttons" style={{ marginTop: '16px' }}>
                  <button
                    className="btn-room-detail-delete"
                    onClick={handleDeleteRoom}
                  >
                    🗑️ Xóa phòng
                  </button>
                </div>
              )}


              {/* Info cho user chưa đăng nhập */}
              {!currentUser && (
                <div style={{
                  marginTop: '20px',
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#3b82f6',
                  textAlign: 'center'
                }}>
                  💡 Click nút "Thuê ngay" hoặc "Đặt cọc" để bắt đầu
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal thuê phòng */}
      {showRentModal && (
        <RentRoom
          room={room}
          onClose={() => setShowRentModal(false)}
          onSuccess={() => {
            setShowRentModal(false)
            fetchRoom() // Refresh room data
          }}
          isDeposit={isDeposit}
        />
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <DeleteConfirmModal
          room={room}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}
    </div>
  )
}

export default RoomDetail
