# 🏠 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ PHÒNG TRỌ

## 📋 MỤC LỤC
1. [Tính năng đã hoàn thành](#tính-năng-đã-hoàn-thành)
2. [Cấu trúc Backend](#cấu-trúc-backend)
3. [Cấu trúc Frontend](#cấu-trúc-frontend)
4. [Hướng dẫn chạy ứng dụng](#hướng-dẫn-chạy-ứng-dụng)
5. [API Endpoints](#api-endpoints)
6. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)

---

## ✅ TÍNH NĂNG ĐÃ HOÀN THÀNH

### Backend (Spring Boot)
✅ **Entity:**
- `User` - Quản lý người dùng
- `Room` - Quản lý phòng trọ (tên, ảnh, detail, giá, vị trí, liên hệ)
- `Booking` - Quản lý đặt phòng (thời hạn, đơn vị, ngày dọn vào, số người, SĐT, ghi chú)

✅ **Repository:**
- `UserRepository`
- `RoomRepository`
- `BookingRepository`

✅ **Service:**
- `AuthenticationService` - Xử lý đăng nhập/đăng ký
- `UserService` - Quản lý người dùng
- `RoomService` - CRUD phòng trọ
- `BookingService` - CRUD đặt phòng

✅ **Controller:**
- `AuthController` - API authentication
- `RoomController` - API quản lý phòng
- `BookingController` - API đặt phòng

### Frontend (React + Vite)
✅ **Components:**
- `CreateRoom` - Modal thêm phòng trọ mới
- `RentRoom` - Modal thuê phòng/đặt cọc
- `Navbar`, `Footer`, `GlowEffects`

✅ **Pages:**
- `Home` - Trang chủ
- `Login` - Đăng nhập
- `Register` - Đăng ký
- `RoomList` - Danh sách phòng trọ (có nút Thuê ngay & Đặt cọc)

✅ **Features:**
- Authentication (đăng nhập/đăng ký)
- Thêm phòng trọ (chỉ khi đã đăng nhập)
- Xem danh sách phòng trọ
- Thuê ngay / Đặt cọc phòng

---

## 🏗️ CẤU TRÚC BACKEND

```
src/main/java/com/x/group2_timtro/
├── controller/
│   ├── AuthController.java        # Login, Register
│   ├── RoomController.java        # CRUD phòng trọ
│   ├── BookingController.java     # CRUD đặt phòng
│   └── UserController.java
├── entity/
│   ├── User.java
│   ├── Room.java                  # Thông tin phòng trọ
│   └── Booking.java               # Thông tin đặt phòng
├── repository/
│   ├── UserRepository.java
│   ├── RoomRepository.java
│   └── BookingRepository.java
├── service/
│   ├── AuthenticationService.java
│   ├── UserService.java
│   ├── RoomService.java
│   └── BookingService.java
└── dto/
    ├── request/
    │   ├── CreateRoomRequest.java
    │   ├── UpdateRoomRequest.java
    │   └── CreateBookingRequest.java
    └── response/
        ├── RoomResponse.java
        └── BookingResponse.java
```

---

## 🎨 CẤU TRÚC FRONTEND

```
frontend/src/
├── components/
│   ├── CreateRoom.jsx          # Modal tạo phòng trọ
│   ├── CreateRoom.css
│   ├── RentRoom.jsx            # Modal thuê phòng
│   ├── RentRoom.css
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── GlowEffects.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── RoomList.jsx            # Trang thuê phòng trọ
├── services/
│   └── api.js                  # API calls
└── App.jsx
```

---

## 🚀 HƯỚNG DẪN CHẠY ỨNG DỤNG

### 1. Chuẩn bị Database
```sql
CREATE DATABASE tim_tro;
```

Cập nhật thông tin database trong `src/main/resources/application.yaml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tim_tro
    username: root
    password: YOUR_PASSWORD
```

### 2. Chạy Backend
```bash
# Từ thư mục gốc của project
./mvnw spring-boot:run

# Hoặc trên Windows
mvnw.cmd spring-boot:run
```

Backend sẽ chạy ở: `http://localhost:8080`

### 3. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy ở: `http://localhost:5173`

---

## 📡 API ENDPOINTS

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Room (Phòng Trọ)
- `GET /api/rooms` - Lấy tất cả phòng
- `GET /api/rooms/available` - Lấy phòng còn trống
- `GET /api/rooms/{id}` - Lấy chi tiết phòng
- `GET /api/rooms/my-rooms` - Lấy phòng của tôi (cần header X-User-Id)
- `POST /api/rooms` - Tạo phòng mới (cần header X-User-Id)
- `PUT /api/rooms/{id}` - Cập nhật phòng (cần header X-User-Id)
- `DELETE /api/rooms/{id}` - Xóa phòng (cần header X-User-Id)

### Booking (Đặt Phòng)
- `POST /api/bookings` - Tạo booking mới (cần header X-User-Id)
- `GET /api/bookings/my-bookings` - Lấy booking của tôi (cần header X-User-Id)
- `GET /api/bookings/room/{roomId}` - Lấy booking của phòng
- `PUT /api/bookings/{id}/confirm` - Xác nhận booking (cần header X-User-Id)
- `PUT /api/bookings/{id}/cancel` - Hủy booking (cần header X-User-Id)

---

## 📖 HƯỚNG DẪN SỬ DỤNG

### 1. Đăng ký tài khoản
1. Truy cập `http://localhost:5173`
2. Click "Đăng ký" ở góc phải
3. Điền thông tin: Username, Email, Password
4. Click "Đăng ký"

### 2. Đăng nhập
1. Sau khi đăng ký, click "Đăng nhập"
2. Nhập Email và Password
3. Click "Đăng nhập"

### 3. Thêm phòng trọ mới
1. Đăng nhập vào hệ thống
2. Vào trang "Thuê Phòng Trọ"
3. Click nút "➕ Thêm Phòng Trọ"
4. Điền thông tin trong form:
   - **Tên Phòng Trọ** (*)
   - **Link Ảnh** (optional)
   - **Mô Tả Chi Tiết** (optional)
   - **Giá Phòng** (*) - VNĐ/tháng
   - **Vị Trí** (*) - Địa chỉ đầy đủ
   - **Liên Hệ** (*) - SĐT + Tên chủ trọ
5. Click "Tạo Phòng Trọ"

### 4. Thuê phòng ngay
1. Đăng nhập vào hệ thống
2. Vào trang "Thuê Phòng Trọ"
3. Chọn phòng muốn thuê
4. Click nút "🏠 Thuê ngay"
5. Điền thông tin:
   - **Thời Hạn Thuê** (*) - Số
   - **Đơn Vị** (*) - Tháng hoặc Năm
   - **Ngày Dọn Vào** (*)
   - **Số Người** (*) - Tối đa 3 người
   - **Số Điện Thoại** (*)
   - **Ghi Chú** (optional)
6. Click "Xác Nhận Thuê Phòng"

### 5. Đặt cọc phòng
1. Tương tự như Thuê phòng
2. Nhưng click nút "💰 Đặt cọc" thay vì "Thuê ngay"
3. Điền thông tin tương tự
4. Click "Xác Nhận Đặt Cọc"

---

## 🔧 LƯU Ý QUAN TRỌNG

1. **Authentication:**
   - User ID được lưu trong localStorage với key `user`
   - Mỗi request đến Room/Booking API cần header `X-User-Id`

2. **Validation:**
   - Số người thuê tối đa: 3
   - Chỉ chủ phòng mới có thể sửa/xóa phòng của mình
   - Chỉ chủ phòng mới có thể xác nhận booking

3. **Database:**
   - Hibernate tự động tạo/cập nhật bảng (ddl-auto: update)
   - Có 3 bảng: users, rooms, bookings

4. **CORS:**
   - Backend đã cấu hình CORS cho tất cả origins (*)
   - Có thể thu hẹp lại trong production

---

## 🎯 CÁC TÍNH NĂNG NÂNG CAO CÓ THỂ BỔ SUNG

- [ ] Upload ảnh thật (hiện tại dùng URL)
- [ ] Search và filter phòng
- [ ] Xem lịch sử booking
- [ ] Đánh giá và nhận xét phòng
- [ ] Thanh toán online
- [ ] Thông báo real-time
- [ ] Chat giữa người thuê và chủ phòng

---

## 🐛 TROUBLESHOOTING

### Lỗi kết nối database
```
Kiểm tra:
- MySQL đã chạy chưa?
- Database 'tim_tro' đã tạo chưa?
- Username/password trong application.yaml đúng chưa?
```

### Lỗi 401/403
```
Kiểm tra:
- Đã đăng nhập chưa?
- LocalStorage có user data không?
- Header X-User-Id có được gửi không?
```

### Frontend không gọi được API
```
Kiểm tra:
- Backend đã chạy chưa? (http://localhost:8080)
- CORS có được cấu hình đúng không?
- API URL trong frontend/src/services/api.js đúng chưa?
```

---

## 👨‍💻 PHÁT TRIỂN BỞI

Group 2 - ASM Project
- Database: MySQL
- Backend: Spring Boot 3.5.6 + Java 21
- Frontend: React 18 + Vite

---

**Chúc bạn sử dụng hệ thống thành công! 🎉**

