-- ==========================================================================================
-- MINIMAL DATABASE SETUP - CHỈ SETUP CẦN THIẾT CHO AUTHENTICATION & ROLES
-- ==========================================================================================
-- Script này chỉ setup cấu trúc cần thiết, không tạo dữ liệu ảo

-- ==========================================================================================
-- STEP 1: Setup Roles and Permissions (MINIMAL)
-- ==========================================================================================

-- Insert basic roles if they don't exist
INSERT INTO roles (name, description) VALUES 
('ADMIN', 'System Administrator with full access'),
('MANAGER', 'Manager with business access'),
('EMPLOYEE', 'Regular employee access'),
('CUSTOMER', 'Customer access')
ON CONFLICT (name) DO NOTHING;

-- Insert basic permissions if they don't exist
INSERT INTO permissions (name, description) VALUES 
-- Employee management permissions
('EMPLOYEE_READ', 'View employees'),
('EMPLOYEE_WRITE', 'Create/Update employees'),
('EMPLOYEE_DELETE', 'Delete employees'),
-- Customer management permissions
('CUSTOMER_READ', 'View customers'),
('CUSTOMER_WRITE', 'Create/Update customers'),
('CUSTOMER_DELETE', 'Delete customers'),
-- Product management permissions
('PRODUCT_READ', 'View products'),
('PRODUCT_WRITE', 'Create/Update products'),
('PRODUCT_DELETE', 'Delete products'),
-- Order management permissions
('ORDER_READ', 'View orders'),
('ORDER_WRITE', 'Create/Update orders'),
('ORDER_DELETE', 'Delete orders'),
-- Admin permissions
('ADMIN_ACCESS', 'Full admin access')
ON CONFLICT (name) DO NOTHING;

-- ==========================================================================================
-- STEP 2: Assign Permissions to Roles
-- ==========================================================================================

-- Admin role gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Manager role gets most permissions except admin-specific ones
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'MANAGER' 
AND p.name NOT IN ('ADMIN_ACCESS')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Employee role gets basic permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'EMPLOYEE' 
AND p.name IN ('CUSTOMER_READ', 'PRODUCT_READ', 'ORDER_READ', 'ORDER_WRITE')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Customer role gets limited permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'CUSTOMER' 
AND p.name IN ('CUSTOMER_READ')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ==========================================================================================
-- STEP 3: Setup User and Employee for Current User
-- ==========================================================================================

-- First, ensure the user has an employee record
INSERT INTO employees (employee_code, user_id, fullname, position, department, hired_date, is_active)
SELECT 
    'ADMIN001', 
    u.id, 
    COALESCE(c.fullname, SPLIT_PART(u.email, '@', 1)), 
    'System Administrator', 
    'IT Department', 
    CURRENT_DATE,
    true
FROM users u
LEFT JOIN customers c ON u.id = c.user_id
WHERE u.email = 'tranpham.thanhson007@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM employees e WHERE e.user_id = u.id
)
ON CONFLICT (employee_code) DO NOTHING;

-- Assign ADMIN role to the employee
INSERT INTO employee_roles (employee_id, role_id)
SELECT e.id, r.id 
FROM employees e
JOIN users u ON e.user_id = u.id
JOIN roles r ON r.name = 'ADMIN'
WHERE u.email = 'tranpham.thanhson007@gmail.com'
ON CONFLICT (employee_id, role_id) DO NOTHING;

-- ==========================================================================================
-- STEP 4: Verify Setup
-- ==========================================================================================

-- Check user roles and permissions
SELECT 'USER SETUP VERIFICATION:' as info;
SELECT 
    u.email,
    u.status as user_status,
    e.employee_code,
    e.fullname,
    e.position,
    e.department,
    r.name as role_name,
    COUNT(p.name) as permission_count
FROM users u
LEFT JOIN employees e ON u.id = e.user_id
LEFT JOIN employee_roles er ON e.id = er.employee_id
LEFT JOIN roles r ON er.role_id = r.id
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
WHERE u.email = 'tranpham.thanhson007@gmail.com'
GROUP BY u.email, u.status, e.employee_code, e.fullname, e.position, e.department, r.name
ORDER BY r.name;

-- ==========================================================================================
-- NOTES:
-- ==========================================================================================
-- 1. Script này chỉ setup roles, permissions và fix user hiện tại
-- 2. Không tạo dữ liệu ảo như yêu cầu của user
-- 3. User sẽ có thể sử dụng hệ thống với quyền ADMIN
