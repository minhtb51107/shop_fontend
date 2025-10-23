-- ====================
-- SETUP ADMIN COMPLETE
-- Script nhanh để setup admin sau khi register
-- ====================

-- Bước 1: Active user
UPDATE users 
SET status = 'ACTIVE', 
    is_email_verified = true 
WHERE email = 'admin@shop.com';

-- Bước 2: Tạo employee và gán role
DO $$
DECLARE
    v_user_id INTEGER;
    v_employee_id INTEGER;
    v_admin_role_id INTEGER;
    v_pm_role_id INTEGER;
BEGIN
    -- Get user
    SELECT id INTO v_user_id FROM users WHERE email = 'admin@shop.com';
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User admin@shop.com không tồn tại! Hãy register trước.';
    END IF;

    RAISE NOTICE 'Found user with ID: %', v_user_id;

    -- Create employee if not exists
    SELECT id INTO v_employee_id FROM employees WHERE user_id = v_user_id;
    
    IF v_employee_id IS NULL THEN
        INSERT INTO employees (
            user_id, 
            employee_code, 
            full_name, 
            email, 
            phone_number, 
            hire_date, 
            status
        ) VALUES (
            v_user_id, 
            'ADMIN001', 
            'Administrator', 
            'admin@shop.com',
            '0123456789', 
            CURRENT_DATE, 
            'ACTIVE'
        )
        RETURNING id INTO v_employee_id;
        RAISE NOTICE '✅ Created employee with ID: %', v_employee_id;
    ELSE
        RAISE NOTICE '✅ Employee already exists with ID: %', v_employee_id;
    END IF;

    -- Assign ADMIN role
    SELECT id INTO v_admin_role_id FROM roles WHERE name = 'ADMIN';
    
    IF v_admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Role ADMIN không tồn tại trong database!';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = v_user_id AND role_id = v_admin_role_id
    ) THEN
        INSERT INTO user_roles (user_id, role_id) 
        VALUES (v_user_id, v_admin_role_id);
        RAISE NOTICE '✅ Assigned ADMIN role';
    ELSE
        RAISE NOTICE '✅ User already has ADMIN role';
    END IF;

    -- Assign PURCHASING_MANAGER role (optional)
    SELECT id INTO v_pm_role_id FROM roles WHERE name = 'PURCHASING_MANAGER';
    
    IF v_pm_role_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = v_user_id AND role_id = v_pm_role_id
        ) THEN
            INSERT INTO user_roles (user_id, role_id) 
            VALUES (v_user_id, v_pm_role_id);
            RAISE NOTICE '✅ Assigned PURCHASING_MANAGER role';
        ELSE
            RAISE NOTICE '✅ User already has PURCHASING_MANAGER role';
        END IF;
    END IF;

    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ SETUP COMPLETE!';
    RAISE NOTICE '========================================';
END $$;

-- Bước 3: Verify kết quả
SELECT 
    u.id as user_id,
    u.email,
    u.status,
    u.is_email_verified,
    e.id as employee_id,
    e.employee_code,
    ARRAY_AGG(r.name) as roles
FROM users u
LEFT JOIN employees e ON e.user_id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'admin@shop.com'
GROUP BY u.id, u.email, u.status, u.is_email_verified, e.id, e.employee_code;

