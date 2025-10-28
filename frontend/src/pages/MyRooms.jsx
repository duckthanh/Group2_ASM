import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Home, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MyRoomCard from '../components/MyRoomCard'
import { myRoomsAPI } from '../services/api'
import './MyRooms.css'

function MyRooms({ currentUser, onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ALL')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [counts, setCounts] = useState({
    ALL: 0,
    HOLD: 0,
    DEPOSITED: 0,
    ACTIVE: 0,
    ENDED: 0,
    CANCELED: 0
  })

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    loadRooms()
  }, [currentUser, activeTab])

  const loadRooms = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    loadRooms()
  }

  const handleAction = async (action, room) => {
    switch (action) {
      case 'cancel':
        if (window.confirm('Bạn có chắc muốn hủy đặt phòng này?')) {
          try {
            await myRoomsAPI.cancelBooking(room.bookingId, 'Hủy bởi người dùng')
            toast.success('Đã hủy đặt phòng')
            loadRooms()
          } catch (error) {
            toast.error('Không thể hủy đặt phòng')
          }
        }
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

  const tabs = [
    { key: 'ALL', label: 'Tất cả', count: counts.ALL },
    { key: 'HOLD', label: 'Giữ chỗ', count: counts.HOLD },
    { key: 'DEPOSITED', label: 'Đã đặt cọc', count: counts.DEPOSITED },
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
              Quản lý tất cả phòng trọ bạn đã đặt và đang thuê
            </p>
          </div>
        </div>

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

        {/* Rooms Grid */}
        <div className="my-rooms-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tải...</p>
            </div>
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
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MyRooms

