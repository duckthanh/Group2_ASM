# Fix Preview Ảnh Sau Upload

## 🐛 Vấn đề
Upload ảnh thành công (có toast notification) nhưng ảnh preview không hiển thị trong form.

## 🔍 Nguyên nhân

Backend trả về **relative URL**:
```json
{
  "url": "/uploads/images/abc-123.jpg",
  "filename": "abc-123.jpg"
}
```

Frontend cần **full URL** để hiển thị ảnh:
```
http://localhost:8080/uploads/images/abc-123.jpg
```

## ✅ Giải pháp

### 1. Fix EditRoom.jsx (Form Sửa Phòng)

**Before:**
```jsx
const response = await uploadAPI.uploadImage(file)
setFormData(prev => ({
  ...prev,
  imageUrl: response.url  // ❌ Relative URL: "/uploads/images/..."
}))
```

**After:**
```jsx
const response = await uploadAPI.uploadImage(file)
// Backend trả về relative URL, cần thêm base URL
const fullImageUrl = response.url.startsWith('http') 
  ? response.url 
  : `http://localhost:8080${response.url}`

setFormData(prev => ({
  ...prev,
  imageUrl: fullImageUrl  // ✅ Full URL
}))
console.log('Image uploaded:', fullImageUrl)
```

### 2. Fix CreateRoom.jsx (Form Thêm Phòng)

**Before:**
```jsx
const result = await uploadAPI.uploadImage(file)
setFormData(prev => ({
  ...prev,
  imageUrl: 'http://localhost:8080' + result.url
}))
```

**After:**
```jsx
const result = await uploadAPI.uploadImage(file)
// Backend trả về relative URL, cần thêm base URL
const fullImageUrl = result.url.startsWith('http') 
  ? result.url 
  : `http://localhost:8080${result.url}`

setFormData(prev => ({
  ...prev,
  imageUrl: fullImageUrl
}))
console.log('Image uploaded:', fullImageUrl)
```

## 🎯 Cách hoạt động

### Backend Response:
```json
{
  "url": "/uploads/images/f3d8a9b2-4c5e-4d7f-8a1b-9c2d3e4f5a6b.jpg",
  "filename": "f3d8a9b2-4c5e-4d7f-8a1b-9c2d3e4f5a6b.jpg"
}
```

### Frontend xử lý:
1. Nhận `response.url = "/uploads/images/..."`
2. Check nếu không bắt đầu bằng `http`
3. Thêm base URL: `http://localhost:8080/uploads/images/...`
4. Set vào formData → Preview hiển thị ✅

### HTML img tag:
```jsx
<img src={formData.imageUrl} alt="Preview" />
// src = "http://localhost:8080/uploads/images/abc-123.jpg" ✅
```

## 🧪 Test Case

### Test 1: Upload ảnh trong form Sửa Phòng
1. Vào chi tiết phòng → Click "Sửa phòng"
2. Click "Choose File" → Chọn ảnh
3. Đợi upload → Toast "Upload ảnh thành công" ✅
4. **Preview ảnh hiển thị ngay lập tức** ✅
5. Mở Console → Xem log: `Image uploaded: http://localhost:8080/uploads/images/...` ✅

### Test 2: Upload ảnh trong form Thêm Phòng
1. Click "Thêm phòng trọ"
2. Điền thông tin → Chọn ảnh
3. **Preview ảnh hiển thị ngay** ✅
4. Click "Tạo phòng"
5. Ảnh được lưu và hiển thị trong danh sách ✅

### Test 3: Xóa và upload ảnh mới
1. Vào "Sửa phòng"
2. Phòng đã có ảnh → Preview hiển thị
3. Click nút ✕ để xóa
4. Upload ảnh mới
5. **Preview ảnh mới hiển thị** ✅

## 📊 Before vs After

### Before:
```
Upload ảnh → Backend trả về → response.url = "/uploads/images/abc.jpg"
                              ↓
<img src="/uploads/images/abc.jpg" />  ❌ Không load được
                              ↓
                         Preview trống
```

### After:
```
Upload ảnh → Backend trả về → response.url = "/uploads/images/abc.jpg"
                              ↓
           Thêm base URL → "http://localhost:8080/uploads/images/abc.jpg"
                              ↓
<img src="http://localhost:8080/uploads/images/abc.jpg" />  ✅ Load OK
                              ↓
                       Preview hiển thị
```

## 🔍 Debug Tips

### Check trong Console:
1. Mở DevTools (F12) → Tab Console
2. Upload ảnh
3. Xem log: `Image uploaded: http://localhost:8080/uploads/images/...`
4. Nếu URL đúng nhưng vẫn không hiển thị → Check network tab

### Check Network Tab:
1. F12 → Tab Network
2. Upload ảnh
3. Tìm request `POST /api/upload/image`
4. Xem Response:
```json
{
  "url": "/uploads/images/xxx.jpg",
  "filename": "xxx.jpg"
}
```

### Check Preview Element:
1. F12 → Tab Elements
2. Tìm `<img>` tag trong preview
3. Xem `src` attribute:
   - ✅ `http://localhost:8080/uploads/images/...`
   - ❌ `/uploads/images/...` (thiếu base URL)

## 📝 Files đã sửa

1. **frontend/src/components/EditRoom.jsx**
   - Thêm logic convert relative URL → full URL
   - Thêm console.log để debug

2. **frontend/src/components/CreateRoom.jsx**
   - Cập nhật logic đồng nhất với EditRoom
   - Thêm console.log để debug

## 🚀 Deployment

1. **Refresh browser** (Ctrl + F5)
2. Test upload ảnh ngay
3. Không cần restart backend

## ✅ Checklist

- [x] EditRoom: Upload ảnh → Preview hiển thị
- [x] CreateRoom: Upload ảnh → Preview hiển thị
- [x] Console log để debug
- [x] Handle cả relative và absolute URL
- [x] Code đồng nhất giữa 2 components

## 🎯 Kết quả

✅ **Upload ảnh thành công → Preview hiển thị ngay**  
✅ **Console log rõ ràng để debug**  
✅ **Code clean và maintainable**  
✅ **Handle edge cases (absolute URL)**  

---

**Hoàn thành:** 24/10/2025  
**Status:** ✅ Ready to use  
**Test:** Refresh browser và test ngay!

