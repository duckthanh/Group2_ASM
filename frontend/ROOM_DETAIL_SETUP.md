# Hướng dẫn Setup & Sử dụng Room Detail Page mới

## 1. Cài đặt

Các dependencies đã được cài đặt (từ lần setup trước):

```bash
cd frontend
npm install lucide-react react-hot-toast
```

## 2. Files đã được tạo/cập nhật

### Files mới:
- `frontend/src/pages/RoomDetail.jsx` - Component chính (redesigned)
- `frontend/src/pages/RoomDetail.css` - Styles riêng cho Room Detail
- `frontend/ROOM_DETAIL_REDESIGN.md` - Documentation chi tiết
- `frontend/ROOM_DETAIL_SETUP.md` - File này

### Files đã có (không cần thay đổi):
- `frontend/src/index.css` - CSS variables đã có đầy đủ
- `frontend/src/App.jsx` - Toaster đã được setup
- `frontend/src/services/api.js` - API service đã có

## 3. Chạy ứng dụng

```bash
# Từ thư mục frontend
npm run dev

# Server sẽ chạy ở: http://localhost:5173
```

## 4. Test các tính năng

### Truy cập Room Detail
```
http://localhost:5173/room/1
http://localhost:5173/room/2
http://localhost:5173/room/3
```

### Test với back query
```
http://localhost:5173/room/1?back=/rooms/phong-tro
```

### Checklist tính năng cần test:

#### Desktop View
- [ ] Breadcrumb hiển thị đúng
- [ ] Nút Lưu (Heart) toggle khi click
- [ ] Nút Chia sẻ copy link hoặc mở native share
- [ ] Nút Báo cáo hiển thị toast
- [ ] Nút "Quay lại kết quả" navigate về đúng URL
- [ ] Gallery zoom khi click vào ảnh
- [ ] Gallery modal đóng khi click outside hoặc nút X
- [ ] Badge "Còn trống"/"Sắp trống" hiển thị đúng
- [ ] Copy địa chỉ hiển thị icon Check
- [ ] Meta chips (loại hình, diện tích, sức chứa) hiển thị đúng
- [ ] Giá format đúng với dấu phẩy
- [ ] Nút "Đặt lịch xem" mở form
- [ ] Mô tả hiển thị với line breaks
- [ ] Tiện nghi hiển thị với icons đúng
- [ ] Bảng chi phí hiển thị đầy đủ
- [ ] Form đặt lịch validate đúng (required, min date)
- [ ] Submit form hiển thị toast thành công
- [ ] Scroll spy navigation active khi scroll
- [ ] Smooth scroll khi click scroll spy nav
- [ ] Contact card hiển thị avatar, tên, SĐT
- [ ] Nút "Gọi ngay" mở tel: link
- [ ] Nút "Nhắn tin" hiển thị toast (đang phát triển)
- [ ] Map placeholder hiển thị địa chỉ
- [ ] Nút "Chỉ đường" mở Google Maps

#### Tablet View (768-1024px)
- [ ] Layout chuyển sang 1 cột
- [ ] Right column hiển thị dưới left column
- [ ] Scroll spy navigation ẩn
- [ ] Amenities grid 2 cột

#### Mobile View (<768px)
- [ ] Header bar stack vertical
- [ ] Breadcrumb wrap đúng
- [ ] Gallery height 300px
- [ ] Title font size nhỏ hơn (24px)
- [ ] Price section stack vertical
- [ ] Amenities grid 1 cột
- [ ] Form inputs stack vertical
- [ ] Mobile CTA bar hiện ở bottom
- [ ] Mobile CTA bar sticky
- [ ] 3 nút CTA hoạt động đúng

#### User Authentication
- [ ] Khi chưa login, click "Lưu" redirect to /login
- [ ] Khi chưa login, click "Đặt lịch xem" redirect to /login
- [ ] Khi đã login, các tính năng hoạt động bình thường

#### Loading & Error States
- [ ] Loading spinner hiển thị khi fetch data
- [ ] Loading text "Đang tải thông tin phòng..."
- [ ] Error page khi không tìm thấy phòng
- [ ] Nút "Quay lại danh sách" navigate về /rooms/phong-tro

#### Empty Data Handling
- [ ] "Chưa cập nhật" khi thiếu roomType
- [ ] "Chưa cập nhật" khi thiếu area/capacity
- [ ] "Chưa có mô tả chi tiết" khi thiếu detail
- [ ] "Chưa cập nhật tiện nghi" khi amenities rỗng
- [ ] "Chưa cập nhật" trong bảng chi phí

#### Toast Notifications
- [ ] "Đã lưu phòng" khi save
- [ ] "Đã bỏ lưu" khi unsave
- [ ] "Đã copy link" khi copy
- [ ] "Đã gửi báo cáo..." khi report
- [ ] "Đặt lịch xem phòng thành công!" khi submit form
- [ ] "Tính năng nhắn tin đang phát triển" khi click message
- [ ] "Vui lòng đăng nhập..." khi unauthorized
- [ ] "Không tìm thấy phòng trọ" khi error

