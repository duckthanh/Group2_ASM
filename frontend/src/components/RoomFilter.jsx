import { useState } from 'react'
import { SlidersHorizontal, Home, DollarSign, Maximize2, Star, Users, CheckCircle } from 'lucide-react'
import './RoomFilter.css'

function RoomFilter({ onFilter, onReset }) {
  const [filters, setFilters] = useState({
    roomTypes: [],
    minPrice: '',
    maxPrice: '',
    selectedPriceChip: null,
    areas: [],
    minArea: '',
    maxArea: '',
    amenities: [],
    capacity: null,
    availability: null
  })

  const roomTypeOptions = [
    { value: 'Nhà trọ', label: 'Nhà trọ / phòng trọ', icon: '🏠' },
    { value: 'Nhà nguyên căn', label: 'Nhà nguyên căn', icon: '🏡' },
    { value: 'Căn hộ', label: 'Căn hộ', icon: '🏢' }
  ]

  const priceRanges = [
    { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
    { label: '1–10 triệu', min: 1000000, max: 10000000 },
    { label: '10–30 triệu', min: 10000000, max: 30000000 },
    { label: '30–50 triệu', min: 30000000, max: 50000000 }
  ]

  const areaOptions = [
    { value: '<15', label: '<15m²', icon: '📐' },
    { value: '15-20', label: '15-20m²', icon: '📐' },
    { value: '20-30', label: '20-30m²', icon: '📐' },
    { value: '>30', label: '>30m²', icon: '📐' }
  ]

  const amenityOptions = [
    { value: 'Có gác lửng', label: 'Có gác lửng', icon: '🪜' },
    { value: 'Có nhà vệ sinh riêng', label: 'Có nhà vệ sinh riêng', icon: '🚿' },
    { value: 'Có ban công', label: 'Có ban công', icon: '🌿' },
    { value: 'Có máy lạnh', label: 'Có máy lạnh / điều hòa', icon: '❄️' },
    { value: 'Có nóng lạnh', label: 'Có nóng lạnh', icon: '🔥' },
    { value: 'Có wifi', label: 'Có wifi', icon: '📶' },
    { value: 'Cho nấu ăn', label: 'Cho nấu ăn', icon: '🍳' },
    { value: 'Có nội thất', label: 'Có nội thất cơ bản', icon: '🛋️' },
    { value: 'Gửi xe', label: 'Gửi xe', icon: '🚗' }
  ]

  const capacityOptions = [
    { value: 1, label: '1 người' },
    { value: 2, label: '2 người' },
    { value: 3, label: '3–4 người' },
    { value: 4, label: '4+ người' }
  ]

  const availabilityOptions = [
    { value: 'Còn trống', label: 'Còn trống' },
    { value: 'Sắp trống', label: 'Sắp trống' }
  ]

  const handleRoomTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(type)
        ? prev.roomTypes.filter(t => t !== type)
        : [...prev.roomTypes, type]
    }))
  }

  const handlePriceRangeClick = (range, index) => {
    setFilters(prev => ({
      ...prev,
      minPrice: range.min.toString(),
      maxPrice: range.max.toString(),
      selectedPriceChip: index
    }))
  }

  const handleManualPriceChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      selectedPriceChip: null // Bỏ chọn chip khi gõ tay
    }))
  }

  const handleAreaChange = (area) => {
    setFilters(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area]
    }))
  }

  const handleAmenityChange = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleApplyFilter = () => {
    onFilter(filters)
  }

  const handleResetFilter = () => {
    const resetFilters = {
      roomTypes: [],
      minPrice: '',
      maxPrice: '',
      selectedPriceChip: null,
      areas: [],
      minArea: '',
      maxArea: '',
      amenities: [],
      capacity: null,
      availability: null
    }
    setFilters(resetFilters)
    onReset()
  }

  // Count active filters
  const countActiveFilters = () => {
    let count = 0
    if (filters.roomTypes.length > 0) count += filters.roomTypes.length
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.areas.length > 0) count += filters.areas.length
    if (filters.amenities.length > 0) count += filters.amenities.length
    if (filters.capacity !== null) count++
    if (filters.availability !== null) count++
    return count
  }

  return (
    <div className="filter-panel-new">
      <div className="filter-header-new">
        <div className="filter-title-wrapper">
          <SlidersHorizontal size={20} strokeWidth={2.5} />
          <h3>Bộ lọc</h3>
        </div>
        {countActiveFilters() > 0 && (
          <span className="filter-count-badge">{countActiveFilters()}</span>
        )}
      </div>

      <div className="filter-content-new">
        {/* Loại hình */}
        <div className="filter-section-new">
          <div className="filter-section-title">
            <Home size={18} />
            <span>Loại hình</span>
          </div>
          <div className="filter-options">
            {roomTypeOptions.map(option => (
              <label key={option.value} className="filter-checkbox-new">
                <input
                  type="checkbox"
                  checked={filters.roomTypes.includes(option.value)}
                  onChange={() => handleRoomTypeChange(option.value)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-icon">{option.icon}</span>
                <span className="checkbox-label-new">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mức giá */}
        <div className="filter-section-new">
          <div className="filter-section-title">
            <DollarSign size={18} />
            <span>Mức giá</span>
          </div>
          <div className="filter-options">
            <div className="price-inputs-new">
              <input
                type="number"
                placeholder="Từ (VNĐ)"
                value={filters.minPrice}
                onChange={(e) => handleManualPriceChange('minPrice', e.target.value)}
                className="price-input-new"
              />
              <span className="price-separator">—</span>
              <input
                type="number"
                placeholder="Đến (VNĐ)"
                value={filters.maxPrice}
                onChange={(e) => handleManualPriceChange('maxPrice', e.target.value)}
                className="price-input-new"
              />
            </div>
            <div className="price-chips">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  className={`price-chip ${filters.selectedPriceChip === index ? 'active' : ''}`}
                  onClick={() => handlePriceRangeClick(range, index)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diện tích */}
        <div className="filter-section-new">
          <div className="filter-section-title">
            <Maximize2 size={18} />
            <span>Diện tích</span>
          </div>
          <div className="filter-options">
            {areaOptions.map(option => (
              <label key={option.value} className="filter-checkbox-new">
                <input
                  type="checkbox"
                  checked={filters.areas.includes(option.value)}
                  onChange={() => handleAreaChange(option.value)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-icon">{option.icon}</span>
                <span className="checkbox-label-new">{option.label}</span>
              </label>
            ))}
            <div className="area-inputs-new">
              <input
                type="number"
                placeholder="m² tối thiểu"
                value={filters.minArea}
                onChange={(e) => setFilters({...filters, minArea: e.target.value})}
                className="area-input-new"
              />
              <input
                type="number"
                placeholder="m² tối đa"
                value={filters.maxArea}
                onChange={(e) => setFilters({...filters, maxArea: e.target.value})}
                className="area-input-new"
              />
            </div>
          </div>
        </div>

        {/* Tiện nghi */}
        <div className="filter-section-new">
          <div className="filter-section-title">
            <Star size={18} />
            <span>Tiện nghi</span>
          </div>
          <div className="filter-options">
            {amenityOptions.map(option => (
              <label key={option.value} className="filter-checkbox-new">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(option.value)}
                  onChange={() => handleAmenityChange(option.value)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-icon">{option.icon}</span>
                <span className="checkbox-label-new">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sức chứa */}
        <div className="filter-section-new">
          <div className="filter-section-title">
            <Users size={18} />
            <span>Sức chứa</span>
          </div>
          <div className="filter-options">
            {capacityOptions.map(option => (
              <label key={option.value} className="filter-radio-new">
                <input
                  type="radio"
                  name="capacity"
                  checked={filters.capacity === option.value}
                  onChange={() => setFilters({...filters, capacity: option.value})}
                />
                <span className="radio-custom"></span>
                <span className="radio-label-new">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Phòng trống */}
        <div className="filter-section-new">
          <div className="filter-section-title">
            <CheckCircle size={18} />
            <span>Phòng trống</span>
          </div>
          <div className="filter-options">
            {availabilityOptions.map(option => (
              <label key={option.value} className="filter-radio-new">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === option.value}
                  onChange={() => setFilters({...filters, availability: option.value})}
                />
                <span className="radio-custom"></span>
                <span className="radio-label-new">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filter-actions-new">
          <button className="btn-filter-reset" onClick={handleResetFilter}>
            Xóa
          </button>
          <button className="btn-filter-apply" onClick={handleApplyFilter}>
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomFilter
