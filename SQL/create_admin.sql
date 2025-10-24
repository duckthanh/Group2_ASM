-- Script tạo tài khoản Admin mặc định
-- Chạy script này trong MySQL Workbench sau khi tạo database

USE tim_tro;

-- Tắt safe update mode tạm thời
SET SQL_SAFE_UPDATES = 0;

-- Xóa admin cũ nếu có (để tạo lại)
DELETE FROM users WHERE email = 'admin@timtro.com';

-- Tạo user admin với mật khẩu đã mã hóa BCrypt (password: admin123)
-- BCrypt hash của "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (username, email, password, phone_number, address, role) 
VALUES (
    'admin', 
    'admin@timtro.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    '0123456789', 
    'Hòa Lạc, Hà Nội', 
    'ADMIN'
);

-- Bật lại safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Note: Mật khẩu mặc định: admin123
-- Bạn nên đổi mật khẩu sau khi đăng nhập lần đầu!

