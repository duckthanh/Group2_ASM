import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminRevenue({ currentUser, onLogout }) {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartData, setChartData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [localUser, setLocalUser] = useState(currentUser);

  useEffect(() => {
    if (!localUser) {
      const saved = localStorage.getItem("user");
      if (saved) setLocalUser(JSON.parse(saved));
    }
  }, [localUser]);

  useEffect(() => {
    if (localUser && localUser.role !== "ADMIN") navigate("/");
  }, [localUser, navigate]);

  // Fetch months
  const fetchMonths = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/revenue/months"
      );
      setMonths(res.data);
      if (res.data.length > 0) setSelectedMonth(res.data[0]);
    } catch {
      setError("Không thể tải danh sách tháng.");
    }
  };

  // Fetch chart data
  const fetchChart = async (month) => {
    if (!month) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/revenue/daily/${month}`
      );
      setChartData(res.data);
    } catch {
      setError("Không thể tải dữ liệu doanh thu.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment list
  const fetchPayments = async (month, page = 0) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/revenue/payments/${month}?page=${page}&size=10`
      );
      setPayments(res.data.content);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.number);
    } catch {
      setError("Không thể tải danh sách thanh toán.");
    }
  };

  useEffect(() => {
    fetchMonths();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchChart(selectedMonth);
      fetchPayments(selectedMonth, 0);
    }
  }, [selectedMonth]);

  return (
    <div className="admin-revenue-page">
      <Navbar currentUser={localUser} onLogout={onLogout} />
      <main style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 Báo cáo doanh thu</h1>
          <p style={styles.subtitle}>
            Theo dõi doanh thu và danh sách thanh toán theo tháng
          </p>
        </div>

        {/* Month selector */}
        <div style={styles.monthSelector}>
          <label style={styles.label}>Chọn tháng:</label>
          <select
            style={styles.select}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Chart section */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Doanh thu tháng {selectedMonth}</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                label={{ value: "Ngày", position: "insideBottom", offset: -5 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="totalRevenue"
                fill="#6366F1"
                name="Doanh thu (VNĐ)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment table */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>💵 Danh sách thanh toán</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Ngày thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={styles.emptyRow}>
                      Không có dữ liệu thanh toán.
                    </td>
                  </tr>
                ) : (
                  payments.map((p, index) => (
                    <tr key={p.id}>
                      {/* show row number instead of payment id */}
                      <td>{currentPage * 10 + index + 1}</td>
                      <td>{p.booking?.room?.name || "—"}</td>
                      <td>{p.amount?.toLocaleString()} ₫</td>
                      <td>{p.paymentMethod}</td>
                      <td>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background:
                              p.status === "PAID" ? "#DCFCE7" : "#FEF9C3",
                            color: p.status === "PAID" ? "#166534" : "#92400E",
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td>{new Date(p.paidAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              disabled={currentPage === 0}
              onClick={() => fetchPayments(selectedMonth, currentPage - 1)}
            >
              ← Trước
            </button>
            <span>
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              style={styles.pageBtn}
              disabled={currentPage + 1 >= totalPages}
              onClick={() => fetchPayments(selectedMonth, currentPage + 1)}
            >
              Sau →
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminRevenue;

// 🎨 Inline CSS — clean, modern layout
const styles = {
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 0",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2rem",
    color: "#1E293B",
    fontWeight: 700,
  },
  subtitle: {
    color: "#64748B",
    fontSize: "1.1rem",
    marginTop: "6px",
  },
  monthSelector: {
    textAlign: "center",
    marginBottom: "30px",
  },
  label: {
    marginRight: "8px",
    fontWeight: 500,
  },
  select: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #CBD5E1",
    background: "#F9FAFB",
    fontSize: "1rem",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "40px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    color: "#1E293B",
    fontWeight: 600,
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableContainer: {
    overflowX: "auto",
  },
  tableThTd: {
    padding: "12px 16px",
    borderBottom: "1px solid #E2E8F0",
    textAlign: "left",
  },
  emptyRow: {
    textAlign: "center",
    padding: "16px",
    color: "#6B7280",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  pageBtn: {
    padding: "8px 14px",
    background: "#4F46E5",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
  },
};
