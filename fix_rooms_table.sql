-- =====================================================
-- FIX ROOMS TABLE STRUCTURE
-- Chạy script này để sửa lỗi bảng rooms
-- =====================================================

USE tim_tro;

-- Kiểm tra xem bảng rooms có tồn tại không
SELECT 'Checking rooms table structure...' AS status;

-- Xem cấu trúc bảng rooms hiện tại
DESCRIBE rooms;

-- Nếu bảng rooms không tồn tại hoặc thiếu cột id, tạo lại
DROP TABLE IF EXISTS rooms;

-- Tạo lại bảng rooms với cấu trúc đúng
CREATE TABLE rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    additional_images TEXT,
    detail TEXT,
    price DOUBLE NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Filter fields
    room_type VARCHAR(50),
    area DOUBLE,
    capacity INT,
    amenities TEXT,
    availability VARCHAR(50),
    
    -- Cost fields
    electricity_cost DOUBLE,
    water_cost DOUBLE,
    internet_cost DOUBLE,
    parking_fee DOUBLE,
    deposit DOUBLE,
    deposit_type VARCHAR(20),
    
    -- Timestamps
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_owner (user_id),
    INDEX idx_available (is_available),
    INDEX idx_location (location),
    INDEX idx_price (price),
    INDEX idx_room_type (room_type),
    INDEX idx_area (area),
    INDEX idx_capacity (capacity),
    
    -- Foreign key
    CONSTRAINT fk_rooms_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
        
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kiểm tra lại cấu trúc
DESCRIBE rooms;

-- Thêm một số dữ liệu mẫu để test
INSERT INTO rooms (
    name, price, location, contact, user_id, is_available,
    room_type, area, capacity, amenities, availability
) VALUES 
(
    'Phòng trọ đẹp tại Cầu Giấy',
    5000000,
    'Cầu Giấy, Hà Nội',
    '0123456789',
    1,
    TRUE,
    'Nhà trọ / phòng trọ',
    25.0,
    2,
    'Có wifi,Có máy lạnh,Có nóng lạnh',
    'Còn trống'
),
(
    'Căn hộ cao cấp tại Ba Đình',
    12000000,
    'Ba Đình, Hà Nội',
    '0987654321',
    1,
    TRUE,
    'Căn hộ',
    45.0,
    4,
    'Có wifi,Có máy lạnh,Có nóng lạnh,Có ban công',
    'Còn trống'
);

-- Kiểm tra dữ liệu
SELECT 'Sample data inserted:' AS status;
SELECT id, name, price, location, is_available FROM rooms;

SELECT '✅ Rooms table fixed successfully!' AS status;
