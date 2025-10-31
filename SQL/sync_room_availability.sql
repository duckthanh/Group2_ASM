-- Sync room availability status between availability and is_available columns

USE tim_tro;

-- Disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Set is_available = TRUE for rooms with "Còn trống"
UPDATE rooms 
SET is_available = TRUE
WHERE availability = 'Còn trống';

-- Set is_available = FALSE for rooms with "Hết phòng"
UPDATE rooms 
SET is_available = FALSE
WHERE availability = 'Hết phòng';

-- Set is_available = TRUE for rooms with "Sắp trống" (still available to book)
UPDATE rooms 
SET is_available = TRUE
WHERE availability = 'Sắp trống';

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Verify the sync
SELECT id, name, availability, is_available 
FROM rooms 
ORDER BY is_available DESC, availability;

