USE tim_tro;

SET SQL_SAFE_UPDATES = 0;

DELETE FROM users WHERE email = 'admin@timtro.com';

VALUES (
    'admin@timtro.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    '0123456789', 
);

SET SQL_SAFE_UPDATES = 1;


