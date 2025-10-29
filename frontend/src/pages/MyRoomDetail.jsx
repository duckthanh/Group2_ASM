import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Maximize2, Users, Calendar, Clock, 
  CreditCard, FileText, Phone, Mail, AlertCircle, Download,
  CheckCircle, XCircle, MessageSquare, Upload, Image as ImageIcon,
  User, X, Edit2
} from 'lucide-react'
import { customToast } from '../utils/customToast.jsx'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { myRoomsAPI, uploadAPI } from '../services/api'
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

  // Modal states
  const [showSignContractModal, setShowSignContractModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRenewModal, setShowRenewModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [renewMonths, setRenewMonths] = useState('')
  const [processing, setProcessing] = useState(false)

  // Payment QR states
  const [showQrUploadModal, setShowQrUploadModal] = useState(false)
  const [uploadingQr, setUploadingQr] = useState(false)
  const [qrPaymentDescription, setQrPaymentDescription] = useState('')

  // Payment proof states
  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false)
  const [uploadingProof, setUploadingProof] = useState(false)
  const [paymentProofNote, setPaymentProofNote] = useState('')

  // Check if current user is landlord
  const isLandlord = room?.landlord?.id === currentUser?.id
  
  console.log('Room data:', room);
  console.log('Current user:', currentUser);
  console.log('Is Landlord:', isLandlord);

  useEffect(() => {
    if (currentUser && bookingId) {
      loadRoomDetail()
    }
  }, [bookingId, currentUser])

  const loadRoomDetail = async () => {
    try {
      setLoading(true)
      console.log('Loading room detail with bookingId:', bookingId)
      const data = await myRoomsAPI.getMyRoomDetail(bookingId)
      console.log('Room detail loaded:', data)
      console.log('Payment QR URL:', data.room?.paymentQrImageUrl)
      console.log('Payment Description:', data.room?.paymentDescription)
      setRoom(data)
    } catch (error) {
      console.error('Failed to load room detail:', error)
      console.error('Error response:', error.response?.data)
      console.error('BookingId was:', bookingId)
      customToast.error('Không thể tải thông tin phòng: ' + (error.response?.data?.error || error.message))
      // Don't navigate away immediately, let user see the error
      setTimeout(() => {
        navigate('/landlord/booking-requests')
      }, 2000)
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
      customToast.success('Đã thanh toán tiền cọc thành công! 💰')
      setShowPaymentModal(false)
      loadRoomDetail()
    } catch (error) {
      customToast.error('Thanh toán thất bại')
    }
  }

  const handleSignContract = () => {
    setShowSignContractModal(true)
  }

  const handleConfirmSignContract = async () => {
    setProcessing(true)
    try {
      await myRoomsAPI.signContract(bookingId)
      customToast.success('Đã ký hợp đồng thành công! ✍️')
      setShowSignContractModal(false)
      loadRoomDetail()
    } catch (error) {
      customToast.error(error.response?.data?.error || 'Không thể ký hợp đồng')
    } finally {
      setProcessing(false)
    }
  }

  const handleCancelBooking = () => {
    setCancelReason('')
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      customToast.error('Vui lòng nhập lý do hủy')
      return
    }

    setProcessing(true)
    try {
      await myRoomsAPI.cancelBooking(bookingId, cancelReason)
      customToast.success('Đã hủy đặt phòng thành công! 🚫')
      navigate('/account/rooms')
    } catch (error) {
      customToast.error('Không thể hủy đặt phòng')
    } finally {
      setProcessing(false)
    }
  }

  const handleRenewLease = () => {
    setRenewMonths('')
    setShowRenewModal(true)
  }

  const handleConfirmRenew = async () => {
    const months = parseInt(renewMonths)
    if (!renewMonths || isNaN(months) || months <= 0) {
      customToast.error('Vui lòng nhập số tháng hợp lệ')
      return
    }

    setProcessing(true)
    try {
      await myRoomsAPI.renewLease(bookingId, months)
      customToast.success(`Đã gia hạn ${months} tháng thành công! 📝`)
      setShowRenewModal(false)
      loadRoomDetail()
    } catch (error) {
      customToast.error('Không thể gia hạn hợp đồng')
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmitIssue = async (e) => {
    e.preventDefault()
    try {
      await myRoomsAPI.createIssue(bookingId, issueForm)
      customToast.success('Đã gửi báo cáo sự cố! 📢')
      setShowIssueModal(false)
      setIssueForm({ title: '', description: '', photos: [] })
      loadRoomDetail()
    } catch (error) {
      customToast.error('Không thể gửi báo cáo')
    }
  }

  const handleUploadQrImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploadingQr(true)
      // Upload image first
      const uploadResult = await uploadAPI.uploadImage(file)
      const imageUrl = `http://localhost:8080${uploadResult.url}`
      
      // Then update room with QR image and payment description
      await myRoomsAPI.uploadPaymentQr(bookingId, imageUrl, qrPaymentDescription)
      customToast.success('Đã cập nhật QR thanh toán! 💳')
      setShowQrUploadModal(false)
      setQrPaymentDescription('') // Reset description
      loadRoomDetail()
    } catch (error) {
      customToast.error('Không thể tải lên QR code')
    } finally {
      setUploadingQr(false)
    }
  }

  const handleUploadPaymentProof = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploadingProof(true)
      // Upload image first
      const uploadResult = await uploadAPI.uploadImage(file)
      const documentUrl = `http://localhost:8080${uploadResult.url}`
      
      // Then create payment proof document
      await myRoomsAPI.uploadPaymentProof(
        bookingId, 
        documentUrl, 
        file.name,
        paymentProofNote
      )
      customToast.success('Đã tải lên chứng từ thanh toán! 📄')
      setShowPaymentProofModal(false)
      setPaymentProofNote('')
      loadRoomDetail()
    } catch (error) {
      customToast.error('Không thể tải lên chứng từ')
    } finally {
      setUploadingProof(false)
    }
  }

  const handleConfirmPayment = async (documentId) => {
    try {
      await myRoomsAPI.confirmPayment(bookingId, documentId, 'Đã xác nhận thanh toán')
      customToast.success('Đã xác nhận thanh toán! ✅')
      loadRoomDetail()
    } catch (error) {
      customToast.error('Không thể xác nhận thanh toán')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      HOLD: { label: 'Giữ chỗ', className: 'badge-hold' },
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
                  {/* QR Payment Section - Landlord only */}
                  {isLandlord && (
                    <div className="qr-payment-section" style={{ marginBottom: '24px', padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
                          QR Code Thanh Toán
                        </h3>
                        <button
                          onClick={() => setShowQrUploadModal(true)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 size={16} />
                          {room.room?.paymentQrImageUrl ? 'Cập nhật QR' : 'Thêm QR'}
                        </button>
                      </div>
                      {room.room?.paymentQrImageUrl ? (
                        <div>
                          <div style={{ textAlign: 'center' }}>
                            <img 
                              src={room.room.paymentQrImageUrl} 
                              alt="QR Thanh toán" 
                              style={{ maxWidth: '300px', borderRadius: '8px', border: '2px solid #E2E8F0' }}
                            />
                          </div>
                          {room.room?.paymentDescription && (
                            <div style={{ 
                              marginTop: '16px', 
                              padding: '12px 16px', 
                              background: '#FEF3C7', 
                              border: '1px solid #F59E0B',
                              borderRadius: '8px',
                              textAlign: 'center'
                            }}>
                              <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: '#92400E' }}>
                                Nội dung chuyển khoản:
                              </p>
                              <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#B45309' }}>
                                {room.room.paymentDescription}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p style={{ textAlign: 'center', color: '#64748B', margin: 0 }}>
                          Chưa có QR code thanh toán. Hãy thêm QR code để người thuê có thể thanh toán.
                        </p>
                      )}
                    </div>
                  )}

                  {/* QR Payment View - Tenant only */}
                  {!isLandlord && room.room?.paymentQrImageUrl && (
                    <div className="qr-payment-section" style={{ marginBottom: '24px', padding: '20px', background: '#F0F9FF', borderRadius: '12px', border: '1px solid #3B82F6' }}>
                      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#0F172A', textAlign: 'center' }}>
                        Quét mã QR để thanh toán
                      </h3>
                      <div style={{ textAlign: 'center' }}>
                        <img 
                          src={room.room.paymentQrImageUrl} 
                          alt="QR Thanh toán" 
                          style={{ maxWidth: '300px', borderRadius: '8px', border: '2px solid #3B82F6' }}
                        />
                      </div>
                      {room.room?.paymentDescription && (
                        <div style={{ 
                          marginTop: '16px', 
                          padding: '12px 16px', 
                          background: '#FEF3C7', 
                          border: '1px solid #F59E0B',
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: '#92400E' }}>
                            Nội dung chuyển khoản:
                          </p>
                          <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#B45309' }}>
                            {room.room.paymentDescription}
                          </p>
                        </div>
                      )}
                      <p style={{ textAlign: 'center', color: '#1E40AF', marginTop: '12px', fontSize: '14px' }}>
                        Sau khi chuyển khoản, vui lòng tải ảnh chứng từ lên mục "Tài liệu"
                      </p>
                    </div>
                  )}

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
                  {/* Upload button for tenant */}
                  {!isLandlord && (
                    <button 
                      className="btn-upload" 
                      onClick={() => setShowPaymentProofModal(true)}
                      style={{ marginBottom: '20px', width: '100%' }}
                    >
                      <Upload size={16} />
                      Tải lên chứng từ chuyển khoản
                    </button>
                  )}

                  {room.documents && room.documents.length > 0 ? (
                    <div className="documents-grid">
                      {room.documents.map(doc => (
                        <div key={doc.id} className="document-card">
                          <FileText size={32} />
                          <div style={{ flex: 1 }}>
                            <h4>{doc.fileName || doc.documentType}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                              <span className={`doc-status status-${doc.status.toLowerCase()}`}>
                                {doc.status === 'APPROVED' ? 'Đã duyệt' :
                                 doc.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                              </span>
                              {doc.uploadedBy && (
                                <span style={{ fontSize: '12px', color: '#64748B' }}>
                                  • {doc.uploadedBy === 'TENANT' ? 'Người thuê' : 'Chủ trọ'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <a href={doc.documentUrl} className="btn-view" target="_blank" rel="noreferrer">
                              Xem
                            </a>
                            {/* Landlord can confirm payment proof */}
                            {isLandlord && doc.documentType === 'PAYMENT_PROOF' && doc.status === 'PENDING' && (
                              <button
                                onClick={() => handleConfirmPayment(doc.id)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#22C55E',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <CheckCircle size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                Xác nhận
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-content">
                      <p>Chưa có tài liệu nào</p>
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
            {/* Contact Card - Show tenant info if landlord, landlord info if tenant */}
            {!isLandlord && room.landlord && (
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
            )}
            
            {/* Show tenant info if current user is landlord */}
            {isLandlord && (
              <div className="sidebar-card">
                <h3>Thông tin người thuê</h3>
                <div className="landlord-info">
                  <div className="landlord-avatar">
                    <User size={32} />
                  </div>
                  <div>
                    <h4>{currentUser?.username || 'Người thuê'}</h4>
                    {room.phoneNumber && (
                      <a href={`tel:${room.phoneNumber}`} className="landlord-contact">
                        <Phone size={14} />
                        {room.phoneNumber}
                      </a>
                    )}
                  </div>
                </div>
                <button className="btn-contact">
                  <MessageSquare size={16} />
                  Liên hệ
                </button>
              </div>
            )}

            {/* Actions Card - Only show for tenant */}
            {!isLandlord && (
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
            )}
            
            {/* Landlord Actions */}
            {isLandlord && (
              <div className="sidebar-card">
                <h3>Quản lý</h3>
                <div className="actions-list">
                  <div className="action-btn" style={{ 
                    background: '#F0F9FF', 
                    color: '#3B82F6',
                    border: '2px solid #3B82F6',
                    cursor: 'default'
                  }}>
                    <User size={16} />
                    Chế độ xem chủ trọ
                  </div>
                  {room.contract?.pdfUrl && (
                    <a href={room.contract.pdfUrl} className="action-btn" target="_blank" rel="noreferrer">
                      <Download size={16} />
                      Tải hợp đồng
                    </a>
                  )}
                </div>
              </div>
            )}
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

      {/* Sign Contract Modal */}
      {showSignContractModal && (
        <div className="modal-overlay-new" onClick={() => setShowSignContractModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Xác nhận ký hợp đồng</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowSignContractModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p>Bạn xác nhận muốn ký hợp đồng thuê phòng này?</p>
              <div className="warning-box" style={{ marginTop: '20px', background: '#EFF6FF', borderColor: '#3B82F6' }}>
                ℹ️ Sau khi ký hợp đồng, bạn sẽ chịu trách nhiệm theo các điều khoản đã thỏa thuận.
              </div>
            </div>
            <div className="modal-actions-new">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowSignContractModal(false)}
                disabled={processing}
              >
                Hủy
              </button>
              <button
                className="btn-modal-primary"
                onClick={handleConfirmSignContract}
                disabled={processing}
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận ký'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="modal-overlay-new" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Hủy đặt phòng</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowCancelModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p>Bạn có chắc muốn hủy đặt phòng này?</p>
              <div className="form-group-new" style={{ marginTop: '20px' }}>
                <label className="form-label-new">Lý do hủy <span style={{ color: '#EF4444' }}>*</span>:</label>
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

      {/* Renew Lease Modal */}
      {showRenewModal && (
        <div className="modal-overlay-new" onClick={() => setShowRenewModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Gia hạn hợp đồng</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowRenewModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p>Nhập số tháng bạn muốn gia hạn hợp đồng:</p>
              <div className="form-group-new" style={{ marginTop: '20px' }}>
                <label className="form-label-new">Số tháng <span style={{ color: '#EF4444' }}>*</span>:</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  className="form-input-new"
                  placeholder="Nhập số tháng (1-24)"
                  value={renewMonths}
                  onChange={(e) => setRenewMonths(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div className="modal-actions-new">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowRenewModal(false)}
                disabled={processing}
              >
                Hủy
              </button>
              <button
                className="btn-modal-primary"
                onClick={handleConfirmRenew}
                disabled={processing}
              >
                {processing ? 'Đang xử lý...' : 'Xác nhận gia hạn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Upload Modal */}
      {showQrUploadModal && (
        <div className="modal-overlay-new" onClick={() => setShowQrUploadModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Tải lên QR Code Thanh Toán</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowQrUploadModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p style={{ marginBottom: '20px', color: '#64748B' }}>
                Tải lên mã QR để người thuê có thể quét và thanh toán tiền thuê phòng.
              </p>
              <div className="form-group-new" style={{ marginBottom: '20px' }}>
                <label className="form-label-new">Nội dung chuyển khoản:</label>
                <input
                  type="text"
                  className="form-input-new"
                  placeholder="VD: Thanh toan tien phong thang 11/2024"
                  value={qrPaymentDescription}
                  onChange={(e) => setQrPaymentDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#64748B' }}>
                  Người thuê sẽ sử dụng nội dung này khi chuyển khoản
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadQrImage}
                  style={{ display: 'none' }}
                  id="qr-upload-input"
                />
                <label
                  htmlFor="qr-upload-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: '#3B82F6',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: uploadingQr ? 'not-allowed' : 'pointer',
                    opacity: uploadingQr ? 0.6 : 1
                  }}
                >
                  <ImageIcon size={20} />
                  {uploadingQr ? 'Đang tải lên...' : 'Chọn ảnh QR'}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Upload Modal */}
      {showPaymentProofModal && (
        <div className="modal-overlay-new" onClick={() => setShowPaymentProofModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Tải lên Chứng Từ Chuyển Khoản</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowPaymentProofModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p style={{ marginBottom: '20px', color: '#64748B' }}>
                Tải lên ảnh chứng từ chuyển khoản để chủ trọ xác nhận thanh toán.
              </p>
              <div className="form-group-new" style={{ marginBottom: '20px' }}>
                <label className="form-label-new">Ghi chú (không bắt buộc):</label>
                <textarea
                  className="form-textarea-new"
                  placeholder="VD: Tiền thuê tháng 11/2024"
                  value={paymentProofNote}
                  onChange={(e) => setPaymentProofNote(e.target.value)}
                  rows={3}
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
              <div style={{ textAlign: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPaymentProof}
                  style={{ display: 'none' }}
                  id="payment-proof-input"
                />
                <label
                  htmlFor="payment-proof-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: '#3B82F6',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: uploadingProof ? 'not-allowed' : 'pointer',
                    opacity: uploadingProof ? 0.6 : 1
                  }}
                >
                  <Upload size={20} />
                  {uploadingProof ? 'Đang tải lên...' : 'Chọn ảnh chứng từ'}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default MyRoomDetail


