import { useState } from 'react'
import { roomAPI, uploadAPI } from '../services/api'
import './CreateRoom.css'

const CreateRoom = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    detail: '',
    price: '',
    location: '',
    contact: '',
    roomType: '',
    area: '',
    capacity: '',
    amenities: [],
    availability: 'Còn trống'
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh (jpg, png, gif)')
      return
    }

    // Kiểm tra kích thước (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Kích thước ảnh phải nhỏ hơn 10MB')
      return
    }

    setSelectedFile(file)
    
    // Tạo preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload ngay
    setUploading(true)
    setError('')
    try {
      const result = await uploadAPI.uploadImage(file)
      setFormData(prev => ({
        ...prev,
        imageUrl: 'http://localhost:8080' + result.url
      }))
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Không thể upload ảnh. Vui lòng thử lại!')
      setSelectedFile(null)
      setPreviewUrl('')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.name || !formData.price || !formData.location || !formData.contact) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setLoading(true)
    setError('')

    try {
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        area: formData.area ? parseFloat(formData.area) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        amenities: formData.amenities.join(', ') // Convert array to comma-separated string
      }
      
      await roomAPI.createRoom(roomData)
      alert('Tạo phòng trọ thành công!')
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (err) {
      console.error('Error creating room:', err)
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo phòng trọ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm Phòng Trọ Mới</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="create-room-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Tên Phòng Trọ <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Phòng trọ cao cấp Q1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageFile">Ảnh Phòng Trọ</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="imageFile" className="file-upload-label">
                📁 {selectedFile ? selectedFile.name : 'Chọn ảnh từ máy tính'}
              </label>
            </div>
            {uploading && (
              <p className="uploading-text">⏳ Đang tải ảnh lên...</p>
            )}
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="detail">Mô Tả Chi Tiết</label>
            <textarea
              id="detail"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              placeholder="Mô tả đầy đủ về phòng trọ: diện tích, tiện nghi, quy định..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá Phòng (VNĐ/tháng) <span className="required">*</span></label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="3000000"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Vị Trí <span className="required">*</span></label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Thông Tin Liên Hệ <span className="required">*</span></label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="VD: 0901234567 - Mr. Nguyễn"
              required
            />
          </div>

          {/* Thông tin lọc */}
          <div className="form-section-divider">
            <h3>Thông tin chi tiết cho bộ lọc</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roomType">Loại hình</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
              >
                <option value="">-- Chọn loại hình --</option>
                <option value="Nhà trọ">Nhà trọ, phòng trọ</option>
                <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                <option value="Căn hộ">Căn hộ</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="area">Diện tích (m²)</label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="VD: 25"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">Sức chứa (người)</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="VD: 2"
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="availability">Tình trạng</label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="Còn trống">Còn trống</option>
                <option value="Sắp trống">Sắp trống</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tiện nghi</label>
            <div className="amenities-grid">
              {[
                'Có gác lửng',
                'Có nhà vệ sinh riêng',
                'Có ban công',
                'Có máy lạnh',
                'Có nóng lạnh',
                'Có wifi',
                'Cho nấu ăn',
                'Có nội thất',
                'Gửi xe'
              ].map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo Phòng Trọ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRoom

