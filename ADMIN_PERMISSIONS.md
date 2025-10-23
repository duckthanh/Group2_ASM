# Quyền Hạn Admin - Hệ Thống Tìm Trọ

## Tổng Quan
Admin có **toàn quyền** trên tất cả các chức năng của hệ thống.

## 1. Quản Lý Người Dùng

### Xem & Tìm Kiếm
- **GET** `/api/users` - Xem tất cả người dùng
- **GET** `/api/users/{userId}` - Xem chi tiết user
- Tìm kiếm theo tên, email, SĐT, địa chỉ

### Cập Nhật & Phân Quyền
- **PUT** `/api/users/{userId}` - Cập nhật thông tin user
- **PUT** `/api/users/{userId}/role` - Đổi quyền USER ↔ ADMIN
- **PUT** `/api/users/{userId}/change-password` - Đổi mật khẩu (không cần mật khẩu cũ)

### Xóa User
- **DELETE** `/api/users/{userId}` - Xóa user
- ⚠️ Không thể xóa chính mình

## 2. Quản Lý Phòng Trọ

### Toàn Quyền
- Sửa/xóa **BẤT KỲ** phòng nào
- **GET** `/api/rooms/admin/all` - Xem tất cả phòng (kể cả đã thuê)

## 3. Quản Lý Bookings

### Toàn Quyền
- **GET** `/api/bookings` - Xem tất cả bookings
- **PUT** `/api/bookings/{id}/confirm` - Confirm bất kỳ booking nào  
- **PUT** `/api/bookings/{id}/cancel` - Cancel bất kỳ booking nào
- **DELETE** `/api/bookings/{id}` - Xóa booking

## Tạo Admin

```sql
INSERT INTO users (username, email, password, phone_number, address, role, status) 
VALUES ('Admin', 'admin@timtro.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0123456789', 'Hà Nội', 'ADMIN', 'ACTIVE');
```

**Login:** admin@timtro.com / admin123

