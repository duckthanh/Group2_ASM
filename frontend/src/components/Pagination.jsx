import React from 'react'
import './Pagination.css'

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisiblePages = 5 
}) {
  if (totalPages <= 1) return null

  const pages = []
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="pagination-wrapper">
      <div className="pagination-controls">
        {/* Previous Button */}
        <button
          className="pagination-btn pagination-prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
        >
          <span className="pagination-arrow">←</span>
          <span className="pagination-text">Trước</span>
        </button>
        
        {/* First Page */}
        {startPage > 1 && (
          <>
            <button
              className="pagination-number"
              onClick={() => handlePageChange(1)}
              aria-label="Trang 1"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="pagination-ellipsis">...</span>
            )}
          </>
        )}
        
        {/* Page Numbers */}
        <div className="pagination-numbers">
          {pages.map(page => (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
              aria-label={`Trang ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>
        
        {/* Last Page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              className="pagination-number"
              onClick={() => handlePageChange(totalPages)}
              aria-label={`Trang ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* Next Button */}
        <button
          className="pagination-btn pagination-next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Trang sau"
        >
          <span className="pagination-text">Sau</span>
          <span className="pagination-arrow">→</span>
        </button>
      </div>
      
      {/* Page Info */}
      <div className="pagination-info">
        Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
      </div>
    </div>
  )
}

export default Pagination

