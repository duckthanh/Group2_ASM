-- ============================================
-- SCRIPT TẠO TÀI KHOẢN ADMIN
-- Hệ Thống Tìm Trọ - Group 6
-- ============================================

USE tim_tro;

-- Tắt safe update mode và foreign key checks
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- Lấy ID của admin cũ (nếu có)
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@timtro.com');

-- Xóa các bản ghi liên quan nếu admin đã tồn tại
DELETE FROM bookings WHERE tenant_id = @admin_id;
DELETE FROM bookings WHERE room_id IN (SELECT id FROM rooms WHERE owner_id = @admin_id);
DELETE FROM rooms WHERE owner_id = @admin_id;
DELETE FROM token WHERE user_id = @admin_id;
DELETE FROM user_has_role WHERE user_id = @admin_id;

-- Xóa admin cũ
DELETE FROM users WHERE email = 'admin@timtro.com';

-- Tạo admin mới
-- Email: admin@timtro.com
-- Password: admin123 (đã mã hóa BCrypt)
INSERT INTO users (username, email, password, phone_number, address, role, status) 
VALUES (
    'Admin', 
    'admin@timtro.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    '0123456789', 
    'Hà Nội', 
    'ADMIN',
    'ACTIVE'
);

-- Bật lại safe update mode và foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- Xác nhận admin đã được tạo
SELECT id, username, email, role, status FROM users WHERE email = 'admin@timtro.com';

-- ============================================
-- THÔNG TIN ĐĂNG NHẬP
-- ============================================
-- Email: admin@timtro.com
-- Password: admin123
-- Role: ADMIN
--
-- LƯU Ý: Đổi mật khẩu sau khi đăng nhập lần đầu!
-- ============================================

