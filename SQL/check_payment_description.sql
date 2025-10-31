-- Script to check payment_description column and data
USE tim_tro;

-- Check if column exists
SHOW COLUMNS FROM rooms LIKE 'payment_description';

-- Check rooms that have QR codes
SELECT 
    id, 
    name, 
    payment_qr_image_url IS NOT NULL as has_qr,
    payment_description
FROM rooms 
WHERE payment_qr_image_url IS NOT NULL
LIMIT 5;

-- Check all columns in rooms table
DESCRIBE rooms;

