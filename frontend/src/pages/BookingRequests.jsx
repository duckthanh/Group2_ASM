import { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './BookingRequests.css';

function BookingRequests({ currentUser, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending', 'all'
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      let data;
      if (filter === 'pending') {
        data = await bookingAPI.getLandlordPendingBookings();
      } else {
        data = await bookingAPI.getAllLandlordBookings();
      }
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      alert('Không thể tải danh sách yêu cầu thuê phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    if (!confirm('Xác nhận chấp nhận yêu cầu thuê phòng này?')) return;
    
    try {
      setProcessingId(bookingId);
      await bookingAPI.confirmBooking(bookingId);
      alert('Đã xác nhận thuê phòng thành công!');
      loadBookings();
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      alert('Không thể xác nhận: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    if (!confirm('Xác nhận từ chối yêu cầu thuê phòng này?')) return;
    
    try {
      setProcessingId(bookingId);
      await bookingAPI.rejectBooking(bookingId);
      alert('Đã từ chối yêu cầu thuê phòng');
      loadBookings();
    } catch (error) {
      console.error('Failed to reject booking:', error);
      alert('Không thể từ chối: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Chờ xác nhận', className: 'status-pending' },
      CONFIRMED: { label: 'Đã xác nhận', className: 'status-confirmed' },
      REJECTED: { label: 'Đã từ chối', className: 'status-rejected' },
      CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
    };
    
    const config = statusConfig[status] || { label: status, className: 'status-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const getDurationText = (duration, unit) => {
    return unit === 'YEAR' ? `${duration} năm` : `${duration} tháng`;
  };

  if (loading) {
    return (
      <div className="booking-requests-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <div className="booking-requests-container">
        <div className="booking-requests-header">
        <div className="header-content">
          <h1>📋 Quản lý yêu cầu thuê phòng</h1>
          <p className="subtitle">Xem và xử lý các yêu cầu thuê phòng từ người dùng</p>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Chờ xác nhận
            {filter === 'pending' && bookings.length > 0 && (
              <span className="badge">{bookings.length}</span>
            )}
          </button>
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Chưa có yêu cầu nào</h3>
          <p>
            {filter === 'pending' 
              ? 'Hiện tại không có yêu cầu thuê phòng nào chờ xử lý'
              : 'Bạn chưa có yêu cầu thuê phòng nào'}
          </p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-main-info">
                  <h3 className="room-name">🏠 {booking.roomName}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="booking-meta">
                  <span className="booking-id">Mã: #{booking.id}</span>
                  <span className="booking-date">
                    📅 {formatDateTime(booking.createdAt)}
                  </span>
                </div>
              </div>

              <div className="booking-body">
                <div className="info-section">
                  <h4>👤 Thông tin người thuê</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Tên:</span>
                      <span className="info-value">{booking.tenantUsername}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Số điện thoại:</span>
                      <span className="info-value">{booking.phoneNumber}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Số người:</span>
                      <span className="info-value">{booking.numberOfPeople} người</span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h4>📝 Chi tiết thuê</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Thời hạn:</span>
                      <span className="info-value">{getDurationText(booking.duration, booking.durationUnit)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Ngày dọn vào:</span>
                      <span className="info-value">{formatDate(booking.moveInDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Loại:</span>
                      <span className="info-value">
                        {booking.isDeposit ? '💰 Đặt cọc' : '🔑 Thuê ngay'}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.note && (
                  <div className="info-section">
                    <h4>💬 Ghi chú</h4>
                    <p className="note-content">{booking.note}</p>
                  </div>
                )}
              </div>

              {booking.status === 'PENDING' && (
                <div className="booking-actions">
                  <button 
                    className="btn-confirm"
                    onClick={() => handleConfirm(booking.id)}
                    disabled={processingId === booking.id}
                  >
                    {processingId === booking.id ? (
                      <>
                        <span className="spinner-small"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        ✅ Xác nhận
                      </>
                    )}
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleReject(booking.id)}
                    disabled={processingId === booking.id}
                  >
                    {processingId === booking.id ? (
                      <>
                        <span className="spinner-small"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        ❌ Từ chối
                      </>
                    )}
                  </button>
                </div>
              )}

              {booking.status === 'CONFIRMED' && (
                <div className="booking-notice success">
                  ✅ Yêu cầu này đã được xác nhận
                </div>
              )}

              {booking.status === 'REJECTED' && (
                <div className="booking-notice rejected">
                  ❌ Yêu cầu này đã bị từ chối
                </div>
              )}

              {booking.status === 'CANCELLED' && (
                <div className="booking-notice cancelled">
                  🚫 Yêu cầu này đã bị hủy bởi người thuê
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}

export default BookingRequests;

