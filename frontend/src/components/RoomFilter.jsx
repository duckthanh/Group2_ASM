import { useState } from 'react'
import './RoomFilter.css'

function RoomFilter({ onFilter, onReset }) {
  const [showFilter, setShowFilter] = useState(true)
  const [filters, setFilters] = useState({
    roomTypes: [],
    minPrice: '',
    maxPrice: '',
    areas: [],
    amenities: [],
    capacity: null,
    availability: null
  })

  const roomTypeOptions = [
    { value: 'Nhà trọ', label: 'Nhà trọ, phòng trọ' },
    { value: 'Nhà nguyên căn', label: 'Nhà nguyên căn' },
    { value: 'Căn hộ', label: 'Căn hộ' }
  ]

  const priceRanges = [
    { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
    { label: '1-10 triệu', min: 1000000, max: 10000000 },
    { label: '10-30 triệu', min: 10000000, max: 30000000 },
    { label: '30-50 triệu', min: 30000000, max: 50000000 }
  ]

  const areaOptions = [
    { value: '<15', label: '<15m²' },
    { value: '15-20', label: '15-20m²' },
    { value: '20-30', label: '20-30m²' },
    { value: '>30', label: '>30m²' }
  ]

  const amenityOptions = [
    { value: 'Có gác lửng', label: 'Có gác lửng' },
    { value: 'Có nhà vệ sinh riêng', label: 'Có nhà vệ sinh riêng' },
    { value: 'Có ban công', label: 'Có ban công' },
    { value: 'Có máy lạnh', label: 'Có máy lạnh / điều hòa' },
    { value: 'Có nóng lạnh', label: 'Có nóng lạnh' },
    { value: 'Có wifi', label: 'Có wifi' },
    { value: 'Cho nấu ăn', label: 'Cho nấu ăn' },
    { value: 'Có nội thất', label: 'Có nội thất cơ bản' },
    { value: 'Gửi xe', label: 'Gửi xe' }
  ]

  const capacityOptions = [
    { value: 1, label: '1 người' },
    { value: 2, label: '2 người' },
    { value: 3, label: '3-4 người' },
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

  const handlePriceRangeClick = (range) => {
    setFilters(prev => ({
      ...prev,
      minPrice: range.min.toString(),
      maxPrice: range.max.toString()
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
      areas: [],
      amenities: [],
      capacity: null,
      availability: null
    }
    setFilters(resetFilters)
    onReset()
  }

  return (
    <div className="room-filter">
      <div className="filter-header">
        <h3 className="filter-title">🔍 Lọc tìm kiếm</h3>
        <button 
          className="filter-toggle"
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? '▲' : '▼'}
        </button>
      </div>

      {showFilter && (
        <div className="filter-content">
          {/* Loại hình */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={(e) => e.currentTarget.parentElement.classList.toggle('collapsed')}
            >
              <span className="filter-section-title">Loại hình</span>
              <span className="filter-section-arrow">▼</span>
            </button>
            <div className="filter-section-content">
              {roomTypeOptions.map(option => (
                <label key={option.value} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.roomTypes.includes(option.value)}
                    onChange={() => handleRoomTypeChange(option.value)}
                  />
                  <span className="checkbox-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Mức giá */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={(e) => e.currentTarget.parentElement.classList.toggle('collapsed')}
            >
              <span className="filter-section-title">Mức giá</span>
              <span className="filter-section-arrow">▼</span>
            </button>
            <div className="filter-section-content">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Giá thấp nhất</label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="price-input"
                  />
                </div>
                <div className="price-input-group">
                  <label>Giá cao nhất</label>
                  <input
                    type="number"
                    placeholder="Không giới hạn"
                    min="0"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="price-input"
                  />
                </div>
              </div>
              <div className="price-ranges">
                {priceRanges.map((range, index) => (
                  <button
                    key={index}
                    className="price-range-btn"
                    onClick={() => handlePriceRangeClick(range)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Diện tích */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={(e) => e.currentTarget.parentElement.classList.toggle('collapsed')}
            >
              <span className="filter-section-title">Diện tích</span>
              <span className="filter-section-arrow">▼</span>
            </button>
            <div className="filter-section-content">
              {areaOptions.map(option => (
                <label key={option.value} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.areas.includes(option.value)}
                    onChange={() => handleAreaChange(option.value)}
                  />
                  <span className="checkbox-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tiện nghi */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={(e) => e.currentTarget.parentElement.classList.toggle('collapsed')}
            >
              <span className="filter-section-title">Tiện nghi</span>
              <span className="filter-section-arrow">▼</span>
            </button>
            <div className="filter-section-content">
              {amenityOptions.map(option => (
                <label key={option.value} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(option.value)}
                    onChange={() => handleAmenityChange(option.value)}
                  />
                  <span className="checkbox-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sức chứa */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={(e) => e.currentTarget.parentElement.classList.toggle('collapsed')}
            >
              <span className="filter-section-title">Sức chứa</span>
              <span className="filter-section-arrow">▼</span>
            </button>
            <div className="filter-section-content">
              {capacityOptions.map(option => (
                <label key={option.value} className="filter-radio">
                  <input
                    type="radio"
                    name="capacity"
                    checked={filters.capacity === option.value}
                    onChange={() => setFilters({...filters, capacity: option.value})}
                  />
                  <span className="radio-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Phòng trống */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={(e) => e.currentTarget.parentElement.classList.toggle('collapsed')}
            >
              <span className="filter-section-title">Phòng trống</span>
              <span className="filter-section-arrow">▼</span>
            </button>
            <div className="filter-section-content">
              {availabilityOptions.map(option => (
                <label key={option.value} className="filter-radio">
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === option.value}
                    onChange={() => setFilters({...filters, availability: option.value})}
                  />
                  <span className="radio-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            <button className="btn-reset-filter" onClick={handleResetFilter}>
              Xóa bộ lọc
            </button>
            <button className="btn-apply-filter" onClick={handleApplyFilter}>
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomFilter

