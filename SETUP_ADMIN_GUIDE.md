# 🔧 HƯỚNG DẪN SETUP ADMIN & QUYỀN

## 📋 **MỤC ĐÍCH**
File này tổng hợp **TẤT CẢ** các bước cần thiết để setup admin và phân quyền cho hệ thống Shop ERP.

---

## 🎯 **BƯỚC 1: ĐĂNG KÝ TÀI KHOẢN ADMIN**

### Frontend:
```
http://localhost:5173/auth/register
```

**Điền thông tin:**
- Email: `admin@shop.com`
- Password: `admin123`
- Full Name: `Administrator`
- Phone: `0123456789`

### Hoặc dùng Postman:
```http
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

{
  "email": "admin@shop.com",
  "password": "admin123",
  "fullname": "Administrator",
  "phoneNumber": "0123456789"
}
```

---

## 🎯 **BƯỚC 2: ACTIVE TÀI KHOẢN (nếu cần)**

```sql
-- Kích hoạt tài khoản
UPDATE users 
SET status = 'ACTIVE', 
    is_email_verified = true 
WHERE email = 'admin@shop.com';
```

---

## 🎯 **BƯỚC 3: TẠO EMPLOYEE VÀ GÁN ROLE ADMIN**

### File SQL: `setup_admin_permissions.sql`

```sql
-- Bước 1: Tạo employee cho user admin
DO $$
DECLARE
    v_user_id INTEGER;
    v_employee_id INTEGER;
BEGIN
    -- Lấy user_id
    SELECT id INTO v_user_id FROM users WHERE email = 'admin@shop.com';
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User admin@shop.com không tồn tại!';
    END IF;

    -- Kiểm tra employee đã tồn tại chưa
    SELECT id INTO v_employee_id FROM employees WHERE user_id = v_user_id;
    
    IF v_employee_id IS NULL THEN
        -- Tạo employee mới
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
        ) RETURNING id INTO v_employee_id;
        
        RAISE NOTICE 'Created employee with ID: %', v_employee_id;
    ELSE
        RAISE NOTICE 'Employee already exists with ID: %', v_employee_id;
    END IF;
END $$;

-- Bước 2: Gán role ADMIN
DO $$
DECLARE
    v_user_id INTEGER;
    v_admin_role_id INTEGER;
    v_existing_role INTEGER;
BEGIN
    SELECT id INTO v_user_id FROM users WHERE email = 'admin@shop.com';
    SELECT id INTO v_admin_role_id FROM roles WHERE name = 'ADMIN';
    
    IF v_admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Role ADMIN không tồn tại trong database!';
    END IF;
    
    -- Kiểm tra đã có role chưa
    SELECT 1 INTO v_existing_role 
    FROM user_roles 
    WHERE user_id = v_user_id AND role_id = v_admin_role_id;
    
    IF v_existing_role IS NULL THEN
        INSERT INTO user_roles (user_id, role_id) 
        VALUES (v_user_id, v_admin_role_id);
        RAISE NOTICE 'Assigned ADMIN role to user';
    ELSE
        RAISE NOTICE 'User already has ADMIN role';
    END IF;
END $$;

-- Bước 3: Kiểm tra
SELECT 
    u.email,
    u.status,
    e.employee_code,
    r.name as role_name
FROM users u
LEFT JOIN employees e ON e.user_id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'admin@shop.com';
```

---

## 🎯 **BƯỚC 4: THÊM ROLE KHÁC (nếu cần)**

### Gán role PURCHASING_MANAGER:
```sql
DO $$
DECLARE
    v_user_id INTEGER;
    v_role_id INTEGER;
BEGIN
    SELECT id INTO v_user_id FROM users WHERE email = 'admin@shop.com';
    SELECT id INTO v_role_id FROM roles WHERE name = 'PURCHASING_MANAGER';
    
    IF NOT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = v_user_id AND role_id = v_role_id
    ) THEN
        INSERT INTO user_roles (user_id, role_id) 
        VALUES (v_user_id, v_role_id);
        RAISE NOTICE 'Added PURCHASING_MANAGER role';
    END IF;
END $$;
```

---

## 🎯 **BƯỚC 5: LOGIN VÀ KIỂM TRA**

### Frontend Login:
```
http://localhost:5173/auth/login
Email: admin@shop.com
Password: admin123
```

### Kiểm tra trong DevTools Console:
```javascript
// Mở Console (F12)
console.log('User:', localStorage.getItem('auth_user'))
console.log('Token:', localStorage.getItem('auth_token'))
```

