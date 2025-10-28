# Cập nhật Chi phí & Điều khoản

## 📋 Tổng quan

Đã bổ sung chức năng sửa và hiển thị đầy đủ thông tin chi phí & điều khoản cho phòng trọ, bao gồm:
- ✅ Tiền điện
- ✅ Tiền nước
- ✅ Internet
- ✅ Phí giữ xe
- ✅ Tiền cọc (với 2 loại: số tháng hoặc cố định)

## ✨ Tính năng mới

### 1. **Sửa thông tin chi phí**
- Admin/Chủ phòng có thể sửa tất cả các trường chi phí
- Form validation và placeholder hướng dẫn
- Tự động format số tiền khi hiển thị

### 2. **Hiển thị chi phí động**
- Hiển thị dữ liệu thực từ database
- Hiển thị "Chưa cập nhật" nếu chưa có dữ liệu
- Format số tiền theo chuẩn Việt Nam (3.500đ/kWh, 2.000.000đ/tháng)
- Tiền cọc hiển thị theo loại: "1 tháng" hoặc "3.000.000đ"

### 3. **Linh hoạt về đơn vị**
- Tiền điện: VNĐ/kWh
- Tiền nước: VNĐ/m³
- Internet: VNĐ/tháng
- Phí giữ xe: VNĐ/tháng
- Tiền cọc: Số tháng HOẶC cố định (VNĐ)

## 🔧 Backend Changes

### 1. Entity Room (`Room.java`)
Thêm 6 trường mới:
```java
@Column
private Double electricityCost; // Tiền điện (VNĐ/kWh hoặc cố định)

@Column
private Double waterCost; // Tiền nước (VNĐ/m³ hoặc cố định)

@Column
private Double internetCost; // Tiền internet (VNĐ/tháng)

@Column
private Double parkingFee; // Phí giữ xe (VNĐ/tháng)

@Column
private Double deposit; // Tiền cọc (VNĐ hoặc số tháng)

@Column
private String depositType; // "FIXED" (cố định) hoặc "MONTHS" (số tháng)
```

### 2. UpdateRoomRequest DTO
Thêm 6 trường tương ứng để nhận dữ liệu từ frontend

### 3. RoomResponse DTO
Thêm 6 trường để trả về dữ liệu cho frontend

### 4. RoomService
- Cập nhật method `updateRoom()` để xử lý 6 trường mới
- Cập nhật method `mapToRoomResponse()` để map dữ liệu chi phí

## 🎨 Frontend Changes

### 1. EditRoom Component (`EditRoom.jsx`)
Thêm section "Chi phí & điều khoản" với các input:

#### Form fields:
- **Tiền điện**: Number input, placeholder "VD: 3500", step 100
- **Tiền nước**: Number input, placeholder "VD: 20000", step 1000
- **Internet**: Number input, placeholder "VD: 100000", step 10000
- **Phí giữ xe**: Number input, placeholder "VD: 50000", step 10000
- **Tiền cọc**: Number input, placeholder "VD: 3000000", step 100000
- **Loại tiền cọc**: Select (Số tháng / Cố định VNĐ)

#### Features:
- Grid layout 2 cột cho desktop, 1 cột cho mobile
- Validation: min="0"
- Helper text: "Để trống nếu chưa xác định hoặc thương lượng trực tiếp"
- Auto-parse to float/int khi submit

### 2. RoomDetail Component (`RoomDetail.jsx`)
Cập nhật hiển thị chi phí động:

```jsx
{/* Tiền điện */}
{room.electricityCost 
  ? `${formatPrice(room.electricityCost)}đ/kWh` 
  : 'Chưa cập nhật'
}

{/* Tiền cọc */}
{room.deposit 
  ? room.depositType === 'MONTHS' 
    ? `${room.deposit} tháng`
    : `${formatPrice(room.deposit)}đ`
  : 'Chưa cập nhật'
}
```

## 💾 Database Migration

### SQL Script: `add_cost_fields_to_rooms.sql`

```sql
ALTER TABLE rooms
ADD COLUMN electricity_cost DOUBLE NULL,
ADD COLUMN water_cost DOUBLE NULL,
ADD COLUMN internet_cost DOUBLE NULL,
ADD COLUMN parking_fee DOUBLE NULL,
ADD COLUMN deposit DOUBLE NULL,
ADD COLUMN deposit_type VARCHAR(20) NULL DEFAULT 'MONTHS';
```

### Cách chạy migration:

#### Option 1: Chạy file SQL
```sql
-- Mở file add_cost_fields_to_rooms.sql
-- Sửa dòng đầu: USE your_database_name; -> USE timtro_db;
-- Chạy toàn bộ script
```

#### Option 2: Chạy từng lệnh trong MySQL Workbench
1. Chọn database: `USE timtro_db;`
2. Copy paste các câu lệnh ALTER TABLE
3. Execute

#### Option 3: Auto migration (Spring Boot)
Spring Boot sẽ tự động tạo các cột mới khi khởi động nếu `spring.jpa.hibernate.ddl-auto=update` trong `application.yaml`

