# Thông tin chủ trọ & Chức năng sửa phòng

## 📋 Tổng quan

Đã bổ sung tính năng hiển thị thông tin chi tiết người tạo phòng trọ và cho phép Admin/Chủ phòng sửa thông tin phòng trọ.

## ✨ Các tính năng mới

### 1. **Hiển thị thông tin người tạo phòng**
- Avatar người tạo (chữ cái đầu của username)
- Tên người tạo
- Số điện thoại liên hệ
- Email (nếu có)
- Card riêng biệt với thiết kế hiện đại

### 2. **Chức năng sửa phòng**
- Nút "Sửa phòng" chỉ hiển thị cho:
  - Admin (có thể sửa mọi phòng)
  - Chủ phòng (chỉ sửa được phòng của mình)
- Modal sửa phòng với form đầy đủ các trường
- Validation dữ liệu
- Upload ảnh mới
- Preview ảnh trước khi upload

## 🎨 Frontend Changes

### Các file mới
- **`frontend/src/components/EditRoom.jsx`** - Component modal sửa phòng
- **`frontend/src/components/EditRoom.css`** - Style cho modal

### Các file đã cập nhật
- **`frontend/src/pages/RoomDetail.jsx`**
  - Import `EditRoom` component và icon `Edit`
  - Thêm state `showEditModal`
  - Thêm function `canManageRoom()` để check quyền
  - Thêm function `handleEditRoom()`
  - Thêm section "Thông tin chủ trọ" với nút "Sửa phòng"
  - Tích hợp EditRoom modal

- **`frontend/src/pages/RoomDetail.css`**
  - Style cho `.owner-info-card`
  - Style cho `.owner-card-header`
  - Style cho `.btn-edit-room`
  - Style cho `.host-email`
  - Cập nhật `.host-phone` để hiển thị icon

## 🔧 Backend Changes

### Các file đã cập nhật

#### 1. **`UpdateRoomRequest.java`**
Thêm các trường mới:
```java
private String roomType;
private Double area;
private Integer capacity;
private String amenities;
private String availability;
```

#### 2. **`RoomService.java`**
Cập nhật method `updateRoom()` để xử lý các trường mới:
- `roomType` - Loại hình phòng
- `area` - Diện tích (m²)
- `capacity` - Sức chứa (số người)
- `amenities` - Tiện nghi
- `availability` - Tình trạng chi tiết

## 🎯 Các trường có thể sửa

### Thông tin cơ bản
- ✅ Tên phòng
- ✅ Giá thuê (VNĐ/tháng)
- ✅ Địa chỉ
- ✅ Số điện thoại liên hệ

### Hình ảnh
- ✅ Upload ảnh mới
- ✅ Preview ảnh

### Thông tin chi tiết
- ✅ Loại hình (Nhà trọ/Nhà nguyên căn/Căn hộ)
- ✅ Diện tích (m²)
- ✅ Sức chứa (người)
- ✅ Mô tả chi tiết
- ✅ Tiện nghi (phân cách bằng dấu phẩy)

### Tình trạng
- ✅ Tình trạng chi tiết (Còn trống/Sắp trống/Đã cho thuê)
- ✅ Checkbox "Phòng còn trống"

## 🔐 Kiểm soát quyền

### Quyền sửa phòng
```javascript
const canManageRoom = () => {
  if (!currentUser || !room) return false
  return currentUser.role === 'ADMIN' || currentUser.id === room.ownerId
}
```

### Backend Permission Check
```java
// Admin có thể cập nhật bất kỳ phòng nào
// User thường chỉ cập nhật được phòng của mình
if (!"ADMIN".equals(user.getRole()) && room.getOwner().getId() != userId) {
    throw new RuntimeException("You don't have permission to update this room");
}
```

## 📸 UI/UX Features

### Owner Info Card
- Avatar tròn với gradient màu
- Icon Phone và MessageCircle
- Layout sạch sẽ, dễ đọc
- Nút "Sửa phòng" nổi bật (primary color)

### Edit Room Modal
- Modal toàn màn hình responsive
- Scroll riêng cho nội dung form
- Chia sections rõ ràng:
  - Thông tin cơ bản
  - Hình ảnh
  - Thông tin chi tiết
  - Tình trạng
- Validation đầy đủ
- Loading states (uploading, saving)
- Preview ảnh trước khi upload

