-- Complaint Management System sample data
-- The application DataSeeder creates BCrypt users and categories automatically on an empty database.
-- Run this file AFTER the backend has started once if you want additional sample complaint records.
-- It uses the seeded IDs from the default empty database. If IDs differ, adjust them first.

USE complaint_management;

INSERT IGNORE INTO categories(name,description,active) VALUES
('Technical Issue','Technical support complaints',1),('Billing','Billing and invoice complaints',1),('Customer Service','Service quality complaints',1),('Product Complaint','Product quality complaints',1),('Delivery','Delivery and logistics complaints',1),('Account','Account and profile complaints',1),('Website','Website and portal complaints',1),('Other','Other customer complaints',1);

-- Example complaint inserts. User/category IDs are resolved by username/name rather than hard-coded IDs.
INSERT INTO complaints(complaint_number,title,description,status,priority,category_id,created_by_id,created_at,updated_at)
SELECT CONCAT('SMP-',DATE_FORMAT(NOW(),'%Y%m%d'),'-001'),'Unable to login to account','The customer cannot sign in even after resetting the password.', 'SUBMITTED','HIGH',c.id,u.id,NOW(),NOW() FROM categories c JOIN users u ON u.username='user' WHERE c.name='Account' AND NOT EXISTS(SELECT 1 FROM complaints WHERE complaint_number=CONCAT('SMP-',DATE_FORMAT(NOW(),'%Y%m%d'),'-001'));

INSERT INTO complaints(complaint_number,title,description,status,priority,category_id,created_by_id,assigned_to_id,created_at,updated_at)
SELECT CONCAT('SMP-',DATE_FORMAT(NOW(),'%Y%m%d'),'-002'),'Incorrect invoice amount','The latest invoice contains a duplicated charge.', 'IN_PROGRESS','URGENT',c.id,u.id,s.id,NOW(),NOW() FROM categories c JOIN users u ON u.username='sara' JOIN users s ON s.username='support' WHERE c.name='Billing' AND NOT EXISTS(SELECT 1 FROM complaints WHERE complaint_number=CONCAT('SMP-',DATE_FORMAT(NOW(),'%Y%m%d'),'-002'));

INSERT INTO complaints(complaint_number,title,description,status,priority,category_id,created_by_id,created_at,updated_at)
SELECT CONCAT('SMP-',DATE_FORMAT(NOW(),'%Y%m%d'),'-003'),'Website not loading','The customer portal returns a blank page during business hours.', 'UNDER_REVIEW','MEDIUM',c.id,u.id,NOW(),NOW() FROM categories c JOIN users u ON u.username='ali' WHERE c.name='Website' AND NOT EXISTS(SELECT 1 FROM complaints WHERE complaint_number=CONCAT('SMP-',DATE_FORMAT(NOW(),'%Y%m%d'),'-003'));
