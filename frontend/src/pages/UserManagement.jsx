import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserCog, Users as UsersIcon, Shield, Edit2, Trash2, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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
  const [usersPerPage] = useState(10)
  
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [filteredUsers, setFilteredUsers] = useState([])
  
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/')
      return
    }
    fetchUsers()
  }, [currentUser, navigate])

  // Filter users
  useEffect(() => {
    let result = users

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(result)
    setCurrentPage(1)
  }, [searchTerm, roleFilter, users])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await userAPI.getAllUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return
    
    setDeleting(true)
    try {
      await userAPI.deleteUser(selectedUser.id)
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
    setSelectedUser(user)
    setNewRole(user.role)
    setShowRoleModal(true)
  }

  const handleConfirmRoleUpdate = async () => {
    if (!selectedUser || !newRole) return
    
    setUpdating(true)
    try {
      const updatedUser = await userAPI.updateUserRole(selectedUser.id, newRole)
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

  const getRoleBadge = (role) => {
    return role === 'ADMIN' ? (
      <span className="user-badge-admin">
        <Shield size={14} />
        Admin
      </span>
    ) : (
      <span className="user-badge-user">
        <UsersIcon size={14} />
        User
      </span>
    )
  }

  const getStats = () => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      users: users.filter(u => u.role === 'USER').length
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="user-management-page-new">
        <Navbar currentUser={currentUser} onLogout={onLogout} />
        <main className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>
            Đang tải danh sách người dùng...
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="user-management-page-new">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <main className="container user-management-main">
        {/* Header */}
        <div className="um-header">
          <div className="um-header-content">
            <div className="um-title-section">
              <h1 className="um-title">Quản lý người dùng</h1>
              <p className="um-subtitle">Quản lý tài khoản và phân quyền người dùng trong hệ thống</p>
            </div>
          </div>

          {/* Stats */}
          <div className="um-stats">
            <div className="stat-card-new">
              <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                <UsersIcon size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Tổng người dùng</div>
              </div>
            </div>
            <div className="stat-card-new">
              <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                <Shield size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.admins}</div>
                <div className="stat-label">Quản trị viên</div>
              </div>
            </div>
            <div className="stat-card-new">
              <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                <UserCog size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{stats.users}</div>
                <div className="stat-label">Người dùng</div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="um-controls">
            <div className="um-search">
              <Search size={20} className="search-icon-um" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="um-search-input"
              />
            </div>
            
            <div className="um-filters">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="um-filter-select"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="ADMIN">Quản trị viên</option>
                <option value="USER">Người dùng</option>
              </select>
            </div>
          </div>

          {searchTerm && (
            <div className="um-search-info">
              Tìm thấy {filteredUsers.length} kết quả cho "{searchTerm}"
            </div>
          )}
        </div>

        {error && (
          <div className="um-error">
            {error}
          </div>
        )}

        {/* User Table */}
        {filteredUsers.length === 0 ? (
          <div className="empty-state-new">
            <UsersIcon size={64} strokeWidth={1.5} className="empty-icon-new" />
            <h3>Không tìm thấy người dùng</h3>
            <p>Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <>
            <div className="um-table-wrapper">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Người dùng</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id} className={user.id === currentUser.id ? 'current-user-row' : ''}>
                      <td className="td-number">{indexOfFirstUser + index + 1}</td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-table">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="user-name-table">{user.username || 'Chưa có tên'}</div>
                            {user.id === currentUser.id && (
                              <span className="current-user-label">Tài khoản hiện tại</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="td-email">{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td className="td-phone">{user.phoneNumber || '—'}</td>
                      <td className="td-address">{user.address || '—'}</td>
                      <td>
                        <div className="um-table-actions">
                          <button
                            className="btn-table-action btn-edit"
                            onClick={() => handleUpdateRole(user)}
                            disabled={user.id === currentUser.id}
                            title="Đổi quyền"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-table-action btn-delete"
                            onClick={() => handleDeleteUser(user)}
                            disabled={user.id === currentUser.id}
                            title="Xóa người dùng"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-new">
                <button
                  className="pagination-btn-new"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Trước
                </button>
                
                <div className="pagination-numbers-new">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      className={`pagination-number-new ${currentPage === number ? 'active' : ''}`}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                
                <button
                  className="pagination-btn-new"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay-new" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Xác nhận xóa người dùng</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p>Bạn có chắc chắn muốn xóa người dùng:</p>
              <div className="user-to-delete-box">
                <strong>{selectedUser.username}</strong>
                <span className="user-email-small">({selectedUser.email})</span>
              </div>
              <div className="warning-box">
                ⚠️ Hành động này không thể hoàn tác!
              </div>
            </div>
            <div className="modal-actions-new">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                className="btn-modal-delete"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xóa người dùng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && selectedUser && (
        <div className="modal-overlay-new" onClick={() => setShowRoleModal(false)}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h3>Đổi quyền người dùng</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowRoleModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body-new">
              <p>Thay đổi quyền cho: <strong>{selectedUser.username}</strong></p>
              <div className="form-group-new">
                <label className="form-label-new">Vai trò mới:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="form-select-new"
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>
            </div>
            <div className="modal-actions-new">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowRoleModal(false)}
                disabled={updating}
              >
                Hủy
              </button>
              <button
                className="btn-modal-primary"
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
