-- Migration SQL để thêm các columns cho 2FA vào bảng users
-- Chạy script này trên database của bạn

USE tim_tro; -- Tên database từ application.yaml

-- Thêm cột mfa_secret để lưu secret key
ALTER TABLE users 
ADD COLUMN mfa_secret VARCHAR(255) NULL COMMENT 'Secret key for 2FA authentication';

-- Thêm cột mfa_enabled để theo dõi trạng thái 2FA
ALTER TABLE users 
ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE NOT NULL COMMENT '2FA enabled status';

-- Kiểm tra kết quả
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT, 
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' 
    AND TABLE_SCHEMA = DATABASE()
    AND COLUMN_NAME IN ('mfa_secret', 'mfa_enabled');

-- Hiển thị thông báo thành công
SELECT 'Migration completed successfully! Columns mfa_secret and mfa_enabled have been added to users table.' AS status;