## 5. Responsive Testing

### Desktop (>1024px)
```bash
# Browser: F12 > Responsive mode > 1920x1080
# Hoặc: Set viewport width > 1024px
```

### Tablet (768-1024px)
```bash
# Browser: F12 > Responsive mode > 768x1024
# Hoặc: Resize browser window
```

### Mobile (<768px)
```bash
# Browser: F12 > Responsive mode > 375x667 (iPhone SE)
# Browser: F12 > Responsive mode > 390x844 (iPhone 12)
```

## 6. Customization

### Thay đổi colors
Edit `frontend/src/index.css`:
```css
:root {
  --primary: #2563EB;
  --accent: #22C55E;
  /* ... */
}
```

### Thay đổi layout
Edit `frontend/src/pages/RoomDetail.css`:
```css
.room-detail-layout {
  grid-template-columns: 1fr 380px; /* Adjust right column width */
}
```

### Thêm amenity icons
Edit `frontend/src/pages/RoomDetail.jsx`:
```javascript
const amenitiesMap = {
  'Tên tiện nghi': { icon: IconName, label: 'Label' },
  // Add more...
}
```

### Customize toast style
Edit `frontend/src/App.jsx`:
```javascript
<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: { /* custom styles */ }
  }}
/>
```

## 7. Integration với Backend

### Current API endpoint:
```javascript
// GET /api/rooms/:id
roomAPI.getRoomById(id)
```

### Expected response:
```json
{
  "id": 1,
  "name": "Phòng trọ gần FTU",
  "location": "Hòa Lạc, Hà Nội",
  "price": 3000000,
  "imageUrl": "http://...",
  "contact": "0912345678",
  "ownerUsername": "John Doe",
  "roomType": "Phòng trọ",
  "area": 25,
  "capacity": 2,
  "isAvailable": true,
  "availability": "Còn trống",
  "detail": "Mô tả...",
  "amenities": "Có wifi, Có điều hoà, Có ban công",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

### TODO - API cần thêm (future):
- POST `/api/bookings` - Đặt lịch xem phòng
- POST `/api/rooms/:id/save` - Lưu phòng
- DELETE `/api/rooms/:id/save` - Bỏ lưu phòng
- POST `/api/rooms/:id/report` - Báo cáo tin
- GET `/api/rooms/:id/similar` - Phòng tương tự

## 8. Troubleshooting

### Lỗi: Cannot find module 'lucide-react'
```bash
cd frontend
npm install lucide-react
```

### Lỗi: Cannot find module 'react-hot-toast'
```bash
cd frontend
npm install react-hot-toast
```

### Lỗi: CSS không load
- Kiểm tra import trong RoomDetail.jsx: `import './RoomDetail.css'`
- Clear cache: Ctrl+Shift+R hoặc Cmd+Shift+R

### Lỗi: Toast không hiển thị
- Kiểm tra Toaster component trong App.jsx
- Kiểm tra z-index của toast (default: 9999)

### Lỗi: Images không load
- Kiểm tra imageUrl từ backend
- Kiểm tra CORS nếu images từ external source
- Fallback: Placeholder image sẽ hiển thị

### Lỗi: Back button không giữ filters
- Implement query preservation ở RoomList page
- Pass filters as query params khi navigate to detail

## 9. Performance Optimization

### Lazy load images
```javascript
<img loading="lazy" src={room.imageUrl} alt={room.name} />
```

### Debounce scroll event
```javascript
import { debounce } from 'lodash'
const handleScroll = debounce(() => { /* ... */ }, 100)
```

### Memoize expensive calculations
```javascript
import { useMemo } from 'react'
const amenitiesList = useMemo(() => 
  room?.amenities?.split(', ') || [], 
  [room?.amenities]
)
```

## 10. Accessibility Checklist

- [ ] All images have alt text
- [ ] All buttons have meaningful labels
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] Color contrast ≥ 4.5:1
- [ ] Form inputs have labels
- [ ] Error messages are clear
- [ ] Skip links (if needed)

## 11. Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Polyfills needed for older browsers:
- CSS Grid (IE11)
- CSS Custom Properties (IE11)
- Fetch API (IE11)

## 12. Deploy Checklist

- [ ] Run `npm run build` successfully
- [ ] No console errors in production
- [ ] All images load
- [ ] API endpoints correct
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Meta tags for SEO
- [ ] og:image for social sharing
- [ ] Analytics tracking (if needed)

## 13. Next Steps

1. Test trên nhiều devices thật
2. Collect user feedback
3. Implement missing features (reviews, similar rooms, chat)
4. Optimize images (WebP, lazy load)
5. Add unit tests
6. Add E2E tests với Playwright
7. Monitor performance với Lighthouse
8. A/B testing cho conversion rate

## Support

Nếu gặp vấn đề:
1. Check console errors
2. Check network tab (API calls)
3. Check React DevTools (component state)
4. Refer to ROOM_DETAIL_REDESIGN.md

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-24  
**Author**: AI Assistant

