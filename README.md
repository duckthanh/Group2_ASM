# 🏠 WEBSITE TÌM TRỌ - Group 6

## 📋 Mô Tả Dự Án

Hệ thống tìm trọ trực tuyến với đầy đủ chức năng quản lý phòng trọ, đặt phòng, và quản lý người dùng.

## 🚀 Công Nghệ Sử Dụng

### Backend
- **Java 17** + **Spring Boot 3.5.6**
- **Spring Security** + **JWT Authentication**
- **JPA/Hibernate** + **MySQL**
- **BCrypt** password encryption

### Frontend
- **React 18** + **Vite**
- **React Router** v6
- **Axios** for API calls
- **CSS3** với gradients và glassmorphism

## 📦 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/duckthanh/Group6_ASM.git
cd Group6_ASM
```

### 2. Cấu Hình Database

Tạo database MySQL:

```sql
CREATE DATABASE tim_tro;
```

Cấu hình trong `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tim_tro
    username: root
    password: your_password
```

### 3. Chạy Backend

```bash
# Clean và compile
./mvnw clean compile

# Chạy Spring Boot
./mvnw spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### 4. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 👤 Tạo Tài Khoản Admin

Chạy SQL trong MySQL Workbench:

```sql
USE tim_tro;

INSERT INTO users (username, email, password, phone_number, address, role, status) 
VALUES (
    'Admin', 
    'admin@timtro.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    '0123456789', 
    'Hà Nội', 
    'ADMIN',
    'ACTIVE'
);
```

**Đăng nhập:**
- Email: `admin@timtro.com`
- Password: `admin123`

## ✨ Tính Năng Chính

### Cho Người Dùng
- ✅ Đăng ký/Đăng nhập với JWT
- ✅ Tìm kiếm & lọc phòng trọ
- ✅ Xem chi tiết phòng
- ✅ Đặt phòng (cọc/thuê ngay)
- ✅ Quản lý phòng của mình
- ✅ Quản lý hồ sơ cá nhân

### Cho Admin
- ✅ Quản lý tất cả người dùng
- ✅ Xóa user, đổi quyền
- ✅ Sửa/xóa mọi phòng
- ✅ Quản lý tất cả bookings
- ✅ Thống kê hệ thống

## 📁 Cấu Trúc Thư Mục

```
Group6_ASM/
├── src/main/java/com/x/group2_timtro/
│   ├── controller/          # REST Controllers
│   ├── service/             # Business Logic
│   ├── repository/          # Data Access Layer
│   ├── entity/              # JPA Entities
│   ├── dto/                 # Data Transfer Objects
│   ├── configuration/       # Security & CORS Config
│   └── common/              # Constants & Enums
├── frontend/src/
│   ├── components/          # React Components
│   ├── pages/               # Page Components
│   ├── services/            # API Services
│   └── styles/              # CSS Files
└── uploads/images/          # Uploaded Images
```

## 🔐 Bảo Mật

- JWT Token authentication
- BCrypt password hashing
- CORS configuration
- Role-based access control (USER, ADMIN)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/create-admin` - Tạo admin

### Rooms
- `GET /api/rooms` - Xem tất cả phòng
- `GET /api/rooms/{id}` - Chi tiết phòng
- `POST /api/rooms` - Tạo phòng (authenticated)
- `PUT /api/rooms/{id}` - Sửa phòng
- `DELETE /api/rooms/{id}` - Xóa phòng

### Users (Admin only)
- `GET /api/users` - Xem tất cả users
- `DELETE /api/users/{id}` - Xóa user
- `PUT /api/users/{id}/role` - Đổi quyền

### Bookings
- `POST /api/bookings` - Đặt phòng
- `GET /api/bookings/my-bookings` - Bookings của tôi
- `PUT /api/bookings/{id}/confirm` - Xác nhận
- `PUT /api/bookings/{id}/cancel` - Hủy

## 👥 Nhóm Phát Triển

**Group 6 - Website Tìm Trọ**

## 📄 License

This project is for educational purposes.

## 🐛 Báo Lỗi

Nếu gặp lỗi, vui lòng tạo issue trên GitHub.

---

**Created:** 2025
**Version:** 1.0.0

