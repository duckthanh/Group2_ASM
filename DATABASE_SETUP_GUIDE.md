# 📚 HƯỚNG DẪN CÀI ĐẶT DATABASE - TÌM TRỌ

## 📋 Mục lục
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cách 1: Sử dụng MySQL Workbench (Khuyến nghị)](#cách-1-mysql-workbench)
3. [Cách 2: Sử dụng Command Line](#cách-2-command-line)
4. [Cách 3: Sử dụng phpMyAdmin](#cách-3-phpmyadmin)
5. [Kiểm tra kết quả](#kiểm-tra-kết-quả)
6. [Tài khoản mẫu](#tài-khoản-mẫu)
7. [Cấu hình kết nối](#cấu-hình-kết-nối)
8. [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)

---

## 🔧 Yêu cầu hệ thống

- ✅ MySQL Server 5.7+ hoặc MySQL 8.0+
- ✅ MySQL Workbench (khuyến nghị) HOẶC Command Line
- ✅ Quyền root hoặc quyền tạo database

---

## 🎯 Cách 1: MySQL Workbench (Khuyến nghị)

### Bước 1: Mở MySQL Workbench
1. Khởi động **MySQL Workbench**
2. Click vào connection của bạn (thường là `localhost`)
3. Nhập password root nếu được yêu cầu

### Bước 2: Mở file SQL
1. Click menu **File** → **Open SQL Script...**
2. Chọn file `database_setup.sql`
3. File sẽ hiển thị trong editor

### Bước 3: Chạy script
1. Click vào icon ⚡ **Execute** (hoặc nhấn `Ctrl+Shift+Enter`)
2. Đợi khoảng 5-10 giây để script chạy xong
3. Kiểm tra **Output** tab để xem kết quả

### Bước 4: Kiểm tra
1. Refresh **Schemas** panel (bên trái)
2. Bạn sẽ thấy database `tim_tro` với 6 tables:
   - `users`
   - `rooms`
   - `bookings`
   - `documents`
   - `saved_rooms`
   - `room_reports`

---

## 💻 Cách 2: Command Line

### Windows:
```bash
# Mở Command Prompt hoặc PowerShell
cd C:\Users\phong\Downloads\timtro\Group6_timtro

# Chạy script (nhập password khi được yêu cầu)
mysql -u root -p < database_setup.sql
```

### Mac/Linux:
```bash
# Mở Terminal
cd /path/to/Group6_timtro

# Chạy script
mysql -u root -p < database_setup.sql
```

### Nếu gặp lỗi "mysql command not found":
```bash
# Windows - thêm MySQL vào PATH hoặc dùng đường dẫn đầy đủ:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database_setup.sql

# Mac - cài MySQL qua Homebrew:
brew install mysql
```

---

## 🌐 Cách 3: phpMyAdmin

### Bước 1: Mở phpMyAdmin
1. Truy cập `http://localhost/phpmyadmin`
2. Đăng nhập với tài khoản root

### Bước 2: Import file
1. Click tab **Import**
2. Click **Choose File** → Chọn `database_setup.sql`
3. Cuộn xuống dưới → Click **Import**

### Bước 3: Kiểm tra
- Database `tim_tro` sẽ xuất hiện ở sidebar bên trái

---

## ✅ Kiểm tra kết quả

### Cách 1: Trong MySQL Workbench
```sql
USE tim_tro;

-- Kiểm tra số lượng dữ liệu
SELECT 'Users' as TableName, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings;
```

**Kết quả mong đợi:**
```
Users: 4
Rooms: 5
Bookings: 2
```

### Cách 2: Xem dữ liệu mẫu
```sql
-- Xem danh sách users
SELECT id, username, email, role FROM users;

-- Xem danh sách phòng
SELECT id, name, price, location FROM rooms;
```

---

## 👤 Tài khoản mẫu

Sử dụng các tài khoản sau để test hệ thống:

### 1. ADMIN
```
Email: admin@timtro.com
Password: 123456
Quyền: Quản trị toàn bộ hệ thống
```

### 2. LANDLORD (Chủ trọ)
```
Email: landlord1@gmail.com
Password: 123456
Quyền: Đăng phòng, quản lý booking
```

### 3. TENANT (Người thuê)
```
Email: tenant1@gmail.com
Password: 123456
Quyền: Tìm phòng, đặt phòng, lưu phòng
```

### 4. USER
```
Email: user1@gmail.com
Password: 123456
Quyền: Người dùng thông thường
```

---

## ⚙️ Cấu hình kết nối

### File: `src/main/resources/application.properties`

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/tim_tro?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

⚠️ **LƯU Ý:** Thay `YOUR_MYSQL_PASSWORD` bằng password MySQL của bạn!

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi 1: "Access denied for user 'root'@'localhost'"
**Nguyên nhân:** Password sai hoặc user không có quyền

**Giải pháp:**
```sql
-- Reset password root (chạy trong MySQL)
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Lỗi 2: "Database 'tim_tro' already exists"
**Giải pháp:** Script tự động xóa database cũ. Nếu vẫn lỗi:
```sql
DROP DATABASE tim_tro;
-- Sau đó chạy lại script
```

### Lỗi 3: "Unknown database 'tim_tro'"
**Nguyên nhân:** Database chưa được tạo

**Giải pháp:** Chạy lại file `database_setup.sql`

### Lỗi 4: "Table 'tim_tro.users' doesn't exist"
**Nguyên nhân:** Tables chưa được tạo

**Giải pháp:**
```sql
USE tim_tro;
SOURCE database_setup.sql;
```

### Lỗi 5: Backend không kết nối được database
**Kiểm tra:**
1. MySQL server đang chạy: `services.msc` (Windows) → MySQL80
2. Port 3306 đang mở
3. File `application.properties` đúng cấu hình

**Test kết nối:**
```bash
mysql -u root -p -h localhost -P 3306
```

---

## 📊 Cấu trúc Database

### Sơ đồ quan hệ:
```
users (1) ←→ (*) rooms
users (1) ←→ (*) bookings
rooms (1) ←→ (*) bookings
bookings (1) ←→ (*) documents
users (*) ←→ (*) saved_rooms (←→) rooms
users (1) ←→ (*) room_reports
```

### Các tables chính:

| Table | Mô tả | Số dòng mẫu |
|-------|-------|-------------|
| `users` | Người dùng | 4 |
| `rooms` | Phòng trọ | 5 |
| `bookings` | Đơn đặt phòng | 2 |
| `documents` | Tài liệu | 0 |
| `saved_rooms` | Phòng đã lưu | 3 |
| `room_reports` | Báo cáo phòng | 0 |

---

## 🚀 Bước tiếp theo

Sau khi setup database thành công:

1. ✅ Kiểm tra backend có kết nối được database
2. ✅ Khởi động backend: `.\mvnw.cmd spring-boot:run`
3. ✅ Khởi động frontend: `npm run dev`
4. ✅ Đăng nhập bằng tài khoản mẫu
5. ✅ Test các chức năng:
   - Tìm kiếm phòng
   - Đăng phòng mới
   - Đặt phòng
   - Lưu phòng
   - Quản lý booking

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra lại các bước trong hướng dẫn
2. Xem phần "Xử lý lỗi thường gặp"
3. Kiểm tra logs của backend
4. Liên hệ team support

---

**Chúc bạn setup thành công! 🎉**

