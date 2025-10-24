# Backend Features Documentation

## Tổng quan

Document này mô tả chi tiết các tính năng backend mới đã được implement để support các chức năng frontend của trang Room Detail.

## Các tính năng đã implement

### 1. Saved Rooms (Lưu phòng yêu thích)
### 2. Room Reports (Báo cáo tin)
### 3. Viewing Schedules (Đặt lịch xem phòng)

---

## 1. SAVED ROOMS API

### Entity: SavedRoom

```java
@Entity
@Table(name = "saved_rooms")
public class SavedRoom {
    private Long id;
    private User user;           // User who saved the room
    private Room room;           // Room that was saved
    private LocalDateTime savedAt;
}
```

### Endpoints

#### 1.1. Lưu phòng
```
POST /api/saved-rooms/{roomId}
Authentication: Required (JWT)
```

**Response:**
```json
{
  "id": 1,
  "roomId": 123,
  "userId": 456,
  "room": { /* RoomResponse object */ },
  "savedAt": "2025-01-24T10:30:00"
}
```

**Errors:**
- 400: Room already saved
- 404: Room not found / User not found

#### 1.2. Bỏ lưu phòng
```
DELETE /api/saved-rooms/{roomId}
Authentication: Required (JWT)
```

**Response:**
- 200: Success (empty body)

**Errors:**
- 404: Room not found / User not found

#### 1.3. Lấy danh sách phòng đã lưu
```
GET /api/saved-rooms
Authentication: Required (JWT)
```

**Response:**
```json
[
  {
    "id": 1,
    "roomId": 123,
    "userId": 456,
    "room": { /* RoomResponse object */ },
    "savedAt": "2025-01-24T10:30:00"
  },
  ...
]
```

#### 1.4. Kiểm tra phòng đã lưu chưa
```
GET /api/saved-rooms/{roomId}/check
Authentication: Required (JWT)
```

**Response:**
```json
{
  "saved": true
}
```

---

## 2. ROOM REPORTS API

### Entity: RoomReport

```java
@Entity
@Table(name = "room_reports")
public class RoomReport {
    private Long id;
    private Room room;
    private User reporter;
    private String reason;          // "spam", "wrong_price", "fake_images", "other"
    private String description;
    private String status;          // "PENDING", "REVIEWING", "RESOLVED", "REJECTED"
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;
}
```

### Endpoints

#### 2.1. Tạo báo cáo
```
POST /api/reports/rooms/{roomId}
Authentication: Required (JWT)
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "spam",
  "description": "Tin đăng spam, không có thật"
}
```

**Valid reasons:**
- `spam` - Tin spam
- `wrong_price` - Giá sai
- `fake_images` - Ảnh không thật
- `other` - Khác

**Response:**
```json
{
  "id": 1,
  "roomId": 123,
  "reporterId": 456,
  "reporterName": "Nguyễn Văn A",
  "reason": "spam",
  "description": "Tin đăng spam, không có thật",
  "status": "PENDING",
  "reportedAt": "2025-01-24T10:30:00",
  "resolvedAt": null
}
```

#### 2.2. Lấy tất cả báo cáo (Admin only)
```
GET /api/reports
Authentication: Required (JWT + ADMIN role)
```

**Response:**
```json
[
  {
    "id": 1,
    "roomId": 123,
    "reporterId": 456,
    "reporterName": "Nguyễn Văn A",
    "reason": "spam",
    "description": "...",
    "status": "PENDING",
    "reportedAt": "2025-01-24T10:30:00",
    "resolvedAt": null
  },
  ...
]
```

#### 2.3. Lấy báo cáo theo trạng thái
```
GET /api/reports/status/{status}
Authentication: Required (JWT + ADMIN role)
```

**Valid statuses:**
- PENDING
- REVIEWING
- RESOLVED
- REJECTED

#### 2.4. Lấy báo cáo theo phòng
```
GET /api/reports/rooms/{roomId}
Authentication: Required (JWT + ADMIN role)
```

#### 2.5. Cập nhật trạng thái báo cáo
```
PUT /api/reports/{reportId}/status?status=RESOLVED
Authentication: Required (JWT + ADMIN role)
```

**Response:**
```json
{
  "id": 1,
  "roomId": 123,
  "reporterId": 456,
  "reporterName": "Nguyễn Văn A",
  "reason": "spam",
  "description": "...",
  "status": "RESOLVED",
  "reportedAt": "2025-01-24T10:30:00",
  "resolvedAt": "2025-01-24T15:45:00"
}
```

---

## 3. VIEWING SCHEDULES API

### Entity: ViewingSchedule

```java
@Entity
@Table(name = "viewing_schedules")
public class ViewingSchedule {
    private Long id;
    private Room room;
    private User user;
    private LocalDate viewingDate;
    private LocalTime viewingTime;
    private String visitorName;
    private String visitorPhone;
    private String status;          // "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime cancelledAt;
}
```

### Endpoints

#### 3.1. Tạo lịch xem phòng
```
POST /api/viewing-schedules/rooms/{roomId}
Authentication: Required (JWT)
Content-Type: application/json
```

**Request Body:**
```json
{
  "viewingDate": "2025-02-01",
  "viewingTime": "14:00",
  "visitorName": "Nguyễn Văn A",
  "visitorPhone": "0912345678",
  "notes": "Tôi muốn xem phòng vào buổi chiều"
}
```

**Response:**
```json
{
  "id": 1,
  "roomId": 123,
  "roomName": "Phòng trọ gần FTU",
  "userId": 456,
  "userName": "Nguyễn Văn A",
  "viewingDate": "2025-02-01",
  "viewingTime": "14:00:00",
  "visitorName": "Nguyễn Văn A",
  "visitorPhone": "0912345678",
  "status": "PENDING",
  "notes": "Tôi muốn xem phòng vào buổi chiều",
  "createdAt": "2025-01-24T10:30:00",
  "confirmedAt": null,
  "cancelledAt": null
}
```

#### 3.2. Lấy lịch xem phòng của user
```
GET /api/viewing-schedules/my-schedules
Authentication: Required (JWT)
```

**Response:**
```json
[
  {
    "id": 1,
    "roomId": 123,
    "roomName": "Phòng trọ gần FTU",
    "userId": 456,
    "userName": "Nguyễn Văn A",
    "viewingDate": "2025-02-01",
    "viewingTime": "14:00:00",
    "visitorName": "Nguyễn Văn A",
    "visitorPhone": "0912345678",
    "status": "PENDING",
    "notes": "...",
    "createdAt": "2025-01-24T10:30:00",
    "confirmedAt": null,
    "cancelledAt": null
  },
  ...
]
```

#### 3.3. Lấy lịch xem phòng theo phòng
```
GET /api/viewing-schedules/rooms/{roomId}
Authentication: Required (JWT)
```

**Response:** Same as 3.2

#### 3.4. Lấy lịch theo trạng thái
```
GET /api/viewing-schedules/status/{status}
Authentication: Required (JWT)
```

**Valid statuses:**
- PENDING
- CONFIRMED
- CANCELLED
- COMPLETED

#### 3.5. Cập nhật trạng thái lịch
```
PUT /api/viewing-schedules/{scheduleId}/status?status=CONFIRMED
Authentication: Required (JWT + Room Owner or ADMIN)
```

**Response:**
```json
{
  "id": 1,
  "roomId": 123,
  "roomName": "Phòng trọ gần FTU",
  "userId": 456,
  "userName": "Nguyễn Văn A",
  "viewingDate": "2025-02-01",
  "viewingTime": "14:00:00",
  "visitorName": "Nguyễn Văn A",
  "visitorPhone": "0912345678",
  "status": "CONFIRMED",
  "notes": "...",
  "createdAt": "2025-01-24T10:30:00",
  "confirmedAt": "2025-01-24T11:00:00",
  "cancelledAt": null
}
```

#### 3.6. Xóa lịch
```
DELETE /api/viewing-schedules/{scheduleId}
Authentication: Required (JWT + Owner or ADMIN)
```

**Response:**
- 200: Success (empty body)

**Errors:**
- 403: Unauthorized (only creator or admin can delete)

---

## Database Schema

### Bảng saved_rooms
```sql
CREATE TABLE saved_rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    saved_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    UNIQUE (user_id, room_id)
);
```

### Bảng room_reports
```sql
CREATE TABLE room_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reported_at DATETIME NOT NULL,
    resolved_at DATETIME,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (reporter_id) REFERENCES users(id)
);
```

### Bảng viewing_schedules
```sql
CREATE TABLE viewing_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    viewing_date DATE NOT NULL,
    viewing_time TIME NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at DATETIME NOT NULL,
    confirmed_at DATETIME,
    cancelled_at DATETIME,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Frontend Integration

### Import APIs
```javascript
import { savedRoomAPI, roomReportAPI, viewingScheduleAPI } from '../services/api'
```

### Saved Rooms
```javascript
// Lưu phòng
await savedRoomAPI.saveRoom(roomId)

// Bỏ lưu
await savedRoomAPI.unsaveRoom(roomId)

// Lấy danh sách đã lưu
const savedRooms = await savedRoomAPI.getSavedRooms()

// Kiểm tra đã lưu chưa
const { saved } = await savedRoomAPI.checkIfSaved(roomId)
```

### Room Reports
```javascript
// Tạo báo cáo
await roomReportAPI.createReport(roomId, {
  reason: 'spam',
  description: 'Tin đăng spam'
})

// Lấy tất cả báo cáo (Admin)
const reports = await roomReportAPI.getAllReports()

// Cập nhật trạng thái (Admin)
await roomReportAPI.updateReportStatus(reportId, 'RESOLVED')
```

### Viewing Schedules
```javascript
// Đặt lịch
await viewingScheduleAPI.createSchedule(roomId, {
  viewingDate: '2025-02-01',
  viewingTime: '14:00',
  visitorName: 'Nguyễn Văn A',
  visitorPhone: '0912345678',
  notes: 'Optional notes'
})

// Lấy lịch của user
const mySchedules = await viewingScheduleAPI.getMySchedules()

// Cập nhật trạng thái
await viewingScheduleAPI.updateScheduleStatus(scheduleId, 'CONFIRMED')

// Xóa lịch
await viewingScheduleAPI.deleteSchedule(scheduleId)
```

---

## Error Handling

Tất cả APIs đều trả về error với format:
```json
{
  "message": "Error message"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 400: Bad Request (validation error, business logic error)
- 401: Unauthorized (not logged in)
- 403: Forbidden (no permission)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

---

## Security

### Authentication
- Tất cả endpoints yêu cầu JWT token trong header:
  ```
  Authorization: Bearer <access_token>
  ```

### Authorization
- Saved Rooms: User chỉ có thể lưu/bỏ lưu cho chính mình
- Reports: 
  - User có thể tạo báo cáo
  - Admin có thể xem tất cả và cập nhật trạng thái
- Viewing Schedules:
  - User có thể tạo lịch và xem lịch của mình
  - Room owner có thể xem lịch của phòng mình
  - Admin có thể xem tất cả
  - Chỉ creator hoặc admin có thể xóa lịch

---

## Testing

### Postman Collection

#### 1. Save Room
```
POST http://localhost:8080/api/saved-rooms/1
Headers:
  Authorization: Bearer <token>
```

#### 2. Create Report
```
POST http://localhost:8080/api/reports/rooms/1
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "reason": "spam",
  "description": "Test report"
}
```

#### 3. Create Viewing Schedule
```
POST http://localhost:8080/api/viewing-schedules/rooms/1
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "viewingDate": "2025-02-01",
  "viewingTime": "14:00",
  "visitorName": "Test User",
  "visitorPhone": "0912345678",
  "notes": "Test schedule"
}
```

---

## Files Created

### Backend
1. **Entities:**
   - `SavedRoom.java`
   - `RoomReport.java`
   - `ViewingSchedule.java`

2. **DTOs:**
   - Request: `CreateReportRequest.java`, `CreateViewingScheduleRequest.java`
   - Response: `SavedRoomResponse.java`, `RoomReportResponse.java`, `ViewingScheduleResponse.java`

3. **Repositories:**
   - `SavedRoomRepository.java`
   - `RoomReportRepository.java`
   - `ViewingScheduleRepository.java`

4. **Services:**
   - `SavedRoomService.java`
   - `RoomReportService.java`
   - `ViewingScheduleService.java`

5. **Controllers:**
   - `SavedRoomController.java`
   - `RoomReportController.java`
   - `ViewingScheduleController.java`

### Frontend
- Updated `frontend/src/services/api.js` with new API methods

---

## Next Steps

### Phase 1: Database Migration
1. Run migrations to create new tables
2. Test CRUD operations

### Phase 2: Integration Testing
1. Test all endpoints with Postman
2. Verify authentication/authorization
3. Test error cases

### Phase 3: Frontend Integration
1. Test save/unsave functionality
2. Test report submission
3. Test viewing schedule booking
4. Verify toast notifications

### Phase 4: Production
1. Deploy backend with new features
2. Update frontend to use new APIs
3. Monitor logs for errors
4. Collect user feedback

---

## Support & Maintenance

### Monitoring
- Log all API calls
- Track error rates
- Monitor database performance

### Future Enhancements
1. Email notifications for schedule confirmations
2. SMS notifications
3. Admin dashboard for reports management
4. Analytics for saved rooms
5. Recommendation system based on saved rooms

---

**Version**: 1.0.0  
**Date**: 2025-01-24  
**Status**: ✅ Completed & Ready for Testing

