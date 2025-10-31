-- =====================================================
-- TIM TRO - DATABASE SETUP SCRIPT
-- =====================================================
-- Mục đích: Tạo database và tables cho hệ thống Tìm Trọ
-- Hướng dẫn: 
--   1. Mở MySQL Workbench hoặc command line
--   2. Chạy script này: mysql -u root -p < database_setup.sql
--   3. Hoặc copy từng phần và chạy trong MySQL Workbench
-- =====================================================

-- 1. TẠO DATABASE
DROP DATABASE IF EXISTS tim_tro;
CREATE DATABASE tim_tro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tim_tro;

-- =====================================================
-- 2. TẠO TABLES
-- =====================================================

-- 2.1. USERS TABLE
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'USER', -- USER, LANDLORD, ADMIN
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.2. ROOMS TABLE
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    additional_images TEXT, -- JSON array of image URLs
    detail TEXT,
    price DOUBLE NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Filter fields
    room_type VARCHAR(100), -- 'Nhà trọ', 'Nhà nguyên căn', 'Căn hộ'
    area DOUBLE, -- Diện tích (m²)
    capacity INT, -- Sức chứa (số người)
    amenities TEXT, -- Tiện nghi (comma-separated)
    availability VARCHAR(50), -- 'Còn trống', 'Sắp trống', 'Hết phòng'
    
    -- Cost fields
    electricity_cost DOUBLE,
    water_cost DOUBLE,
    internet_cost DOUBLE,
    parking_fee DOUBLE,
    deposit DOUBLE,
    deposit_type VARCHAR(50), -- 'FIXED' hoặc 'MONTHS'
    
    -- Room quantity management
    total_rooms INT DEFAULT 1,
    available_rooms INT DEFAULT 1,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_location (location),
    INDEX idx_price (price),
    INDEX idx_room_type (room_type),
    INDEX idx_availability (availability)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.3. BOOKINGS TABLE
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) UNIQUE, -- BK-2025-XXXXX format
    room_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    duration INT NOT NULL,
    duration_unit VARCHAR(20) NOT NULL, -- 'MONTH', 'YEAR'
    move_in_date DATE NOT NULL,
    number_of_people INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    note TEXT,
    is_deposit BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, ACTIVE, CANCELLED, COMPLETED
    
    -- Payment QR (specific to this booking)
    payment_qr_image_url TEXT,
    payment_description TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_booking_id (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.4. DOCUMENTS TABLE
CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    document_url TEXT NOT NULL,
    file_name VARCHAR(255),
    document_type VARCHAR(100), -- 'CONTRACT', 'PAYMENT_PROOF', 'ID_CARD', 'OTHER'
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    note TEXT,
    uploaded_by VARCHAR(50), -- 'LANDLORD' or 'TENANT'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_document_type (document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.5. SAVED ROOMS TABLE
CREATE TABLE saved_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved_room (room_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.6. ROOM REPORTS TABLE
CREATE TABLE room_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, REVIEWED, RESOLVED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. INSERT SAMPLE DATA
-- =====================================================

-- 3.1. Sample Users (Password: "123456" đã mã hóa BCrypt)
INSERT INTO users (username, email, password, full_name, phone, role) VALUES
('admin', 'admin@timtro.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'Admin', '0984123289', 'ADMIN'),
('landlord1', 'landlord1@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'Nguyễn Văn Chủ', '0901234567', 'USER'),
('tenant1', 'tenant1@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'Trần Thị Thuê', '0912345678', 'USER'),
('user1', 'user1@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'Lê Văn User', '0923456789', 'USER');

-- 3.2. Sample Rooms
INSERT INTO rooms (name, image_url, detail, price, location, contact, user_id, is_available, room_type, area, capacity, amenities, availability, total_rooms, available_rooms) VALUES
('Phòng trọ cao cấp gần FPT', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', 'Phòng trọ mới xây, đầy đủ tiện nghi, gần trường FPT University', 3000000, 'Thôn 2 Thạch Hòa Thạch Thất', '0984123289', 2, TRUE, 'Nhà trọ', 25, 2, 'Có gác lửng, Có nhà vệ sinh riêng, Có ban công, Có máy lạnh, Có wifi, Cho nấu ăn', 'Còn trống', 5, 5),
('Nhà nguyên căn Hòa Lạc', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', 'Nhà nguyên căn 3 tầng, khu vực yên tĩnh', 8000000, 'Gần chợ Hòa Lạc', '0901234567', 2, TRUE, 'Nhà nguyên căn', 80, 6, 'Có nhà vệ sinh riêng, Có ban công, Có máy lạnh, Có nóng lạnh, Có wifi, Cho nấu ăn, Có nội thất, Gửi xe', 'Còn trống', 1, 1),
('Căn hộ mini thôn 4', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400', 'Căn hộ mini hiện đại, view đẹp', 4500000, 'Thôn 4 Thạch Hòa', '0912345678', 2, TRUE, 'Căn hộ', 35, 2, 'Có nhà vệ sinh riêng, Có ban công, Có máy lạnh, Có wifi, Có nội thất', 'Còn trống', 10, 8),
('Phòng trọ sinh viên giá rẻ', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400', 'Phòng trọ cho sinh viên, giá rẻ, gần trường', 1500000, 'Thôn 5 Thạch Hòa', '0923456789', 3, TRUE, 'Nhà trọ', 20, 2, 'Có wifi, Cho nấu ăn, Gửi xe', 'Còn trống', 1, 1),
('Phòng cao cấp gần FTU', 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400', 'Phòng trọ cao cấp gần ĐH Ngoại Thương', 3500000, 'Gần FTU Hòa Lạc', '0984123289', 2, TRUE, 'Nhà trọ', 28, 2, 'Có gác lửng, Có nhà vệ sinh riêng, Có máy lạnh, Có wifi, Cho nấu ăn', 'Còn trống', 3, 2);

-- 3.3. Sample Bookings
INSERT INTO bookings (booking_id, room_id, tenant_id, duration, duration_unit, move_in_date, number_of_people, phone_number, is_deposit, status) VALUES
('BK-2025-00001', 1, 3, 12, 'MONTH', '2025-11-01', 2, '0912345678', FALSE, 'PENDING'),
('BK-2025-00002', 3, 4, 6, 'MONTH', '2025-11-15', 1, '0923456789', TRUE, 'CONFIRMED');

-- 3.4. Sample Saved Rooms
INSERT INTO saved_rooms (room_id, user_id) VALUES
(1, 3),
(2, 3),
(3, 4);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better query performance
CREATE INDEX idx_rooms_user_available ON rooms(user_id, is_available);
CREATE INDEX idx_bookings_tenant_status ON bookings(tenant_id, status);
CREATE INDEX idx_bookings_room_status ON bookings(room_id, status);

-- =====================================================
-- 5. VERIFICATION QUERIES
-- =====================================================

-- Kiểm tra số lượng dữ liệu
SELECT 'Users' as TableName, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Documents', COUNT(*) FROM documents
UNION ALL
SELECT 'Saved Rooms', COUNT(*) FROM saved_rooms
UNION ALL
SELECT 'Room Reports', COUNT(*) FROM room_reports;

-- =====================================================
-- 6. THÔNG TIN TÀI KHOẢN MẪU
-- =====================================================

/*
TÀI KHOẢN ĐỂ TEST:

1. ADMIN:
   Email: admin@timtro.com
   Password: 123456
   
2. LANDLORD (Chủ trọ):
   Email: landlord1@gmail.com
   Password: 123456
   
3. TENANT (Người thuê):
   Email: tenant1@gmail.com
   Password: 123456
   
4. USER:
   Email: user1@gmail.com
   Password: 123456

LưU Ý:
- Tất cả mật khẩu đã được mã hóa bằng BCrypt
- Mật khẩu gốc đều là: 123456
*/

-- =====================================================
-- HOÀN TẤT!
-- Database đã được tạo thành công với:
-- - 6 tables chính
-- - 4 users mẫu
-- - 5 rooms mẫu
-- - 2 bookings mẫu
-- - 3 saved rooms mẫu
-- =====================================================

