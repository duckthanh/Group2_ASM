import { useState } from 'react'
import { bookingAPI } from '../services/api'
import './RentRoom.css'

const RentRoom = ({ room, onClose, onSuccess, isDeposit = false }) => {
  const [activeTab, setActiveTab] = useState('month') // 'month' or 'group'
  const [formData, setFormData] = useState({
    duration: '',
    durationUnit: 'MONTH',
    moveInDate: '',
    numberOfPeople: 1,
    phoneNumber: '',
    note: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.duration || !formData.moveInDate || !formData.phoneNumber) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    if (formData.numberOfPeople > 3) {
      setError('Số người tối đa là 3')
      return
    }

    setLoading(true)
    setError('')

    try {
      const bookingData = {
        roomId: room.id,
        duration: parseInt(formData.duration),
        durationUnit: formData.durationUnit,
        moveInDate: formData.moveInDate,
        numberOfPeople: parseInt(formData.numberOfPeople),
        phoneNumber: formData.phoneNumber,
        note: formData.note,
        isDeposit: isDeposit
      }
      
      await bookingAPI.createBooking(bookingData)
      alert(isDeposit ? 'Đặt cọc phòng thành công!' : 'Thuê phòng thành công!')
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (err) {
      console.error('Error creating booking:', err)
      setError(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="rent-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="rent-modal-header">
          <h2>Yêu cầu thuê phòng</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Tabs */}
        <div className="rent-tabs">
          <button 
            className={`rent-tab ${activeTab === 'month' ? 'active' : ''}`}
            onClick={() => setActiveTab('month')}
          >
            Ở một mình
          </button>
          <button 
            className={`rent-tab ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            Ở nhóm
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rent-room-form">
          {error && <div className="error-message">{error}</div>}

          {/* Thời hạn thuê và Đơn vị */}
          <div className="form-row-split">
            <div className="form-group-half">
              <label htmlFor="duration">
                Thời hạn thuê <span className="required">*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Nhập số tháng"
                min="1"
                required
              />
            </div>

            <div className="form-group-half">
              <label htmlFor="durationUnit">
                Đơn vị <span className="required">*</span>
              </label>
              <select
                id="durationUnit"
                name="durationUnit"
                value={formData.durationUnit}
                onChange={handleChange}
                required
              >
                <option value="MONTH">Tháng</option>
                <option value="YEAR">Năm</option>
              </select>
            </div>
          </div>

          {/* Ngày dọn vào */}
          <div className="form-group">
            <label htmlFor="moveInDate">
              Ngày dọn vào để ở <span className="required">*</span>
            </label>
            <input
              type="date"
              id="moveInDate"
              name="moveInDate"
              value={formData.moveInDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Số người ở 1 phòng */}
          <div className="form-group">
            <label htmlFor="numberOfPeople">
              Số người ở 1 phòng (Tối đa 3) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="numberOfPeople"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              placeholder="Nhập số người (1-3)"
              min="1"
              max="3"
              required
            />
          </div>

          {/* Số điện thoại */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Số điện thoại liên hệ</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              pattern="[0-9]{10}"
            />
          </div>

          {/* Ghi chú */}
          <div className="form-group">
            <label htmlFor="note">Ghi chú thêm</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (không bắt buộc)"
              rows="4"
            />
          </div>

          {/* Actions */}
          <div className="form-actions-modern">
            <button type="button" className="btn-cancel-modern" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-confirm-modern" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Xác nhận thuê phòng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RentRoom

