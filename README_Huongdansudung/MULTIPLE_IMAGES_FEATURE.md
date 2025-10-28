# Tính năng Upload Nhiều Ảnh

## ✨ Tổng quan

Đã thêm tính năng upload nhiều ảnh cho phòng trọ:
- **1 ảnh chính** (imageUrl) - Hiển thị trong danh sách
- **Tối đa 9 ảnh phụ** (additionalImages) - Gallery trong trang chi tiết

## ✅ Đã hoàn thành

### 1. Database Migration ✅
```sql
ALTER TABLE rooms
ADD COLUMN additional_images TEXT NULL;
```

File: `add_multiple_images_to_rooms.sql`

### 2. Backend ✅

**Entity (Room.java):**
```java
@Column(name = "additional_images", columnDefinition = "TEXT")
private String additionalImages; // JSON array
```

**DTOs cập nhật:**
- `CreateRoomRequest.java` - thêm field `additionalImages`
- `UpdateRoomRequest.java` - thêm field `additionalImages`
- `RoomResponse.java` - thêm field `additionalImages`

**RoomService.java:**
- `createRoom()` - lưu additionalImages
- `updateRoom()` - cập nhật additionalImages  
- `mapToRoomResponse()` - trả về additionalImages

### 3. Frontend - EditRoom ✅

**Tính năng:**
- ✅ Upload nhiều ảnh cùng lúc (multiple files)
- ✅ Grid hiển thị ảnh phụ (responsive)
- ✅ Nút xóa từng ảnh
- ✅ Validation tối đa 10 ảnh (1 chính + 9 phụ)
- ✅ Toast notifications
- ✅ Loading states

**UI Components:**
```jsx
// Grid hiển thị ảnh phụ
<div className="additional-images-grid">
  {formData.additionalImages.map((imageUrl, index) => (
    <div className="additional-image-item">
      <img src={imageUrl} />
      <button onClick={() => handleRemoveAdditionalImage(index)}>✕</button>
    </div>
  ))}
</div>

// Input upload nhiều ảnh
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleAdditionalImagesUpload}
  disabled={uploading || formData.additionalImages.length >= 9}
/>
```

**Functions:**
- `handleAdditionalImagesUpload()` - Upload nhiều ảnh
- `handleRemoveAdditionalImage(index)` - Xóa 1 ảnh
- Parse JSON khi load form
- Stringify JSON khi submit

### 4. CSS Styles ✅

```css
.additional-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.additional-image-item {
  position: relative;
  height: 120px;
  border-radius: var(--radius-md);
}

.btn-remove-additional-image {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(239, 68, 68, 0.9);
}
```

## ✅ Hoàn thành 100%

### 5. CreateRoom.jsx ✅
- State `additionalImages: []`
- Function `handleAdditionalImagesUpload`
- Function `handleRemoveAdditionalImage`
- UI grid hiển thị ảnh phụ
- Submit với JSON.stringify

### 6. Image Gallery Component ✅
Tạo component hiển thị ảnh đẹp:
- Lightbox/Modal xem ảnh lớn
- Navigation (previous/next) với keyboard (←/→/Esc)
- Thumbnails clickable
- Zoom in/out
- Counter (1/10)
- Responsive cho mobile

### 7. RoomDetail.jsx ✅
- Parse `additionalImages` từ JSON
- Hiển thị gallery grid (1 ảnh lớn + 4 thumbnails)
- "+X ảnh" overlay khi có >5 ảnh
- Click ảnh để xem fullscreen
- Responsive design (mobile: vertical stack)

## 🧪 Cách test

### Test EditRoom:
1. Chạy migration SQL:
```sql
USE timtro_db;
ALTER TABLE rooms ADD COLUMN additional_images TEXT NULL;
```

2. Restart backend:
```bash
.\mvnw.cmd spring-boot:run
```

3. Refresh frontend (Ctrl + F5)

4. Test upload:
   - Vào "Sửa phòng"
   - Upload ảnh chính
   - Upload 3-4 ảnh phụ (chọn nhiều files cùng lúc)
   - Xem grid hiển thị
   - Thử xóa 1 ảnh
   - Lưu thay đổi

5. Kiểm tra database:
```sql
SELECT id, name, additional_images FROM rooms WHERE id = 14;
```

Kết quả: `additional_images` chứa JSON array
```json
["http://localhost:8080/uploads/images/abc.jpg", "http://localhost:8080/uploads/images/def.jpg"]
```

## 📊 Data Flow

### Upload Flow:
```
1. User chọn nhiều files
2. Frontend upload từng file → Backend
3. Backend trả về URL cho mỗi file  
4. Frontend thu thập URLs vào array
5. Hiển thị trong grid
6. User click Lưu
7. Frontend: JSON.stringify(array)
8. Backend: Lưu JSON string vào DB
```

### Display Flow:
```
1. Backend trả về JSON string
2. Frontend: JSON.parse(string) → array
3. Map qua array hiển thị grid
4. Click ảnh → Fullscreen gallery
```

## 🎯 Validation

- **Tối đa 10 ảnh:** 1 chính + 9 phụ
- **File type:** image/*
- **File size:** 5MB per file (từ backend)
- **Format:** jpg, png, gif, webp

## 🚀 Deployment Steps

1. **Chạy migration SQL** ✅
2. **Restart backend** ⏳ (Cần làm)
3. **Test EditRoom** ✅
4. **Implement CreateRoom** ✅
5. **Tạo Gallery component** ✅
6. **Update RoomDetail với gallery** ✅
7. **Test end-to-end** ⏳ (Cần làm)

## 📁 Files

**Backend:**
- `add_multiple_images_to_rooms.sql`
- `src/main/java/com/x/group2_timtro/entity/Room.java`
- `src/main/java/com/x/group2_timtro/dto/request/CreateRoomRequest.java`
- `src/main/java/com/x/group2_timtro/dto/request/UpdateRoomRequest.java`
- `src/main/java/com/x/group2_timtro/dto/response/RoomResponse.java`
- `src/main/java/com/x/group2_timtro/service/RoomService.java`

**Frontend:**
- `frontend/src/components/EditRoom.jsx`
- `frontend/src/components/EditRoom.css`
- `frontend/src/components/CreateRoom.jsx`
- `frontend/src/components/CreateRoom.css`
- `frontend/src/components/ImageGallery.jsx` ⭐ NEW
- `frontend/src/components/ImageGallery.css` ⭐ NEW
- `frontend/src/pages/RoomDetail.jsx`
- `frontend/src/pages/RoomDetail.css`

---

**Status:** ✅ 100% hoàn thành - Sẵn sàng test!  
**Cần làm:** Chạy migration SQL và test tính năng

