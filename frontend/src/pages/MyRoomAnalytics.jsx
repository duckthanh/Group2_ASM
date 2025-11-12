import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Home, MapPin, BedDouble, Coins } from "lucide-react";

function MyRoomAnalytics({ currentUser, onLogout }) {
  const [data, setData] = useState({ totalRooms: 0, rooms: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const user = currentUser || JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }
    fetchData(user.id);
  }, [currentUser]);

  const fetchData = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/analytics/user/${userId}/rooms`
      );
      setData(res.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError("Không thể tải dữ liệu thống kê phòng.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = data.rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(data.rooms.length / roomsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="room-analytics-page">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <main style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 Thống kê phòng của bạn</h1>
          <p style={styles.subtitle}>
            Theo dõi tổng số phòng và lượt đặt của từng phòng
          </p>
        </div>

        {loading ? (
          <p style={styles.loading}>Đang tải dữ liệu...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Tổng số phòng</h2>
              <p style={styles.summaryValue}>{data.totalRooms}</p>
            </div>

            {data.rooms.length === 0 ? (
              <p style={styles.empty}>Chưa có phòng nào được tạo.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Hình ảnh</th>
                      <th>Tên phòng</th>
                      <th>Vị trí</th>
                      <th>Giá (VNĐ)</th>
                      <th>Số lượt đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRooms.map((room, index) => (
                      <tr key={room.id} className="hover:bg-gray-50 transition">
                        <td className="text-center">{index + 1}</td>

                        <td>
                          <img
                            src={room.imageUrl || "/default-room.jpg"}
                            alt={room.name}
                            style={styles.image}
                          />
                        </td>

                        <td className="font-semibold text-gray-800 flex items-center gap-2">
                          <Home size={16} className="text-indigo-600" />
                          {room.name}
                        </td>

                        <td className="text-gray-600 flex items-center gap-2">
                          <MapPin size={16} className="text-pink-500" />
                          {room.location}
                        </td>

                        <td className="text-blue-600 font-semibold">
                          {room.price.toLocaleString()} VNĐ
                        </td>

                        <td className="text-green-600 font-semibold flex items-center justify-center gap-1">
                          <BedDouble size={16} />
                          {room.totalBookings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    style={{
                      ...styles.pageButton,
                      background: i + 1 === currentPage ? "#4F46E5" : "white",
                      color: i + 1 === currentPage ? "white" : "#4F46E5",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default MyRoomAnalytics;

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
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: "8px",
  },
  summaryCard: {
    background: "#EEF2FF",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    marginBottom: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  summaryTitle: {
    fontSize: "1.2rem",
    color: "#4F46E5",
  },
  summaryValue: {
    fontSize: "2.4rem",
    fontWeight: 700,
    color: "#312E81",
    marginTop: "10px",
  },
  tableWrapper: {
    overflowX: "auto",
    background: "#FFF",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  image: {
    width: "70px",
    height: "70px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    color: "#111827",
    fontWeight: 500,
  },
  locationCell: {
    display: "flex",
    alignItems: "center",
    color: "#6B7280",
  },
  pagination: {
    marginTop: "25px",
    textAlign: "center",
  },
  pageButton: {
    margin: "0 5px",
    padding: "6px 12px",
    border: "1px solid #4F46E5",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s",
  },
  loading: {
    textAlign: "center",
    color: "#6B7280",
  },
  error: {
    textAlign: "center",
    color: "#DC2626",
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
  },
};
