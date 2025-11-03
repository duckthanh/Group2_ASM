import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AdminRevenue() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    

   useEffect(() => {
  const fetchRevenue = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bạn chưa đăng nhập!");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:8080/api/admin/revenue/monthly", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.error("Lỗi khi tải doanh thu:", err);

      if (err.response?.status === 401) {
        setError("Phiên đăng nhập hết hạn hoặc bạn không có quyền truy cập.");
      } else {
        setError("Không thể tải dữ liệu doanh thu.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchRevenue();
}, []);


    return (
        <div style={styles.page}>
            <Navbar />
            <main style={styles.container}>
                <h1 style={styles.title}>📊 Doanh thu theo tháng</h1>

                {loading ? (
                    <p style={styles.loading}>Đang tải dữ liệu...</p>
                ) : error ? (
                    <p style={styles.error}>{error}</p>
                ) : data.length === 0 ? (
                    <p style={styles.noData}>Chưa có dữ liệu doanh thu.</p>
                ) : (
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalRevenue" fill="#4F46E5" name="Doanh thu (VNĐ)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}

const styles = {
    page: {
        background: '#f9fafb',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    container: {
        flex: 1,
        width: '90%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 0',
    },
    title: {
        textAlign: 'center',
        fontSize: '1.8rem',
        color: '#111827',
        fontWeight: 700,
        marginBottom: '40px',
    },
    chartContainer: {
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    loading: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '1.1rem',
        marginTop: '40px',
    },
    error: {
        textAlign: 'center',
        color: '#dc2626',
        fontSize: '1.1rem',
        marginTop: '40px',
    },
    noData: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '1.1rem',
        marginTop: '40px',
    },
}
