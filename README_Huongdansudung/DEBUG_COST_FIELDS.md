# Debug Chi phí & Điều khoản

## Vấn đề
Đã sửa phòng và điền chi phí nhưng vẫn hiển thị "Chưa cập nhật"

## Các bước kiểm tra

### 1. Kiểm tra Database có columns mới chưa

Chạy SQL này trong MySQL Workbench:

```sql
USE timtro_db;  -- Thay bằng tên database của bạn
DESCRIBE rooms;
```

**Kết quả mong đợi:** Phải thấy các cột:
- `electricity_cost`
- `water_cost`
- `internet_cost`
- `parking_fee`
- `deposit`
- `deposit_type`

**Nếu KHÔNG thấy:** Chạy migration script:
```sql
USE timtro_db;

ALTER TABLE rooms
ADD COLUMN electricity_cost DOUBLE NULL,
ADD COLUMN water_cost DOUBLE NULL,
ADD COLUMN internet_cost DOUBLE NULL,
ADD COLUMN parking_fee DOUBLE NULL,
ADD COLUMN deposit DOUBLE NULL,
ADD COLUMN deposit_type VARCHAR(20) NULL DEFAULT 'MONTHS';
```

### 2. Kiểm tra dữ liệu trong database

```sql
SELECT id, name, price, electricity_cost, water_cost, internet_cost, 
       parking_fee, deposit, deposit_type
FROM rooms
WHERE id = 14;  -- Thay bằng ID phòng bạn vừa sửa
```

**Nếu các cột chi phí = NULL:** Dữ liệu chưa được lưu.

### 3. Kiểm tra Console trong Browser

1. Mở trang chi tiết phòng
2. Nhấn F12 → Tab Console
3. Tìm request GET `/api/rooms/{id}`
4. Xem response có chứa các field này không:
   - `electricityCost`
   - `waterCost`
   - `internetCost`
   - `parkingFee`
   - `deposit`
   - `depositType`

### 4. Test sửa phòng với Console log

**Cách test:**

1. Mở trang chi tiết phòng
2. Click "Sửa phòng"
3. Điền thông tin chi phí:
   - Tiền điện: 3500
   - Tiền nước: 20000
   - Internet: 100000
   - Phí giữ xe: 50000
   - Tiền cọc: 1
   - Loại: Số tháng
4. Mở Console (F12) TRƯỚC KHI nhấn "Lưu"
5. Nhấn "Lưu thay đổi"
6. Xem trong Console:
   - Request payload có chứa các field chi phí không?
   - Response có trả về đúng không?

### 5. Kiểm tra Backend Logs

Trong terminal backend, khi bạn lưu phòng, xem có log gì không.

## Giải pháp nhanh

### Nếu database chưa có columns:

```sql
USE timtro_db;  -- Đổi tên database

ALTER TABLE rooms
ADD COLUMN electricity_cost DOUBLE NULL,
ADD COLUMN water_cost DOUBLE NULL,
ADD COLUMN internet_cost DOUBLE NULL,
ADD COLUMN parking_fee DOUBLE NULL,
ADD COLUMN deposit DOUBLE NULL,
ADD COLUMN deposit_type VARCHAR(20) NULL DEFAULT 'MONTHS';
```

### Nếu đã có columns nhưng không lưu:

Restart backend:
```bash
cd "C:\Users\phong\Downloads\New folder - Copy\Group2_ASM"
.\mvnw.cmd spring-boot:run
```

## Test Case đầy đủ

1. **Chạy migration SQL** (nếu chưa)
2. **Restart backend**
3. **Clear browser cache** (Ctrl + F5)
4. **Test sửa phòng:**
   - Vào chi tiết phòng bất kỳ
   - Click "Sửa phòng"
   - Điền đầy đủ chi phí
   - Lưu
5. **Refresh trang**
6. **Kiểm tra "Chi phí & điều khoản"**

## Expected Result

Sau khi sửa phòng và điền:
- Tiền điện: 3500
- Tiền nước: 20000
- Internet: 100000
- Phí giữ xe: 50000
- Tiền cọc: 1 (Số tháng)

Phải hiển thị:
```
Chi phí & điều khoản

Tiền phòng       30.000.000đ/tháng
Tiền điện        3.500đ/kWh
Tiền nước        20.000đ/m³
Internet         100.000đ/tháng
Phí giữ xe       50.000đ/tháng
Tiền cọc         1 tháng
```

## Troubleshooting

### Case 1: Database không có columns
➜ Chạy migration SQL ở bước 1

### Case 2: Database có columns nhưng không lưu
➜ Restart backend

### Case 3: Backend lưu nhưng frontend không hiển thị
➜ Clear cache và refresh (Ctrl + F5)

### Case 4: Tất cả đều ok nhưng vẫn lỗi
➜ Kiểm tra Console logs để xem lỗi cụ thể

---

**Bước tiếp theo:** Hãy chạy các lệnh SQL kiểm tra database và cho tôi biết kết quả!

