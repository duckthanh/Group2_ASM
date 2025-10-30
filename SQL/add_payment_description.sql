-- Migration script to add payment_description column to rooms table
-- This allows landlords to set a payment transfer content/description

USE tim_tro;

-- Add payment_description column to rooms table
ALTER TABLE rooms ADD COLUMN payment_description TEXT COMMENT 'Payment transfer content/description for tenant to use';

-- You can optionally set a default description for existing rooms with QR codes
-- UPDATE rooms 
-- SET payment_description = 'Thanh toan tien phong' 
-- WHERE payment_qr_image_url IS NOT NULL AND payment_description IS NULL;

SELECT 'Migration completed successfully!' AS status;

