# Room Detail Page - Redesign Documentation

## Tổng quan

Trang chi tiết phòng trọ đã được thiết kế lại hoàn toàn theo yêu cầu UI/UX mới, tập trung vào trải nghiệm người dùng tối ưu và hiển thị thông tin chi tiết, đầy đủ.

## Các thay đổi chính

### 1. Layout & Cấu trúc

#### Header Bar
- **Breadcrumb**: Trang chủ / Danh sách trọ / [Tên phòng]
- **Actions**: Lưu (♥), Chia sẻ, Báo cáo
- **Back Button**: "← Quay lại kết quả" với query preservation

#### 2-Column Layout (Desktop)

**Cột trái (70%)**:
- Gallery (với zoom và full-screen)
- Tiêu đề & thông tin cơ bản
- Giá & tình trạng
- Mô tả chi tiết
- Tiện nghi (grid với icons)
- Chi phí & điều khoản
- Form đặt lịch xem phòng

**Cột phải (30%)**:
- Scroll spy navigation
- Card liên hệ chủ trọ
- Bản đồ với nút chỉ đường

### 2. Gallery

- Ảnh lớn với khả năng zoom
- Badge "Còn trống" / "Sắp trống" ở góc ảnh
- Click để xem full-screen
- Hover effect mượt mà

### 3. Thông tin phòng

#### Header
- **Tiêu đề**: Font size lớn (32px), bold
- **Địa chỉ**: Icon map-pin màu đỏ, có nút copy
- **Meta chips**: 
  - Loại hình (với icon nhà)
  - Diện tích (với icon maximize)
  - Sức chứa (với icon users)
- **Cập nhật**: Hiển thị ngày cập nhật cuối

#### Giá
- Font size lớn (40px), màu primary
- Đơn vị rõ ràng "/tháng"
- Nút "Đặt lịch xem" nổi bật

### 4. Mô tả & Tiện nghi

#### Mô tả chi tiết
- Typography rõ ràng, line-height 1.8
- White-space: pre-wrap để giữ format
- Fallback text khi chưa có mô tả

#### Tiện nghi
- Grid 3 cột (responsive)
- Icons chuyên biệt cho mỗi tiện nghi:
  - Gác lửng: Home
  - Vệ sinh riêng: Droplets
  - Điều hoà: AirVent
  - Wifi: Wifi
  - Nấu ăn: UtensilsCrossed
  - Nội thất: Sofa
  - Gửi xe: Car
- Hover effect nhẹ

### 5. Chi phí & Điều khoản

- Bảng gọn gàng với separator
- Các mục:
  - Tiền phòng
  - Tiền điện
  - Tiền nước
  - Internet
  - Phí giữ xe
  - Tiền cọc
- Fallback "Chưa cập nhật" cho thông tin thiếu

### 6. Đặt lịch xem phòng

Form đầy đủ với:
- **Chọn ngày**: Date picker (min = today)
- **Chọn giờ**: Dropdown với các slot (08:00-17:00)
- **Họ tên**: Text input
- **Số điện thoại**: Tel input
- **Submit**: Button màu primary

Validation:
- Tất cả fields required
- Không cho chọn ngày quá khứ
- Toast notification khi thành công

### 7. Card liên hệ chủ trọ (Sticky Right)

- **Avatar**: Gradient background với chữ cái đầu
- **Tên & SĐT**: Hiển thị rõ ràng
- **Actions**:
  - Gọi ngay (màu xanh lá - accent)
  - Nhắn tin (màu xanh dương - primary)
- **Note**: Giờ liên hệ tốt nhất (8:00-20:00)

### 8. Bản đồ

- Placeholder với icon map-pin
- Hiển thị địa chỉ
- Nút "Chỉ đường" mở Google Maps với địa chỉ tự động

### 9. Scroll Spy Navigation

- Sticky menu ở cột phải
- Các section:
  - Tổng quan
  - Tiện nghi
  - Chi phí
  - Lịch xem
- Active state tự động khi scroll
- Smooth scroll khi click

### 10. Mobile Optimization

#### Mobile CTA Bar (Fixed Bottom)
- Hiển thị giá
- 3 nút actions:
  - Gọi (Phone icon)
  - Nhắn tin (Message icon)
  - Xem lịch (Calendar icon)
- Sticky ở bottom với shadow

#### Responsive Breakpoints
- **Desktop (>1024px)**: 2 cột, full features
- **Tablet (768-1024px)**: 1 cột, right column dưới left
- **Mobile (<768px)**: Stack layout, mobile CTA bar hiện

### 11. Micro-interactions

