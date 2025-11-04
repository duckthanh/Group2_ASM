-- Select database first (change 'timtro' to your actual database name)
USE tim_tro;

-- Add payment QR image URL to rooms table
ALTER TABLE rooms 
ADD COLUMN payment_qr_image_url TEXT;

-- Add uploaded_by column to documents table
ALTER TABLE documents 
ADD COLUMN uploaded_by VARCHAR(50);

-- Update existing documents to set uploaded_by as TENANT (default assumption)
UPDATE documents 
SET uploaded_by = 'TENANT' 
WHERE uploaded_by IS NULL;

