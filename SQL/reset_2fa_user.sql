-- Script để reset 2FA cho một user cụ thể
-- Thay 'your_email@gmail.com' bằng email thực của bạn

USE tim_tro;

-- Xem trạng thái hiện tại
SELECT id, email, username, mfa_enabled, mfa_secret 
FROM users 
WHERE email = 'your_email@gmail.com';

-- Reset 2FA (tắt và xóa secret)
UPDATE users 
SET mfa_enabled = FALSE, mfa_secret = NULL 
WHERE email = 'your_email@gmail.com';

-- Kiểm tra kết quả
SELECT id, email, username, mfa_enabled, mfa_secret 
FROM users 
WHERE email = 'your_email@gmail.com';

SELECT 'MFA has been reset! You can now setup 2FA again.' AS status;

