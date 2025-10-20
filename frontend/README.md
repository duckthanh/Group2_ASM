# 🏠 TimTrọ Frontend

> React + Vite web application for finding rental rooms in Vietnam

## ✨ Features

- 🔐 User Authentication (Login/Register)
- 🏠 Browse rental rooms with beautiful cards
- 🔍 Real-time search functionality
- 📱 Fully responsive design
- 🎨 Modern dark theme UI
- ⚡ Fast and optimized with Vite

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## 📂 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── components/     # Các component tái sử dụng (Navbar, RoomCard, etc.)
│   ├── pages/          # Các trang (Home, Login, Register, RoomList)
│   ├── services/       # API calls (axios)
│   ├── assets/         # Images, CSS
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── public/             # Static files
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## 🔗 API Endpoints (Backend)

Backend cần cung cấp các REST API endpoints sau:

### Auth
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Rooms
- `GET /api/rooms` - Lấy tất cả phòng
- `GET /api/rooms/type/{type}` - Lấy phòng theo loại
- `GET /api/rooms/search?type={type}&keyword={keyword}` - Tìm kiếm phòng
- `GET /api/rooms/{id}` - Lấy chi tiết phòng

## ⚙️ Configuration

- Frontend port: **3000**
- Backend port: **8080**
- Proxy: Vite đã được config để proxy `/api` requests tới backend

## 📝 To-Do

- [ ] Copy CSS từ `src/main/resources/static/css/app.css` sang `frontend/src/index.css`
- [ ] Tạo các components: Navbar, RoomCard, Footer
- [ ] Tạo các pages: Home, Login, Register, RoomList
- [ ] Chuyển backend sang REST API
- [ ] Thêm JWT authentication vào backend
- [ ] Config CORS trong backend

