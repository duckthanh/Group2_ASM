import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import './ImageGallery.css'

function ImageGallery({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  return (
    <div 
      className="gallery-overlay" 
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="gallery-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gallery-header">
          <div className="gallery-counter">
            {currentIndex + 1} / {images.length}
          </div>
          <button className="gallery-close-btn" onClick={onClose} title="Đóng (Esc)">
            <X size={24} />
          </button>
        </div>

        {/* Main Image */}
        <div className="gallery-main">
          <img 
            src={images[currentIndex]} 
            alt={`Image ${currentIndex + 1}`}
            className={isZoomed ? 'zoomed' : ''}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              className="gallery-nav gallery-nav-prev" 
              onClick={goToPrevious}
              title="Previous (←)"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              className="gallery-nav gallery-nav-next" 
              onClick={goToNext}
              title="Next (→)"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* Zoom Control */}
        <button 
          className="gallery-zoom-btn" 
          onClick={() => setIsZoomed(!isZoomed)}
          title={isZoomed ? "Zoom Out" : "Zoom In"}
        >
          {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="gallery-thumbnails">
            {images.map((image, index) => (
              <div
                key={index}
                className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsZoomed(false)
                }}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGallery

