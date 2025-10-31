# 🏠 TÌM TRỌ - Hệ thống quản lý phòng trọ

## 📖 Giới thiệu

**Tìm Trọ** là một ứng dụng web fullstack giúp kết nối người tìm trọ với chủ nhà trọ. Hệ thống cung cấp các tính năng:

### 🎯 Tính năng chính:
- ✅ Tìm kiếm phòng trọ (flexible search - không cần chính xác từng chữ)
- ✅ Lọc phòng theo loại hình, giá, diện tích, tiện nghi
- ✅ Đăng phòng trọ với quản lý số lượng
- ✅ Đặt phòng và quản lý booking
- ✅ Upload tài liệu, thanh toán QR
- ✅ Lưu phòng yêu thích
- ✅ Báo cáo phòng
- ✅ Quản lý đặt cọc/thuê ngay

---

## 🛠️ Công nghệ sử dụng

### Backend:
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**

### Frontend:
- **React 18**
- **React Router DOM**
- **Axios**
- **Vite**
- **Lucide React** (Icons)
- **React Hot Toast**

---

## 📋 Yêu cầu hệ thống

- ✅ **Java JDK 17+**
- ✅ **Node.js 18+** và **npm**
- ✅ **MySQL 8.0+**
- ✅ **Git**

---

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone project
```bash
git clone <repository-url>
cd Group6_timtro
```

### Bước 2: Setup Database

#### Option 1: Sử dụng MySQL Workbench (Khuyến nghị)
1. Mở MySQL Workbench
2. File → Open SQL Script → Chọn `database_setup.sql`
3. Click Execute (⚡)

#### Option 2: Command Line
```bash
mysql -u root -p < database_setup.sql
```

📖 **Chi tiết:** Xem file `DATABASE_SETUP_GUIDE.md`
và chạy file ở My SQL `database_setup.sql`

### Bước 3: Cấu hình Backend

#### 3.1. Cập nhật `src/main/resources/application.properties`:
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/tim_tro
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.expiration=86400000
```

⚠️ **Thay `YOUR_MYSQL_PASSWORD` bằng password MySQL của bạn!**

#### 3.2. Build và chạy Backend:
```bash
# Windows
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw clean install
./mvnw spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### Bước 4: Setup và chạy Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 👤 Tài khoản mẫu

Sử dụng các tài khoản sau để test:

| Loại | Email | Password | Quyền |
|------|-------|----------|-------|
| **Admin** | admin@timtro.com | 123456 | Quản trị viên |
| **Chủ trọ** | landlord1@gmail.com | 123456 | Đăng phòng, quản lý |
| **Người thuê** | tenant1@gmail.com | 123456 | Tìm phòng, đặt phòng |
| **User** | user1@gmail.com | 123456 | Người dùng |

---

## 📁 Cấu trúc project

```
Group6_timtro/
├── src/                          # Backend (Spring Boot)
│   ├── main/
│   │   ├── java/
│   │   │   └── com/x/group2_timtro/
│   │   │       ├── controller/   # REST API Controllers
│   │   │       ├── service/      # Business Logic
│   │   │       ├── repository/   # Database Access
│   │   │       ├── entity/       # JPA Entities
│   │   │       ├── dto/          # Data Transfer Objects
│   │   │       └── configuration/# Security, JWT config
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── frontend/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/           # React Components
│   │   ├── pages/                # Page Components
│   │   ├── services/             # API Services
│   │   ├── utils/                # Utilities
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── database_setup.sql            # SQL Setup Script
├── DATABASE_SETUP_GUIDE.md       # Hướng dẫn setup DB
├── README.md                     # File này
└── pom.xml                       # Maven configuration
```

---

## 🎮 Hướng dẫn sử dụng

### 1. Người tìm trọ:
1. Đăng ký/Đăng nhập
2. Tìm kiếm phòng (có thể gõ: "gần FPT", "thôn4", "ban công"...)
3. Lọc theo giá, diện tích, loại hình, tiện nghi
4. Xem chi tiết phòng
5. Lưu phòng yêu thích (❤️)
6. Đặt phòng (Thuê ngay hoặc Đặt cọc)
7. Upload chứng từ thanh toán
8. Theo dõi trạng thái booking

### 2. Chủ trọ:
1. Đăng nhập
2. Thêm phòng trọ mới
   - Upload hình ảnh
   - Điền thông tin: giá, diện tích, tiện nghi
   - **Nhập số lượng phòng** (mới!)
3. Quản lý phòng đã đăng
4. Xem yêu cầu booking
5. Xác nhận/Từ chối booking
6. Upload QR thanh toán
7. Xác nhận thanh toán từ người thuê

### 3. Admin:
1. Quản lý tất cả phòng
2. Quản lý users
3. Xem báo cáo phòng
4. Xóa/Chỉnh sửa bất kỳ dữ liệu nào

---

## 🔍 API Endpoints

### Authentication
```
POST   /auth/register          # Đăng ký
POST   /auth/login             # Đăng nhập
```

### Rooms
```
GET    /api/rooms              # Lấy danh sách phòng
GET    /api/rooms/{id}         # Chi tiết phòng
POST   /api/rooms              # Tạo phòng mới
PUT    /api/rooms/{id}         # Cập nhật phòng
DELETE /api/rooms/{id}         # Xóa phòng
GET    /api/rooms/search       # Tìm kiếm phòng
POST   /api/rooms/filter       # Lọc phòng
```

### Bookings
```
GET    /api/me/rooms           # Phòng đã đặt
GET    /api/me/rooms/posted    # Phòng đã đăng
GET    /api/me/rooms/{bookingId} # Chi tiết booking
POST   /api/me/rooms/{bookingId}/payment-qr     # Upload QR
POST   /api/me/rooms/{bookingId}/payment-proof  # Upload proof
POST   /api/me/rooms/{bookingId}/confirm-payment # Xác nhận
```

### Saved Rooms
```
GET    /api/saved-rooms        # Phòng đã lưu
POST   /api/saved-rooms/{roomId} # Lưu phòng
DELETE /api/saved-rooms/{roomId} # Bỏ lưu
```

📖 **Full API Documentation:** Xem Postman collection (nếu có)

---

## ⚡ Tính năng nổi bật

### 1. Flexible Search (Tìm kiếm linh hoạt)
- Không cần gõ chính xác: `"thôn4"` → tìm `"thôn 4"` ✅
- Không phân biệt HOA/thường: `"FPT"` = `"fpt"` ✅
- Tìm trong nhiều trường: tên, địa chỉ, mô tả, tiện nghi

### 2. Quản lý số lượng phòng
- Mỗi phòng có thể có nhiều đơn vị (vd: 10 phòng)
- Tự động giảm khi có người thuê
- Tự động chuyển "Hết phòng" khi số lượng = 0
- Tăng lại khi hủy booking

### 3. Payment QR & Documents
- Chủ trọ upload QR thanh toán
- Người thuê upload chứng từ
- Chủ trọ xác nhận thanh toán

---

## 🐛 Xử lý lỗi thường gặp

### 1. Backend không khởi động
```bash
# Kiểm tra Java version
java -version   # Phải >= 17

# Clean và rebuild
.\mvnw.cmd clean install
```

### 2. Frontend không kết nối Backend
- Kiểm tra Backend đang chạy: `http://localhost:8080`
- Kiểm tra CORS configuration trong `SecurityConfiguration.java`

### 3. Database connection error
- Kiểm tra MySQL đang chạy
- Kiểm tra username/password trong `application.properties`
- Test: `mysql -u root -p`

### 4. "NoClassDefFoundError"
```bash
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
```

---

## 📝 Changelog

### Version 1.0 (Latest)
- ✅ Flexible search algorithm
- ✅ Room quantity management
- ✅ Payment QR per booking
- ✅ Room availability badges
- ✅ Posted rooms tab
- ✅ Improved filter UI
- ❌ Removed viewing schedule feature

---

## 👥 Contributors

- **Team 6** - Group2_timtro
- Phong - Developer

---

## 📄 License

This project is licensed for educational purposes.

---

## 🆘 Support

Nếu gặp vấn đề:
1. Đọc kỹ `DATABASE_SETUP_GUIDE.md`
2. Kiểm tra logs của Backend
3. Kiểm tra Console của Frontend (F12)
4. Liên hệ team support

---

**Happy Coding! 🚀**

*Cập nhật lần cuối: 30/10/2025*
