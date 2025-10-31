import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { Search, Filter, Home, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MyRoomCard from '../components/MyRoomCard'
=======
import { Search, Filter, Home, AlertCircle, X } from 'lucide-react'
import { customToast } from '../utils/customToast.jsx'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MyRoomCard from '../components/MyRoomCard'
import PostedRoomCard from '../components/PostedRoomCard'
>>>>>>> origin/phong28
import { myRoomsAPI } from '../services/api'
import './MyRooms.css'

function MyRooms({ currentUser, onLogout }) {
  const navigate = useNavigate()
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('ALL')
  const [rooms, setRooms] = useState([])
=======
  const [viewMode, setViewMode] = useState('RENTED') // 'RENTED' or 'POSTED'
  const [activeTab, setActiveTab] = useState('ALL')
  const [rooms, setRooms] = useState([])
  const [postedRooms, setPostedRooms] = useState([])
>>>>>>> origin/phong28
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [counts, setCounts] = useState({
    ALL: 0,
<<<<<<< HEAD
    HOLD: 0,
    DEPOSITED: 0,
=======
    PENDING: 0,
>>>>>>> origin/phong28
    ACTIVE: 0,
    ENDED: 0,
    CANCELED: 0
  })

<<<<<<< HEAD
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    loadRooms()
  }, [currentUser, activeTab])
=======
  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (currentUser) {
      if (viewMode === 'RENTED') {
        loadRooms()
      } else {
        loadPostedRooms()
      }
    }
  }, [currentUser, activeTab, viewMode])
