# Hướng Dẫn Sử Dụng Tính Năng "Phòng Của Tôi"

## 📋 Tổng Quan

Tính năng "Phòng Của Tôi" cho phép người dùng quản lý tất cả các phòng trọ đã đặt và đang thuê, theo dõi trạng thái, thanh toán, hợp đồng và nhiều hơn nữa.

## 🚀 Cách Truy Cập

1. **Đăng nhập** vào tài khoản của bạn
2. Nhấp vào **avatar/tên người dùng** ở góc phải navbar
3. Chọn **"Phòng của tôi"** từ menu dropdown
4. Hoặc truy cập trực tiếp: `/account/rooms`

## 📊 Các Trạng Thái Phòng

### 1. **Giữ chỗ (HOLD)**
- Sau khi bấm "Thuê ngay" trên trang chi tiết phòng
- Thời gian giữ chỗ: 48 giờ
- **Hành động cần làm:**
  - Đặt cọc trước khi hết hạn
  - Hoặc hủy giữ chỗ nếu không muốn tiếp tục

### 2. **Đã đặt cọc (DEPOSITED)**
- Sau khi thanh toán tiền cọc
- **Hành động cần làm:**
  - Chờ chủ trọ xác nhận
  - Ký hợp đồng điện tử
  - Chọn ngày nhận phòng

### 3. **Đang thuê (ACTIVE)**
- Đã ký hợp đồng và nhận phòng
- **Chức năng có sẵn:**
  - Thanh toán tiền nhà hàng tháng
  - Xem lịch sử thanh toán
  - Báo cáo sự cố
  - Gia hạn hợp đồng
  - Liên hệ chủ trọ

### 4. **Đã trả phòng (ENDED)**
- Hợp đồng đã kết thúc
- Xem lịch sử thuê trọ
- Viết đánh giá cho phòng

### 5. **Đã hủy (CANCELED)**
- Đặt phòng bị hủy
- Xem lý do hủy (người dùng/chủ trọ/hệ thống)

## 🎯 Các Tính Năng Chính

### 🔍 Tìm kiếm & Lọc
- Tìm theo tên phòng, địa chỉ
- Lọc theo trạng thái (tabs)
- Đếm số lượng phòng theo trạng thái

### 📇 Thông tin trên mỗi Card
- Ảnh phòng + badge trạng thái
- Countdown (giữ chỗ hoặc hết hạn hợp đồng)
- Tên phòng, địa chỉ
- Giá/tháng, diện tích, sức chứa
- Progress bar (theo trạng thái)
- Thông tin chủ trọ
- CTA button (thay đổi theo trạng thái)

### 📱 Menu Hành Động (⋮)
- Xem chi tiết
- Tải hợp đồng (nếu có)
- Tải biên lai
- Báo sự cố (khi đang thuê)
- Liên hệ chủ trọ
- Hủy giữ chỗ/đặt cọc

## 📄 Trang Chi Tiết Phòng

### Thông tin hiển thị:
1. **Overview**
   - Thông tin đặt phòng
   - Thông tin đặt cọc
   - Thông tin hợp đồng (lease)

2. **Timeline**
   - Lịch sử các sự kiện:
     - Tạo đặt chỗ
     - Đặt cọc
     - Ký hợp đồng
     - Nhận phòng
     - Kết thúc hợp đồng

3. **Thanh toán**
   - Bảng danh sách thanh toán
   - Tháng, số tiền, trạng thái
   - Link tải biên lai

4. **Tài liệu**
   - CMND/CCCD
   - Hợp đồng
   - Các giấy tờ khác
   - Trạng thái duyệt

5. **Sự cố**
   - Danh sách sự cố đã báo
   - Nút "Báo cáo sự cố mới"
   - Form: Tiêu đề, Mô tả, Ảnh

### Sidebar Hành Động:
- **Thông tin chủ trọ**: Tên, SĐT, Email
- **Các nút hành động** (thay đổi theo trạng thái):
  - Đặt cọc ngay (HOLD)
  - Thanh toán cọc (DEPOSITED - chưa thanh toán)
  - Ký hợp đồng (DEPOSITED - đã thanh toán)
  - Thanh toán tiền nhà (ACTIVE)
  - Gia hạn hợp đồng (ACTIVE)
  - Báo sự cố (ACTIVE)
  - Hủy giữ chỗ/đặt phòng

## 🔔 Thông Báo & Nhắc Việc

### Banner cảnh báo hiển thị khi:
- Sắp hết hạn giữ chỗ (< 12h)
- Chưa thanh toán tiền cọc
- Sắp hết hạn hợp đồng
- Tiền nhà đến hạn

## 🎨 Giao Diện

### Màu sắc theo trạng thái:
- **Giữ chỗ**: Amber/Yellow
- **Đã đặt cọc**: Blue
- **Đang thuê**: Green
- **Đã trả phòng**: Gray
- **Đã hủy**: Red

### Responsive:
- Desktop: Grid 3-4 cột
- Tablet: Grid 2 cột
- Mobile: 1 cột, tabs dạng carousel

## 📝 Luồng Sử Dụng Cơ Bản

### Luồng 1: Thuê Ngay (Không đặt cọc)
1. Trang chi tiết phòng → "Thuê ngay"
2. Điền form thông tin
3. Tạo booking với status = HOLD
4. Vào "Phòng Của Tôi" → Thấy card với status "Giữ chỗ"
5. Click "Đặt cọc ngay" → Thanh toán
6. Status chuyển sang DEPOSITED
7. Ký hợp đồng
8. Status chuyển sang ACTIVE
9. Nhận phòng và bắt đầu thuê

