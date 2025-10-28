# Tài liệu Thay đổi Thiết kế Frontend

## Tổng quan

Frontend đã được redesign hoàn toàn theo yêu cầu UI/UX mới với tone sáng – thoáng – tối giản.

## Màu sắc mới

### Primary Colors
- **Primary:** `#2563EB` (blue-600) - Màu chính cho buttons, links, highlights
- **Accent:** `#22C55E` (green-500) - Trạng thái "còn phòng", CTA phụ

### Text Colors
- **Text Primary:** `#0F172A` (slate-900) - Text chính
- **Text Secondary:** `#64748B` (slate-500) - Text phụ, labels

### Background Colors
- **BG Light:** `#F8FAFC` (slate-50) - Background tổng thể
- **BG White:** `#FFFFFF` - Card backgrounds
- **Border:** `#E2E8F0` - Borders

### Success/Error
- **Success:** `#22C55E` (green-500)
- **Error:** `#EF4444` (red-500)
- **Warning:** `#F59E0B` (amber-500)

## Font

- **Primary Font:** Plus Jakarta Sans (imported từ Google Fonts)
- **Fallback:** Inter, system fonts
- Font weights: 300, 400, 500, 600, 700, 800

## Icons

Sử dụng **lucide-react** - icons nét mảnh, hiện đại:
- Search, MapPin, Home, Users, etc.
- Kích thước phổ biến: 16px, 18px, 20px, 24px

## Layout

- **Container:** max-width 1200px
- **Grid:** 12 cột với gap 24px-32px
- **Border Radius:** 
  - Small: 8px
  - Medium: 12px
  - Large: 16px
  - XL: 24px
- **Shadows:** Mềm, tinh tế (0 2px 8px rgba(0, 0, 0, 0.04))

## Components đã được redesign

### 1. Navbar (Navbar.jsx)
✅ **Tính năng mới:**
- Sticky position với blur nhẹ khi scroll
- Logo với icon Building2 từ lucide-react
- Active link có gạch dưới gradient
- User dropdown với avatar, badges
- Mobile hamburger menu
- Smooth transitions

### 2. Filter Panel (RoomFilter.jsx)
✅ **Tính năng mới:**
- Design sạch sẽ với icons cho mỗi section
- Custom checkbox và radio buttons
- Price range chips (mutually exclusive)
- Area range inputs
- Amenity checkboxes với icons
- Badge hiển thị số lượng filter đang active
- Sticky sidebar

### 3. Room List Page (RoomList.jsx)
✅ **Tính năng mới:**
- Hero section với gradient blue
- Search bar với gợi ý từ khóa
- Sort dropdown (giá, mới nhất, diện tích)
- Card grid 3 cột (responsive: 2 cột tablet, 1 cột mobile)
- Room cards với:
  - Hover effects (lift + shadow)
  - Badge "Còn trống"
  - Meta info (diện tích, sức chứa)
  - Amenity chips
  - Contact info
- Loading spinner
- Empty state với icon
- Pagination mới

### 4. Room Cards
✅ **Features:**
- Image với hover zoom effect
- Badge góc phải
- Location với MapPin icon
- Meta info với icons (Maximize, Users, Phone)
- Amenity chips (3-5 tiện nghi nổi bật)
- Price highlight
- View detail button với Eye icon
- Delete button cho owner/admin

### 5. User Management Page (UserManagement.jsx)
✅ **Tính năng mới:**
- Stats cards với icons
- Search bar với focus effects
- Role filter dropdown
- Table với:
  - Avatar cho mỗi user
  - Role badges (Admin/User)
  - Highlight row cho current user
  - Action buttons (Edit, Delete)
  - Hover effects
- Modern modals với animations
- Warning boxes cho actions nguy hiểm

### 6. Toast Notifications
✅ **Features:**
- Sử dụng react-hot-toast
- Position: top-right
- Custom styling matching theme
- Success/Error icons với theme colors
- Duration: 4000ms
- Max width: 500px

## States

### Loading States
- Loading spinner với animation
- Text "Đang tải..."
- Centered layout

### Empty States
- Large icon (64px, opacity 0.5)
- Title + description
- CTA button để reset/thử lại
- Centered layout

### Skeleton States
- CSS animation shimmer effect
- Placeholder cho cards, tables
- Màu background subtle

## Accessibility (A11y)

✅ **Đã implement:**
- Contrast ratio ≥ 4.5:1 cho text
- Focus rings rõ ràng cho interactive elements
- Keyboard navigation support
- Hover states rõ ràng
- Disabled states với opacity
- Alt text cho images
- Semantic HTML

## Responsive Design

### Desktop (>1200px)
- Full layout với sidebar
- 3 cột room grid
- Full navigation menu

### Tablet (769px - 1200px)
- 2 cột room grid
- Filter sidebar collapse to accordion
- Adjusted spacing

### Mobile (≤768px)
- 1 cột layout
- Hamburger menu
- Stack các controls
- Touch-friendly buttons (min 44px)
- Full width inputs

## Animations & Transitions

- **Duration:** 0.2s - 0.3s
- **Easing:** ease, ease-in-out
- **Effects:**
  - Hover lift (translateY(-2px to -4px))
  - Scale on hover (images)
  - Fade in cho modals
  - Smooth scroll

## File Structure

```
frontend/src/
├── components/
│   ├── Navbar.jsx (redesigned)
│   ├── RoomFilter.jsx (redesigned)
│   ├── RoomFilter.css (redesigned)
│   └── ... (other components)
├── pages/
│   ├── RoomList.jsx (redesigned)
│   ├── UserManagement.jsx (redesigned)
│   └── ... (other pages)
├── index.css (updated with new theme)
├── App.jsx (added Toaster)
└── ... (other files)
```

## Dependencies Mới

```json
{
  "lucide-react": "latest",
  "react-hot-toast": "latest"
}
```

## Cách sử dụng Toast

```javascript
import toast from 'react-hot-toast'

// Success
toast.success('Thao tác thành công!')

// Error
toast.error('Có lỗi xảy ra!')

// Loading
const loadingToast = toast.loading('Đang xử lý...')
// ... sau khi xong
toast.dismiss(loadingToast)
toast.success('Hoàn thành!')
```

## Notes

1. **Legacy Support:** Old CSS classes vẫn được giữ để không break existing code
2. **Progressive Enhancement:** New design có thể coexist với old components
3. **Performance:** Sử dụng CSS transitions thay vì JS animations
4. **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

## Migration Guide

Để migrate từ old design sang new design:

1. Import lucide-react icons:
```javascript
import { Search, Home, User } from 'lucide-react'
```

2. Sử dụng new CSS classes (có suffix `-new`):
```javascript
className="navbar-new"
className="room-card-new"
className="filter-panel-new"
```

3. Replace emoji icons với lucide-react icons
4. Update colors to new palette
5. Add toast notifications instead of alert()

## Testing Checklist

- [ ] Kiểm tra responsive trên mobile, tablet, desktop
- [ ] Test keyboard navigation
- [ ] Kiểm tra contrast ratios
- [ ] Test loading states
- [ ] Test empty states
- [ ] Kiểm tra hover effects
- [ ] Test modals
- [ ] Test toast notifications
- [ ] Kiểm tra performance (lighthouse score)

---

**Ngày cập nhật:** 2025-10-23
**Version:** 2.0.0