>>>>>>> origin/phong28

  const loadRooms = async () => {
    try {
      setLoading(true)
<<<<<<< HEAD
      const status = activeTab === 'ALL' ? null : activeTab
      const data = await myRoomsAPI.getMyRooms(status, searchKeyword)
      setRooms(data)
      
      // Calculate counts
      const allRooms = activeTab === 'ALL' ? data : await myRoomsAPI.getMyRooms(null, null)
      const newCounts = {
        ALL: allRooms.length,
        HOLD: allRooms.filter(r => r.status === 'HOLD').length,
        DEPOSITED: allRooms.filter(r => r.status === 'DEPOSITED').length,
        ACTIVE: allRooms.filter(r => r.status === 'ACTIVE').length,
        ENDED: allRooms.filter(r => r.status === 'ENDED').length,
        CANCELED: allRooms.filter(r => r.status === 'CANCELED').length
      }
      setCounts(newCounts)
    } catch (error) {
      console.error('Failed to load rooms:', error)
      toast.error('Không thể tải danh sách phòng')
=======
      
      // Always fetch all rooms first
      const allRooms = await myRoomsAPI.getMyRooms(null, searchKeyword)
      
      console.log('=== MY ROOMS DEBUG ===')
      console.log('All rooms:', allRooms)
      console.log('Room statuses:', allRooms.map(r => ({ id: r.bookingId, status: r.status, title: r.roomTitle })))
      console.log('Active tab:', activeTab)
      console.log('=====================')
      
      // Filter based on active tab
      let filteredRooms = allRooms
      if (activeTab !== 'ALL') {
        filteredRooms = allRooms.filter(room => {
          switch (activeTab) {
            case 'PENDING':
              return room.status === 'PENDING'
            case 'ACTIVE':
              // Include both ACTIVE and CONFIRMED in "Đang thuê" tab
              return room.status === 'ACTIVE' || room.status === 'CONFIRMED'
            case 'ENDED':
              return room.status === 'ENDED'
            case 'CANCELED':
              return room.status === 'CANCELED' || room.status === 'REJECTED'
            default:
              return true
          }
        })
      }
      
      setRooms(filteredRooms)
      
      // Calculate counts
      const newCounts = {
        ALL: allRooms.length,
        PENDING: allRooms.filter(r => r.status === 'PENDING').length,
        ACTIVE: allRooms.filter(r => r.status === 'ACTIVE' || r.status === 'CONFIRMED').length,
        ENDED: allRooms.filter(r => r.status === 'ENDED').length,
        CANCELED: allRooms.filter(r => r.status === 'CANCELED' || r.status === 'REJECTED').length
      }
      
      console.log('Counts:', newCounts)
      console.log('Filtered rooms:', filteredRooms.length)
      
      setCounts(newCounts)
    } catch (error) {
      console.error('Failed to load rooms:', error)
      customToast.error('Không thể tải danh sách phòng')
    } finally {
      setLoading(false)
    }
  }

  const loadPostedRooms = async () => {
    try {
      setLoading(true)
      const rooms = await myRoomsAPI.getMyPostedRooms()
      setPostedRooms(rooms)
    } catch (error) {
      console.error('Failed to load posted rooms:', error)
      customToast.error('Không thể tải danh sách phòng đã đăng')
>>>>>>> origin/phong28
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
<<<<<<< HEAD
    loadRooms()
=======
    if (viewMode === 'RENTED') {
      loadRooms()
    }
>>>>>>> origin/phong28
  }

  const handleAction = async (action, room) => {
    switch (action) {
      case 'cancel':
<<<<<<< HEAD
        if (window.confirm('Bạn có chắc muốn hủy đặt phòng này?')) {
          try {
            await myRoomsAPI.cancelBooking(room.bookingId, 'Hủy bởi người dùng')
            toast.success('Đã hủy đặt phòng')
            loadRooms()
          } catch (error) {
            toast.error('Không thể hủy đặt phòng')
          }
        }
=======
        setSelectedRoom(room)
        setCancelReason('')
        setShowCancelModal(true)
        break
      
      case 'return':
        setSelectedRoom(room)
        setShowReturnModal(true)
>>>>>>> origin/phong28
        break
      
      case 'contact-landlord':
        if (room.landlord?.phone) {
          window.open(`tel:${room.landlord.phone}`, '_self')
        }
        break
      
      case 'report-issue':
        navigate(`/account/rooms/${room.bookingId}?tab=issues`)
        break
      
      case 'view-contract':
        if (room.contract?.pdfUrl) {
          window.open(room.contract.pdfUrl, '_blank')
        }
        break
      
      default:
        console.log('Action:', action, room)
    }
  }

<<<<<<< HEAD
  const tabs = [
    { key: 'ALL', label: 'Tất cả', count: counts.ALL },
    { key: 'HOLD', label: 'Giữ chỗ', count: counts.HOLD },
    { key: 'DEPOSITED', label: 'Đã đặt cọc', count: counts.DEPOSITED },
=======
  const handleConfirmCancel = async () => {
    if (!selectedRoom) return
    
    setProcessing(true)
    try {
      const reason = cancelReason.trim() || 'Đổi ý không thuê nữa'
      await myRoomsAPI.cancelBooking(selectedRoom.bookingId, reason)
      customToast.success('Đã hủy yêu cầu thuê phòng thành công! 🚫')
      setShowCancelModal(false)
      setSelectedRoom(null)
      setCancelReason('')
      loadRooms()
    } catch (error) {
      console.error('Cancel booking error:', error)
      customToast.error('Không thể hủy yêu cầu: ' + (error.response?.data?.message || error.message))
    } finally {
      setProcessing(false)
    }
  }

  const handleConfirmReturn = async () => {
    if (!selectedRoom) return
    
    setProcessing(true)
    try {
      await myRoomsAPI.returnRoom(selectedRoom.bookingId)
      customToast.success('Trả phòng thành công! 🏠✓')
      setShowReturnModal(false)
      setSelectedRoom(null)
      loadRooms()
    } catch (error) {
      console.error('Return room error:', error)
      customToast.error('Không thể trả phòng: ' + (error.response?.data?.message || error.message))
    } finally {
      setProcessing(false)
    }
  }

  const tabs = [
    { key: 'ALL', label: 'Tất cả', count: counts.ALL },
    { key: 'PENDING', label: 'Chờ xác nhận', count: counts.PENDING },
>>>>>>> origin/phong28
    { key: 'ACTIVE', label: 'Đang thuê', count: counts.ACTIVE },
    { key: 'ENDED', label: 'Đã trả phòng', count: counts.ENDED },
    { key: 'CANCELED', label: 'Đã hủy', count: counts.CANCELED }
  ]

  return (
    <div className="my-rooms-page">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <div className="my-rooms-container">
        {/* Header */}
        <div className="my-rooms-header">
          <div>
            <h1 className="my-rooms-title">Phòng Của Tôi</h1>
            <p className="my-rooms-subtitle">
<<<<<<< HEAD
              Quản lý tất cả phòng trọ bạn đã đặt và đang thuê
=======
              {viewMode === 'RENTED' 
                ? 'Quản lý tất cả phòng trọ bạn đã đặt và đang thuê'
                : 'Quản lý tất cả phòng trọ bạn đã đăng'}
>>>>>>> origin/phong28
            </p>
          </div>
        </div>

<<<<<<< HEAD
        {/* Search & Filter */}
        <div className="my-rooms-search-bar">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm theo tên phòng, địa chỉ, chủ trọ..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-search">
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div className="my-rooms-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
=======
        {/* View Mode Toggle */}
        <div className="view-mode-toggle" style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          padding: '4px',
          background: '#F1F5F9',
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          <button
            className={`toggle-btn ${viewMode === 'RENTED' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('RENTED')
              setActiveTab('ALL')
            }}
            style={{
              padding: '12px 24px',
              background: viewMode === 'RENTED' ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              fontWeight: viewMode === 'RENTED' ? '600' : '500',
              color: viewMode === 'RENTED' ? '#1E293B' : '#64748B',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: viewMode === 'RENTED' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            📋 Phòng đang thuê
          </button>
          <button
            className={`toggle-btn ${viewMode === 'POSTED' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('POSTED')
            }}
            style={{
              padding: '12px 24px',
              background: viewMode === 'POSTED' ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              fontWeight: viewMode === 'POSTED' ? '600' : '500',
              color: viewMode === 'POSTED' ? '#1E293B' : '#64748B',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: viewMode === 'POSTED' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            🏠 Phòng đã đăng
          </button>
        </div>

        {/* Search & Filter - Only for RENTED mode */}
        {viewMode === 'RENTED' && (
          <>
            <div className="my-rooms-search-bar">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên phòng, địa chỉ, chủ trọ..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-search">
                  Tìm kiếm
                </button>
              </form>
            </div>

            {/* Tabs */}
            <div className="my-rooms-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  <span className="tab-count">{tab.count}</span>
                </button>
              ))}
            </div>
          </>
        )}
>>>>>>> origin/phong28

        {/* Rooms Grid */}
        <div className="my-rooms-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tải...</p>
            </div>
<<<<<<< HEAD
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Home size={64} />
              </div>
              <h3>Chưa có phòng nào</h3>
              <p>
                {activeTab === 'ALL' 
                  ? 'Bạn chưa đặt phòng nào. Khám phá và tìm phòng phù hợp ngay!'
                  : `Không có phòng nào trong trạng thái "${tabs.find(t => t.key === activeTab)?.label}"`
                }
              </p>
              <button 
                className="btn-find-room"
                onClick={() => navigate('/rooms/phong-tro')}
              >
                <Search size={18} />
                Tìm phòng ngay
              </button>
            </div>
          ) : (
            <div className="my-rooms-grid">
              {rooms.map(room => (
                <MyRoomCard 
                  key={room.bookingId} 
                  room={room}
                  onAction={handleAction}
                />
              ))}
            </div>
=======
          ) : viewMode === 'RENTED' ? (
            // Rented rooms view
            rooms.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Home size={64} />
                </div>
                <h3>Chưa có phòng nào</h3>
                <p>
                  {activeTab === 'ALL' 
                    ? 'Bạn chưa đặt phòng nào. Khám phá và tìm phòng phù hợp ngay!'
                    : `Không có phòng nào trong trạng thái "${tabs.find(t => t.key === activeTab)?.label}"`
                  }
                </p>
                <button 
                  className="btn-find-room"
                  onClick={() => navigate('/rooms/phong-tro')}
                >
                  <Search size={18} />
                  Tìm phòng ngay
                </button>
              </div>
            ) : (
              <div className="my-rooms-grid">
                {rooms.map(room => (
                  <MyRoomCard 
                    key={room.bookingId} 
                    room={room}
                    onAction={handleAction}
                  />
                ))}
              </div>
            )
          ) : (
            // Posted rooms view
            postedRooms.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Home size={64} />
                </div>
                <h3>Chưa có phòng đã đăng</h3>
                <p>
                  Bạn chưa đăng phòng nào. Hãy đăng phòng để cho thuê!
                </p>
                <button 
                  className="btn-find-room"
                  onClick={() => navigate('/account/rooms/add')}
                >
                  <Home size={18} />
                  Đăng phòng ngay
                </button>
              </div>
            ) : (
              <div className="my-rooms-grid">
                {postedRooms.map(room => (
                  <PostedRoomCard 
                    key={room.id} 
                    room={room}
                  />
                ))}
              </div>
            )