### Kiểm tra bằng API:
```http
GET http://localhost:8080/api/v1/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response mong đợi:**
```json
{
  "id": 1,
  "email": "admin@shop.com",
  "fullname": "Administrator",
  "roles": ["ADMIN", "PURCHASING_MANAGER"],
  "permissions": [...]
}
```

---

## 🔍 **TROUBLESHOOTING**

### Lỗi: 403 Forbidden khi gọi API

**Nguyên nhân:** User chưa có role hoặc endpoint yêu cầu role khác

**Giải pháp:**
```sql
-- Kiểm tra role của user
SELECT u.email, r.name as role
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'admin@shop.com';

-- Nếu không có role → Chạy lại BƯỚC 3
```

---

### Lỗi: 401 Unauthorized

**Nguyên nhân:** Token hết hạn hoặc không hợp lệ

**Giải pháp:**
1. Logout
2. Clear localStorage
3. Login lại

---

### Lỗi: User không tồn tại

**Nguyên nhân:** Chưa register hoặc bị xóa

**Giải pháp:**
```sql
-- Kiểm tra user
SELECT * FROM users WHERE email = 'admin@shop.com';

-- Nếu không có → Chạy lại BƯỚC 1
```

---

### Lỗi: Employee không tồn tại

**Nguyên nhân:** Chưa tạo employee record

**Giải pháp:**
```sql
-- Kiểm tra employee
SELECT e.*, u.email 
FROM employees e
JOIN users u ON u.id = e.user_id
WHERE u.email = 'admin@shop.com';

-- Nếu không có → Chạy lại BƯỚC 3
```

---

## 📊 **DANH SÁCH ROLES TRONG HỆ THỐNG**

Theo schema database, hệ thống có các roles sau:

1. **ADMIN** - Quản trị viên (toàn quyền)
2. **SALES_MANAGER** - Quản lý bán hàng
3. **PURCHASING_MANAGER** - Quản lý mua hàng
4. **WAREHOUSE_MANAGER** - Quản lý kho
5. **ACCOUNTANT** - Kế toán
6. **SALES_STAFF** - Nhân viên bán hàng

---

## 📝 **SCRIPT NHANH - TẤT CẢ TRONG 1**

### File: `setup_admin_quick.sql`

```sql
-- ====================
-- SETUP ADMIN COMPLETE
-- ====================

-- 1. Active user
UPDATE users 
SET status = 'ACTIVE', is_email_verified = true 
WHERE email = 'admin@shop.com';

-- 2. Tạo employee và gán role
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
        RAISE EXCEPTION 'User not found!';
    END IF;

    -- Create employee if not exists
    INSERT INTO employees (
        user_id, employee_code, full_name, email, 
        phone_number, hire_date, status
    ) VALUES (
        v_user_id, 'ADMIN001', 'Administrator', 'admin@shop.com',
        '0123456789', CURRENT_DATE, 'ACTIVE'
    )
    ON CONFLICT (user_id) DO NOTHING
    RETURNING id INTO v_employee_id;

    -- Assign ADMIN role
    SELECT id INTO v_admin_role_id FROM roles WHERE name = 'ADMIN';
    INSERT INTO user_roles (user_id, role_id) 
    VALUES (v_user_id, v_admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;

    -- Assign PURCHASING_MANAGER role
    SELECT id INTO v_pm_role_id FROM roles WHERE name = 'PURCHASING_MANAGER';
    INSERT INTO user_roles (user_id, role_id) 
    VALUES (v_user_id, v_pm_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;

    RAISE NOTICE '✅ Setup complete!';
END $$;

-- 3. Verify
SELECT 
    u.email,
    u.status,
    e.employee_code,
    ARRAY_AGG(r.name) as roles
FROM users u
LEFT JOIN employees e ON e.user_id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.email = 'admin@shop.com'
GROUP BY u.id, u.email, u.status, e.employee_code;
```

---

## ✅ **CHECKLIST**

- [ ] 1. Đã register user `admin@shop.com`
- [ ] 2. Đã active user (status = ACTIVE)
- [ ] 3. Đã tạo employee record
- [ ] 4. Đã gán role ADMIN
- [ ] 5. Đã login thành công
- [ ] 6. Đã kiểm tra token có roles
- [ ] 7. Đã test gọi API thành công

---

## 🚀 **DONE!**

Sau khi hoàn tất các bước trên, bạn có thể:
- ✅ Login với `admin@shop.com`
- ✅ Truy cập tất cả trang trong Admin Panel
- ✅ Gọi tất cả API endpoints
- ✅ Quản lý users, roles, permissions

**LƯU Ý:** Backend phải có data về roles trong bảng `roles` trước khi chạy script!

