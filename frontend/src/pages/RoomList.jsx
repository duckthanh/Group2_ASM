import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { customToast } from '../utils/customToast.jsx'
import { Search, MapPin, SlidersHorizontal, Plus, Home, Users, Maximize, Phone, Eye, Trash2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CreateRoom from '../components/CreateRoom'
import RentRoom from '../components/RentRoom'
import RoomFilter from '../components/RoomFilter'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import Pagination from '../components/Pagination'
import { roomAPI } from '../services/api'

function RoomList({ currentUser, onLogout }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRentModal, setShowRentModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isDeposit, setIsDeposit] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchLocation, setSearchLocation] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [roomsPerPage] = useState(10) // 10 phòng trên mỗi trang

  const fetchRooms = async () => {
    console.log('🔄 Fetching available rooms...')
    setLoading(true)
    try {
      const data = await roomAPI.getAvailableRooms()
      console.log(`✅ Fetched ${data.length} available rooms:`, data)
      setRooms(data)
    } catch (err) {
      console.error('❌ Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchWithParams = async (keyword, location) => {
    setLoading(true)
    try {
      const data = await roomAPI.searchRooms(keyword, location)
      setRooms(data)
      if (data.length === 0) {
        customToast.info('Không tìm thấy phòng nào phù hợp với từ khóa tìm kiếm.')
      }
    } catch (err) {
      console.error('Error searching rooms:', err)
      if (err.response?.status === 500) {
        customToast.error('Lỗi server. Vui lòng kiểm tra backend có đang chạy không.')
      } else if (err.message === 'Network Error') {
        customToast.error('Không thể kết nối đến server.')
      } else {
        customToast.error('Có lỗi khi tìm kiếm: ' + (err.response?.data?.message || err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
      customToast.error('Vui lòng đăng nhập để thêm phòng trọ')
      navigate('/login')
      return
    }
    setShowCreateModal(true)
  }

  const handleModalClose = () => {
    setShowCreateModal(false)
    setShowRentModal(false)
    setSelectedRoom(null)
  }

  const handleSuccess = async () => {
    console.log('🎉 handleSuccess called - refreshing room list...')
    // Reset về trạng thái ban đầu để thấy phòng mới
    setSearchKeyword('')
    setSearchLocation('')
    setCurrentPage(1) // Reset về trang đầu tiên
    setSortBy('default') // Reset sorting
    await fetchRooms() // Fetch all available rooms
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setCurrentPage(1)
    await handleSearchWithParams(searchKeyword, searchLocation)
  }

  const handleReset = () => {
    setSearchKeyword('')
    setSearchLocation('')
    setCurrentPage(1)
    fetchRooms()
  }

  const handleFilter = async (filters) => {
    setLoading(true)
    setCurrentPage(1)
    try {
      const data = await roomAPI.filterRooms(filters)
      setRooms(data)
      if (data.length === 0) {
        customToast.info('Không tìm thấy phòng nào phù hợp với bộ lọc của bạn.')
      }
    } catch (err) {
      console.error('Error filtering rooms:', err)
      if (err.response?.status === 500) {
        customToast.error('Lỗi server. Vui lòng kiểm tra backend có đang chạy không.')
      } else if (err.message === 'Network Error') {
        customToast.error('Không thể kết nối đến server.')
      } else {
        customToast.error('Có lỗi khi lọc: ' + (err.response?.data?.message || err.message))
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
      customToast.success('Xóa phòng trọ thành công! 🗑️')
      setShowDeleteModal(false)
      setRoomToDelete(null)
      fetchRooms()
    } catch (err) {
      console.error('Error deleting room:', err)
      customToast.error('Có lỗi khi xóa phòng trọ: ' + (err.response?.data?.message || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setRoomToDelete(null)
  }

  const canManageRoom = (room) => {
    if (!currentUser) return false
    if (currentUser.role === 'ADMIN') return true
    return room.ownerId === currentUser.id
  }

  // Sort rooms
  const getSortedRooms = (rooms) => {
    const sorted = [...rooms]
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'newest':
        return sorted.reverse()
      default:
        return sorted
    }
  }

  const sortedRooms = getSortedRooms(rooms)

  // Pagination
  const indexOfLastRoom = currentPage * roomsPerPage
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage
  const currentRooms = sortedRooms.slice(indexOfFirstRoom, indexOfLastRoom)
  const totalPages = Math.ceil(sortedRooms.length / roomsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="room-list-page-new">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      {/* Hero Section */}
      <div className="room-list-hero">
        <div className="container">
          <div className="hero-content-new">
            <h1 className="hero-title-new">Tìm phòng trọ phù hợp với bạn</h1>
            <p className="hero-subtitle-new">Khám phá hàng ngàn phòng trọ chất lượng, giá cả phải chăng</p>
          </div>

          {/* Search Bar */}
          <div className="search-bar-new">
            <form onSubmit={handleSearch} className="search-form-new">
              <div className="search-input-wrapper-new">
                <Search size={20} className="search-icon-new" />
                <input
                  type="text"
                  placeholder="Tìm kiếm từ khóa: gần trường, có ban công..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="search-input-new"
                />
              </div>
              <div className="search-input-wrapper-new">
                <MapPin size={20} className="search-icon-new" />
                <input
                  type="text"
                  placeholder="Địa điểm: quận, huyện, tuyến bus..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="search-input-new"
                />
              </div>
              <button type="submit" className="btn-search-new">
                <Search size={20} />
                Tìm kiếm
              </button>
            </form>
            
            {/* Popular keywords */}
            <div className="search-suggestions">
              <span className="suggestions-label">Gợi ý:</span>
              <button className="suggestion-chip" onClick={() => setSearchKeyword('gần FPT')}>Gần FPT</button>
              <button className="suggestion-chip" onClick={() => setSearchKeyword('thôn 4')}>Thôn 4</button>
              <button className="suggestion-chip" onClick={() => setSearchKeyword('gần chợ hòa lạc')}>Gần chợ hòa lạc</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container room-list-main">
        <div className="room-list-layout">
          {/* Filter Panel */}
          <aside className="filter-sidebar-new">
            <RoomFilter onFilter={handleFilter} onReset={handleResetFilter} />
          </aside>

          {/* Room Content */}
          <div className="room-content-new">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <h2 className="results-title">
                  {loading ? 'Đang tải...' : `${sortedRooms.length} phòng trọ`}
                </h2>
                <p className="results-subtitle">Kết quả tìm kiếm</p>
              </div>
              
              <div className="results-controls">
                {currentUser && (
                  <button className="btn-add-room" onClick={handleCreateRoom}>
                    <Plus size={20} />
                    Thêm phòng
                  </button>
                )}
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Phù hợp nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="newest">Mới đăng</option>
                </select>
              </div>
            </div>

            {/* Room Grid */}
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Đang tải danh sách phòng...</p>
              </div>
            ) : sortedRooms.length > 0 ? (
              <>
                <div className="room-grid-new">
                  {currentRooms.map((room) => (
                    <div key={room.id} className="room-card-new">
                      {/* Room Image */}
                      <Link to={`/room/${room.id}`} className="room-image-link">
                        <img 
                          src={room.imageUrl || 'https://via.placeholder.com/400x300?text=Phòng+Trọ'} 
                          alt={room.name}
                          className="room-image-new"
                        />
                        <div 
                          className="room-badge-new"
                          style={{
                            background: room.isAvailable ? '#10B981' : '#EF4444',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            position: 'absolute',
                            top: '12px',
                            right: '12px'
                          }}
                        >
                          {room.isAvailable ? '✓ Còn Trống' : '✕ Hết Phòng'}
                        </div>
                      </Link>

                      {/* Room Info */}
                      <div className="room-info-new">
                        <Link to={`/room/${room.id}`} className="room-name-link">
                          <h3 className="room-name-new">{room.name}</h3>
                        </Link>
                        
                        <div className="room-location-new">
                          <MapPin size={16} />
                          <span>{room.location}</span>
                        </div>

                        <div className="room-meta-new">
                          <div className="meta-item">
                            <Maximize size={16} />
                            <span>{room.area || 20}m²</span>
                          </div>
                          <div className="meta-item">
                            <Users size={16} />
                            <span>{room.capacity || 2} người</span>
                          </div>
                        </div>

                        {/* Amenities chips */}
                        <div className="room-amenities-chips">
                          <span className="amenity-chip">❄️ Điều hòa</span>
                          <span className="amenity-chip">🚿 WC riêng</span>
                          <span className="amenity-chip">🌿 Ban công</span>
                        </div>

                        <div className="room-footer-new">
                          <div className="room-price-new">
                            <span className="price-amount">{formatPrice(room.price)}</span>
                            <span className="price-unit">đ/tháng</span>
                          </div>
                          
                          <Link to={`/room/${room.id}`} className="btn-view-detail-new">
                            <Eye size={18} />
                            Xem chi tiết
                          </Link>
                        </div>

                        {/* Quick contact */}
                        {room.contact && (
                          <div className="room-contact-new">
                            <Phone size={14} />
                            <span>{room.contact}</span>
                          </div>
                        )}

                        {/* Delete button for owner/admin */}
                        {canManageRoom(room) && (
                          <button
                            className="btn-delete-room-new"
                            onClick={() => handleDeleteClick(room)}
                          >
                            <Trash2 size={16} />
                            Xóa phòng
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="empty-state-new">
                <Home size={64} strokeWidth={1.5} className="empty-icon-new" />
                <h3>Không tìm thấy phòng trọ</h3>
                <p>Thử điều chỉnh bộ lọc hoặc mở rộng khu vực tìm kiếm</p>
                <button className="btn-reset-search" onClick={handleReset}>
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {showCreateModal && (
        <CreateRoom onClose={handleModalClose} onSuccess={handleSuccess} />
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