>>>>>>> origin/phong28
          )}
        </div>
      </div>

<<<<<<< HEAD
=======
      {/* Cancel Booking Modal */}
      {showCancelModal && selectedRoom && (
        <div className="modal-overlay-new" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Hủy yêu cầu thuê phòng</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowCancelModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p>Bạn có chắc muốn hủy yêu cầu thuê phòng:</p>
              <div className="user-to-delete-box">
                <strong>{selectedRoom.roomTitle}</strong>
              </div>
              <div className="form-group-new" style={{ marginTop: '20px' }}>
                <label className="form-label-new">Lý do hủy (không bắt buộc):</label>
                <textarea
                  className="form-textarea-new"
                  placeholder="Vui lòng cho biết lý do hủy..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div className="warning-box">
                ⚠️ Hành động này không thể hoàn tác!
              </div>
            </div>
            <div className="modal-actions-new">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowCancelModal(false)}
                disabled={processing}
              >
                Đóng
              </button>
              <button
                className="btn-modal-delete"
                onClick={handleConfirmCancel}
                disabled={processing}
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Room Modal */}
      {showReturnModal && selectedRoom && (
        <div className="modal-overlay-new" onClick={() => setShowReturnModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Xác nhận trả phòng</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowReturnModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p>Bạn chắc chắn muốn trả phòng:</p>
              <div className="user-to-delete-box">
                <strong>{selectedRoom.roomTitle}</strong>
              </div>
              <div className="warning-box" style={{ marginTop: '20px' }}>
                ⚠️ Phòng sẽ được chuyển sang trạng thái "Đã trả phòng" và bạn sẽ không thể quay lại quyết định này!
              </div>
            </div>
            <div className="modal-actions-new">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowReturnModal(false)}
                disabled={processing}
              >
                Hủy
              </button>
              <button
                className="btn-modal-delete"
                onClick={handleConfirmReturn}
                disabled={processing}
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận trả phòng'}
              </button>
            </div>
          </div>
        </div>
      )}

>>>>>>> origin/phong28
      <Footer />
    </div>
  )
}

export default MyRooms

