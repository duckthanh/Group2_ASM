# KHẮC PHỤC LỖI DATABASE - "Failed to configure a DataSource"

## 🔴 LỖI
```
Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured.
```

## ✅ GIẢI PHÁP

### Bước 1: Kiểm tra MySQL đã chạy chưa

**Trên Windows:**
1. Mở **Services** (nhấn `Win + R`, gõ `services.msc`)
2. Tìm "**MySQL**" trong danh sách
3. Nếu chưa chạy, click phải → **Start**

**Hoặc dùng Command Prompt (Admin):**
```cmd
net start MySQL80
```

### Bước 2: Tạo Database `tim_tro`

1. Mở **MySQL Workbench** hoặc **phpMyAdmin**

2. Hoặc dùng command line:
```bash
mysql -u root -p
```

3. Nhập mật khẩu MySQL (theo file config: `21112004`)

4. Tạo database:
```sql
CREATE DATABASE IF NOT EXISTS tim_tro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Kiểm tra:
```sql
SHOW DATABASES;
```

6. Thoát:
```sql
EXIT;
```

### Bước 3: Kiểm tra lại thông tin kết nối

File: `src/main/resources/application.yaml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tim_tro
    username: root
    password: 21112004  # ← Kiểm tra mật khẩu này có đúng không
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**Nếu mật khẩu MySQL của bạn khác:**
- Đổi `password: 21112004` thành mật khẩu đúng của bạn

**Nếu port MySQL khác (không phải 3306):**
- Đổi `localhost:3306` thành port đúng

### Bước 4: Chạy lại ứng dụng

```bash
mvn spring-boot:run
```

Hoặc trong IntelliJ IDEA: Click nút **Run** (Shift + F10)

---

## 📋 KIỂM TRA NHANH

### Test kết nối MySQL:
```bash
mysql -u root -p -h localhost -P 3306
```

Nếu kết nối thành công → MySQL đang chạy ✅

### Kiểm tra database đã tồn tại:
```sql
mysql -u root -p -e "SHOW DATABASES LIKE 'tim_tro';"
```

---

## ⚠️ LƯU Ý VỀ LỖI TẠO QR CODE 2FA

Sau khi fix lỗi database này, về lỗi tạo QR code 2FA bạn đã gặp:

### Nguyên nhân:
- User không có JWT token hợp lệ trong localStorage
- Phiên đăng nhập đã hết hạn

### Giải pháp:
✅ **Tôi đã fix code**:
1. ✅ Sửa `Login.jsx` - Xử lý flow 2FA đúng cách
2. ✅ Sửa `api.js` - Gửi đúng parameters cho verify MFA
3. ✅ Sửa `Profile.jsx` - Kiểm tra token trước khi gọi API MFA

### Cách kiểm tra lại:
1. Đăng xuất tài khoản hiện tại
2. Đăng nhập lại (để có token mới)
3. Vào Profile → Tab "Bảo mật"
4. Click "Bật 2FA" → Sẽ hiện QR code ✅

---

## 🆘 NẾU VẪN LỖI

**Lỗi kết nối MySQL:**
```
Communications link failure
```
→ MySQL chưa chạy hoặc port sai

**Lỗi xác thực:**
```
Access denied for user 'root'@'localhost'
```
→ Mật khẩu sai trong file `application.yaml`

**Lỗi database không tồn tại:**
```
Unknown database 'tim_tro'
```
→ Chưa tạo database `tim_tro`

---

Chúc bạn thành công! 🚀

