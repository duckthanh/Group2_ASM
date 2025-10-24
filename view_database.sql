-- Script xem database tim_tro

-- Kết nối: mysql -u root -p123456

USE tim_tro;

-- Xem cấu trúc các bảng
SHOW TABLES;

-- Xem users
SELECT id, username, email, DATE_FORMAT(created_at, '%Y-%m-%d') as created 
FROM users;

-- Xem rooms
SELECT r.id, r.name, r.price, r.location, r.is_available, 
       u.username as owner
FROM rooms r
LEFT JOIN users u ON r.user_id = u.id;

-- Xem bookings
SELECT b.id, b.duration, b.duration_unit, b.move_in_date, 
       b.number_of_people, b.status, b.is_deposit,
       r.name as room_name,
       u.username as tenant
FROM bookings b
LEFT JOIN rooms r ON b.room_id = r.id
LEFT JOIN users u ON b.user_id = u.id;

-- Đếm số lượng
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM rooms) as total_rooms,
  (SELECT COUNT(*) FROM bookings) as total_bookings;

