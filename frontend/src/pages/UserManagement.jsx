import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GlowEffects from '../components/GlowEffects'
import { userAPI } from '../services/api'

function UserManagement({ currentUser, onLogout }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [updating, setUpdating] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(6)
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  
  const navigate = useNavigate()

  useEffect(() => {
    // Kiểm tra quyền admin
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/')
      return
    }
    fetchUsers()
  }, [currentUser, navigate])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, users])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await userAPI.getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleDeleteUser = (user) => {
    console.log('Opening delete modal for user:', user)
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) {
      alert('Không tìm thấy người dùng để xóa')
      return
    }
    
    setDeleting(true)
    try {
      console.log('Deleting user:', selectedUser.id)
      await userAPI.deleteUser(selectedUser.id)
      console.log('User deleted successfully')
      
      setUsers(users.filter(user => user.id !== selectedUser.id))
      alert('Xóa người dùng thành công!')
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Có lỗi khi xóa người dùng: ' + (err.response?.data?.message || err.message))
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
      setSelectedUser(null)
    }
  }

  const handleUpdateRole = (user) => {
    console.log('Opening role update modal for user:', user)
    setSelectedUser(user)
    setNewRole(user.role)
    setShowRoleModal(true)
  }

  const handleConfirmRoleUpdate = async () => {
    if (!selectedUser || !newRole) {
      alert('Vui lòng chọn quyền mới')
      return
    }
    
    setUpdating(true)
    try {
      console.log('Updating role for user:', selectedUser.id, 'to role:', newRole)
      const updatedUser = await userAPI.updateUserRole(selectedUser.id, newRole)
      console.log('Role updated successfully:', updatedUser)
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ))
      alert('Cập nhật quyền thành công!')
    } catch (err) {
      console.error('Error updating role:', err)
      alert('Có lỗi khi cập nhật quyền: ' + (err.response?.data?.message || err.message))
    } finally {
      setUpdating(false)
      setShowRoleModal(false)
      setSelectedUser(null)
      setNewRole('')
    }
  }

  const getRoleBadgeClass = (role) => {
    return role === 'ADMIN' ? 'role-badge-admin' : 'role-badge-user'
  }

  const getRoleDisplayName = (role) => {
    return role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'
  }

  if (loading) {
    return (
      <div className="bg-gradient">
        <Navbar currentUser={currentUser} onLogout={onLogout} />
        <GlowEffects />
        <main className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>
            Đang tải danh sách người dùng...
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-gradient">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <GlowEffects />

      <main className="container" style={{ padding: '100px 0' }}>
        <div className="user-management-container">
          <div className="user-management-header">
            <h1 className="user-management-title">Quản lý người dùng</h1>
            <p className="user-management-subtitle">
              Quản lý tài khoản và phân quyền người dùng trong hệ thống
            </p>
          </div>

          {/* Search Bar */}
          <div className="user-search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
            {searchTerm && (
              <div className="search-results-info">
                Tìm thấy {filteredUsers.length} kết quả cho "{searchTerm}"
              </div>
            )}
          </div>

          {error && (
            <div className="error-message" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="user-management-stats">
            <div className="stat-card">
              <div className="stat-number">{users.length}</div>
              <div className="stat-label">Tổng người dùng</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{users.filter(u => u.role === 'ADMIN').length}</div>
              <div className="stat-label">Quản trị viên</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{users.filter(u => u.role === 'USER').length}</div>
              <div className="stat-label">Người dùng</div>
            </div>
          </div>

          <div className="user-list">
            {users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>Chưa có người dùng nào</h3>
                <p>Hiện tại chưa có người dùng nào trong hệ thống.</p>
              </div>
            ) : (
              <>
                <div className="user-grid">
                  {currentUsers.map((user, index) => (
                  <div key={user.id} className="user-card">
                    <div className="user-number">
                      #{indexOfFirstUser + index + 1}
                    </div>
                    <div className="user-card-header">
                      <div className="user-info">
                        <h3 className="user-name">{user.username || 'Chưa có tên'}</h3>
                        <p className="user-email">{user.email}</p>
                        <div className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </div>
                      </div>
                    </div>

                    <div className="user-details">
                      <div className="user-detail-item">
                        <span className="detail-icon">📞</span>
                        <span className="detail-label">SĐT:</span>
                        <span className="detail-value">{user.phoneNumber || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="user-detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-label">Địa chỉ:</span>
                        <span className="detail-value">{user.address || 'Chưa cập nhật'}</span>
                      </div>
                    </div>

                    <div className="user-actions">
                      <button
                        className="btn-change-role"
                        onClick={() => handleUpdateRole(user)}
                        disabled={user.id === currentUser.id}
                      >
                        🔄 Đổi quyền
                      </button>
                      <button
                        className="btn-delete-user"
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.id === currentUser.id}
                      >
                        🗑️ Xóa
                      </button>
                    </div>

                    {user.id === currentUser.id && (
                      <div className="current-user-notice">
                        Tài khoản hiện tại
                      </div>
                    )}
                  </div>
                ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Trước
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                          onClick={() => handlePageChange(number)}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal xác nhận xóa */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Xác nhận xóa người dùng</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa người dùng:</p>
              <div className="user-to-delete">
                <strong>{selectedUser.username}</strong> ({selectedUser.email})
              </div>
              <p style={{ color: '#ef4444', marginTop: '10px' }}>
                ⚠️ Hành động này không thể hoàn tác!
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                className="btn-delete"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xóa người dùng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal đổi quyền */}
      {showRoleModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Đổi quyền người dùng</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRoleModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Thay đổi quyền cho: <strong>{selectedUser.username}</strong></p>
              <div className="form-group">
                <label htmlFor="newRole" className="form-label">Quyền mới:</label>
                <select
                  id="newRole"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="form-select"
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowRoleModal(false)}
                disabled={updating}
              >
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmRoleUpdate}
                disabled={updating || newRole === selectedUser.role}
              >
                {updating ? 'Đang cập nhật...' : 'Cập nhật quyền'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