## 🧪 Cách test

### 1. Test migration database
```sql
USE timtro_db;
DESCRIBE rooms;
-- Kiểm tra 6 cột mới xuất hiện
```

### 2. Test sửa chi phí

#### Với Admin/Chủ phòng:
1. Đăng nhập
2. Vào chi tiết phòng (của mình hoặc bất kỳ nếu Admin)
3. Click "Sửa phòng"
4. Scroll xuống section "Chi phí & điều khoản"
5. Nhập dữ liệu:
   - Tiền điện: 3500
   - Tiền nước: 20000
   - Internet: 100000
   - Phí giữ xe: 50000
   - Tiền cọc: 1
   - Loại: Số tháng
6. Click "Lưu thay đổi"
7. Kiểm tra toast "Cập nhật phòng thành công!"

### 3. Test hiển thị chi phí

#### Trường hợp có dữ liệu:
1. Sau khi sửa thành công
2. Scroll xuống section "Chi phí & điều khoản"
3. Kiểm tra hiển thị:
   - Tiền phòng: 3.000.000đ/tháng
   - Tiền điện: 3.500đ/kWh ✅
   - Tiền nước: 20.000đ/m³ ✅
   - Internet: 100.000đ/tháng ✅
   - Phí giữ xe: 50.000đ/tháng ✅
   - Tiền cọc: 1 tháng ✅

#### Trường hợp chưa có dữ liệu:
1. Vào phòng chưa cập nhật chi phí
2. Scroll xuống section "Chi phí & điều khoản"
3. Kiểm tra hiển thị "Chưa cập nhật" cho các trường trống

### 4. Test tiền cọc với 2 loại

#### Loại "Số tháng":
```
Input: deposit = 1, depositType = "MONTHS"
Output: "1 tháng"
```

#### Loại "Cố định":
```
Input: deposit = 3000000, depositType = "FIXED"
Output: "3.000.000đ"
```

### 5. Test validation
1. Mở form sửa phòng
2. Nhập số âm vào tiền điện → Không cho nhập (min="0")
3. Để trống tất cả chi phí → Vẫn lưu được (không bắt buộc)
4. Nhập text vào trường number → Browser tự validate

## 📊 Ví dụ dữ liệu

### JSON Request khi update:
```json
{
  "name": "Phòng trọ gần FTU",
  "price": 3000000,
  "location": "Thạch Thất, Hà Nội",
  "contact": "0912345678",
  "electricityCost": 3500,
  "waterCost": 20000,
  "internetCost": 100000,
  "parkingFee": 50000,
  "deposit": 1,
  "depositType": "MONTHS"
}
```

### JSON Response:
```json
{
  "id": 14,
  "name": "Phòng trọ gần FTU",
  "price": 3000000,
  "electricityCost": 3500,
  "waterCost": 20000,
  "internetCost": 100000,
  "parkingFee": 50000,
  "deposit": 1,
  "depositType": "MONTHS"
}
```

## 🎯 Kết quả

✅ Backend compile thành công  
✅ 6 trường chi phí mới được thêm vào database  
✅ Form sửa phòng có section chi phí đầy đủ  
✅ Hiển thị chi phí động trên trang chi tiết  
✅ Format số tiền chuẩn Việt Nam  
✅ Hỗ trợ 2 loại tiền cọc  
✅ Validation đầy đủ  
✅ UI/UX responsive  

## 🔗 Files liên quan

### Backend
- `src/main/java/com/x/group2_timtro/entity/Room.java`
- `src/main/java/com/x/group2_timtro/dto/request/UpdateRoomRequest.java`
- `src/main/java/com/x/group2_timtro/dto/response/RoomResponse.java`
- `src/main/java/com/x/group2_timtro/service/RoomService.java`

### Frontend
- `frontend/src/components/EditRoom.jsx`
- `frontend/src/pages/RoomDetail.jsx`

### Database
- `add_cost_fields_to_rooms.sql`

## 📝 Lưu ý quan trọng

1. **Migration database**: Phải chạy script SQL trước khi test để tạo các cột mới
2. **Không bắt buộc**: Tất cả các trường chi phí là optional, có thể để trống
3. **Format hiển thị**: Tự động format với dấu phẩy phân cách hàng nghìn
4. **Deposit type**: Mặc định là "MONTHS" (số tháng)
5. **Backend validation**: Không có validation bắt buộc, chấp nhận NULL

## 🚀 Deployment

### 1. Chạy migration
```sql
USE timtro_db;
source add_cost_fields_to_rooms.sql;
```

### 2. Compile backend
```bash
cd "C:\Users\phong\Downloads\New folder - Copy\Group2_ASM"
.\mvnw.cmd clean compile
```

### 3. Start backend
```bash
.\mvnw.cmd spring-boot:run
```

### 4. Test ngay
- Vào http://localhost:5173
- Login với tài khoản Admin hoặc Owner
- Vào chi tiết phòng → Click "Sửa phòng"
- Test các trường chi phí mới

---

**Hoàn thành:** 24/10/2025

