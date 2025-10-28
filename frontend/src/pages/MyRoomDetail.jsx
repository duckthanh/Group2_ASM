import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Maximize2, Users, Calendar, Clock, 
  CreditCard, FileText, Phone, Mail, AlertCircle, Download,
  CheckCircle, XCircle, MessageSquare, Upload, Image as ImageIcon,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { myRoomsAPI } from '../services/api'
import './MyRoomDetail.css'

function MyRoomDetail({ currentUser, onLogout }) {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [issueForm, setIssueForm] = useState({ title: '', description: '', photos: [] })

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    loadRoomDetail()
  }, [bookingId, currentUser])

  const loadRoomDetail = async () => {
    try {
      setLoading(true)
      const data = await myRoomsAPI.getMyRoomDetail(bookingId)
      setRoom(data)
    } catch (error) {
      console.error('Failed to load room detail:', error)
      toast.error('Không thể tải thông tin phòng')
      navigate('/account/rooms')
    } finally {
      setLoading(false)
    }
  }

  const handlePayDeposit = async () => {
    try {
      await myRoomsAPI.makePayment(bookingId, {
        amount: room.deposit.amount,
        method: 'BANK_TRANSFER',
        note: 'Thanh toán tiền cọc'
      })
      toast.success('Đã thanh toán tiền cọc thành công')
      setShowPaymentModal(false)
      loadRoomDetail()
    } catch (error) {
      toast.error('Thanh toán thất bại')
    }
  }

  const handleSignContract = async () => {
    if (!window.confirm('Bạn xác nhận muốn ký hợp đồng này?')) return
    
    try {
      await myRoomsAPI.signContract(bookingId)
      toast.success('Đã ký hợp đồng thành công')
      loadRoomDetail()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Không thể ký hợp đồng')
    }
  }

  const handleCancelBooking = async () => {
    const reason = window.prompt('Vui lòng nhập lý do hủy:')
    if (!reason) return

    try {
      await myRoomsAPI.cancelBooking(bookingId, reason)
      toast.success('Đã hủy đặt phòng')
      navigate('/account/rooms')
    } catch (error) {
      toast.error('Không thể hủy đặt phòng')
    }
  }

  const handleRenewLease = async () => {
    const months = window.prompt('Số tháng muốn gia hạn:')
    if (!months || isNaN(months)) return

    try {
      await myRoomsAPI.renewLease(bookingId, parseInt(months))
      toast.success(`Đã gia hạn ${months} tháng`)
      loadRoomDetail()
    } catch (error) {
      toast.error('Không thể gia hạn hợp đồng')
    }
  }

  const handleSubmitIssue = async (e) => {
    e.preventDefault()
    try {
      await myRoomsAPI.createIssue(bookingId, issueForm)
      toast.success('Đã gửi báo cáo sự cố')
      setShowIssueModal(false)
      setIssueForm({ title: '', description: '', photos: [] })
      loadRoomDetail()
    } catch (error) {
      toast.error('Không thể gửi báo cáo')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      HOLD: { label: 'Giữ chỗ', className: 'badge-hold' },
      DEPOSITED: { label: 'Đã đặt cọc', className: 'badge-deposited' },
      ACTIVE: { label: 'Đang thuê', className: 'badge-active' },
      ENDED: { label: 'Đã trả phòng', className: 'badge-ended' },
      CANCELED: { label: 'Đã hủy', className: 'badge-canceled' }
    }
    return badges[status] || { label: status, className: 'badge-default' }
  }

  if (loading) {
    return (
      <div className="my-room-detail-page">
        <Navbar currentUser={currentUser} onLogout={onLogout} />
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Đang tải...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!room) {
    return null
  }

  const badge = getStatusBadge(room.status)

  return (
    <div className="my-room-detail-page">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <div className="my-room-detail-container">
        {/* Header */}
        <div className="detail-header">
          <button className="btn-back" onClick={() => navigate('/account/rooms')}>
            <ArrowLeft size={20} />
            Quay lại
          </button>
          
          <div className="detail-title-section">
            <div>
              <h1 className="detail-title">{room.room.name}</h1>
              <div className="detail-meta">
                <span className="booking-id">Mã: {room.bookingId}</span>
                <span className={`status-badge ${badge.className}`}>{badge.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {room.status === 'HOLD' && room.holdExpiresAt && (
          <div className="warning-banner">
            <AlertCircle size={20} />
            <div>
              <strong>Sắp hết hạn giữ chỗ!</strong>
              <p>Vui lòng đặt cọc trước {new Date(room.holdExpiresAt).toLocaleString('vi-VN')}</p>
            </div>
          </div>
        )}

        {room.status === 'DEPOSITED' && !room.deposit?.paid && (
          <div className="warning-banner">
            <AlertCircle size={20} />
            <div>
              <strong>Chưa thanh toán tiền cọc!</strong>
              <p>Vui lòng hoàn tất thanh toán để tiếp tục</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="detail-content">
          {/* Left Column */}
          <div className="detail-main">
            {/* Room Info Card */}
            <div className="info-card">
              <img src={room.room.imageUrl} alt={room.room.name} className="room-image" />
              
              <div className="room-info-grid">
                <div className="info-item">
                  <MapPin size={20} />
                  <div>
                    <span className="info-label">Địa chỉ</span>
                    <span className="info-value">{room.room.location}</span>
                  </div>
                </div>

                <div className="info-item">
                  <CreditCard size={20} />
                  <div>
                    <span className="info-label">Giá thuê</span>
                    <span className="info-value">{room.room.price?.toLocaleString('vi-VN')}đ/tháng</span>
                  </div>
                </div>

                {room.room.area && (
                  <div className="info-item">
                    <Maximize2 size={20} />
                    <div>
                      <span className="info-label">Diện tích</span>
                      <span className="info-value">{room.room.area}m²</span>
                    </div>
                  </div>
                )}

                {room.room.capacity && (
                  <div className="info-item">
                    <Users size={20} />
                    <div>
                      <span className="info-label">Sức chứa</span>
                      <span className="info-value">{room.room.capacity} người</span>
                    </div>
                  </div>
                )}
              </div>

              {room.room.detail && (
                <div className="room-description">
                  <h3>Mô tả chi tiết</h3>
                  <p>{room.room.detail}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="detail-tabs">
              <button 
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                Tổng quan
              </button>
              <button 
                className={activeTab === 'timeline' ? 'active' : ''}
                onClick={() => setActiveTab('timeline')}
              >
                Timeline
              </button>
              <button 
                className={activeTab === 'payments' ? 'active' : ''}
                onClick={() => setActiveTab('payments')}
              >
                Thanh toán
              </button>
              <button 
                className={activeTab === 'documents' ? 'active' : ''}
                onClick={() => setActiveTab('documents')}
              >
                Tài liệu
              </button>
              <button 
                className={activeTab === 'issues' ? 'active' : ''}
                onClick={() => setActiveTab('issues')}
              >
                Sự cố
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  {/* Booking Info */}
                  <div className="section-card">
                    <h3>Thông tin đặt phòng</h3>
                    <div className="info-rows">
                      <div className="info-row">
                        <span>Thời hạn thuê:</span>
                        <strong>{room.duration} {room.durationUnit === 'MONTH' ? 'tháng' : 'năm'}</strong>
                      </div>
                      {room.moveInDate && (
                        <div className="info-row">
                          <span>Ngày dọn vào:</span>
                          <strong>{new Date(room.moveInDate).toLocaleDateString('vi-VN')}</strong>
                        </div>
                      )}
                      <div className="info-row">
                        <span>Số người:</span>
                        <strong>{room.numberOfPeople} người</strong>
                      </div>
                      <div className="info-row">
                        <span>Số điện thoại:</span>
                        <strong>{room.phoneNumber}</strong>
                      </div>
                      {room.note && (
                        <div className="info-row">
                          <span>Ghi chú:</span>
                          <strong>{room.note}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deposit Info */}
                  {room.deposit && (
                    <div className="section-card">
                      <h3>Thông tin đặt cọc</h3>
                      <div className="info-rows">
                        <div className="info-row">
                          <span>Số tiền:</span>
                          <strong>{room.deposit.amount?.toLocaleString('vi-VN')}đ</strong>
                        </div>
                        <div className="info-row">
                          <span>Trạng thái:</span>
                          <strong className={room.deposit.paid ? 'text-success' : 'text-warning'}>
                            {room.deposit.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                          </strong>
                        </div>
                        {room.deposit.receiptUrl && (
                          <div className="info-row">
                            <span>Biên lai:</span>
                            <a href={room.deposit.receiptUrl} target="_blank" rel="noreferrer" className="link-download">
                              <Download size={16} />
                              Tải xuống
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lease Info */}
                  {room.lease && (
                    <div className="section-card">
                      <h3>Thông tin hợp đồng</h3>
                      <div className="info-rows">
                        <div className="info-row">
                          <span>Bắt đầu:</span>
                          <strong>{new Date(room.lease.start).toLocaleDateString('vi-VN')}</strong>
                        </div>
                        <div className="info-row">
                          <span>Kết thúc:</span>
                          <strong>{new Date(room.lease.end).toLocaleDateString('vi-VN')}</strong>
                        </div>
                        <div className="info-row">
                          <span>Còn lại:</span>
                          <strong>{room.lease.daysRemaining} ngày</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="timeline-tab">
                  <div className="timeline">
                    {room.timeline?.map((event, index) => (
                      <div key={index} className={`timeline-item ${event.status.toLowerCase()}`}>
                        <div className="timeline-marker">
                          {event.status === 'COMPLETED' && <CheckCircle size={20} />}
                          {event.status === 'CURRENT' && <Clock size={20} />}
                          {event.status === 'PENDING' && <Clock size={20} />}
                        </div>
                        <div className="timeline-content">
                          <h4>{event.event}</h4>
                          <p>{event.description}</p>
                          <span className="timeline-date">
                            {new Date(event.timestamp).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="payments-tab">
                  {room.payments && room.payments.length > 0 ? (
                    <div className="payments-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Tháng</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày thanh toán</th>
                            <th>Biên lai</th>
                          </tr>
                        </thead>
                        <tbody>
                          {room.payments.map(payment => (
                            <tr key={payment.id}>
                              <td>{payment.month}</td>
                              <td>{payment.amount?.toLocaleString('vi-VN')}đ</td>
                              <td>
                                <span className={`payment-status status-${payment.status.toLowerCase()}`}>
                                  {payment.status === 'PAID' ? 'Đã thanh toán' : 
                                   payment.status === 'PENDING' ? 'Chờ thanh toán' : 'Quá hạn'}
                                </span>
                              </td>
                              <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('vi-VN') : '-'}</td>
                              <td>
                                {payment.receiptUrl && (
                                  <a href={payment.receiptUrl} className="btn-download-mini">
                                    <Download size={14} />
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-content">
                      <p>Chưa có thông tin thanh toán</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="documents-tab">
                  {room.documents && room.documents.length > 0 ? (
                    <div className="documents-grid">
                      {room.documents.map(doc => (
                        <div key={doc.id} className="document-card">
                          <FileText size={32} />
                          <div>
                            <h4>{doc.fileName || doc.documentType}</h4>
                            <span className={`doc-status status-${doc.status.toLowerCase()}`}>
                              {doc.status === 'APPROVED' ? 'Đã duyệt' :
                               doc.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                            </span>
                          </div>
                          <a href={doc.documentUrl} className="btn-view" target="_blank" rel="noreferrer">
                            Xem
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-content">
                      <p>Chưa có tài liệu nào</p>
                      <button className="btn-upload">
                        <Upload size={16} />
                        Tải lên tài liệu
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'issues' && (
                <div className="issues-tab">
                  <button className="btn-report-issue" onClick={() => setShowIssueModal(true)}>
                    <AlertCircle size={16} />
                    Báo cáo sự cố mới
                  </button>

                  {room.issues && room.issues.length > 0 ? (
                    <div className="issues-list">
                      {room.issues.map(issue => (
                        <div key={issue.id} className="issue-card">
                          <div className="issue-header">
                            <h4>{issue.title}</h4>
                            <span className={`issue-status status-${issue.status.toLowerCase()}`}>
                              {issue.status}
                            </span>
                          </div>
                          <p>{issue.description}</p>
                          <span className="issue-date">
                            {new Date(issue.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-content">
                      <p>Chưa có sự cố nào được báo cáo</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="detail-sidebar">
            {/* Landlord Card */}
            <div className="sidebar-card">
              <h3>Thông tin chủ trọ</h3>
              <div className="landlord-info">
                <div className="landlord-avatar">
                  <User size={32} />
                </div>
                <div>
                  <h4>{room.landlord.name}</h4>
                  {room.landlord.phone && (
                    <a href={`tel:${room.landlord.phone}`} className="landlord-contact">
                      <Phone size={14} />
                      {room.landlord.phone}
                    </a>
                  )}
                  {room.landlord.email && (
                    <a href={`mailto:${room.landlord.email}`} className="landlord-contact">
                      <Mail size={14} />
                      {room.landlord.email}
                    </a>
                  )}
                </div>
              </div>
              <button className="btn-contact">
                <MessageSquare size={16} />
                Liên hệ
              </button>
            </div>

            {/* Actions Card */}
            <div className="sidebar-card">
              <h3>Hành động</h3>
              <div className="actions-list">
                {room.status === 'HOLD' && (
                  <>
                    <button className="action-btn primary" onClick={() => setShowPaymentModal(true)}>
                      <CreditCard size={16} />
                      Đặt cọc ngay
                    </button>
                    <button className="action-btn danger" onClick={handleCancelBooking}>
                      <XCircle size={16} />
                      Hủy giữ chỗ
                    </button>
                  </>
                )}

                {room.status === 'DEPOSITED' && (
                  <>
                    {!room.deposit?.paid && (
                      <button className="action-btn primary" onClick={handlePayDeposit}>
                        <CreditCard size={16} />
                        Thanh toán cọc
                      </button>
                    )}
                    {room.deposit?.paid && room.contract?.status === 'PENDING' && (
                      <button className="action-btn primary" onClick={handleSignContract}>
                        <FileText size={16} />
                        Ký hợp đồng
                      </button>
                    )}
                    <button className="action-btn danger" onClick={handleCancelBooking}>
                      <XCircle size={16} />
                      Hủy đặt phòng
                    </button>
                  </>
                )}

                {room.status === 'ACTIVE' && (
                  <>
                    <button className="action-btn primary" onClick={() => setShowPaymentModal(true)}>
                      <CreditCard size={16} />
                      Thanh toán tiền nhà
                    </button>
                    <button className="action-btn" onClick={handleRenewLease}>
                      <Calendar size={16} />
                      Gia hạn hợp đồng
                    </button>
                    <button className="action-btn" onClick={() => setShowIssueModal(true)}>
                      <AlertCircle size={16} />
                      Báo sự cố
                    </button>
                  </>
                )}

                {room.contract?.pdfUrl && (
                  <a href={room.contract.pdfUrl} className="action-btn" target="_blank" rel="noreferrer">
                    <Download size={16} />
                    Tải hợp đồng
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="modal-overlay" onClick={() => setShowIssueModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Báo cáo sự cố</h2>
            <form onSubmit={handleSubmitIssue}>
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  value={issueForm.title}
                  onChange={(e) => setIssueForm({...issueForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả chi tiết</label>
                <textarea
                  value={issueForm.description}
                  onChange={(e) => setIssueForm({...issueForm, description: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowIssueModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  Gửi báo cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default MyRoomDetail

