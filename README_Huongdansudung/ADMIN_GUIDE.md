# Hướng dẫn sử dụng tài khoản Admin

## 🔐 Tạo tài khoản Admin

### Cách 1: Sử dụng API (Khuyến nghị)

1. **Khởi động backend:**
   ```bash
   ./mvnw spring-boot:run
   ```

2. **Gọi API tạo admin bằng PowerShell:**
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:8080/api/auth/create-admin" -Method POST
   ```

3. **Hoặc dùng cURL:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/create-admin
   ```

4. **Thông tin đăng nhập mặc định:**
   - Email: `admin@timtro.com`
   - Password: `admin123`

### Cách 2: Sử dụng SQL Script

1. Mở MySQL Workbench
2. Kết nối tới database `tim_tro`
3. Chạy file `create_admin.sql`

```sql
USE tim_tro;

INSERT INTO users (username, email, password, phone_number, address, role) 
VALUES (
    'admin', 
    'admin@timtro.com', 
    '$2a$10$8c6CxXxQxNxQxQxQxQxQxOeJ3c6CxXxQxNxQxQxQxQxQxQxQxQxQxO', 
    '0123456789', 
    'Hòa Lạc, Hà Nội', 
    'ADMIN'
)
ON DUPLICATE KEY UPDATE role = 'ADMIN';
```

## 👨‍💼 Quyền hạn của Admin

Admin có toàn quyền quản lý hệ thống:

### ✅ Quản lý phòng trọ
- ✨ Xem tất cả các phòng trọ
- ➕ Tạo phòng trọ mới
- ✏️ **Sửa bất kỳ phòng nào** (không cần là chủ phòng)
- 🗑️ **Xóa bất kỳ phòng nào** (không cần là chủ phòng)

### 👤 Phân biệt với User thường
- **User thường:** Chỉ sửa/xóa được phòng của chính mình
- **Admin:** Có thể sửa/xóa mọi phòng trong hệ thống

## 🎨 Giao diện Admin

### Badge hiển thị
- Admin sẽ thấy badge **"ADMIN"** màu cam phát sáng bên cạnh tên trong navbar
- Badge có hiệu ứng pulse để dễ nhận biết

### Nút xóa phòng
- Admin sẽ thấy nút "Xóa phòng" 🗑️ trên **TẤT CẢ** các phòng
- User thường chỉ thấy nút xóa trên phòng của họ

## 🔒 Bảo mật

### ⚠️ Lưu ý quan trọng
1. **Đổi mật khẩu ngay sau khi đăng nhập lần đầu!**
   - Vào Profile → Đổi mật khẩu
   - Đặt mật khẩu mạnh (ít nhất 8 ký tự, có chữ hoa, chữ thường, số)

2. **Không chia sẻ tài khoản admin**
   - Chỉ cấp quyền admin cho người đáng tin cậy
   - Mỗi admin nên có tài khoản riêng

3. **Kiểm tra hoạt động định kỳ**
   - Theo dõi log trong backend
   - Kiểm tra các phòng bị xóa/sửa

## 🛠️ Troubleshooting

### Không tạo được admin qua API
```
Error: Admin account already exists
```
**Giải pháp:** Admin đã tồn tại, sử dụng thông tin đăng nhập mặc định

### Badge "ADMIN" không hiển thị
**Kiểm tra:**
1. Đăng xuất và đăng nhập lại
2. Clear cache trình duyệt (Ctrl + Shift + R)
3. Kiểm tra trong database: `SELECT * FROM users WHERE role = 'ADMIN';`

### Không thấy nút xóa trên tất cả phòng
**Kiểm tra:**
1. Role trong localStorage: Mở Console (F12) → Application → Local Storage → user → role phải là "ADMIN"
2. Hard refresh (Ctrl + Shift + R)

## 📊 Kiểm tra database

```sql
-- Xem tất cả admin
SELECT * FROM users WHERE role = 'ADMIN';

-- Đổi user thường thành admin
UPDATE users SET role = 'ADMIN' WHERE email = 'user@example.com';

-- Đổi admin về user thường
UPDATE users SET role = 'USER' WHERE email = 'admin@timtro.com';
```

## 🎯 Best Practices

1. **Luôn có ít nhất 1 admin**
2. **Backup database trước khi xóa nhiều phòng**
3. **Ghi log các hành động quan trọng**
4. **Kiểm tra kỹ trước khi xóa phòng**
5. **Đổi mật khẩu admin định kỳ (mỗi 3 tháng)**

---

**📝 Lưu ý:** Hệ thống chỉ phân biệt 2 role: `USER` và `ADMIN`. Không có role trung gian.

