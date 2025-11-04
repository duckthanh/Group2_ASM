import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function AdminRevenue({ currentUser, onLogout }) {
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Restore user from localStorage (like UserManagement)
  const [localUser, setLocalUser] = useState(currentUser)

  useEffect(() => {
    if (!localUser) {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setLocalUser(JSON.parse(savedUser))
      }
    }
  }, [localUser])

  // Only allow admin
  useEffect(() => {
    if (localUser && localUser.role !== 'ADMIN') {
      navigate('/')
    }
  }, [localUser, navigate])

  // Fetch months
  const fetchMonths = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:8080/api/admin/revenue/months')
      setMonths(res.data)
      if (res.data.length > 0) {
        setSelectedMonth(res.data[0]) // default latest month
      }
    } catch (err) {
      console.error('Error fetching months:', err)
      setError('Không thể tải danh sách tháng.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch daily revenue by month
  const fetchRevenue = async (month) => {
    if (!month) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`http://localhost:8080/api/admin/revenue/daily/${month}`)
      setData(res.data)
    } catch (err) {
      console.error('Error fetching daily revenue:', err)
      setError('Không thể tải dữ liệu doanh thu.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMonths()
  }, [])

  useEffect(() => {
    if (selectedMonth) {
      fetchRevenue(selectedMonth)
    }
  }, [selectedMonth])

  return (
    <div className="admin-revenue-page">
      <Navbar currentUser={localUser} onLogout={onLogout} />

      <main style={styles.container}>
        <div style={styles.headerSection}>
          <h1 style={styles.title}>📊 Thống kê doanh thu</h1>
          <p style={styles.subtitle}>Xem doanh thu chi tiết theo ngày trong tháng</p>
        </div>

        {/* Month Selector */}
        <div style={styles.selectorBox}>
          <label htmlFor="monthSelect" style={styles.label}>Chọn tháng:</label>
          <select
            id="monthSelect"
            style={styles.select}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.length === 0 ? (
              <option value="">Không có tháng nào</option>
            ) : (
              months.map((m) => <option key={m} value={m}>{m}</option>)
            )}
          </select>
        </div>

        {/* Chart Content */}
        <div style={styles.contentWrapper}>
          {loading ? (
            <p style={styles.loading}>Đang tải dữ liệu...</p>
          ) : error ? (
            <div style={styles.errorBox}>
              <p style={styles.error}>{error}</p>
            </div>
          ) : data.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.noData}>Không có doanh thu trong tháng này.</p>
            </div>
          ) : (
            <div style={styles.chartContainer}>
              <h2 style={styles.chartTitle}>Doanh thu tháng {selectedMonth}</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" label={{ value: 'Ngày', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalRevenue" fill="#4F46E5" name="Doanh thu (VNĐ)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AdminRevenue

// 🧩 Inline CSS
const styles = {
  container: {
    flex: 1,
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 0'
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '1.8rem',
    color: '#111827',
    fontWeight: 700,
    marginBottom: '10px'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1.1rem'
  },
  selectorBox: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  label: {
    fontSize: '1rem',
    fontWeight: 500,
    marginRight: '10px',
    color: '#374151'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    background: '#fff',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  chartContainer: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  chartTitle: {
    textAlign: 'center',
    marginBottom: '15px',
    color: '#1f2937',
    fontWeight: '600'
  },
  loading: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.1rem',
    marginTop: '40px'
  },
  error: {
    textAlign: 'center',
    color: '#dc2626',
    fontSize: '1.1rem',
    marginTop: '40px'
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.1rem',
    marginTop: '40px'
  }
}
