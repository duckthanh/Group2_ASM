# Quick Test Guide - Hướng dẫn Test nhanh

## ✅ Đã sửa các lỗi

1. ✅ **Compilation Error** - Fixed comparison of primitive `long` type
2. ✅ **Lombok Warnings** - Added `@Builder.Default` annotations
3. ✅ **Database Error** - Added `USE database_name;` to SQL script

## 🗄️ Bước 1: Tạo Database Tables

### Cách 1: Chạy toàn bộ file SQL

1. Mở MySQL Workbench
2. Mở file `create_new_features_tables.sql`
3. **SỬA TÊN DATABASE** ở dòng 12:
   ```sql
   USE timtro_db;  -- Đổi thành tên database của bạn
   ```
4. Chạy toàn bộ file (⚡ Execute)

### Cách 2: Chọn database trước rồi chạy

1. Double-click vào database bên trái (Schema panel)
2. Database sẽ in **đậm** khi được chọn
3. Chạy file SQL

### Kiểm tra tables đã tạo

```sql
SHOW TABLES;
```

Kết quả phải có 3 tables mới:
- ✅ `saved_rooms`
- ✅ `room_reports`
- ✅ `viewing_schedules`

## 🚀 Bước 2: Backend đang chạy

Backend đã chạy thành công trên: `http://localhost:8080`

Kiểm tra logs để đảm bảo không có lỗi.

## 🧪 Bước 3: Test APIs

### 1. Đăng nhập để lấy JWT Token

```bash
# Request
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "your_email@example.com",
  "password": "your_password"
}

# Response
{
  "id": 1,
  "username": "Your Name",
  "email": "your_email@example.com",
  "role": "USER",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}
```

**Copy `accessToken` để dùng cho các requests sau!**

### 2. Test Saved Rooms API

#### 2.1. Lưu phòng
```bash
POST http://localhost:8080/api/saved-rooms/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response:**
```json
{
  "id": 1,
  "roomId": 1,
  "userId": 1,
  "room": { /* room details */ },
  "savedAt": "2025-01-24T14:00:00"
}
```

#### 2.2. Kiểm tra đã lưu chưa
```bash
GET http://localhost:8080/api/saved-rooms/1/check
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response:**
```json
{
  "saved": true
}
```

#### 2.3. Xem danh sách đã lưu
```bash
GET http://localhost:8080/api/saved-rooms
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### 2.4. Bỏ lưu phòng
```bash
DELETE http://localhost:8080/api/saved-rooms/1
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 3. Test Room Reports API

#### 3.1. Tạo báo cáo
```bash
POST http://localhost:8080/api/reports/rooms/1
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "reason": "spam",
  "description": "Tin đăng spam, lặp lại nhiều lần"
}
```

**Valid reasons:**
- `spam` - Tin spam
- `wrong_price` - Giá sai
- `fake_images` - Ảnh không thật
- `other` - Khác

**Expected Response:**
```json
{
  "id": 1,
  "roomId": 1,
  "reporterId": 1,
  "reporterName": "User Name",
  "reason": "spam",
  "description": "Tin đăng spam, lặp lại nhiều lần",
  "status": "PENDING",
  "reportedAt": "2025-01-24T14:00:00",
  "resolvedAt": null
}
```

#### 3.2. Xem tất cả báo cáo (Admin only)
```bash
GET http://localhost:8080/api/reports
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

### 4. Test Viewing Schedules API

#### 4.1. Đặt lịch xem phòng
```bash
POST http://localhost:8080/api/viewing-schedules/rooms/1
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "viewingDate": "2025-02-01",
  "viewingTime": "14:00",
  "visitorName": "Nguyễn Văn A",
  "visitorPhone": "0912345678",
  "notes": "Tôi muốn xem phòng vào buổi chiều"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "roomId": 1,
  "roomName": "Phòng trọ gần FTU",
  "userId": 1,
  "userName": "User Name",
  "viewingDate": "2025-02-01",
  "viewingTime": "14:00:00",
  "visitorName": "Nguyễn Văn A",
  "visitorPhone": "0912345678",
  "status": "PENDING",
  "notes": "Tôi muốn xem phòng vào buổi chiều",
  "createdAt": "2025-01-24T14:00:00",
  "confirmedAt": null,
  "cancelledAt": null
}
```

#### 4.2. Xem lịch của tôi
```bash
GET http://localhost:8080/api/viewing-schedules/my-schedules
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### 4.3. Cập nhật trạng thái lịch (Admin/Owner)
```bash
PUT http://localhost:8080/api/viewing-schedules/1/status?status=CONFIRMED
Authorization: Bearer OWNER_ACCESS_TOKEN
```

