-- Migration: Update room availability from "Đã cho thuê" to "Hết phòng"

USE tim_tro;

-- Temporarily disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Update existing rooms with "Đã cho thuê" to "Hết phòng"
UPDATE rooms 
SET availability = 'Hết phòng'
WHERE availability = 'Đã cho thuê';

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Verify the update
SELECT id, name, availability, is_available 
FROM rooms 
WHERE availability IN ('Hết phòng', 'Đã cho thuê', 'Còn trống', 'Sắp trống');

