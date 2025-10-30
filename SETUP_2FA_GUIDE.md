# Hướng dẫn Setup và Test 2FA với QR Code

## 📋 Tổng quan

Đã tích hợp đầy đủ chức năng 2FA (Two-Factor Authentication) vào frontend với khả năng hiển thị mã QR theo chuẩn library **java-totp** (https://github.com/samdjstevens/java-totp).

## ✅ Đã Hoàn Thành

### Backend (Đã có sẵn):
- ✅ Library `dev.samstevens.totp:totp:1.7.1` trong `pom.xml`
- ✅ Service `AuthenticationService` với các method:
  - `generateMfaSetup()` - Tạo secret và QR code
  - `enableMfa()` - Kích hoạt 2FA
  - `disableMfa()` - Tắt 2FA
  - `verifyMfaCode()` - Xác thực mã OTP
- ✅ Controller endpoints:
  - `GET /auth/mfa/setup` - Lấy QR code
  - `POST /auth/mfa/enable` - Bật 2FA
  - `POST /auth/mfa/disable` - Tắt 2FA
  - `GET /auth/mfa/status` - Kiểm tra trạng thái
- ✅ Database columns: `mfa_secret`, `mfa_enabled`

### Frontend (Vừa hoàn thành):
- ✅ State management cho 2FA
- ✅ Hiển thị mã QR từ backend
- ✅ Input mã xác minh 6 số
- ✅ Enable/Disable 2FA
- ✅ Regenerate QR code
- ✅ UI responsive và đẹp mắt

## 🚀 Cách Test

### 1. Khởi động ứng dụng

```bash
# Backend (Terminal 1)
cd Group2_timtro
mvn spring-boot:run

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### 2. Cài đặt ứng dụng Authenticator

Tải một trong các ứng dụng sau:
- **Google Authenticator** (iOS/Android)
- **Microsoft Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)

### 3. Test Flow Bật 2FA

1. **Đăng nhập** vào ứng dụng
2. Vào **Profile** → Tab **Bảo mật**
3. Click nút **"Bật 2FA"**
4. Màn hình sẽ hiển thị:
   - ✅ Mã QR (được generate từ backend)
   - ✅ Input nhập mã 6 số
   - ✅ Các nút: Tạo lại mã, Hủy, Xác thực

5. **Quét mã QR** bằng ứng dụng Authenticator:
   - Mở app Authenticator
   - Chọn "Scan QR code"
   - Quét mã QR trên màn hình
   
6. **Nhập mã xác minh**:
   - App Authenticator sẽ hiển thị mã 6 số
   - Nhập mã đó vào ô input
   - Click **"Xác thực"**

7. ✅ Thành công! Sẽ hiển thị thông báo "Đã bật 2FA thành công!"

### 4. Test Flow Tắt 2FA

1. Vào **Profile** → Tab **Bảo mật**
2. Click nút **"Tắt 2FA"** (màu đỏ)
3. Nhập mã 6 số từ app Authenticator
4. Click **"Xác nhận tắt"**
5. ✅ Thành công! 2FA đã được tắt

### 5. Test Login với 2FA (Nếu đã có flow login 2FA)

Sau khi bật 2FA:
1. Đăng xuất
2. Đăng nhập lại bằng email/password
3. Hệ thống sẽ yêu cầu nhập mã 6 số từ Authenticator
4. Nhập mã và click xác nhận
5. ✅ Đăng nhập thành công!

## 🔧 API Endpoints

### 1. GET /auth/mfa/setup
**Mô tả**: Tạo secret và QR code mới

**Request**: 
```
GET /auth/mfa/setup
Headers: Authorization: Bearer {token}
```

**Response**:
```json
{
  "secret": "BP26TDZUZ5SVPZJRIHCAUVREO5EWMHHV",
  "qrCodeDataUri": "data:image/png;base64,iVBORw0KGgoAAAANSU..."
}
```

### 2. POST /auth/mfa/enable
**Mô tả**: Kích hoạt 2FA sau khi xác thực mã

**Request**:
```json
POST /auth/mfa/enable
Headers: Authorization: Bearer {token}
Body: {
  "secret": "BP26TDZUZ5SVPZJRIHCAUVREO5EWMHHV",
  "code": "123456"
}
```

**Response**:
```
"2FA đã được bật thành công"
```

### 3. POST /auth/mfa/disable
**Mô tả**: Tắt 2FA

**Request**:
```json
POST /auth/mfa/disable
Headers: Authorization: Bearer {token}
Body: {
  "code": "123456"
}
```

**Response**:
```
"2FA đã được tắt thành công"
```

### 4. GET /auth/mfa/status
**Mô tả**: Kiểm tra trạng thái 2FA

**Request**:
```
GET /auth/mfa/status
Headers: Authorization: Bearer {token}
```

**Response**:
```json
true // hoặc false
```

## 📱 UI States

### Trạng thái 1: Chưa bật 2FA
- Hiển thị nút "Bật 2FA"
- Hiển thị thông tin cảnh báo về bảo mật
- Không hiển thị QR code

### Trạng thái 2: Đang setup 2FA
- Hiển thị mã QR (image từ backend)
- Hiển thị input nhập mã 6 số
- Hiển thị 3 nút: Tạo lại mã, Hủy, Xác thực
- Nút "Xác thực" disabled khi chưa đủ 6 số

### Trạng thái 3: Đã bật 2FA
- Hiển thị nút "Tắt 2FA" (màu đỏ)
- Hiển thị badge "✓ Đã bật"
- Hiển thị thông báo thành công màu xanh

### Trạng thái 4: Đang tắt 2FA
- Hiển thị form nhập mã xác minh
- Hiển thị nút: Hủy, Xác nhận tắt

## 🎨 UI Features

1. **QR Code**: 
   - Hiển thị dưới dạng image tag với src là data URI
   - Kích thước tối đa 250px
   - Auto-scale responsive

2. **Input mã xác minh**:
   - Chỉ chấp nhận số (0-9)
   - Tối đa 6 ký tự
   - Letter-spacing để dễ đọc
   - Focus state đẹp mắt

3. **Buttons**:
   - Disabled state khi đang xử lý
   - Disabled khi chưa đủ 6 số
   - Hover effects
   - Loading text

4. **Toast notifications**:
   - Thành công: màu xanh
   - Lỗi: màu đỏ
   - Auto-dismiss sau 3 giây

## 🔐 Security Notes

1. **Secret Key**:
   - Được generate ngẫu nhiên 32 ký tự
   - Chỉ hiển thị 1 lần khi setup
   - Không được lưu ở frontend

2. **Verification Code**:
   - 6 số
   - Expire sau 30 giây (standard TOTP)
   - Cho phép sai lệch ±30 giây (discrepancy = 1)

3. **QR Code**:
   - Format: Data URI (base64 encoded PNG)
   - Contains: email, secret, issuer name
   - Algorithm: SHA1 (standard)

## 🐛 Troubleshooting

### Lỗi: "Mã xác minh không đúng"
- ✅ Kiểm tra thời gian hệ thống (phải đồng bộ)
- ✅ Đảm bảo nhập đúng mã 6 số từ app
- ✅ Mã sẽ thay đổi sau 30 giây

### Lỗi: "Không thể tạo mã QR"
- ✅ Kiểm tra backend đang chạy
- ✅ Kiểm tra token authorization
- ✅ Xem log backend để biết lỗi chi tiết

### Lỗi: "2FA đã được bật"
- ✅ Cần tắt 2FA trước khi setup lại
- ✅ Hoặc reset database: `mysql < reset_2fa_user.sql`

## 📖 Tham khảo

- **java-totp Library**: https://github.com/samdjstevens/java-totp
- **TOTP RFC 6238**: https://tools.ietf.org/html/rfc6238
- **Google Authenticator**: https://support.google.com/accounts/answer/1066447

## 🎉 Kết luận

✅ 2FA đã được tích hợp đầy đủ với:
- Backend generate QR code chuẩn TOTP
- Frontend hiển thị QR code và xử lý flow
- UI/UX đẹp và dễ sử dụng
- Security đúng chuẩn

**Ready to test!** 🚀

