# Fix Upload Ảnh trong Form Sửa Phòng

## 🐛 Vấn đề
Khi sửa phòng và upload ảnh mới, ảnh preview bị mất và không hiển thị.

## ✅ Giải pháp

### 1. **Thêm key để reset input file**
```jsx
const [imageKey, setImageKey] = useState(Date.now())

// Input file với key
<input
  key={imageKey}
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
/>
```

### 2. **Cập nhật handleImageUpload**
```jsx
const handleImageUpload = async (e) => {
  // ... validation ...
  
  try {
    const response = await uploadAPI.uploadImage(file)
    setFormData(prev => ({  // Dùng prev để tránh stale data
      ...prev,
      imageUrl: response.url
    }))
    setImageKey(Date.now()) // Reset input file
    toast.success('Upload ảnh thành công')
  } catch (err) {
    // ... error handling ...
  }
}
```

### 3. **Thêm nút xóa ảnh**
```jsx
const handleRemoveImage = () => {
  setFormData(prev => ({
    ...prev,
    imageUrl: ''
  }))
  setImageKey(Date.now())
  toast.success('Đã xóa ảnh')
}
```

### 4. **UI cải tiến**

**Preview ảnh với nút xóa:**
```jsx
{formData.imageUrl && (
  <div className="image-preview">
    <img src={formData.imageUrl} alt="Preview" />
    <button 
      type="button" 
      className="btn-remove-image" 
      onClick={handleRemoveImage}
      title="Xóa ảnh"
    >
      ✕
    </button>
  </div>
)}
```

**Helper text:**
```jsx
<small>
  {formData.imageUrl ? 'Chọn ảnh mới để thay đổi' : 'Chọn ảnh phòng'}
</small>
```

### 5. **CSS cho nút xóa**
```css
.btn-remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  /* ... */
}

.btn-remove-image:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1);
}
```

## 🎯 Tính năng mới

### 1. **Preview ảnh hiện tại**
- Hiển thị ảnh đang có của phòng
- Preview ảnh ngay khi upload thành công

### 2. **Nút xóa ảnh**
- Nút ✕ đỏ góc trên bên phải
- Click để xóa ảnh hiện tại
- Toast notification "Đã xóa ảnh"

### 3. **Reset input file**
- Tự động reset sau khi upload thành công
- Tránh confusion khi chọn file mới

### 4. **Helper text động**
- "Chọn ảnh phòng" - khi chưa có ảnh
- "Chọn ảnh mới để thay đổi" - khi đã có ảnh

## 🧪 Cách test

### Test Case 1: Upload ảnh mới
1. Vào chi tiết phòng → Click "Sửa phòng"
2. Phòng đã có ảnh → Preview hiển thị ảnh hiện tại ✅
3. Click "Choose File" → Chọn ảnh mới
4. Đợi upload → Toast "Upload ảnh thành công" ✅
5. Preview hiển thị ảnh mới ngay lập tức ✅
6. Input file được reset (không còn tên file cũ) ✅

### Test Case 2: Xóa ảnh
1. Vào chi tiết phòng → Click "Sửa phòng"
2. Phòng có ảnh → Preview hiển thị
3. Click nút ✕ đỏ góc trên
4. Toast "Đã xóa ảnh" ✅
5. Preview biến mất ✅
6. Helper text: "Chọn ảnh phòng" ✅

### Test Case 3: Sửa thông tin + Upload ảnh
1. Vào "Sửa phòng"
2. Sửa tên phòng, giá, v.v.
3. Upload ảnh mới
4. Click "Lưu thay đổi"
5. Tất cả thông tin + ảnh mới được lưu ✅

## 📝 Files đã sửa

1. **frontend/src/components/EditRoom.jsx**
   - Thêm state `imageKey`
   - Cập nhật `handleImageUpload` với `prev => {...}`
   - Thêm function `handleRemoveImage`
   - Thêm nút xóa ảnh trong UI
   - Thêm helper text

2. **frontend/src/components/EditRoom.css**
   - Cập nhật `.image-preview` với `position: relative`
   - Thêm `.btn-remove-image` styles
   - Thêm hover effects

## 🎨 UI/UX Improvements

### Before:
- ❌ Upload ảnh mới → Preview không hiển thị
- ❌ Không có nút xóa ảnh
- ❌ Input file không reset
- ❌ Không rõ có thể đổi ảnh

### After:
- ✅ Upload ảnh mới → Preview hiển thị ngay
- ✅ Nút xóa ảnh đỏ nổi bật
- ✅ Input file tự động reset
- ✅ Helper text rõ ràng

## 🚀 Deployment

Chỉ cần refresh browser (Ctrl + F5) vì chỉ sửa frontend.

Không cần:
- ❌ Restart backend
- ❌ Migration database
- ❌ Clear cache

## ✅ Checklist

- [x] Preview ảnh hiện tại khi mở form
- [x] Preview ảnh mới sau khi upload
- [x] Nút xóa ảnh
- [x] Reset input file sau upload
- [x] Helper text động
- [x] Toast notifications
- [x] Responsive design
- [x] Error handling

---

**Hoàn thành:** 24/10/2025  
**Impact:** Cải thiện UX khi sửa ảnh phòng  
**Status:** ✅ Ready to use

