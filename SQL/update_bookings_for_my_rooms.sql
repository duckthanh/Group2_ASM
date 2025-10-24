-- Update bookings table for My Rooms feature

-- Add new columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_id VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS hold_expires_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deposit_amount DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS deposit_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deposit_receipt_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS lease_start DATE,
ADD COLUMN IF NOT EXISTS lease_end DATE,
ADD COLUMN IF NOT EXISTS contract_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS contract_pdf_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
ADD COLUMN IF NOT EXISTS canceled_by VARCHAR(50);

-- Update existing bookings with booking_id if null
UPDATE bookings 
SET booking_id = CONCAT('BK-', YEAR(CURRENT_DATE), '-', LPAD(id, 5, '0'))
WHERE booking_id IS NULL;

-- Update status values to new format
UPDATE bookings SET status = 'HOLD' WHERE status = 'PENDING' AND is_deposit = FALSE;
UPDATE bookings SET status = 'DEPOSITED' WHERE status = 'PENDING' AND is_deposit = TRUE;
UPDATE bookings SET status = 'ACTIVE' WHERE status = 'CONFIRMED';
UPDATE bookings SET status = 'ENDED' WHERE status = 'COMPLETED';
UPDATE bookings SET status = 'CANCELED' WHERE status = 'CANCELLED';

-- Set contract status for existing bookings
UPDATE bookings SET contract_status = 'PENDING' WHERE contract_status IS NULL AND status IN ('HOLD', 'DEPOSITED');
UPDATE bookings SET contract_status = 'SIGNED' WHERE contract_status IS NULL AND status IN ('ACTIVE', 'ENDED');

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    month VARCHAR(7) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL,
    receipt_url VARCHAR(500),
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    due_date TIMESTAMP,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    photos TEXT,
    status VARCHAR(50) NOT NULL,
    landlord_response TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_issues_booking ON issues(booking_id);
CREATE INDEX IF NOT EXISTS idx_documents_booking ON documents(booking_id);

-- Display updated structure
DESCRIBE bookings;
SHOW TABLES;

