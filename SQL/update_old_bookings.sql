-- Select database first (change 'timtro' to your actual database name)
USE tim_tro;

-- Update old bookings that don't have bookingId
-- Generate bookingId for existing bookings
UPDATE bookings 
SET booking_id = CONCAT('BK-', YEAR(created_at), '-', LPAD(id, 5, '0'))
WHERE booking_id IS NULL OR booking_id = '';

-- Verify the update
SELECT id, booking_id, status, created_at 
FROM bookings 
ORDER BY created_at DESC 
LIMIT 10;

