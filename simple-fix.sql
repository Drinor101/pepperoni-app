-- Simple fix: Clear users table and add admin back
DELETE FROM users;
INSERT INTO users (username, password, role) VALUES ('admin', 'admin', 'admin'); 