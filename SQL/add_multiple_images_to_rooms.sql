-- Migration script to add multiple images support to rooms table
-- Run this script in your database to add additional_images column

USE timtro_db;  -- Thay bằng tên database của bạn

-- Add column to store additional images as JSON array
ALTER TABLE rooms
ADD COLUMN additional_images TEXT NULL COMMENT 'JSON array of additional image URLs';

-- Verify the change
DESCRIBE rooms;

SELECT 'Migration completed successfully! Column additional_images added.' AS status;

