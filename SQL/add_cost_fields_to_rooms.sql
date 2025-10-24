-- Migration script to add cost fields to rooms table
-- Run this script in your database to add the new cost columns

USE your_database_name;

-- Add cost fields to rooms table
ALTER TABLE rooms
ADD COLUMN electricity_cost DOUBLE NULL COMMENT 'Tiền điện (VNĐ/kWh hoặc cố định)',
ADD COLUMN water_cost DOUBLE NULL COMMENT 'Tiền nước (VNĐ/m³ hoặc cố định)',
ADD COLUMN internet_cost DOUBLE NULL COMMENT 'Tiền internet (VNĐ/tháng)',
ADD COLUMN parking_fee DOUBLE NULL COMMENT 'Phí giữ xe (VNĐ/tháng)',
ADD COLUMN deposit DOUBLE NULL COMMENT 'Tiền cọc (VNĐ hoặc số tháng)',
ADD COLUMN deposit_type VARCHAR(20) NULL DEFAULT 'MONTHS' COMMENT 'Loại tiền cọc: FIXED (cố định) hoặc MONTHS (số tháng)';

-- Verify the changes
DESCRIBE rooms;

-- Optional: Set some default values for existing rooms (if needed)
-- UPDATE rooms SET deposit = 1, deposit_type = 'MONTHS' WHERE deposit IS NULL;

SELECT 'Migration completed successfully!' AS status;

