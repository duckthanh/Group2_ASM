import './DeleteConfirmModal.css'

const DeleteConfirmModal = ({ room, onConfirm, onCancel, loading }) => {
  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-icon">⚠️</div>
          <h2>Xác nhận xóa phòng trọ</h2>
        </div>

        <div className="delete-modal-body">
          <p className="warning-text">
            Bạn có chắc chắn muốn xóa phòng trọ này không?
          </p>
          
          <div className="room-info-preview">
            <div className="preview-image">
              <img 
                src={room.imageUrl || 'https://via.placeholder.com/200x150?text=Phòng+Trọ'} 
                alt={room.name} 
              />
            </div>
            <div className="preview-details">
              <h3>{room.name}</h3>
              <p>📍 {room.location}</p>
              <p className="price-preview">💰 {new Intl.NumberFormat('vi-VN').format(room.price)} đ/tháng</p>
            </div>
          </div>

          <div className="warning-note">
            <strong>⚠️ Lưu ý:</strong> Hành động này không thể hoàn tác. Tất cả thông tin về phòng trọ 
            này sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </div>
        </div>

        <div className="delete-modal-actions">
          <button 
            className="btn-cancel-delete" 
            onClick={onCancel}
            disabled={loading}
          >
            ❌ Hủy bỏ
          </button>
          <button 
            className="btn-confirm-delete" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? '⏳ Đang xóa...' : '🗑️ Xóa phòng'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal

