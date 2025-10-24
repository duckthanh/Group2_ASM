-- =====================================================
-- SQL Migration Script for New Features
-- Created: 2025-01-24
-- Features: Saved Rooms, Room Reports, Viewing Schedules
-- =====================================================

-- =====================================================
-- SELECT YOUR DATABASE FIRST!
-- =====================================================
-- IMPORTANT: Thay 'your_database_name' bằng tên database của bạn
-- Ví dụ: USE timtro_db; hoặc USE group2_timtro;
USE timtro_db;

-- Nếu database khác, uncomment và sửa tên:
-- USE your_database_name;

-- =====================================================
-- 1. SAVED ROOMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS saved_rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    saved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_user_saved_at (user_id, saved_at DESC),
    INDEX idx_room_id (room_id),
    
    -- Unique constraint to prevent duplicate saves
    UNIQUE KEY unique_user_room (user_id, room_id),
    
    -- Foreign keys
    CONSTRAINT fk_saved_rooms_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_rooms_room FOREIGN KEY (room_id) 
        REFERENCES rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. ROOM REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS room_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    reported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    
    -- Indexes for performance
    INDEX idx_room_reported_at (room_id, reported_at DESC),
    INDEX idx_reporter_id (reporter_id),
    INDEX idx_status_reported_at (status, reported_at DESC),
    
    -- Foreign keys
    CONSTRAINT fk_room_reports_room FOREIGN KEY (room_id) 
        REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_room_reports_reporter FOREIGN KEY (reporter_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    -- Check constraints
    CONSTRAINT chk_report_reason CHECK (reason IN ('spam', 'wrong_price', 'fake_images', 'other')),
    CONSTRAINT chk_report_status CHECK (status IN ('PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. VIEWING SCHEDULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS viewing_schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    viewing_date DATE NOT NULL,
    viewing_time TIME NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME NULL,
    cancelled_at DATETIME NULL,
    
    -- Indexes for performance
    INDEX idx_user_viewing_date (user_id, viewing_date DESC),
    INDEX idx_room_viewing_date (room_id, viewing_date DESC),
    INDEX idx_status_viewing_date (status, viewing_date DESC),
    INDEX idx_room_date_time (room_id, viewing_date, viewing_time),
    
    -- Foreign keys
    CONSTRAINT fk_viewing_schedules_room FOREIGN KEY (room_id) 
        REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_viewing_schedules_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    -- Check constraints
    CONSTRAINT chk_schedule_status CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. INSERT SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Note: Uncomment the following lines to insert sample data
-- Make sure to replace user_id and room_id with actual IDs from your database

/*
-- Sample Saved Rooms
INSERT INTO saved_rooms (user_id, room_id, saved_at) VALUES
(1, 1, NOW()),
(1, 2, NOW()),
(2, 1, NOW());

-- Sample Room Reports
INSERT INTO room_reports (room_id, reporter_id, reason, description, status, reported_at) VALUES
(1, 2, 'spam', 'Tin đăng spam, lặp đi lặp lại nhiều lần', 'PENDING', NOW()),
(2, 1, 'wrong_price', 'Giá thực tế cao hơn giá đăng', 'REVIEWING', NOW()),
(3, 3, 'fake_images', 'Ảnh không khớp với thực tế', 'RESOLVED', NOW());

-- Sample Viewing Schedules
INSERT INTO viewing_schedules (room_id, user_id, viewing_date, viewing_time, visitor_name, visitor_phone, status, notes, created_at) VALUES
(1, 2, '2025-02-01', '14:00:00', 'Nguyễn Văn A', '0912345678', 'PENDING', 'Tôi muốn xem phòng vào buổi chiều', NOW()),
(2, 1, '2025-02-02', '09:00:00', 'Trần Thị B', '0987654321', 'CONFIRMED', 'Tôi sẽ đến đúng giờ', NOW()),
(3, 3, '2025-02-03', '15:30:00', 'Lê Văn C', '0901234567', 'CANCELLED', 'Tôi có việc đột xuất', NOW());
*/

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created successfully
SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME IN ('saved_rooms', 'room_reports', 'viewing_schedules');

-- Count records in each table
SELECT 'saved_rooms' AS table_name, COUNT(*) AS record_count FROM saved_rooms
UNION ALL
SELECT 'room_reports' AS table_name, COUNT(*) AS record_count FROM room_reports
UNION ALL
SELECT 'viewing_schedules' AS table_name, COUNT(*) AS record_count FROM viewing_schedules;

-- =====================================================
-- 6. ROLLBACK SCRIPT (Use with caution!)
-- =====================================================

/*
-- To rollback/remove the new tables, uncomment and run:

DROP TABLE IF EXISTS viewing_schedules;
DROP TABLE IF EXISTS room_reports;
DROP TABLE IF EXISTS saved_rooms;
*/

-- =====================================================
-- END OF MIGRATION SCRIPT
-- =====================================================

