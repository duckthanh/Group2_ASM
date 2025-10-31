import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, Users, Maximize2, Calendar, Clock, 
  CreditCard, FileText, Phone, MoreVertical,
  Download, AlertCircle, MessageSquare, XCircle
} from 'lucide-react'
import './MyRoomCard.css'

function MyRoomCard({ room, onAction }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { label: 'Chờ xác nhận', className: 'status-pending' },
      CONFIRMED: { label: 'Đã xác nhận', className: 'status-confirmed' },
      ACTIVE: { label: 'Đang thuê', className: 'status-active' },
      ENDED: { label: 'Đã trả phòng', className: 'status-ended' },
      CANCELED: { label: 'Đã hủy', className: 'status-canceled' },
      REJECTED: { label: 'Bị từ chối', className: 'status-rejected' }
    }
    return badges[status] || { label: status, className: 'status-default' }
  }

  const getTimeRemaining = () => {
    if ((room.status === 'ACTIVE' || room.status === 'CONFIRMED') && room.lease) {
      const days = room.lease.daysRemaining
      if (days < 0) return 'Đã quá hạn'
      if (days === 0) return 'Hết hạn hôm nay'
      if (days < 30) return `Còn ${days} ngày`
      return `Còn ${Math.floor(days / 30)} tháng`
    }
    
    return null
  }

  const getPrimaryCTA = () => {
    switch (room.status) {
      case 'PENDING':
        return { label: 'Xem chi tiết', action: 'view', variant: 'secondary' }
      case 'CONFIRMED':
        return { label: 'Xem chi tiết', action: 'view', variant: 'primary' }
      case 'ACTIVE':
        return { label: 'Xem chi tiết', action: 'view', variant: 'primary' }
      case 'ENDED':
        return { label: 'Xem chi tiết', action: 'view', variant: 'secondary' }
      case 'CANCELED':
      case 'REJECTED':
        return { label: 'Tìm phòng khác', action: 'find-room', variant: 'secondary' }
      default:
        return { label: 'Xem chi tiết', action: 'view', variant: 'secondary' }
    }
  }

  const handleCardClick = () => {
    navigate(`/account/rooms/${room.bookingId}`)
  }

  const handleCTAClick = (e) => {
    e.stopPropagation()
    const cta = getPrimaryCTA()
    if (cta.action === 'view' || cta.action === 'sign-contract' || cta.action === 'pay-deposit' || cta.action === 'pay-rent') {
      navigate(`/account/rooms/${room.bookingId}`)
    } else if (cta.action === 'find-room') {
      navigate('/rooms/phong-tro')
    } else {
      onAction?.(cta.action, room)
    }
  }

  const handleMenuAction = (e, action) => {
    e.stopPropagation()
    setShowMenu(false)
    onAction?.(action, room)
  }

  const badge = getStatusBadge(room.status)
  const timeRemaining = getTimeRemaining()
  const cta = getPrimaryCTA()

  return (
    <div className="my-room-card" onClick={handleCardClick}>
      {/* Image & Badge */}
      <div className="my-room-card-image">
        <img src={room.imageUrl || '/placeholder-room.jpg'} alt={room.roomTitle} />
        <div className={`my-room-badge ${badge.className}`}>
          {badge.label}
        </div>
        {timeRemaining && room.status !== 'ENDED' && room.status !== 'CANCELED' && (
          <div className="my-room-countdown">
            <Clock size={14} />
            <span>{timeRemaining}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="my-room-card-content">
        {/* Header */}
        <div className="my-room-card-header">
          <div>
            <h3 className="my-room-title">{room.roomTitle}</h3>
            <div className="my-room-location">
              <MapPin size={14} />
              <span>{room.addressShort}</span>
            </div>
          </div>
          <div className="my-room-menu">
            <button 
              className="my-room-menu-btn"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
            >
              <MoreVertical size={20} />
            </button>
            
            {showMenu && (
              <div className="my-room-menu-dropdown">
                <button onClick={() => navigate(`/account/rooms/${room.bookingId}`)}>
                  <FileText size={16} />
                  Xem chi tiết
                </button>
                {room.contract?.pdfUrl && (
                  <button onClick={(e) => handleMenuAction(e, 'view-contract')}>
                    <Download size={16} />
                    Tải hợp đồng
                  </button>
                )}
                {room.status === 'ACTIVE' && (
                  <>
                    <button onClick={(e) => handleMenuAction(e, 'report-issue')}>
                      <AlertCircle size={16} />
                      Báo sự cố
                    </button>
                    <button onClick={(e) => handleMenuAction(e, 'contact-landlord')}>
                      <Phone size={16} />
                      Liên hệ chủ trọ
                    </button>
                  </>
                )}
                {room.status === 'PENDING' && (
                  <button onClick={(e) => handleMenuAction(e, 'cancel')} className="menu-danger">
                    <XCircle size={16} />
                    Hủy yêu cầu thuê
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="my-room-info-grid">
          <div className="my-room-info-item">
            <CreditCard size={16} />
            <span>{room.pricePerMonth?.toLocaleString('vi-VN')}đ/tháng</span>
          </div>
          {room.area && (
            <div className="my-room-info-item">
              <Maximize2 size={16} />
              <span>{room.area}m²</span>
            </div>
          )}
          {room.capacity && (
            <div className="my-room-info-item">
              <Users size={16} />
              <span>{room.capacity} người</span>
            </div>
          )}
        </div>

        {/* Progress / Status Info */}
        {room.status === 'PENDING' && (
          <div className="my-room-status-info pending">
            <AlertCircle size={14} />
            <span>Đang chờ chủ trọ xác nhận...</span>
          </div>
        )}

        {room.status === 'CONFIRMED' && !room.isDeposit && (
          <div className="my-room-status-info confirmed">
            <AlertCircle size={14} />
            <span>Đã được xác nhận - Sẵn sàng chuyển vào</span>
          </div>
        )}

        {(room.status === 'ACTIVE' || room.status === 'CONFIRMED') && room.lease && (
          <div className="my-room-lease-info">
            <Calendar size={14} />
            <span>
              {new Date(room.lease.start).toLocaleDateString('vi-VN')} - 
              {new Date(room.lease.end).toLocaleDateString('vi-VN')}
            </span>
          </div>
        )}

        {(room.status === 'CANCELED' || room.status === 'REJECTED') && room.cancelReason && (
          <div className="my-room-cancel-info">
            <AlertCircle size={14} />
            <span>{room.cancelReason}</span>
          </div>
        )}

        {/* Landlord Info */}
        {room.landlord && (
          <div className="my-room-landlord">
            <Phone size={14} />
            <span>Chủ trọ: {room.landlord.name}</span>
            {room.status === 'ACTIVE' && (
              <button 
                className="btn-contact-landlord"
                onClick={(e) => handleMenuAction(e, 'contact-landlord')}
              >
                <MessageSquare size={14} />
              </button>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="my-room-actions">
          <button 
            className={`my-room-cta btn-${cta.variant}`}
            onClick={handleCTAClick}
          >
            {cta.label}
          </button>
          
          {/* Cancel Button - Only show when PENDING (not yet confirmed by landlord) */}
          {room.status === 'PENDING' && (
            <button 
              className="my-room-cta btn-cancel"
              onClick={(e) => {
                e.stopPropagation()
                onAction?.('cancel', room)
              }}
            >
              <XCircle size={16} />
              Hủy yêu cầu thuê
            </button>
          )}

          {/* Return Room Button - Only show when ACTIVE or CONFIRMED (user is renting) */}
          {(room.status === 'ACTIVE' || room.status === 'CONFIRMED') && (
            <button 
              className="my-room-cta btn-return"
              onClick={(e) => {
                e.stopPropagation()
                onAction?.('return', room)
              }}
            >
              <XCircle size={16} />
              Trả phòng
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyRoomCard

