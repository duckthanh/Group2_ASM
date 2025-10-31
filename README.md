<<<<<<< HEAD
# 🏠 WEBSITE TÌM TRỌ - GROUP 6
=======
# 🏠 TÌM TRỌ - Hệ thống quản lý phòng trọ
>>>>>>> origin/phong28

## 📖 Giới thiệu

**Tìm Trọ** là một ứng dụng web fullstack giúp kết nối người tìm trọ với chủ nhà trọ. Hệ thống cung cấp các tính năng:

<<<<<<< HEAD
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

Spring Boot sử dụng Hibernate với `ddl-auto: update`, nên các bảng cơ bản sẽ **TỰ ĐỘNG** được tạo khi chạy lần đầu. Tuy nhiên, bạn vẫn cần:
1. Tạo database
2. Chạy các file SQL cho features mới
3. Tạo tài khoản admin

---

### Bước 1: Tạo Database
```sql
CREATE DATABASE tim_tro 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### Bước 2: Cấu hình kết nối (nếu cần)
Mở file `src/main/resources/application.yaml` và kiểm tra/cập nhật:

```yaml
datasource:
  url: jdbc:mysql://localhost:3306/tim_tro
  username: root
  password: password MySQL của bạn
```

### Bước 3: Chạy Backend lần đầu
```bash
./mvnw spring-boot:run
```

✅ **Hibernate sẽ tự động tạo các bảng cơ bản:**
- `users`
- `rooms`
- `bookings`
- Và các bảng khác trong entities

Tôi đã tạo file SQL tổng hợp bên dưới. Chỉ cần chạy 1 lần duy nhất!

```sql
-- =====================================================
-- COMPLETE DATABASE SETUP FOR TÌM TRỌ
-- Chạy file này SAU KHI đã chạy Backend lần đầu
-- =====================================================

USE tim_tro;

-- =====================================================
-- 1. CREATE ADDITIONAL TABLES
-- =====================================================

-- Saved Rooms Table
CREATE TABLE IF NOT EXISTS saved_rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    saved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_saved_at (user_id, saved_at DESC),
    INDEX idx_room_id (room_id),
    UNIQUE KEY unique_user_room (user_id, room_id),
    CONSTRAINT fk_saved_rooms_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_rooms_room FOREIGN KEY (room_id) 
        REFERENCES rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Room Reports Table
CREATE TABLE IF NOT EXISTS room_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    INDEX idx_room_reported_at (room_id, reported_at DESC),
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_status_reported_at (status, reported_at DESC),
    CONSTRAINT fk_room_reports_room FOREIGN KEY (room_id) 
        REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_room_reports_reporter FOREIGN KEY (reporter_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_report_reason CHECK (reason IN ('spam', 'wrong_price', 'fake_images', 'other')),
    CONSTRAINT chk_report_status CHECK (status IN ('PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Viewing Schedules Table
CREATE TABLE IF NOT EXISTS viewing_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    viewing_date DATE NOT NULL,
    viewing_time TIME NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    INDEX idx_user_viewing_date (user_id, viewing_date DESC),
    INDEX idx_room_viewing_date (room_id, viewing_date DESC),
    INDEX idx_status_viewing_date (status, viewing_date DESC),
    INDEX idx_room_date_time (room_id, viewing_date, viewing_time),
    CONSTRAINT fk_viewing_schedules_room FOREIGN KEY (room_id) 
        REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_viewing_schedules_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_schedule_status CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. ADD COST FIELDS TO ROOMS (if not exists)
-- =====================================================

-- Check and add electricity_cost column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'tim_tro' 
  AND TABLE_NAME = 'rooms' 
  AND COLUMN_NAME = 'electricity_cost';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE rooms ADD COLUMN electricity_cost INT DEFAULT 0 AFTER contact',
    'SELECT "electricity_cost column already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add water_cost column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'tim_tro' 
  AND TABLE_NAME = 'rooms' 
  AND COLUMN_NAME = 'water_cost';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE rooms ADD COLUMN water_cost INT DEFAULT 0 AFTER electricity_cost',
    'SELECT "water_cost column already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add internet_cost column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'tim_tro' 
  AND TABLE_NAME = 'rooms' 
  AND COLUMN_NAME = 'internet_cost';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE rooms ADD COLUMN internet_cost INT DEFAULT 0 AFTER water_cost',
    'SELECT "internet_cost column already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add parking_cost column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'tim_tro' 
  AND TABLE_NAME = 'rooms' 
  AND COLUMN_NAME = 'parking_cost';

SET @query = IF(@col_exists = 0,
    'ALTER TABLE rooms ADD COLUMN parking_cost INT DEFAULT 0 AFTER internet_cost',
    'SELECT "parking_cost column already exists" AS message');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 3. CREATE ADMIN ACCOUNT
-- =====================================================

-- Tắt safe update mode tạm thời
SET SQL_SAFE_UPDATES = 0;

-- Xóa admin cũ nếu có
DELETE FROM users WHERE email = 'admin@timtro.com';

-- Tạo admin account (password: admin123)
INSERT INTO users (username, email, password, phone_number, address, role) 
VALUES (
    'Admin', 
    'admin@timtro.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    '0123456789', 
    'Hà Nội', 
    'ADMIN'
);

-- Bật lại safe update mode
SET SQL_SAFE_UPDATES = 1;

-- =====================================================
-- 4. VERIFICATION
-- =====================================================

-- Show all tables
SHOW TABLES;

-- Count records
SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'rooms' AS table_name, COUNT(*) AS record_count FROM rooms
UNION ALL
SELECT 'bookings' AS table_name, COUNT(*) AS record_count FROM bookings
UNION ALL
SELECT 'saved_rooms' AS table_name, COUNT(*) AS record_count FROM saved_rooms
UNION ALL
SELECT 'room_reports' AS table_name, COUNT(*) AS record_count FROM room_reports
UNION ALL
SELECT 'viewing_schedules' AS table_name, COUNT(*) AS record_count FROM viewing_schedules;

-- =====================================================
-- DONE! DATABASE SETUP COMPLETE
-- =====================================================

SELECT '✅ Database setup completed successfully!' AS status;
SELECT '👤 Admin account created:' AS info;
SELECT '   Email: admin@timtro.com' AS credentials;
SELECT '   Password: admin123' AS credentials;
SELECT '⚠️  Remember to change admin password after first login!' AS warning;
```

---

## ✅ CHECKLIST SAU KHI SETUP

Chạy query sau để kiểm tra:

```sql
USE tim_tro;

-- Xem tất cả các bảng
SHOW TABLES;

-- Kết quả mong đợi (tối thiểu 6 bảng):
-- ✓ users
-- ✓ rooms  
-- ✓ bookings
-- ✓ saved_rooms
-- ✓ room_reports
-- ✓ viewing_schedules

-- Kiểm tra admin account
SELECT username, email, role FROM users WHERE role = 'ADMIN';
```

---

## 🎯 TÀI KHOẢN MẶC ĐỊNH

### Admin Account
- **Email:** `admin@timtro.com`
- **Password:** `admin123`
- **Role:** ADMIN

⚠️ **LƯU Ý:** Đổi mật khẩu admin ngay sau khi đăng nhập lần đầu!

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Table doesn't exist"
➡️ **Giải pháp:** Chạy lại Backend để Hibernate tạo bảng, sau đó chạy file SQL.

### Lỗi: "Foreign key constraint fails"
➡️ **Giải pháp:** Đảm bảo các bảng `users` và `rooms` đã tồn tại trước khi tạo các bảng features mới.

### Lỗi: "Access denied for user"
➡️ **Giải pháp:** Kiểm tra lại username/password trong `application.yaml`.

### Lỗi: "Unknown database 'tim_tro'"
➡️ **Giải pháp:** Chạy lại `CREATE DATABASE tim_tro;`

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. MySQL đã cài đặt và đang chạy
2. Database `tim_tro` đã được tạo
3. Thông tin kết nối trong `application.yaml` đúng
4. Backend đã chạy thành công lần đầu

---

**✨ Setup thành công? Bắt đầu sử dụng website tại `http://localhost:3000`**



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
=======
### 🎯 Tính năng chính:
- ✅ Tìm kiếm phòng trọ (flexible search - không cần chính xác từng chữ)
- ✅ Lọc phòng theo loại hình, giá, diện tích, tiện nghi
- ✅ Đăng phòng trọ với quản lý số lượng
- ✅ Đặt phòng và quản lý booking
- ✅ Upload tài liệu, thanh toán QR
- ✅ Lưu phòng yêu thích
- ✅ Báo cáo phòng
- ✅ Quản lý đặt cọc/thuê ngay
>>>>>>> origin/phong28

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
