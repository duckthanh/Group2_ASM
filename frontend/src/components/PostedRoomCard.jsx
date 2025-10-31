import { useNavigate } from 'react-router-dom'
import { MapPin, Users, Home, DollarSign, Calendar, CheckCircle2, Clock } from 'lucide-react'

function PostedRoomCard({ room }) {
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    })
  }

  return (
    <div className="posted-room-card" style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onClick={() => navigate(`/room/${room.id}`)}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
    }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '60%', background: '#E2E8F0' }}>
        {room.imageUrl ? (
          <img 
            src={room.imageUrl} 
            alt={room.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94A3B8'
          }}>
            <Home size={48} />
          </div>
        )}
        {/* Availability Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '6px 12px',
          background: room.isAvailable ? '#10B981' : '#EF4444',
          color: 'white',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {room.isAvailable ? '✓ Còn trống' : '✕ Hết phòng'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Title */}
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#1E293B',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {room.name}
        </h3>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <MapPin size={14} color="#64748B" />
          <span style={{ fontSize: '13px', color: '#64748B' }}>{room.location}</span>
        </div>

        {/* Price */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginBottom: '12px',
          padding: '8px 12px',
          background: '#FEF3C7',
          borderRadius: '8px'
        }}>
          <DollarSign size={16} color="#B45309" />
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#B45309' }}>
            {formatPrice(room.price)}/tháng
          </span>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '8px',
          marginBottom: '12px',
          padding: '12px',
          background: '#F8FAFC',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#3B82F6', marginBottom: '4px' }}>
              {room.totalBookings}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Tổng booking</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>
              {room.activeBookings}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Đang thuê</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>
              {room.pendingBookings}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Chờ xác nhận</div>
          </div>
        </div>

        {/* Meta info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#64748B" />
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Đăng: {formatDate(room.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostedRoomCard

