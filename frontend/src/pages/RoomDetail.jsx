import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { 
  Heart, Share2, Flag, MapPin, Home, Users, Maximize, 
  Phone, MessageCircle, Clock, ChevronLeft, ChevronRight,
  ZoomIn, X, Copy, Check, Star, DollarSign, Zap, Wifi,
  AirVent, Droplets, Car, UtensilsCrossed, Sofa, Edit
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RentRoom from '../components/RentRoom'
import EditRoom from '../components/EditRoom'
import ImageGallery from '../components/ImageGallery'
import { roomAPI, savedRoomAPI, roomReportAPI } from '../services/api'
import toast from 'react-hot-toast'
import './RoomDetail.css'

function RoomDetail({ currentUser, onLogout }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  // Rent Room modal state
  const [showRentModal, setShowRentModal] = useState(false)
  const [isDeposit, setIsDeposit] = useState(false)

  // Edit Room modal state
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchRoom()
    if (currentUser) {
      checkIfRoomSaved()
    }
    // Scroll spy
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [id, currentUser])

  const handleScroll = () => {
    const sections = ['overview', 'amenities', 'costs', 'map', 'similar']
    const scrollPosition = window.scrollY + 200

    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
        }
      }
    }
  }

  // Get all images (main + additional)
  const getAllImages = () => {
    if (!room) return []
    const images = []
    if (room.imageUrl) images.push(room.imageUrl)
    
    if (room.additionalImages) {
      try {
        const additionalImagesArray = JSON.parse(room.additionalImages)
        images.push(...additionalImagesArray)
      } catch (e) {
        console.error('Error parsing additional images:', e)
      }
    }
    
    return images
  }


  const fetchRoom = async () => {
    setLoading(true)
    try {
      const data = await roomAPI.getRoomById(id)
      setRoom(data)
    } catch (err) {
      console.error('Error fetching room:', err)
      toast.error('Không tìm thấy phòng trọ')
      navigate('/rooms/phong-tro')
    } finally {
      setLoading(false)
    }
  }

  const checkIfRoomSaved = async () => {
    if (!currentUser) return
    try {
      const response = await savedRoomAPI.checkIfSaved(id)
      setSaved(response.saved)
    } catch (err) {
      console.error('Error checking saved status:', err)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const canManageRoom = () => {
    if (!currentUser || !room) return false
    return currentUser.role === 'ADMIN' || currentUser.id === room.ownerId
  }

  const handleEditRoom = () => {
    setShowEditModal(true)
  }

  const handleSave = async () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để lưu phòng')
      navigate('/login')
      return
    }
    
    try {
      if (saved) {
        await savedRoomAPI.unsaveRoom(id)
        setSaved(false)
        toast.success('Đã bỏ lưu')
      } else {
        await savedRoomAPI.saveRoom(id)
        setSaved(true)
        toast.success('Đã lưu phòng')
      }
    } catch (err) {
      console.error('Error saving room:', err)
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message
      if (errorMessage === 'Room already saved') {
        toast.error('Bạn đã lưu phòng này rồi!')
      } else {
        toast.error(errorMessage || 'Có lỗi xảy ra')
      }
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: room.name,
        text: `${room.name} - ${formatPrice(room.price)}đ/tháng`,
        url: window.location.href
      })
    } else {
      handleCopyLink()
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success('Đã copy link')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReport = async () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để báo cáo')
      navigate('/login')
      return
    }

    try {
      await roomReportAPI.createReport(id, {
        reason: 'other',
        description: 'Báo cáo từ người dùng'
      })
      toast.success('Đã gửi báo cáo. Chúng tôi sẽ xem xét trong 24h.')
    } catch (err) {
      console.error('Error reporting room:', err)
      toast.error('Có lỗi xảy ra khi gửi báo cáo')
    }
  }

  const handleRentNow = () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để thuê phòng')
      navigate('/login')
      return
    }
    // Check if user is the owner
    if (currentUser.id === room?.ownerId) {
      toast.error('Bạn không thể thuê phòng của chính mình')
      return
    }
    setIsDeposit(false)
    setShowRentModal(true)
  }

  const handleDeposit = () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để đặt cọc')
      navigate('/login')
      return
    }
    // Check if user is the owner
    if (currentUser.id === room?.ownerId) {
      toast.error('Bạn không thể thuê phòng của chính mình')
      return
    }
    setIsDeposit(true)
    setShowRentModal(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (room.images?.length || 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (room.images?.length || 1)) % (room.images?.length || 1))
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const getBackUrl = () => {
    const params = new URLSearchParams(location.search)
    const back = params.get('back')
    return back || '/rooms/phong-tro'
  }

  // Parse amenities
  const amenitiesMap = {
    'Có gác lửng': { icon: Home, label: 'Gác lửng' },
    'Có nhà vệ sinh riêng': { icon: Droplets, label: 'Vệ sinh riêng' },
    'Có ban công': { icon: Home, label: 'Ban công' },
    'Có máy lạnh/điều hoà': { icon: AirVent, label: 'Điều hoà' },
    'Có nóng lạnh': { icon: Zap, label: 'Nóng lạnh' },
    'Có wifi': { icon: Wifi, label: 'Wifi' },
    'Cho nấu ăn': { icon: UtensilsCrossed, label: 'Nấu ăn' },
    'Có nội thất cơ bản': { icon: Sofa, label: 'Nội thất' },
    'Gửi xe': { icon: Car, label: 'Gửi xe' }
  }

  const amenitiesList = room && room.amenities ? room.amenities.split(', ') : []

  if (loading) {
    return (
      <div className="room-detail-page">
        <Navbar currentUser={currentUser} onLogout={onLogout} />
        <div className="room-detail-loading">
          <div className="loading-spinner-detail"></div>
          <p>Đang tải thông tin phòng...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="room-detail-page">
        <Navbar currentUser={currentUser} onLogout={onLogout} />
        <div className="room-detail-error">
          <h2>Không tìm thấy phòng trọ</h2>
          <Link to="/rooms/phong-tro" className="btn-back-list">
            Quay lại danh sách
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="room-detail-page">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <main className="room-detail-main">
        <div className="container">
          {/* Breadcrumb & Actions */}
          <div className="room-detail-header-bar">
            <div className="breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>/</span>
              <Link to="/rooms/phong-tro">Danh sách trọ</Link>
              <span>/</span>
              <span>{room.name}</span>
            </div>
            <div className="header-actions">
              <button 
                className={`btn-icon ${saved ? 'active' : ''}`}
                onClick={handleSave}
                title="Lưu"
              >
                <Heart size={20} />
              </button>
              <button 
                className="btn-icon"
                onClick={handleShare}
                title="Chia sẻ"
              >
                <Share2 size={20} />
              </button>
              <button 
                className="btn-icon"
                onClick={handleReport}
                title="Báo cáo"
              >
                <Flag size={20} />
              </button>
            </div>
          </div>

          {/* Back Button */}
          <Link to={getBackUrl()} className="btn-back">
            <ChevronLeft size={20} />
            Quay lại kết quả
          </Link>

          {/* 2 Column Layout */}
          <div className="room-detail-layout">
            {/* Left Column (70%) */}
            <div className="room-detail-left">
              {/* Gallery */}
              <div className="room-gallery" id="overview">
                {(() => {
                  const allImages = getAllImages()
                  
                  if (allImages.length === 1) {
                    // Single image layout
                    return (
                      <div className="gallery-main">
                        <img 
                          src={allImages[0]} 
                          alt={room.name}
                          onClick={() => setShowGallery(true)}
                        />
                        <button className="btn-zoom" onClick={() => setShowGallery(true)}>
                          <ZoomIn size={20} />
                        </button>
                        {room.isAvailable && (
                          <span className="room-status-badge available">Còn trống</span>
                        )}
                        {!room.isAvailable && room.availability === 'Sắp trống' && (
                          <span className="room-status-badge soon">Sắp trống</span>
                        )}
                      </div>
                    )
                  } else if (allImages.length > 1) {
                    // Multi-image grid layout
                    return (
                      <div className="gallery-grid">
                        <div className="gallery-grid-main" onClick={() => setShowGallery(true)}>
                          <img src={allImages[0]} alt={room.name} />
                          <button className="btn-zoom">
                            <ZoomIn size={20} />
                          </button>
                          {room.isAvailable && (
                            <span className="room-status-badge available">Còn trống</span>
                          )}
                          {!room.isAvailable && room.availability === 'Sắp trống' && (
                            <span className="room-status-badge soon">Sắp trống</span>
                          )}
                        </div>
                        <div className="gallery-grid-thumbnails">
                          {allImages.slice(1, 5).map((img, index) => (
                            <div 
                              key={index} 
                              className="gallery-grid-thumb"
                              onClick={() => {
                                setCurrentImageIndex(index + 1)
                                setShowGallery(true)
                              }}
                            >
                              <img src={img} alt={`Ảnh ${index + 2}`} />
                              {index === 3 && allImages.length > 5 && (
                                <div className="gallery-more-overlay">
                                  +{allImages.length - 5} ảnh
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  } else {
                    // No image
                    return (
                      <div className="gallery-main">
                        <img 
                          src="https://via.placeholder.com/800x600?text=Phòng+Trọ" 
                          alt="No image"
                        />
                      </div>
                    )
                  }
                })()}
              </div>

              {/* Title & Basic Info */}
              <div className="room-info-header">
                <h1 className="room-title">{room.name}</h1>
                <div className="room-location">
                  <MapPin size={18} />
                  <span>{room.location}</span>
                  <button className="btn-copy-address" onClick={handleCopyLink}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="room-meta-chips">
                  <span className="meta-chip">
                    <Home size={16} />
                    {room.roomType || 'Phòng trọ'}
                  </span>
                  <span className="meta-chip">
                    <Maximize size={16} />
                    {room.area ? `${room.area}m²` : 'N/A'}
                  </span>
                  <span className="meta-chip">
                    <Users size={16} />
                    {room.capacity ? `${room.capacity} người` : 'N/A'}
                  </span>
                </div>
                <p className="room-updated">Cập nhật {room.updatedAt ? new Date(room.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
              </div>

              {/* Price & Status */}
              <div className="room-price-section">
                <div className="price-main">
                  <span className="price-amount">{formatPrice(room.price)}đ</span>
                  <span className="price-unit">/tháng</span>
                </div>
              </div>

              {/* Description */}
              <div className="room-section">
                <h2 className="section-title">Mô tả chi tiết</h2>
                <p className="room-description">
                  {room.detail || 'Chưa có mô tả chi tiết'}
                </p>
              </div>

              {/* Amenities */}
              <div className="room-section" id="amenities">
                <h2 className="section-title">Tiện nghi</h2>
                <div className="amenities-grid">
                  {amenitiesList.length > 0 ? (
                    amenitiesList.map((amenity, index) => {
                      const amenityData = amenitiesMap[amenity.trim()]
                      const Icon = amenityData?.icon || Check
                      return (
                        <div key={index} className="amenity-item">
                          <Icon size={20} className="amenity-icon" />
                          <span>{amenityData?.label || amenity.trim()}</span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="empty-text">Chưa cập nhật tiện nghi</p>
                  )}
                </div>
              </div>

              {/* Costs & Terms */}
              <div className="room-section" id="costs">
                <h2 className="section-title">Chi phí & điều khoản</h2>
                <div className="costs-table">
                  <div className="cost-row">
                    <span className="cost-label">Tiền phòng</span>
                    <span className="cost-value">{formatPrice(room.price)}đ/tháng</span>
                  </div>
                  <div className="cost-row">
                    <span className="cost-label">Tiền điện</span>
                    <span className="cost-value">
                      {room.electricityCost ? `${formatPrice(room.electricityCost)}đ/kWh` : 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="cost-row">
                    <span className="cost-label">Tiền nước</span>
                    <span className="cost-value">
                      {room.waterCost ? `${formatPrice(room.waterCost)}đ/m³` : 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="cost-row">
                    <span className="cost-label">Internet</span>
                    <span className="cost-value">
                      {room.internetCost ? `${formatPrice(room.internetCost)}đ/tháng` : 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="cost-row">
                    <span className="cost-label">Phí giữ xe</span>
                    <span className="cost-value">
                      {room.parkingFee ? `${formatPrice(room.parkingFee)}đ/tháng` : 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="cost-row">
                    <span className="cost-label">Tiền cọc</span>
                    <span className="cost-value">
                      {room.deposit 
                        ? room.depositType === 'MONTHS' 
                          ? `${room.deposit} tháng`
                          : `${formatPrice(room.deposit)}đ`
                        : 'Chưa cập nhật'
                      }
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (30%) */}
            <div className="room-detail-right">
              {/* Scroll Spy Navigation */}
              <div className="scroll-spy-nav">
                <button 
                  className={activeSection === 'overview' ? 'active' : ''}
                  onClick={() => scrollToSection('overview')}
                >
                  Tổng quan
                </button>
                <button 
                  className={activeSection === 'amenities' ? 'active' : ''}
                  onClick={() => scrollToSection('amenities')}
                >
                  Tiện nghi
                </button>
                <button 
                  className={activeSection === 'costs' ? 'active' : ''}
                  onClick={() => scrollToSection('costs')}
                >
                  Chi phí
                </button>
              </div>

              {/* Owner Info Card */}
              <div className="owner-info-card">
                <div className="owner-card-header">
                  <h3>Thông tin chủ trọ</h3>
                  {canManageRoom() && (
                    <button className="btn-edit-room" onClick={handleEditRoom}>
                      <Edit size={16} />
                      Sửa phòng
                    </button>
                  )}
                </div>
                <div className="host-info">
                  <div className="host-avatar">
                    {room.ownerUsername?.charAt(0).toUpperCase() || 'H'}
                  </div>
                  <div className="host-details">
                    <p className="host-name">{room.ownerUsername || 'Chủ trọ'}</p>
                    <p className="host-phone">
                      <Phone size={14} />
                      {room.contact}
                    </p>
                    {room.ownerEmail && (
                      <p className="host-email">
                        <MessageCircle size={14} />
                        {room.ownerEmail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Room Availability Info */}
                {(room.totalRooms !== null && room.totalRooms !== undefined) && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: room.availableRooms > 0 ? '#F0FDF4' : '#FEF2F2',
                    borderRadius: '12px',
                    border: `1px solid ${room.availableRooms > 0 ? '#BBF7D0' : '#FECACA'}`
                  }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '14px', 
                      fontWeight: '600',
                      color: '#1F2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Home size={16} />
                      Tình trạng phòng
                    </h4>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          margin: '0 0 4px 0', 
                          fontSize: '13px', 
                          color: '#6B7280' 
                        }}>
                          Tổng số phòng
                        </p>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '20px', 
                          fontWeight: '700',
                          color: '#1F2937'
                        }}>
                          {room.totalRooms}
                        </p>
                      </div>
                      <div style={{
                        width: '1px',
                        height: '40px',
                        background: '#E5E7EB'
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          margin: '0 0 4px 0', 
                          fontSize: '13px', 
                          color: '#6B7280' 
                        }}>
                          Còn trống
                        </p>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '20px', 
                          fontWeight: '700',
                          color: room.availableRooms > 0 ? '#059669' : '#DC2626'
                        }}>
                          {room.availableRooms || 0}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: 'white',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#6B7280',
                      textAlign: 'center'
                    }}>
                      {room.availableRooms > 0 
                        ? `✓ Còn ${room.availableRooms} phòng trống có thể đặt`
                        : '✕ Hiện tại đã hết phòng'}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Card */}
              <div className="contact-card">
                <h3>Liên hệ chủ trọ</h3>
                {!room.isAvailable && (
                  <div style={{
                    padding: '12px 16px',
                    background: '#FEE2E2',
                    border: '1px solid #EF4444',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#DC2626' }}>
                      ⚠️ {room.totalRooms > 1 
                        ? `Đã hết phòng (0/${room.totalRooms}) - Không thể đặt thuê` 
                        : 'Phòng này đã hết - Không thể đặt thuê'}
                    </p>
                  </div>
                )}
                <div className="contact-actions">
                  <button 
                    className="btn-contact call" 
                    onClick={handleRentNow}
                    disabled={!room.isAvailable}
                    style={{
                      opacity: !room.isAvailable ? 0.5 : 1,
                      cursor: !room.isAvailable ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Home size={18} />
                    {room.isAvailable ? 'Thuê ngay' : 'Hết phòng'}
                  </button>
                  <button 
                    className="btn-contact message" 
                    onClick={handleDeposit}
                    disabled={!room.isAvailable}
                    style={{
                      opacity: !room.isAvailable ? 0.5 : 1,
                      cursor: !room.isAvailable ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <DollarSign size={18} />
                    {room.isAvailable ? 'Đặt cọc' : 'Hết phòng'}
                  </button>
                </div>
                <p className="contact-note">
                  <Phone size={14} />
                  Liên hệ: {room.contact}
                </p>
              </div>

              {/* Map */}
              <div className="map-card" id="map">
                <h3>Vị trí</h3>
                <div className="map-placeholder">
                  <MapPin size={48} />
                  <p>{room.location}</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-directions"
                  >
                    Chỉ đường
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column (30%) */}
            <div className="room-detail-right">
              {/* Scroll Spy Navigation */}
              <div className="scroll-spy-nav">
                <button 
                  className={activeSection === 'overview' ? 'active' : ''}
                  onClick={() => scrollToSection('overview')}
                >
                  Tổng quan
                </button>
                <button 
                  className={activeSection === 'amenities' ? 'active' : ''}
                  onClick={() => scrollToSection('amenities')}
                >
                  Tiện nghi
                </button>
                <button 
                  className={activeSection === 'costs' ? 'active' : ''}
                  onClick={() => scrollToSection('costs')}
                >
                  Chi phí
                </button>
                <button 
                  className={activeSection === 'schedule' ? 'active' : ''}
                  onClick={() => scrollToSection('schedule')}
                >
                  Lịch xem
                </button>
              </div>

              {/* Owner Info Card */}
              <div className="owner-info-card">
                <div className="owner-card-header">
                  <h3>Thông tin chủ trọ</h3>
                  {canManageRoom() && (
                    <button className="btn-edit-room" onClick={handleEditRoom}>
                      <Edit size={16} />
                      Sửa phòng
                    </button>
                  )}
                </div>
                <div className="host-info">
                  <div className="host-avatar">
                    {room.ownerUsername?.charAt(0).toUpperCase() || 'H'}
                  </div>
                  <div className="host-details">
                    <p className="host-name">{room.ownerUsername || 'Chủ trọ'}</p>
                    <p className="host-phone">
                      <Phone size={14} />
                      {room.contact}
                    </p>
                    {room.ownerEmail && (
                      <p className="host-email">
                        <MessageCircle size={14} />
                        {room.ownerEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="contact-card">
                <h3>Liên hệ chủ trọ</h3>
                <div className="contact-actions">
                  <button className="btn-contact call" onClick={handleRentNow}>
                    <Home size={18} />
                    Thuê ngay
                  </button>
                  <button className="btn-contact message" onClick={handleDeposit}>
                    <DollarSign size={18} />
                    Đặt cọc
                  </button>
                </div>
                <p className="contact-note">
                  <Phone size={14} />
                  Liên hệ: {room.contact}
                </p>
              </div>

              {/* Map */}
              <div className="map-card" id="map">
                <h3>Vị trí</h3>
                <div className="map-placeholder">
                  <MapPin size={48} />
                  <p>{room.location}</p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-directions"
                  >
                    Chỉ đường
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile CTA Bar */}
      <div className="mobile-cta-bar">
        <div className="cta-price">
          <span className="cta-amount">{formatPrice(room.price)}đ</span>
          <span className="cta-unit">/tháng</span>
        </div>
        <div className="cta-actions">
          <button 
            className="btn-cta call" 
            onClick={handleRentNow}
            disabled={!room.isAvailable}
            style={{
              opacity: !room.isAvailable ? 0.5 : 1,
              cursor: !room.isAvailable ? 'not-allowed' : 'pointer'
            }}
          >
            <Home size={18} />
            {room.isAvailable ? 'Thuê ngay' : 'Hết phòng'}
          </button>
          <button 
            className="btn-cta message" 
            onClick={handleDeposit}
            disabled={!room.isAvailable}
            style={{
              opacity: !room.isAvailable ? 0.5 : 1,
              cursor: !room.isAvailable ? 'not-allowed' : 'pointer'
            }}
          >
            <DollarSign size={18} />
            {room.isAvailable ? 'Đặt cọc' : 'Hết phòng'}
          </button>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="gallery-modal" onClick={() => setShowGallery(false)}>
          <button className="btn-close-gallery">
            <X size={24} />
          </button>
          <img 
            src={room.imageUrl || 'https://via.placeholder.com/1200x800?text=Phòng+Trọ'} 
            alt={room.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Rent Room Modal */}
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

      {/* Edit Room Modal */}
      {showEditModal && (
        <EditRoom
          room={room}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false)
            fetchRoom() // Refresh room data
            toast.success('Phòng đã được cập nhật!')
          }}
        />
      )}

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery
          images={getAllImages()}
          initialIndex={currentImageIndex}
          onClose={() => {
            setShowGallery(false)
            setCurrentImageIndex(0)
          }}
        />
      )}

      <Footer />
    </div>
  )
}

export default RoomDetail
