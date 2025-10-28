# Hướng dẫn Setup Design Mới

## Bước 1: Cài đặt Dependencies

```bash
cd frontend
npm install lucide-react react-hot-toast
```

## Bước 2: Khởi động Development Server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5173`

## Bước 3: Kiểm tra Backend

Đảm bảo Spring Boot backend đang chạy tại `http://localhost:8080`

## Tính năng mới

### 1. Navbar
- Sticky navbar với blur effect khi scroll
- User dropdown với avatar
- Mobile responsive menu
- Icons từ lucide-react

### 2. Room List Page
- Hero section với search bar
- Filter panel sticky sidebar
- Room cards với hover effects
- Sort options
- Pagination

### 3. User Management
- Stats cards
- Search & filter
- Table với actions
- Modern modals

### 4. Toast Notifications
- Success/Error messages
- Top-right position
- Auto dismiss after 4s

## Màu sắc chính

- Primary: `#2563EB` (Blue)
- Accent: `#22C55E` (Green)
- Error: `#EF4444` (Red)
- Text: `#0F172A` (Slate 900)
- Background: `#F8FAFC` (Slate 50)

## Font

Plus Jakarta Sans (auto-loaded từ Google Fonts)

## Icons

Lucide React - Modern, minimalist icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

Không có issues hiện tại.

## Tips

1. Sử dụng `toast.success()` và `toast.error()` thay vì `alert()`
2. Import icons từ lucide-react: `import { Search } from 'lucide-react'`
3. Sử dụng CSS classes mới (có suffix `-new`) cho components mới
4. Old classes vẫn hoạt động để maintain backward compatibility

## Support

Nếu gặp vấn đề, kiểm tra:
1. Node version >= 16
2. NPM packages đã install đầy đủ
3. Backend đang chạy
4. Browser console để xem errors