- **Lưu phòng**: Toggle ♥, yêu cầu login
- **Chia sẻ**: Native share API hoặc copy link
- **Copy địa chỉ**: Icon check khi copy thành công
- **Hover states**: Subtle transforms & color changes
- **Focus states**: Ring rõ ràng cho accessibility

### 12. States

#### Loading
- Spinner với animation
- Text "Đang tải thông tin phòng..."

#### Error
- Message "Không tìm thấy phòng trọ"
- Button quay lại danh sách

#### Empty fields
- Text "Chưa cập nhật" với màu secondary
- Italic style

### 13. Gallery Modal

- Full-screen overlay (background rgba(0,0,0,0.95))
- Image centered, max 90% viewport
- Close button (X) ở góc trên phải
- Click outside để đóng

## Icons sử dụng (lucide-react)

- Heart, Share2, Flag (header actions)
- MapPin, Home, Users, Maximize (meta chips)
- Phone, MessageCircle, Calendar (CTAs)
- ChevronLeft, ChevronRight (navigation)
- ZoomIn, X (gallery)
- Copy, Check (copy actions)
- Clock (contact note)
- AirVent, Droplets, Wifi, Car, etc. (amenities)

## Color Scheme

- **Primary**: #2563EB (buttons, price)
- **Accent**: #22C55E (available badge, call button)
- **Text Primary**: #0F172A
- **Text Secondary**: #64748B
- **Background**: #F8FAFC
- **Card**: #FFFFFF
- **Border**: #E2E8F0
- **Warning**: #F59E0B (soon badge)
- **Error**: #EF4444 (report, unavailable)

## Typography

- **Font Family**: Plus Jakarta Sans
- **Title**: 32px, weight 800
- **Price**: 40px, weight 800
- **Section Title**: 24px, weight 700
- **Body**: 16px, weight 400-500
- **Meta**: 14px, weight 500

## Shadows & Effects

- **Card Shadow**: 0 2px 8px rgba(0,0,0,0.04)
- **Button Shadow**: 0 4px 12px rgba(37,99,235,0.2)
- **Mobile CTA Shadow**: 0 -4px 12px rgba(0,0,0,0.08)
- **Hover Transform**: translateY(-2px)
- **Border Radius**: 8px (sm), 12px (md), 16px (lg), 24px (xl)

## Accessibility

- Contrast ratio ≥ 4.5:1 cho tất cả text
- Focus rings rõ ràng (box-shadow)
- Alt text cho images
- Semantic HTML (h1, h2, buttons)
- Keyboard navigation support

## Integration với Backend

### API Calls
- `roomAPI.getRoomById(id)` - Fetch room data

### Data Structure
```javascript
{
  id: number,
  name: string,
  location: string,
  price: number,
  imageUrl: string,
  contact: string,
  ownerUsername: string,
  roomType: string,
  area: number,
  capacity: number,
  isAvailable: boolean,
  availability: string,
  detail: string,
  amenities: string, // comma-separated
  createdAt: string,
  updatedAt: string
}
```

### Toast Notifications
- Lưu/bỏ lưu phòng
- Copy link thành công
- Báo cáo gửi thành công
- Đặt lịch thành công
- Lỗi (không tìm thấy phòng, yêu cầu login)

## Future Enhancements

1. **Gallery Carousel**: Multiple images với thumbnails
2. **Map Integration**: Embed Google Maps thực
3. **Distance Calculator**: Tính khoảng cách tới FTU, bến bus
4. **Reviews/Comments**: Hệ thống đánh giá & bình luận
5. **Similar Rooms**: Carousel phòng tương tự (±15% giá)
6. **Comparison**: So sánh 2-3 phòng
7. **Calendar Integration**: Export to iCal/Google Calendar
8. **Virtual Tour**: 360° view nếu có
9. **Chat Integration**: Nhắn tin trực tiếp với chủ trọ
10. **Report System**: Backend xử lý báo cáo

## Files Modified

- `frontend/src/pages/RoomDetail.jsx` - Component chính
- `frontend/src/pages/RoomDetail.css` - Styles riêng
- `frontend/src/index.css` - Global variables (đã có)

## Setup & Testing

```bash
# Install dependencies (nếu chưa)
cd frontend
npm install

# Run dev server
npm run dev

# Test URLs
http://localhost:5173/room/1
http://localhost:5173/room/2?back=/rooms/phong-tro
```

## Notes

- Component hoàn toàn responsive (desktop, tablet, mobile)
- Toast notifications đã integrate với react-hot-toast
- Sử dụng React Router cho navigation
- Query preservation cho back button
- Tất cả interactions có feedback rõ ràng
- Fallbacks cho missing data
- Loading & error states handled

