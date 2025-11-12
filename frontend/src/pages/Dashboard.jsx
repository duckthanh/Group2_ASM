import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  DollarSign, 
  Home, 
  Users, 
  FileText, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Search,
  Bell,
  BarChart3,
  PieChart as PieChartIcon,
  Settings,
  LayoutDashboard
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Dashboard.css'

function Dashboard({ currentUser, onLogout }) {
  const navigate = useNavigate()
  const [activeSidebar, setActiveSidebar] = useState('overview')
  const [timeFilter, setTimeFilter] = useState('month')
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 150000000,
    totalBookings: 248,
    avgRevenuePerRoom: 3200000,
    totalRoomsRented: 42,
    occupancyRate: 87,
    revenueGrowth: 12,
    bookingsGrowth: 8,
    topRooms: [],
    recentTransactions: [],
    revenueOverTime: []
  })

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/')
      return
    }
    fetchDashboardData()
  }, [currentUser, navigate, timeFilter])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch top booked rooms
      const topRoomsRes = await fetch('http://localhost:8080/api/analytics/top-booked-rooms')
      const topRooms = await topRoomsRes.json()
      
      setDashboardData(prev => ({
        ...prev,
        topRooms: topRooms.slice(0, 5)
      }))
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const kpiCards = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(dashboardData.totalRevenue),
      icon: DollarSign,
      growth: dashboardData.revenueGrowth,
      color: '#0D6EFD',
      bgColor: 'rgba(13, 110, 253, 0.1)'
    },
    {
      title: 'Số giao dịch',
      value: formatNumber(dashboardData.totalBookings),
      icon: FileText,
      growth: dashboardData.bookingsGrowth,
      color: '#22C55E',
      bgColor: 'rgba(34, 197, 94, 0.1)'
    },
    {
      title: 'Doanh thu TB/phòng',
      value: formatCurrency(dashboardData.avgRevenuePerRoom),
      icon: Home,
      growth: 5,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Phòng đang thuê',
      value: `${dashboardData.totalRoomsRented} phòng`,
      icon: LayoutDashboard,
      growth: 3,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      title: 'Tỷ lệ lấp đầy',
      value: `${dashboardData.occupancyRate}%`,
      icon: TrendingUp,
      growth: 2,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    }
  ]

  const sidebarItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'revenue', label: 'Doanh thu', icon: DollarSign },
    { id: 'rooms', label: 'Quản lý phòng', icon: Home },
    { id: 'landlords', label: 'Chủ trọ', icon: Users },
    { id: 'tenants', label: 'Người thuê', icon: Users },
    { id: 'transactions', label: 'Giao dịch', icon: FileText },
    { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar currentUser={currentUser} onLogout={onLogout} />
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <BarChart3 size={24} />
            <h2>Analytics</h2>
          </div>
          <nav className="sidebar-nav">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                className={`sidebar-item ${activeSidebar === item.id ? 'active' : ''}`}
                onClick={() => setActiveSidebar(item.id)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Header */}
          <header className="dashboard-header">
            <div className="dashboard-title-section">
              <h1>Dashboard Doanh Thu</h1>
              <p>Theo dõi hiệu quả kinh doanh của bạn</p>
            </div>
            
            <div className="dashboard-actions">
              <div className="search-box-dashboard">
                <Search size={18} />
                <input type="text" placeholder="Tìm kiếm..." />
              </div>
              
              <select 
                className="time-filter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="today">Hôm nay</option>
                <option value="week">7 ngày qua</option>
                <option value="month">Tháng này</option>
                <option value="year">Năm nay</option>
                <option value="custom">Tùy chọn</option>
              </select>
              
              <button className="btn-export">
                <Download size={18} />
                Export
              </button>
              
              <button className="btn-notification">
                <Bell size={18} />
                <span className="notification-badge">3</span>
              </button>
            </div>
          </header>

          {/* KPI Cards */}
          <div className="kpi-grid">
            {kpiCards.map((card, index) => (
              <div key={index} className="kpi-card" style={{ borderLeft: `4px solid ${card.color}` }}>
                <div className="kpi-header">
                  <div className="kpi-icon" style={{ background: card.bgColor, color: card.color }}>
                    <card.icon size={24} />
                  </div>
                  <div className={`kpi-growth ${card.growth >= 0 ? 'positive' : 'negative'}`}>
                    {card.growth >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(card.growth)}%
                  </div>
                </div>
                <div className="kpi-content">
                  <h3>{card.title}</h3>
                  <p className="kpi-value">{card.value}</p>
                  <span className="kpi-subtitle">
                    {card.growth >= 0 ? 'Tăng' : 'Giảm'} so với tháng trước
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Revenue Over Time */}
            <div className="chart-card chart-large">
              <div className="chart-header">
                <div>
                  <h3>Xu hướng doanh thu</h3>
                  <p>Biểu đồ doanh thu theo thời gian</p>
                </div>
                <select className="chart-filter">
                  <option>Theo tháng</option>
                  <option>Theo tuần</option>
                  <option>Theo ngày</option>
                </select>
              </div>
              <div className="chart-body">
                <div className="chart-placeholder">
                  <TrendingUp size={48} />
                  <p>Biểu đồ Line Chart sẽ hiển thị ở đây</p>
                  <span className="chart-note">Sử dụng Chart.js hoặc Recharts để tích hợp</span>
                </div>
              </div>
            </div>

            {/* Revenue by Source */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3>Doanh thu theo nguồn</h3>
                  <p>Phân bổ nguồn khách hàng</p>
                </div>
              </div>
              <div className="chart-body">
                <div className="chart-placeholder">
                  <PieChartIcon size={48} />
                  <p>Pie Chart</p>
                </div>
                <div className="source-legend">
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#0D6EFD' }}></span>
                    <span>Website (42%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#22C55E' }}></span>
                    <span>Facebook (33%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#F59E0B' }}></span>
                    <span>Zalo/Group (15%)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ background: '#8B5CF6' }}></span>
                    <span>Referral (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Rooms Table */}
          <div className="data-card">
            <div className="data-header">
              <div>
                <h3>Top phòng tạo doanh thu cao nhất</h3>
                <p>5 phòng có số lượt đặt nhiều nhất</p>
              </div>
            </div>
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Hạng</th>
                    <th>Ảnh</th>
                    <th>Tên phòng</th>
                    <th>Địa chỉ</th>
                    <th>Giá phòng</th>
                    <th>Số lượt đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topRooms.map((room, index) => (
                    <tr key={room.id}>
                      <td>
                        <span className={`rank-badge rank-${index + 1}`}>#{index + 1}</span>
                      </td>
                      <td>
                        <img 
                          src={room.imageUrl || 'https://via.placeholder.com/60'} 
                          alt={room.name}
                          className="room-thumbnail"
                        />
                      </td>
                      <td className="room-name">{room.name}</td>
                      <td className="room-location">{room.location}</td>
                      <td className="room-price">{formatCurrency(room.price)}</td>
                      <td>
                        <span className="booking-count">{room.bookingCount || 0} lượt</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="data-card">
            <div className="data-header">
              <div>
                <h3>Giao dịch gần đây</h3>
                <p>Lịch sử giao dịch mới nhất</p>
              </div>
              <button className="btn-view-all">Xem tất cả →</button>
            </div>
            <div className="transactions-list">
              <div className="transaction-item">
                <div className="transaction-icon success">
                  <FileText size={20} />
                </div>
                <div className="transaction-info">
                  <h4>Thanh toán đặt phòng #TX2912</h4>
                  <p>Minh Đức - Trọ 2 Anh Cò</p>
                </div>
                <div className="transaction-amount">
                  <span className="amount">₫ 2.500.000</span>
                  <span className="status success">✅ Thành công</span>
                  <span className="date">11/04/2025</span>
                </div>
              </div>
              
              <div className="transaction-item">
                <div className="transaction-icon pending">
                  <FileText size={20} />
                </div>
                <div className="transaction-info">
                  <h4>Thanh toán đặt phòng #TX2874</h4>
                  <p>Huyền - Trọ Hoàng Nam 23</p>
                </div>
                <div className="transaction-amount">
                  <span className="amount">₫ 3.000.000</span>
                  <span className="status pending">⏳ Chờ thanh toán</span>
                  <span className="date">10/04/2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Card */}
          <div className="forecast-card">
            <div className="forecast-icon">
              <TrendingUp size={32} />
            </div>
            <div className="forecast-content">
              <h3>Dự báo doanh thu tháng sau</h3>
              <p className="forecast-value">₫ 162.000.000</p>
              <span className="forecast-growth">
                <ArrowUpRight size={16} />
                +7.8% so với tháng này
              </span>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard

