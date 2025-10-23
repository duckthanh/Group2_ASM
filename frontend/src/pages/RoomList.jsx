import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GlowEffects from '../components/GlowEffects'
import CreateRoom from '../components/CreateRoom'
import RentRoom from '../components/RentRoom'
import RoomFilter from '../components/RoomFilter'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { roomAPI } from '../services/api'

function RoomList({ currentUser, onLogout }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRentModal, setShowRentModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isDeposit, setIsDeposit] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchDistrict, setSearchDistrict] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage] = useState(4)

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const data = await roomAPI.getAvailableRooms()
      setRooms(data)
    } catch (err) {
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchWithParams = async (keyword, location) => {
    setLoading(true)
    try {
      const data = await roomAPI.searchRooms(keyword, location)
      setRooms(data)
    } catch (err) {
      console.error('Error searching rooms:', err)
      alert('Có lỗi khi tìm kiếm. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Lấy keyword từ URL nếu có
    const keywordFromUrl = searchParams.get('keyword')
    if (keywordFromUrl) {
      setSearchKeyword(keywordFromUrl)
      handleSearchWithParams(keywordFromUrl, '')
    } else {
      fetchRooms()
    }
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const handleCreateRoom = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thêm phòng trọ')
      navigate('/login')
      return
    }
    setShowCreateModal(true)
  }

  const handleViewDetail = (room) => {
    navigate(`/room/${room.id}`)
  }

  const handleRentRoom = (room, deposit = false) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thuê phòng')
      navigate('/login')
      return
    }
    setSelectedRoom(room)
    setIsDeposit(deposit)
    setShowRentModal(true)
  }

  const handleModalClose = () => {
    setShowCreateModal(false)
    setShowRentModal(false)
    setSelectedRoom(null)
  }

  const handleSuccess = () => {
    fetchRooms() // Refresh danh sách phòng
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
    await handleSearchWithParams(searchKeyword, searchDistrict)
  }

  const handleReset = () => {
    setSearchKeyword('')
    setSearchDistrict('')
    setCurrentPage(1) // Reset to first page when resetting
    fetchRooms()
  }

  const handleFilter = async (filters) => {
    setLoading(true)
    setCurrentPage(1) // Reset to first page when filtering
    try {
      console.log('Filtering with:', filters)
      const data = await roomAPI.filterRooms(filters)
      console.log('Filter results:', data)
      setRooms(data)
      
      // Nếu không có kết quả, hiển thị thông báo
      if (data.length === 0) {
        alert('Không tìm thấy phòng nào phù hợp với bộ lọc của bạn.')
      }
    } catch (err) {
      console.error('Error filtering rooms:', err)
      console.error('Error details:', err.response?.data || err.message)
      
      // Hiển thị thông báo lỗi chi tiết hơn
      if (err.response?.status === 500) {
        alert('Lỗi server. Vui lòng kiểm tra backend có đang chạy không.')
      } else if (err.response?.status === 404) {
        alert('Không tìm thấy endpoint filter. Vui lòng kiểm tra backend.')
      } else if (err.message === 'Network Error') {
        alert('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy ở http://localhost:8080')
      } else {
        alert('Có lỗi khi lọc: ' + (err.response?.data?.message || err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetFilter = () => {
    fetchRooms()
  }

  const handleDeleteClick = (room) => {
    setRoomToDelete(room)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return

    setDeleting(true)
    try {
      await roomAPI.deleteRoom(roomToDelete.id)
      alert('Xóa phòng trọ thành công!')
      setShowDeleteModal(false)
      setRoomToDelete(null)
      fetchRooms() // Refresh danh sách
    } catch (err) {
      console.error('Error deleting room:', err)
      alert('Có lỗi khi xóa phòng trọ: ' + (err.response?.data?.message || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setRoomToDelete(null)
  }

  // Check if current user is owner of the room or admin
  const canManageRoom = (room) => {
    console.log('=== CAN MANAGE ROOM DEBUG ===')
    console.log('currentUser:', currentUser)
    console.log('room.ownerId:', room.ownerId)
    console.log('currentUser.id:', currentUser?.id)
    console.log('currentUser.role:', currentUser?.role)

    if (!currentUser) {
      console.log('No currentUser -> false')
      return false
    }
    // Admin có thể quản lý tất cả phòng
    if (currentUser.role === 'ADMIN') {
      console.log('User is ADMIN -> true')
      return true
    }
    // User thường chỉ quản lý được phòng của mình
    const canManage = room.ownerId === currentUser.id
    console.log('User is owner?', canManage)
    console.log('=============================')
    return canManage
  }

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom)
  const totalPages = Math.ceil(rooms.length / roomsPerPage)
  
  // Debug pagination
  console.log('Pagination Debug:', {
    totalRooms: rooms.length,
    currentPage,
    roomsPerPage,
    totalPages,
    currentRoomsCount: currentRooms.length
  })

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="bg-gradient">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <GlowEffects />

      {/* Search Bar for Room List */}
      <div className="search-bar-container">
        <div className="container">
          <form onSubmit={handleSearch} className="room-search-form">
            <div className="search-input-group">
              <span className="search-prefix-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm nhà trọ, địa điểm, tiện ích..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-main-input"
              />
            </div>
            <div className="search-input-group">
              <span className="search-prefix-icon">📍</span>
              <input
                type="text"
                placeholder="Tìm phường/xã"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="search-district-input"
              />
            </div>
            <button type="submit" className="btn-search-orange">
              Tìm kiếm
            </button>
            <button type="button" onClick={handleReset} className="btn-reset">
              Đặt lại
            </button>
          </form>
        </div>
      </div>

      <main className="container room-list-container-with-filter">
        {/* Filter Sidebar */}
        <aside className="filter-sidebar">
          <RoomFilter onFilter={handleFilter} onReset={handleResetFilter} />
        </aside>

        {/* Room Content */}
        <div className="room-content-area">
        <div className="page-header">
          <div>
            <h1>Thuê phòng trọ</h1>
            <p className="subtitle">Khám phá những lựa chọn phù hợp với bạn</p>
          </div>
          {currentUser && (
            <button className="btn btn-create-room" onClick={handleCreateRoom}>
              ➕ Thêm Phòng Trọ
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Đang tải...
          </div>
        ) : rooms.length > 0 ? (
          <>
          <div className="room-grid">
            {currentRooms.map((room) => (
              <div key={room.id} className="room-card-modern">
                <Link to={`/room/${room.id}`} className="room-image-wrapper">
                  <img src={room.imageUrl || 'https://via.placeholder.com/400x300?text=Phòng+Trọ'} alt={room.name} />
                  <span className="room-badge-modern">
                    Còn trống
                  </span>
                </Link>
                <div className="room-content-modern">
                  <Link to={`/room/${room.id}`} className="room-name-link">
                    <h3 className="room-name">{room.name}</h3>
                  </Link>
                  <p className="room-location-modern">
                    <span className="location-icon">📍</span>
                    {room.location}
                  </p>
                  {room.detail && (
                    <p className="room-description">
                      {room.detail.length > 50 ? room.detail.substring(0, 50) + '...' : room.detail}
                    </p>
                  )}

                  <div className="room-price-contact">
                    <span className="room-price-modern">
                      {formatPrice(room.price)} <br/>
                      <span className="price-unit">đ/tháng</span>
                    </span>
                    <span className="room-contact-modern">
                      📞 {room.contact}
                    </span>
                  </div>

                  <p className="room-owner-modern">Chủ trọ: {room.ownerUsername}</p>

                  {/* Nút Xem chi tiết */}
                  <div className="room-actions-modern">
                    <Link to={`/room/${room.id}`} className="btn-view-detail">
                      👁️ Xem chi tiết
                    </Link>
                  </div>

                  {/* Hiển thị nút xóa ở dưới nếu là chủ phòng hoặc admin */}
                  {canManageRoom(room) && (
                    <div className="room-actions-delete">
                      <button
                        className="btn-delete-room"
                        onClick={() => handleDeleteClick(room)}
                      >
                        🗑️ Xóa phòng
                      </button>
                    </div>
                  )}

                  {/* Debug info - chỉ hiện khi có nút xóa */}

                  {/* Info cho user chưa đăng nhập */}
                  {!currentUser && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#3b82f6',
                      textAlign: 'center'
                    }}>
                      💡 Click "Xem chi tiết" để thuê phòng
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div style={{ marginTop: '20px', textAlign: 'center', color: 'white' }}>
            <p>Trang {currentPage} / {totalPages} - Tổng {rooms.length} phòng trọ</p>
          </div>
          {totalPages >= 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Trước
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau →
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h3>Chưa có phòng trọ nào</h3>
            <p>{currentUser ? 'Hãy là người đầu tiên thêm phòng trọ!' : 'Đăng nhập để thêm phòng trọ mới!'}</p>
            {currentUser && (
              <button className="btn" onClick={handleCreateRoom}>Thêm phòng trọ</button>
            )}
          </div>
        )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {showCreateModal && (
        <CreateRoom
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}

      {showRentModal && selectedRoom && (
        <RentRoom
          room={selectedRoom}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          isDeposit={isDeposit}
        />
      )}

      {showDeleteModal && roomToDelete && (
        <DeleteConfirmModal
          room={roomToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          loading={deleting}
        />
      )}
    </div>
  )
}

export default RoomList