### Luồng 2: Đặt Cọc Trước
1. Trang chi tiết phòng → "Đặt cọc"
2. Điền form + số tiền cọc
3. Tạo booking với status = DEPOSITED
4. Thanh toán tiền cọc
5. Ký hợp đồng
6. Status chuyển sang ACTIVE

### Luồng 3: Đang Thuê
1. Mỗi tháng nhận thông báo thanh toán
2. Vào "Phòng Của Tôi" → Click "Thanh toán tiền nhà"
3. Thanh toán và lưu biên lai
4. Có sự cố → "Báo sự cố" → Form + Ảnh
5. Hết hạn → "Gia hạn hợp đồng" hoặc "Trả phòng"

## 🔧 API Endpoints

### Backend (Spring Boot)
```
GET    /api/me/rooms                          - Lấy danh sách phòng
GET    /api/me/rooms?status=HOLD              - Lọc theo trạng thái
GET    /api/me/rooms?q=keyword                - Tìm kiếm
GET    /api/me/rooms/{bookingId}              - Chi tiết phòng
POST   /api/me/rooms                          - Tạo booking mới
POST   /api/me/rooms/{bookingId}/payments     - Thanh toán
GET    /api/me/rooms/{bookingId}/payments     - Lịch sử thanh toán
POST   /api/me/rooms/{bookingId}/contract/sign - Ký hợp đồng
POST   /api/me/rooms/{bookingId}/cancel       - Hủy booking
POST   /api/me/rooms/{bookingId}/renew        - Gia hạn
POST   /api/me/rooms/{bookingId}/handover     - Trả phòng
POST   /api/me/rooms/{bookingId}/issues       - Báo sự cố
POST   /api/me/rooms/{bookingId}/documents    - Upload tài liệu
```

### Frontend (React)
```javascript
import { myRoomsAPI } from './services/api'

// Lấy danh sách
const rooms = await myRoomsAPI.getMyRooms('ACTIVE', 'keyword')

// Lấy chi tiết
const detail = await myRoomsAPI.getMyRoomDetail('BK-2025-00123')

// Tạo booking
const booking = await myRoomsAPI.createBooking({
  roomId: 123,
  action: 'HOLD',
  duration: 6,
  durationUnit: 'MONTH',
  ...
})

// Thanh toán
await myRoomsAPI.makePayment('BK-2025-00123', {
  amount: 3500000,
  method: 'BANK_TRANSFER'
})

// Ký hợp đồng
await myRoomsAPI.signContract('BK-2025-00123')

// Hủy booking
await myRoomsAPI.cancelBooking('BK-2025-00123', 'Lý do hủy')

// Gia hạn
await myRoomsAPI.renewLease('BK-2025-00123', 6)

// Báo sự cố
await myRoomsAPI.createIssue('BK-2025-00123', {
  title: 'Điều hòa hỏng',
  description: '...',
  photos: []
})
```

## 💾 Database Schema

### Booking (Đã cập nhật)
```sql
- booking_id VARCHAR(50) UNIQUE
- hold_expires_at TIMESTAMP
- deposit_amount DOUBLE
- deposit_paid BOOLEAN
- deposit_receipt_url VARCHAR(500)
- lease_start DATE
- lease_end DATE
- contract_status VARCHAR(50)
- contract_pdf_url VARCHAR(500)
- cancel_reason TEXT
- canceled_by VARCHAR(50)
```

### Payment (Mới)
```sql
- id, booking_id
- month VARCHAR(7)
- amount DOUBLE
- status VARCHAR(50)
- receipt_url VARCHAR(500)
- payment_method VARCHAR(50)
- paid_at TIMESTAMP
- due_date TIMESTAMP
```

### Issue (Mới)
```sql
- id, booking_id
- title VARCHAR(255)
- description TEXT
- photos TEXT
- status VARCHAR(50)
- landlord_response TEXT
- resolved_at TIMESTAMP
```

### Document (Mới)
```sql
- id, booking_id
- document_type VARCHAR(50)
- document_url VARCHAR(500)
- file_name VARCHAR(255)
- status VARCHAR(50)
```

## 🛠️ Cài Đặt & Chạy

### Backend
1. Chạy SQL script để update database:
```bash
mysql -u root -p your_database < SQL/update_bookings_for_my_rooms.sql
```

2. Build & Run Spring Boot:
```bash
mvn clean install
mvn spring-boot:run
```

### Frontend
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Truy cập: `http://localhost:5173`

## 🐛 Troubleshooting

### Lỗi không tải được danh sách phòng
- Kiểm tra JWT token có hợp lệ
- Kiểm tra X-User-Id header được gửi đúng
- Xem console log để debug

### Lỗi không thể thanh toán
- Kiểm tra trạng thái phòng
- Kiểm tra số tiền
- Kiểm tra backend logs

### Lỗi không thể ký hợp đồng
- Phải thanh toán cọc trước
- Trạng thái phải là DEPOSITED

## 📞 Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, vui lòng liên hệ:
- Email: support@timtro.com
- Phone: 1900-xxxx
- Hoặc báo cáo issue trên GitHub

---

**Chúc bạn có trải nghiệm tốt với tính năng "Phòng Của Tôi"! 🏠**

