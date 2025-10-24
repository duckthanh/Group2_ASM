import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { roomAPI, uploadAPI } from '../services/api'
import toast from 'react-hot-toast'
import './EditRoom.css'

function EditRoom({ room, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    additionalImages: [],
    detail: '',
    price: '',
    location: '',
    contact: '',
    roomType: '',
    area: '',
    capacity: '',
    amenities: '',
    availability: '',
    isAvailable: true,
    // Cost fields
    electricityCost: '',
    waterCost: '',
    internetCost: '',
    parkingFee: '',
    deposit: '',
    depositType: 'MONTHS'
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageKey, setImageKey] = useState(Date.now())

  useEffect(() => {
    if (room) {
      // Parse additional images from JSON string
      let additionalImagesArray = []
      if (room.additionalImages) {
        try {
          additionalImagesArray = JSON.parse(room.additionalImages)
        } catch (e) {
          console.error('Error parsing additional images:', e)
        }
      }
      
      setFormData({
        name: room.name || '',
        imageUrl: room.imageUrl || '',
        additionalImages: additionalImagesArray,
        detail: room.detail || '',
        price: room.price || '',
        location: room.location || '',
        contact: room.contact || '',
        roomType: room.roomType || '',
        area: room.area || '',
        capacity: room.capacity || '',
        amenities: room.amenities || '',
        availability: room.availability || 'Còn trống',
        isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
        // Cost fields
        electricityCost: room.electricityCost || '',
        waterCost: room.waterCost || '',
        internetCost: room.internetCost || '',
        parkingFee: room.parkingFee || '',
        deposit: room.deposit || '',
        depositType: room.depositType || 'MONTHS'
      })
    }
  }, [room])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }))
    setImageKey(Date.now())
    toast.success('Đã xóa ảnh')
  }

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate total images (main + additional)
    const currentTotal = formData.additionalImages.length + (formData.imageUrl ? 1 : 0)
    if (currentTotal + files.length > 10) {
      toast.error('Tối đa 10 ảnh (1 ảnh chính + 9 ảnh phụ)')
      return
    }

    setUploading(true)
    try {
      const uploadPromises = files.map(file => uploadAPI.uploadImage(file))
      const results = await Promise.all(uploadPromises)
      
      const newImageUrls = results.map(result => {
        return result.url.startsWith('http') 
          ? result.url 
          : `http://localhost:8080${result.url}`
      })

      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newImageUrls]
      }))
      
      toast.success(`Đã upload ${files.length} ảnh`)
    } catch (err) {
      console.error('Error uploading images:', err)
      toast.error('Lỗi khi upload ảnh')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }))
    toast.success('Đã xóa ảnh')
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    setUploading(true)
    try {
      const response = await uploadAPI.uploadImage(file)
      // Backend trả về relative URL, cần thêm base URL
      const fullImageUrl = response.url.startsWith('http') 
        ? response.url 
        : `http://localhost:8080${response.url}`
      
      setFormData(prev => ({
        ...prev,
        imageUrl: fullImageUrl
      }))
      setImageKey(Date.now()) // Reset input file
      toast.success('Upload ảnh thành công')
      console.log('Image uploaded:', fullImageUrl)
    } catch (err) {
      console.error('Error uploading image:', err)
      toast.error('Lỗi khi upload ảnh')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.price || !formData.location || !formData.contact) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setSaving(true)
    try {
      const updateData = {
        name: formData.name,
        imageUrl: formData.imageUrl,
        additionalImages: JSON.stringify(formData.additionalImages),
        detail: formData.detail,
        price: parseFloat(formData.price),
        location: formData.location,
        contact: formData.contact,
        roomType: formData.roomType,
        area: formData.area ? parseFloat(formData.area) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        amenities: formData.amenities,
        availability: formData.availability,
        isAvailable: formData.isAvailable,
        // Cost fields
        electricityCost: formData.electricityCost ? parseFloat(formData.electricityCost) : null,
        waterCost: formData.waterCost ? parseFloat(formData.waterCost) : null,
        internetCost: formData.internetCost ? parseFloat(formData.internetCost) : null,
        parkingFee: formData.parkingFee ? parseFloat(formData.parkingFee) : null,
        deposit: formData.deposit ? parseFloat(formData.deposit) : null,
        depositType: formData.depositType
      }

      await roomAPI.updateRoom(room.id, updateData)
      toast.success('Cập nhật phòng thành công!')
      onSuccess()
    } catch (err) {
      console.error('Error updating room:', err)
      toast.error('Có lỗi xảy ra khi cập nhật phòng')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="edit-room-overlay">
      <div className="edit-room-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-room-header">
          <h2>Sửa thông tin phòng</h2>
          <button className="btn-close-edit" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-room-form">
          <div className="form-scroll">
            {/* Basic Info */}
            <div className="form-section">
              <h3>Thông tin cơ bản</h3>
              
              <div className="form-group">
                <label>Tên phòng <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: Phòng trọ gần FTU Hòa Lạc"
                  required
                />
              </div>

              <div className="form-group">
                <label>Giá thuê (VNĐ/tháng) <span className="required">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="VD: 3000000"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ <span className="required">*</span></label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="VD: Thạch Thất, Hà Nội"
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại liên hệ <span className="required">*</span></label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="VD: 0912345678"
                  required
                />
              </div>
            </div>

            {/* Image */}
            <div className="form-section">
              <h3>Hình ảnh</h3>
              
              <div className="form-group">
                <label>Ảnh phòng</label>
                {formData.imageUrl && (
                  <div className="image-preview">
                    <img src={formData.imageUrl} alt="Preview" />
                    <button 
                      type="button" 
                      className="btn-remove-image" 
                      onClick={handleRemoveImage}
                      title="Xóa ảnh"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <input
                  key={imageKey}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p className="uploading-text">Đang upload...</p>}
                <small style={{ display: 'block', marginTop: '8px', color: 'var(--text-secondary)' }}>
                  {formData.imageUrl ? 'Chọn ảnh mới để thay đổi' : 'Chọn ảnh phòng'}
                </small>
              </div>

              {/* Additional Images */}
              <div className="form-group">
                <label>Ảnh phụ (tối đa 9 ảnh)</label>
                
                {formData.additionalImages.length > 0 && (
                  <div className="additional-images-grid">
                    {formData.additionalImages.map((imageUrl, index) => (
                      <div key={index} className="additional-image-item">
                        <img src={imageUrl} alt={`Additional ${index + 1}`} />
                        <button
                          type="button"
                          className="btn-remove-additional-image"
                          onClick={() => handleRemoveAdditionalImage(index)}
                          title="Xóa ảnh"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesUpload}
                  disabled={uploading || formData.additionalImages.length >= 9}
                />
                {uploading && <p className="uploading-text">Đang upload...</p>}
                <small style={{ display: 'block', marginTop: '8px', color: 'var(--text-secondary)' }}>
                  Đã upload: {formData.additionalImages.length}/9 ảnh
                </small>
              </div>
            </div>

            {/* Room Details */}
            <div className="form-section">
              <h3>Thông tin chi tiết</h3>
              
              <div className="form-group">
                <label>Loại hình</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                >
                  <option value="">Chọn loại hình</option>
                  <option value="Nhà trọ/phòng trọ">Nhà trọ/phòng trọ</option>
                  <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                  <option value="Căn hộ">Căn hộ</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Diện tích (m²)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="VD: 25"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Sức chứa (người)</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="VD: 2"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết</label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết về phòng trọ..."
                  rows="5"
                />
              </div>

              <div className="form-group">
                <label>Tiện nghi</label>
                <textarea
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="VD: Có wifi, Có điều hoà, Có ban công"
                  rows="3"
                />
                <small>Phân cách bằng dấu phẩy (,)</small>
              </div>
            </div>

            {/* Costs & Terms */}
            <div className="form-section">
              <h3>Chi phí & điều khoản</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tiền điện (VNĐ/kWh)</label>
                  <input
                    type="number"
                    name="electricityCost"
                    value={formData.electricityCost}
                    onChange={handleChange}
                    placeholder="VD: 3500"
                    min="0"
                    step="100"
                  />
                </div>

                <div className="form-group">
                  <label>Tiền nước (VNĐ/m³)</label>
                  <input
                    type="number"
                    name="waterCost"
                    value={formData.waterCost}
                    onChange={handleChange}
                    placeholder="VD: 20000"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Internet (VNĐ/tháng)</label>
                  <input
                    type="number"
                    name="internetCost"
                    value={formData.internetCost}
                    onChange={handleChange}
                    placeholder="VD: 100000"
                    min="0"
                    step="10000"
                  />
                </div>

                <div className="form-group">
                  <label>Phí giữ xe (VNĐ/tháng)</label>
                  <input
                    type="number"
                    name="parkingFee"
                    value={formData.parkingFee}
                    onChange={handleChange}
                    placeholder="VD: 50000"
                    min="0"
                    step="10000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tiền cọc</label>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    placeholder="VD: 3000000"
                    min="0"
                    step="100000"
                  />
                </div>

                <div className="form-group">
                  <label>Loại tiền cọc</label>
                  <select
                    name="depositType"
                    value={formData.depositType}
                    onChange={handleChange}
                  >
                    <option value="MONTHS">Số tháng</option>
                    <option value="FIXED">Cố định (VNĐ)</option>
                  </select>
                </div>
              </div>

              <small style={{ color: 'var(--text-secondary)', marginTop: '8px', display: 'block' }}>
                * Để trống nếu chưa xác định hoặc thương lượng trực tiếp
              </small>
            </div>

            {/* Availability */}
            <div className="form-section">
              <h3>Tình trạng</h3>
              
              <div className="form-group">
                <label>Tình trạng chi tiết</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="Còn trống">Còn trống</option>
                  <option value="Sắp trống">Sắp trống</option>
                  <option value="Đã cho thuê">Đã cho thuê</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  <span>Phòng còn trống</span>
                </label>
              </div>
            </div>
          </div>

          <div className="edit-room-actions">
            <button type="button" className="btn-cancel-edit" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save-edit" disabled={saving || uploading}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRoom

