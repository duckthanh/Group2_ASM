# 🚀 Hướng dẫn setup Frontend

## Bước 1: Copy CSS

Copy file CSS từ backend sang frontend:

```bash
# Từ thư mục Group2_ASM
copy src\main\resources\static\css\app.css frontend\src\index.css
```

Hoặc copy thủ công:
- **Từ:** `Group2_ASM/src/main/resources/static/css/app.css`
- **Đến:** `Group2_ASM/frontend/src/index.css`

## Bước 2: Cài đặt dependencies

```bash
cd frontend
npm install
```

## Bước 3: Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy ở: http://localhost:3000

## Bước 4: Cấu hình Backend REST API

Backend cần cung cấp các endpoints sau:

### Authentication
- `POST /api/auth/login` - Body: `{ "email": "...", "password": "..." }`
- `POST /api/auth/register` - Body: `{ "username": "...", "email": "...", "password": "...", "phoneNumber": "..." }`

### Rooms  
- `GET /api/rooms` - Lấy tất cả phòng
- `GET /api/rooms/type/{type}` - Lấy phòng theo loại
- `GET /api/rooms/search?type={type}&keyword={keyword}` - Tìm kiếm
- `GET /api/rooms/{id}` - Chi tiết phòng

## ✅ Checklist

- [ ] Copy CSS từ backend sang frontend
- [ ] Cài npm dependencies
- [ ] Chạy frontend (npm run dev)
- [ ] Chuyển backend sang REST API
- [ ] Config CORS trong backend
- [ ] Test kết nối frontend-backend

## 🎯 Sau khi hoàn thành

1. Frontend chạy ở port 3000
2. Backend chạy ở port 8080
3. Vite sẽ tự động proxy các request `/api` sang backend

