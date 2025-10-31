-- Migration: Add room quantity management fields

USE tim_tro;

-- Disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Add total_rooms column if not exists
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = 'tim_tro' 
                   AND TABLE_NAME = 'rooms' 
                   AND COLUMN_NAME = 'total_rooms');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE rooms ADD COLUMN total_rooms INT DEFAULT 1 COMMENT "Total number of rooms available"',
    'SELECT "Column total_rooms already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add available_rooms column if not exists
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_SCHEMA = 'tim_tro' 
                   AND TABLE_NAME = 'rooms' 
                   AND COLUMN_NAME = 'available_rooms');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE rooms ADD COLUMN available_rooms INT DEFAULT 1 COMMENT "Number of rooms currently available"',
    'SELECT "Column available_rooms already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Set default values for existing rooms (assume each room is 1 unit)
UPDATE rooms 
SET total_rooms = 1, available_rooms = 1
WHERE total_rooms IS NULL;

-- For rooms that are not available (hết phòng), set available_rooms to 0
UPDATE rooms 
SET available_rooms = 0
WHERE is_available = FALSE OR availability = 'Hết phòng';

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Verify the migration
SELECT id, name, total_rooms, available_rooms, is_available, availability 
FROM rooms 
ORDER BY id;