### Form Validation
- ✅ Các trường bắt buộc có dấu `*` màu đỏ
- ✅ Validation khi submit
- ✅ Hiển thị lỗi bằng toast
- ✅ Disable button khi đang upload/save

## 🧪 Cách test

### 1. Test hiển thị thông tin chủ trọ
1. Truy cập trang chi tiết phòng bất kỳ
2. Kiểm tra section "Thông tin chủ trọ"
3. Xác nhận hiển thị:
   - Avatar
   - Tên người tạo
   - Số điện thoại
   - Email (nếu có)

### 2. Test quyền sửa phòng

#### Với Admin:
1. Đăng nhập bằng tài khoản Admin
2. Vào chi tiết bất kỳ phòng nào
3. Kiểm tra nút "Sửa phòng" xuất hiện
4. Click vào và thử sửa

#### Với Chủ phòng:
1. Đăng nhập bằng tài khoản user đã tạo phòng
2. Vào chi tiết phòng của mình
3. Kiểm tra nút "Sửa phòng" xuất hiện
4. Vào chi tiết phòng của người khác
5. Kiểm tra nút "Sửa phòng" KHÔNG xuất hiện

#### Với User thường:
1. Đăng nhập bằng tài khoản user bình thường
2. Vào chi tiết bất kỳ phòng nào
3. Kiểm tra nút "Sửa phòng" KHÔNG xuất hiện

### 3. Test chức năng sửa phòng

#### Test form cơ bản:
1. Click nút "Sửa phòng"
2. Modal hiển thị với dữ liệu hiện tại
3. Thử sửa từng trường
4. Click "Lưu thay đổi"
5. Kiểm tra toast thành công
6. Kiểm tra dữ liệu đã được cập nhật

#### Test upload ảnh:
1. Mở modal "Sửa phòng"
2. Click chọn file ảnh
3. Kiểm tra preview ảnh
4. Kiểm tra hiển thị "Đang upload..."
5. Sau khi upload thành công, click "Lưu thay đổi"
6. Kiểm tra ảnh mới hiển thị

#### Test validation:
1. Mở modal "Sửa phòng"
2. Xóa các trường bắt buộc (tên, giá, địa chỉ, SĐT)
3. Click "Lưu thay đổi"
4. Kiểm tra hiển thị lỗi validation

#### Test file upload validation:
1. Mở modal "Sửa phòng"
2. Thử upload file không phải ảnh
3. Kiểm tra hiển thị lỗi "Vui lòng chọn file ảnh"
4. Thử upload file > 5MB
5. Kiểm tra hiển thị lỗi "Kích thước ảnh không được vượt quá 5MB"

## 🚀 Deployment

### 1. Compile backend
```bash
cd "C:\Users\phong\Downloads\New folder - Copy\Group2_ASM"
.\mvnw.cmd clean compile
```

### 2. Start backend
```bash
.\mvnw.cmd spring-boot:run
```

### 3. Start frontend
```bash
cd frontend
npm run dev
```

## 📊 API Endpoints

### Update Room
```
PUT /api/rooms/{roomId}
Headers: Authorization: Bearer {token}

Request Body:
{
  "name": "string",
  "imageUrl": "string",
  "detail": "string",
  "price": 0.0,
  "location": "string",
  "contact": "string",
  "roomType": "string",
  "area": 0.0,
  "capacity": 0,
  "amenities": "string",
  "availability": "string",
  "isAvailable": true
}
```

## 🎯 Kết quả

✅ Hiển thị thông tin chủ trọ chi tiết  
✅ Nút "Sửa phòng" chỉ hiển thị cho Admin/Chủ phòng  
✅ Modal sửa phòng với đầy đủ các trường  
✅ Upload và preview ảnh  
✅ Validation đầy đủ  
✅ Kiểm soát quyền chặt chẽ  
✅ Backend compile thành công  
✅ UI/UX hiện đại, responsive  

## 🔗 Files liên quan

### Frontend
- `frontend/src/components/EditRoom.jsx`
- `frontend/src/components/EditRoom.css`
- `frontend/src/pages/RoomDetail.jsx`
- `frontend/src/pages/RoomDetail.css`

### Backend
- `src/main/java/com/x/group2_timtro/dto/request/UpdateRoomRequest.java`
- `src/main/java/com/x/group2_timtro/service/RoomService.java`

---

**Hoàn thành:** 24/10/2025