**Valid statuses:**
- `PENDING` - Chờ xác nhận
- `CONFIRMED` - Đã xác nhận
- `CANCELLED` - Đã hủy
- `COMPLETED` - Đã hoàn thành

## 🌐 Bước 4: Test Frontend

### 1. Chạy Frontend
```bash
cd frontend
npm run dev
```

Frontend chạy trên: `http://localhost:5173`

### 2. Test trên UI

#### 2.1. Test Save Room
1. Đăng nhập
2. Vào Room Detail: `http://localhost:5173/room/1`
3. Click nút ❤️ (Heart) ở góc trên
4. Toast hiện "Đã lưu phòng"
5. Click lại để bỏ lưu → Toast "Đã bỏ lưu"

#### 2.2. Test Report Room
1. Ở Room Detail, click nút 🚩 (Flag)
2. Toast hiện "Đã gửi báo cáo. Chúng tôi sẽ xem xét trong 24h."

#### 2.3. Test Viewing Schedule
1. Ở Room Detail, click nút "Đặt lịch xem phòng"
2. Form hiện ra:
   - Chọn ngày (không được chọn ngày quá khứ)
   - Chọn giờ (08:00 - 17:00)
   - Nhập họ tên
   - Nhập số điện thoại
3. Click "Xác nhận đặt lịch"
4. Toast hiện "Đặt lịch xem phòng thành công!"

## 🔍 Debug & Troubleshooting

### Kiểm tra Backend logs
```bash
# Check console output
# Look for errors or exceptions
```

### Kiểm tra Database
```sql
-- Check saved_rooms
SELECT * FROM saved_rooms;

-- Check room_reports
SELECT * FROM room_reports;

-- Check viewing_schedules
SELECT * FROM viewing_schedules;
```

### Common Issues

#### 1. 401 Unauthorized
- **Nguyên nhân**: JWT token không hợp lệ hoặc hết hạn
- **Giải pháp**: Đăng nhập lại để lấy token mới

#### 2. 404 Not Found
- **Nguyên nhân**: Room ID không tồn tại
- **Giải pháp**: Kiểm tra room ID có trong database

#### 3. 400 Bad Request
- **Nguyên nhân**: Dữ liệu request không hợp lệ
- **Giải pháp**: Kiểm tra format request body

#### 4. 500 Internal Server Error
- **Nguyên nhân**: Lỗi server (database, logic)
- **Giải pháp**: Check backend logs

## 📊 Test Checklist

### Backend APIs
- [ ] POST /api/saved-rooms/{roomId} - Lưu phòng
- [ ] DELETE /api/saved-rooms/{roomId} - Bỏ lưu
- [ ] GET /api/saved-rooms - Danh sách đã lưu
- [ ] GET /api/saved-rooms/{roomId}/check - Kiểm tra đã lưu
- [ ] POST /api/reports/rooms/{roomId} - Tạo báo cáo
- [ ] GET /api/reports - Xem tất cả báo cáo (Admin)
- [ ] POST /api/viewing-schedules/rooms/{roomId} - Đặt lịch
- [ ] GET /api/viewing-schedules/my-schedules - Lịch của tôi

### Frontend Features
- [ ] Save/Unsave room button
- [ ] Report room button
- [ ] Viewing schedule form
- [ ] Toast notifications
- [ ] Loading states
- [ ] Error handling

### Database
- [ ] saved_rooms table created
- [ ] room_reports table created
- [ ] viewing_schedules table created
- [ ] Foreign keys working
- [ ] Indexes created

## 🎉 Success Criteria

Tất cả tính năng hoạt động nếu:
1. ✅ Backend compile không lỗi
2. ✅ Database tables tạo thành công
3. ✅ APIs trả về response đúng format
4. ✅ Frontend hiển thị toast notifications
5. ✅ Data được lưu vào database

## 📞 Support

Nếu gặp vấn đề:
1. Check backend console logs
2. Check browser console (F12)
3. Check database records
4. Refer to `BACKEND_FEATURES_DOCUMENTATION.md`

---

**Happy Testing!** 🚀

