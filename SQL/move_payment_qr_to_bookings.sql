-- Migration: Move payment QR and description from Room to Booking
-- This ensures each booking has its own payment QR code

USE tim_tro;

-- Add columns to bookings table
ALTER TABLE bookings 
ADD COLUMN payment_qr_image_url TEXT COMMENT 'QR code for payment (specific to this booking)',
ADD COLUMN payment_description TEXT COMMENT 'Payment transfer content/description for tenant to use';

-- Optional: Copy existing payment QR from rooms to their active bookings
-- UPDATE bookings b
-- JOIN rooms r ON b.room_id = r.id
-- SET b.payment_qr_image_url = r.payment_qr_image_url,
--     b.payment_description = r.payment_description
-- WHERE r.payment_qr_image_url IS NOT NULL
-- AND b.status IN ('ACTIVE', 'DEPOSITED');

-- Note: We keep the columns in rooms table for backward compatibility
-- You can drop them later if needed:
-- ALTER TABLE rooms DROP COLUMN payment_qr_image_url;
-- ALTER TABLE rooms DROP COLUMN payment_description;

