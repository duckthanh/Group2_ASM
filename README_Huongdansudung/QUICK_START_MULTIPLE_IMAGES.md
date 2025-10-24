# 🚀 Quick Start - Tính Năng Nhiều Ảnh

## ⚡ 3 Bước Để Chạy

### 1️⃣ Chạy SQL (30 giây)
```sql
USE timtro_db;
ALTER TABLE rooms ADD COLUMN additional_images TEXT NULL;
```

### 2️⃣ Restart Backend (1 phút)
```bash
.\mvnw.cmd spring-boot:run
```

### 3️⃣ Test Frontend (2 phút)
- Ctrl + F5 refresh browser
- Vào "Đăng tin" → Upload nhiều ảnh
- Vào chi tiết phòng → Xem gallery

---

## 📸 Demo Flow

### Tạo Phòng Với Nhiều Ảnh:

```
1. Click "Đăng tin"
   ↓
2. Upload ảnh chính (1 file)
   ↓
3. Scroll xuống "Ảnh phụ"
   ↓
4. Click "Choose Files"
   ↓
5. Ctrl + Click chọn 3-4 ảnh
   ↓
6. Xem preview grid 📸 📸 📸
   ↓
7. Click "Tạo phòng"
```

### Xem Gallery:

```
1. Vào danh sách phòng
   ↓
2. Click vào phòng có nhiều ảnh
   ↓
3. Thấy layout:
   ┌─────────┬─┐
   │         │📸│
   │  Main   │📸│
   │         │📸│
   └─────────┴─┘
   ↓
4. Click vào ảnh bất kỳ
   ↓
5. Lightbox fullscreen mở ra
   ↓
6. Dùng ← → để chuyển ảnh
   ↓
7. Click ảnh để zoom
   ↓
8. Press ESC để đóng
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Previous image |
| `→` | Next image |
| `ESC` | Close gallery |
| `Click ảnh` | Zoom in/out |

---

## ✅ Checklist Test

- [ ] Upload được nhiều ảnh trong form tạo/sửa
- [ ] Xóa được từng ảnh riêng lẻ
- [ ] Hiển thị grid khi có >1 ảnh
- [ ] Click ảnh mở lightbox
- [ ] Keyboard ←/→ hoạt động
- [ ] Zoom in/out bằng click
- [ ] Thumbnails clickable
- [ ] Responsive trên mobile

---

## 🎯 Validation

✅ **Pass nếu:**
- Upload tối đa 10 ảnh
- Preview hiển thị ngay
- Gallery fullscreen mượt
- Responsive tốt

❌ **Fail nếu:**
- Upload >10 ảnh vẫn được
- Ảnh không hiển thị
- Gallery bị lag
- Mobile không responsive

---

## 📞 Debug

### Ảnh không upload được?
```javascript
// Check console:
F12 → Console → Xem lỗi

// Check network:
F12 → Network → Xem request upload
```

### Gallery không mở?
```javascript
// Check state:
React DevTools → Components → RoomDetail
→ showGallery: true/false?
→ images array có data?
```

### Database lỗi?
```sql
-- Check column exists:
DESCRIBE rooms;

-- Check data:
SELECT additional_images FROM rooms LIMIT 5;
```

---

## 🎨 Screenshots Expected

### Form Upload:
```
Grid với thumbnails + nút ✕ xóa
```

### Gallery Grid:
```
2 cột: Main (2/3 width) + Thumbnails (1/3 width)
```

### Lightbox:
```
Fullscreen đen, ảnh ở giữa, thumbnails ở dưới
```

---

## ⏱️ Timeline

- **5 phút:** Setup (SQL + restart)
- **10 phút:** Test upload nhiều ảnh
- **5 phút:** Test gallery lightbox
- **Total:** ~20 phút

Chúc bạn thành công! 🎉

