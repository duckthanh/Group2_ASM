# 🏠 WEBSITE TÌM TRỌ - GROUP 6

Ứng dụng web quản lý và cho thuê phòng trọ được xây dựng bằng Spring Boot và React.

## 🚀 Công Nghệ Sử Dụng

### Backend
- ☕ Java 21
- 🍃 Spring Boot 3.5.6
- 🗄️ MySQL Database
- 📦 Maven
- 🔐 Spring Security

### Frontend
- ⚛️ React 18
- ⚡ Vite
- 🎨 CSS3 (Modern Design)
- 🔗 Axios

## ✨ Tính Năng Chính

✅ **Xác thực người dùng**
- Đăng ký tài khoản
- Đăng nhập/Đăng xuất

✅ **Quản lý phòng trọ**
- Thêm phòng trọ mới (yêu cầu đăng nhập)
- Xem danh sách phòng trọ
- Cập nhật/Xóa phòng trọ (chỉ chủ phòng)

✅ **Thuê phòng**
- Thuê ngay
- Đặt cọc
- Quản lý booking
- Xác nhận/Hủy booking

## 📂 Cấu Trúc Project

```
Group2_ASM/
├── src/main/java/          # Backend Spring Boot
│   └── com/x/group2_timtro/
│       ├── controller/     # REST API Controllers
│       ├── entity/         # Database Entities
│       ├── repository/     # JPA Repositories
│       ├── service/        # Business Logic
│       └── dto/            # Data Transfer Objects
├── frontend/               # Frontend React
│   └── src/
│       ├── components/     # React Components
│       ├── pages/          # Page Components
│       └── services/       # API Services
└── HUONG_DAN_SU_DUNG.md   # Hướng dẫn chi tiết
```

## 🏃‍♂️ Cách Chạy Ứng Dụng

### 1. Chuẩn bị Database
```sql
CREATE DATABASE tim_tro;
```

Cập nhật thông tin trong `src/main/resources/application.yaml`

### 2. Chạy Backend
```bash
./mvnw spring-boot:run
```
Backend chạy tại: `http://localhost:8080`

### 3. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend chạy tại: `http://localhost:3000`

## 📖 Hướng Dẫn Sử Dụng

Xem chi tiết trong file [HUONG_DAN_SU_DUNG.md](./HUONG_DAN_SU_DUNG.md)

### Quy trình cơ bản:

1. **Đăng ký** tài khoản mới
2. **Đăng nhập** vào hệ thống
3. **Thêm phòng trọ** (nút "Thêm Phòng Trọ")
   - Điền: Tên, Ảnh, Giá, Vị trí, Liên hệ
4. **Thuê phòng** (nút "Thuê ngay" hoặc "Đặt cọc")
   - Điền: Thời hạn, Ngày dọn vào, Số người, SĐT

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Rooms
- `GET /api/rooms/available` - Lấy phòng còn trống
- `POST /api/rooms` - Tạo phòng mới
- `PUT /api/rooms/{id}` - Cập nhật phòng
- `DELETE /api/rooms/{id}` - Xóa phòng

### Bookings
- `POST /api/bookings` - Tạo booking
- `GET /api/bookings/my-bookings` - Xem booking của tôi
- `PUT /api/bookings/{id}/confirm` - Xác nhận booking
- `PUT /api/bookings/{id}/cancel` - Hủy booking

## 🎨 Screenshots

### Trang chủ
Modern UI với gradient effects và animations

### Trang thuê phòng trọ
- Card hiển thị thông tin phòng
- Nút "Thuê ngay" và "Đặt cọc"
- Modal form đẹp mắt

### Form thêm phòng
- Giao diện hiện đại
- Validation đầy đủ
- Preview ảnh

## 👥 Nhóm Phát Triển

**Group 6 - Website Tìm Trọ**

## 📄 License

This project is for educational purposes.

---

**🌟 Hãy star repo này nếu bạn thấy hữu ích!**

