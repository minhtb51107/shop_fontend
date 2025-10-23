-- ==========================================================================================
-- SCRIPT INSERT DỮ LIỆU MẪU - THEO ĐÚNG CẤU TRÚC MODULE
-- ==========================================================================================
-- LƯU Ý: 
-- 1. Script này KHÔNG chỉ định ID, để PostgreSQL tự động tăng
-- 2. Chạy TOÀN BỘ script này SAU KHI đã chạy schema creation script
-- 3. Script có thể chạy nhiều lần (sẽ xóa dữ liệu cũ trước)
-- ==========================================================================================

-- ===================================================================
-- XÓA DỮ LIỆU CŨ (Chỉ xóa dữ liệu, giữ cấu trúc bảng)
-- ===================================================================
TRUNCATE TABLE return_items, returns, warranty_cases, shipments, payments, promotion_applied_orders,
order_items, order_status_history, orders, promotion_campaigns, inventory_transactions, inventory,
product_price_history, goods_receipt_items, purchase_order_items, product_variants, product_specs_phone,
product_specs_laptop, product_images, products, product_categories, brands, goods_receipts, warehouses, purchase_orders,
suppliers, user_activity_logs, user_sessions, employee_roles, customers CASCADE;

-- KHÔNG xóa users, employees, roles, permissions vì đã có admin setup

TRUNCATE TABLE journal_entry_items, journal_entries, financial_periods, chart_of_accounts CASCADE;

-- ===================================================================
-- MODULE 1: QUẢN LÝ NGƯỜI DÙNG, PHÂN QUYỀN & BẢO MẬT
-- ===================================================================

-- 1.1. Tạo Users mẫu (nếu chưa có)
-- Customer users
INSERT INTO users (email, password, status, created_at) 
SELECT 'customer1@shop.com', '$2a$10$3g.PAy.QGZ1k2.QkQkYgGeOCo.awZ5k/Bx780J6a/ciL0u0j.5B6C', 'ACTIVE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'customer1@shop.com');

INSERT INTO users (email, password, status, created_at) 
SELECT 'customer2@shop.com', '$2a$10$3g.PAy.QGZ1k2.QkQkYgGeOCo.awZ5k/Bx780J6a/ciL0u0j.5B6C', 'ACTIVE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'customer2@shop.com');

-- Sale Manager user
INSERT INTO users (email, password, status, created_at) 
SELECT 'salemanager@shop.com', '$2a$10$3g.PAy.QGZ1k2.QkQkYgGeOCo.awZ5k/Bx780J6a/ciL0u0j.5B6C', 'ACTIVE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'salemanager@shop.com');

-- Warehouse Manager user
INSERT INTO users (email, password, status, created_at) 
SELECT 'warehouse@shop.com', '$2a$10$3g.PAy.QGZ1k2.QkQkYgGeOCo.awZ5k/Bx780J6a/ciL0u0j.5B6C', 'ACTIVE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'warehouse@shop.com');

-- 1.2. Tạo Customers
INSERT INTO customers (user_id, fullname, phone_number, photo)
SELECT u.id, 'Trần Anh Khoa', '0901234567', NULL
FROM users u WHERE u.email = 'customer1@shop.com'
AND NOT EXISTS (SELECT 1 FROM customers WHERE user_id = u.id);

INSERT INTO customers (user_id, fullname, phone_number, photo)
SELECT u.id, 'Lê Thị Mai', '0987654321', '/images/avatars/customer2.jpg'
FROM users u WHERE u.email = 'customer2@shop.com'
AND NOT EXISTS (SELECT 1 FROM customers WHERE user_id = u.id);

-- 1.3. Tạo Employees
-- Sale Manager
INSERT INTO employees (employee_code, user_id, fullname, position, department, hired_date, is_active)
SELECT 'SALE001', u.id, 'Nguyễn Văn Sales', 'Sale Manager', 'Sales', '2025-01-15', TRUE
FROM users u WHERE u.email = 'salemanager@shop.com'
AND NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'SALE001');

-- Warehouse Manager
INSERT INTO employees (employee_code, user_id, fullname, position, department, hired_date, is_active)
SELECT 'WH001', u.id, 'Phạm Thị Kho', 'Warehouse Manager', 'Logistics', '2025-01-10', TRUE
FROM users u WHERE u.email = 'warehouse@shop.com'
AND NOT EXISTS (SELECT 1 FROM employees WHERE employee_code = 'WH001');

-- 1.4. Gán Roles cho Employees (giả sử role SALE_MANAGER id=2, WAREHOUSE_MANAGER id=3)
-- Chỉ gán nếu role tồn tại
INSERT INTO employee_roles (employee_id, role_id)
SELECT e.id, 2 FROM employees e WHERE e.employee_code = 'SALE001'
AND EXISTS (SELECT 1 FROM roles WHERE id = 2)
AND NOT EXISTS (SELECT 1 FROM employee_roles WHERE employee_id = e.id AND role_id = 2);

INSERT INTO employee_roles (employee_id, role_id)
SELECT e.id, 3 FROM employees e WHERE e.employee_code = 'WH001'
AND EXISTS (SELECT 1 FROM roles WHERE id = 3)
AND NOT EXISTS (SELECT 1 FROM employee_roles WHERE employee_id = e.id AND role_id = 3);

-- ===================================================================
-- MODULE 2: CHUỖI CUNG ỨNG & NHẬP HÀNG
-- ===================================================================

-- 2.1. Suppliers
INSERT INTO suppliers (name, contact_person, email) VALUES
('Nhà phân phối Apple Việt Nam', 'Nguyễn Thị C', 'apple-vn@supplier.com'),
('Công ty TNHH Samsung Vina', 'Trần Văn D', 'samsung-vn@supplier.com'),
('Dell Technologies Việt Nam', 'Lê Hoàng E', 'dell-vn@supplier.com'),
('Sony Electronics Việt Nam', 'Phạm Minh F', 'sony-vn@supplier.com'),
('LG Electronics Việt Nam', 'Hoàng Gia G', 'lg-vn@supplier.com'),
('Asus Việt Nam', 'Ngô Văn H', 'asus-vn@supplier.com');

-- 2.2. Warehouses
INSERT INTO warehouses (name, address) VALUES
('Kho Trung Tâm TP.HCM', '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM'),
('Kho Thủ Đức', '456 Đường Võ Văn Ngân, TP. Thủ Đức, TP.HCM'),
('Kho Hà Nội', '789 Phố Giải Phóng, Quận Hai Bà Trưng, Hà Nội');

-- ===================================================================
-- MODULE 3: SẢN PHẨM & TỒN KHO
-- ===================================================================

-- 3.1. Brands
INSERT INTO brands (name) VALUES
('Apple'),
('Samsung'),
('Dell'),
('Sony'),
('LG'),
('Asus');

-- 3.2. Product Categories
INSERT INTO product_categories (name) VALUES
('Laptop'),
('Điện thoại di động'),
('Máy tính bảng'),
('Tai nghe'),
('TV');

-- 3.3. Products (KHÔNG chỉ định ID)
INSERT INTO products (brand_id, category_id, name, sku_prefix, description, is_active, is_deleted) VALUES
-- Laptops
((SELECT id FROM brands WHERE name = 'Apple'), (SELECT id FROM product_categories WHERE name = 'Laptop'), 
 'MacBook Pro 14 inch M3', 'MBP14M3', 'Chip Apple M3, 8GB RAM, 512GB SSD', TRUE, FALSE),
((SELECT id FROM brands WHERE name = 'Dell'), (SELECT id FROM product_categories WHERE name = 'Laptop'), 
 'Dell XPS 13', 'XPS13', 'Intel Core i7, 16GB RAM, 1TB SSD, Màn hình OLED', TRUE, FALSE),
((SELECT id FROM brands WHERE name = 'Asus'), (SELECT id FROM product_categories WHERE name = 'Laptop'), 
 'Asus ROG Strix G16', 'ROG-G16', 'Intel Core i9, 32GB RAM, 1TB SSD, RTX 4070', TRUE, FALSE),

-- Phones
((SELECT id FROM brands WHERE name = 'Apple'), (SELECT id FROM product_categories WHERE name = 'Điện thoại di động'), 
 'iPhone 15 Pro', 'IP15P', 'Chip A17 Bionic, Camera Pro, Dynamic Island', TRUE, FALSE),
((SELECT id FROM brands WHERE name = 'Samsung'), (SELECT id FROM product_categories WHERE name = 'Điện thoại di động'), 
 'Samsung Galaxy S24 Ultra', 'SGS24U', 'Snapdragon 8 Gen 3, Camera 200MP, S Pen', TRUE, FALSE),

-- Headphones
((SELECT id FROM brands WHERE name = 'Sony'), (SELECT id FROM product_categories WHERE name = 'Tai nghe'), 
 'Sony WH-1000XM5', 'WH1KXM5', 'Tai nghe chống ồn chủ động hàng đầu', TRUE, FALSE),
((SELECT id FROM brands WHERE name = 'Apple'), (SELECT id FROM product_categories WHERE name = 'Tai nghe'), 
 'AirPods Pro 2', 'APP2', 'Chống ồn chủ động, Âm thanh không gian', TRUE, FALSE),

-- TV
((SELECT id FROM brands WHERE name = 'LG'), (SELECT id FROM product_categories WHERE name = 'TV'), 
 'LG OLED C3 55 inch', 'LGC355', 'TV OLED 4K, WebOS thông minh', TRUE, FALSE);

-- 3.4. Product Specs - Laptops
INSERT INTO product_specs_laptop (product_id, cpu, ram, storage, gpu, screen_size)
SELECT p.id, 'Apple M3', '8GB', '512GB SSD', 'GPU 10 lõi', '14.2 inch'
FROM products p WHERE p.sku_prefix = 'MBP14M3';

INSERT INTO product_specs_laptop (product_id, cpu, ram, storage, gpu, screen_size)
SELECT p.id, 'Intel Core i7-1360P', '16GB LPDDR5', '1TB NVMe SSD', 'Intel Iris Xe', '13.4 inch OLED'
FROM products p WHERE p.sku_prefix = 'XPS13';

INSERT INTO product_specs_laptop (product_id, cpu, ram, storage, gpu, screen_size)
SELECT p.id, 'Intel Core i9-13980HX', '32GB DDR5', '1TB NVMe SSD', 'NVIDIA RTX 4070', '16 inch QHD+ 240Hz'
FROM products p WHERE p.sku_prefix = 'ROG-G16';

-- 3.5. Product Specs - Phones
INSERT INTO product_specs_phone (product_id, screen_size, ram, storage, battery, os)
SELECT p.id, '6.1 inch Super Retina XDR', '8GB', '256GB', '3274 mAh', 'iOS 17'
FROM products p WHERE p.sku_prefix = 'IP15P';

INSERT INTO product_specs_phone (product_id, screen_size, ram, storage, battery, os)
SELECT p.id, '6.8 inch Dynamic AMOLED 2X', '12GB', '512GB', '5000 mAh', 'Android 14'
FROM products p WHERE p.sku_prefix = 'SGS24U';

-- 3.6. Product Variants (KHÔNG chỉ định ID)
-- MacBook Pro variants
INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'MBP14M3-512-SG', 38990000.00, 'Space Gray'
FROM products p WHERE p.sku_prefix = 'MBP14M3';

INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'MBP14M3-512-SL', 38990000.00, 'Silver'
FROM products p WHERE p.sku_prefix = 'MBP14M3';

-- Dell XPS 13 variant
INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'XPS13-I7-16-1T-SL', 35500000.00, 'Silver'
FROM products p WHERE p.sku_prefix = 'XPS13';

-- Asus ROG variant
INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'ROG-G16-I9-32-1T-BK', 52990000.00, 'Eclipse Gray'
FROM products p WHERE p.sku_prefix = 'ROG-G16';

-- iPhone 15 Pro variants
INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'IP15P-256-NT', 27990000.00, 'Natural Titanium'
FROM products p WHERE p.sku_prefix = 'IP15P';

INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'IP15P-256-BL', 27990000.00, 'Blue Titanium'
FROM products p WHERE p.sku_prefix = 'IP15P';

INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'IP15P-512-NT', 33990000.00, 'Natural Titanium'
FROM products p WHERE p.sku_prefix = 'IP15P';

-- Samsung Galaxy S24 Ultra variants
INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'SGS24U-512-TB', 30500000.00, 'Titanium Black'
FROM products p WHERE p.sku_prefix = 'SGS24U';

INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'SGS24U-512-TG', 30500000.00, 'Titanium Gray'
FROM products p WHERE p.sku_prefix = 'SGS24U';

-- Sony WH-1000XM5 variants
INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'WH1KXM5-BK', 7490000.00, 'Black'
FROM products p WHERE p.sku_prefix = 'WH1KXM5';

INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'WH1KXM5-SL', 7490000.00, 'Silver'
FROM products p WHERE p.sku_prefix = 'WH1KXM5';

-- AirPods Pro 2 variant
INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'APP2-USBC', 5890000.00, 'White'
FROM products p WHERE p.sku_prefix = 'APP2';

-- LG OLED C3 variant
INSERT INTO product_variants (product_id, sku, price, color)
SELECT p.id, 'LGC355PSA', 29900000.00, 'Black'
FROM products p WHERE p.sku_prefix = 'LGC355';

-- 3.7. Product Images
INSERT INTO product_images (product_id, image_url, alt_text, is_main, display_order, metadata, created_at)
SELECT p.id, '/images/products/mbp14-m3-sg-1.jpg', 'MacBook Pro 14 M3 Space Gray - Front view', TRUE, 0, NULL, NOW()
FROM products p WHERE p.sku_prefix = 'MBP14M3';

INSERT INTO product_images (product_id, image_url, alt_text, is_main, display_order, metadata, created_at)
SELECT p.id, '/images/products/mbp14-m3-sg-2.jpg', 'MacBook Pro 14 M3 Space Gray - Side view', FALSE, 1, NULL, NOW()
FROM products p WHERE p.sku_prefix = 'MBP14M3';

INSERT INTO product_images (product_id, image_url, alt_text, is_main, display_order, metadata, created_at)
SELECT p.id, '/images/products/iphone15pro-nt-1.jpg', 'iPhone 15 Pro Natural Titanium - Front', TRUE, 0, NULL, NOW()
FROM products p WHERE p.sku_prefix = 'IP15P';

INSERT INTO product_images (product_id, image_url, alt_text, is_main, display_order, metadata, created_at)
SELECT p.id, '/images/products/s24ultra-tb-1.jpg', 'Samsung Galaxy S24 Ultra - Front', TRUE, 0, NULL, NOW()
FROM products p WHERE p.sku_prefix = 'SGS24U';

-- 3.8. Purchase Orders (Đơn đặt hàng nhà cung cấp)
INSERT INTO purchase_orders (supplier_id, order_date, expected_delivery_date, status, created_by_employee_id)
SELECT 
    (SELECT id FROM suppliers WHERE name LIKE '%Apple%'),
    '2025-10-01',
    '2025-10-15',
    'APPROVED',
    (SELECT id FROM employees WHERE employee_code = 'WH001')
WHERE EXISTS (SELECT 1 FROM employees WHERE employee_code = 'WH001');

INSERT INTO purchase_orders (supplier_id, order_date, expected_delivery_date, status, created_by_employee_id)
SELECT 
    (SELECT id FROM suppliers WHERE name LIKE '%Samsung%'),
    '2025-10-05',
    '2025-10-20',
    'APPROVED',
    (SELECT id FROM employees WHERE employee_code = 'WH001')
WHERE EXISTS (SELECT 1 FROM employees WHERE employee_code = 'WH001');

-- 3.9. Purchase Order Items
-- PO 1: Đặt MacBook và iPhone
INSERT INTO purchase_order_items (purchase_order_id, variant_id, quantity, unit_price)
SELECT 
    (SELECT MIN(id) FROM purchase_orders),
    (SELECT id FROM product_variants WHERE sku = 'MBP14M3-512-SG'),
    20,
    35000000.00;

INSERT INTO purchase_order_items (purchase_order_id, variant_id, quantity, unit_price)
SELECT 
    (SELECT MIN(id) FROM purchase_orders),
    (SELECT id FROM product_variants WHERE sku = 'IP15P-256-NT'),
    50,
    25000000.00;

-- PO 2: Đặt Samsung
INSERT INTO purchase_order_items (purchase_order_id, variant_id, quantity, unit_price)
SELECT 
    (SELECT MIN(id) FROM purchase_orders WHERE id > (SELECT MIN(id) FROM purchase_orders)),
    (SELECT id FROM product_variants WHERE sku = 'SGS24U-512-TB'),
    30,
    28000000.00;

-- 3.10. Goods Receipts (Phiếu nhập kho)
INSERT INTO goods_receipts (purchase_order_id, warehouse_id, receipt_date, created_by_employee_id)
SELECT 
    (SELECT MIN(id) FROM purchase_orders),
    (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'),
    '2025-10-15',
    (SELECT id FROM employees WHERE employee_code = 'WH001')
WHERE EXISTS (SELECT 1 FROM employees WHERE employee_code = 'WH001');

-- 3.11. Goods Receipt Items (Trigger sẽ TỰ ĐỘNG cập nhật inventory)
-- Nhập MacBook
INSERT INTO goods_receipt_items (goods_receipt_id, po_item_id, variant_id, quantity_received, unit_cost)
SELECT 
    (SELECT MIN(id) FROM goods_receipts),
    (SELECT MIN(id) FROM purchase_order_items),
    (SELECT id FROM product_variants WHERE sku = 'MBP14M3-512-SG'),
    20,
    35000000.00;

-- Nhập iPhone
INSERT INTO goods_receipt_items (goods_receipt_id, po_item_id, variant_id, quantity_received, unit_cost)
SELECT 
    (SELECT MIN(id) FROM goods_receipts),
    (SELECT MIN(id) FROM purchase_order_items WHERE id > (SELECT MIN(id) FROM purchase_order_items)),
    (SELECT id FROM product_variants WHERE sku = 'IP15P-256-NT'),
    50,
    25000000.00;

-- Thêm inventory thủ công cho các sản phẩm khác (không qua goods receipt)
-- Dell XPS 13
INSERT INTO inventory (variant_id, warehouse_id, stock_quantity) VALUES
((SELECT id FROM product_variants WHERE sku = 'XPS13-I7-16-1T-SL'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 15);

-- Asus ROG
INSERT INTO inventory (variant_id, warehouse_id, stock_quantity) VALUES
((SELECT id FROM product_variants WHERE sku = 'ROG-G16-I9-32-1T-BK'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 10);

-- iPhone Blue Titanium
INSERT INTO inventory (variant_id, warehouse_id, stock_quantity) VALUES
((SELECT id FROM product_variants WHERE sku = 'IP15P-256-BL'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 40);

-- Samsung variants
INSERT INTO inventory (variant_id, warehouse_id, stock_quantity) VALUES
((SELECT id FROM product_variants WHERE sku = 'SGS24U-512-TB'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 25),
((SELECT id FROM product_variants WHERE sku = 'SGS24U-512-TG'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 20);

-- Sony headphones
INSERT INTO inventory (variant_id, warehouse_id, stock_quantity) VALUES
((SELECT id FROM product_variants WHERE sku = 'WH1KXM5-BK'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 30),
((SELECT id FROM product_variants WHERE sku = 'WH1KXM5-SL'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 25);

-- AirPods Pro 2
INSERT INTO inventory (variant_id, warehouse_id, stock_quantity) VALUES
((SELECT id FROM product_variants WHERE sku = 'APP2-USBC'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 60);

-- LG TV
INSERT INTO inventory (variant_id, warehouse_id, stock_quantity) VALUES
((SELECT id FROM product_variants WHERE sku = 'LGC355PSA'), 
 (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'), 
 5);

-- ===================================================================
-- MODULE 4: BÁN HÀNG, KHUYẾN MÃI & HẬU MÃI
-- ===================================================================

-- 4.1. Promotion Campaigns
INSERT INTO promotion_campaigns (name, start_date, end_date, discount_type, discount_value, is_active) VALUES
('Giảm giá cuối năm 2025', '2025-10-01 00:00:00+07', '2025-12-31 23:59:59+07', 'PERCENTAGE', 10.00, TRUE),
('Black Friday Sale', '2025-11-25 00:00:00+07', '2025-11-30 23:59:59+07', 'FIXED_AMOUNT', 500000.00, FALSE);

-- 4.2. Orders
-- Order 1: Customer 1 mua MacBook + iPhone (COMPLETED)
INSERT INTO orders (customer_id, shipping_address, warehouse_id, grand_total, status, created_at, handled_by_employee_id)
SELECT 
    (SELECT id FROM customers WHERE fullname = 'Trần Anh Khoa'),
    '100 Võ Văn Tần, P.6, Q.3, TP.HCM',
    (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'),
    66980000.00,
    'COMPLETED',
    '2025-10-16 10:30:00+07',
    (SELECT id FROM employees WHERE employee_code = 'SALE001')
WHERE EXISTS (SELECT 1 FROM customers WHERE fullname = 'Trần Anh Khoa')
AND EXISTS (SELECT 1 FROM employees WHERE employee_code = 'SALE001');

-- Order 2: Customer 2 mua Samsung + AirPods (SHIPPED)
INSERT INTO orders (customer_id, shipping_address, warehouse_id, grand_total, status, created_at, handled_by_employee_id)
SELECT 
    (SELECT id FROM customers WHERE fullname = 'Lê Thị Mai'),
    '250 Nguyễn Thị Minh Khai, P. Võ Thị Sáu, Q.3, TP.HCM',
    (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'),
    36390000.00,
    'SHIPPED',
    '2025-10-18 14:00:00+07',
    (SELECT id FROM employees WHERE employee_code = 'SALE001')
WHERE EXISTS (SELECT 1 FROM customers WHERE fullname = 'Lê Thị Mai')
AND EXISTS (SELECT 1 FROM employees WHERE employee_code = 'SALE001');

-- Order 3: Customer 1 mua Sony headphone (PENDING)
INSERT INTO orders (customer_id, shipping_address, warehouse_id, grand_total, status, created_at, handled_by_employee_id)
SELECT 
    (SELECT id FROM customers WHERE fullname = 'Trần Anh Khoa'),
    '100 Võ Văn Tần, P.6, Q.3, TP.HCM',
    (SELECT id FROM warehouses WHERE name LIKE '%Trung Tâm%'),
    7490000.00,
    'PENDING',
    NOW(),
    NULL
WHERE EXISTS (SELECT 1 FROM customers WHERE fullname = 'Trần Anh Khoa');

-- 4.3. Order Items (Trigger sẽ TỰ ĐỘNG giảm inventory)
-- Order 1 items
INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase)
SELECT 
    (SELECT MIN(id) FROM orders),
    (SELECT id FROM product_variants WHERE sku = 'MBP14M3-512-SG'),
    1,
    38990000.00
WHERE EXISTS (SELECT 1 FROM orders);

INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase)
SELECT 
    (SELECT MIN(id) FROM orders),
    (SELECT id FROM product_variants WHERE sku = 'IP15P-256-NT'),
    1,
    27990000.00
WHERE EXISTS (SELECT 1 FROM orders);

-- Order 2 items
INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase)
SELECT 
    (SELECT MIN(id) FROM orders WHERE id > (SELECT MIN(id) FROM orders)),
    (SELECT id FROM product_variants WHERE sku = 'SGS24U-512-TB'),
    1,
    30500000.00
WHERE EXISTS (SELECT 1 FROM orders WHERE id > (SELECT MIN(id) FROM orders));

INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase)
SELECT 
    (SELECT MIN(id) FROM orders WHERE id > (SELECT MIN(id) FROM orders)),
    (SELECT id FROM product_variants WHERE sku = 'APP2-USBC'),
    1,
    5890000.00
WHERE EXISTS (SELECT 1 FROM orders WHERE id > (SELECT MIN(id) FROM orders));

-- Order 3 items
INSERT INTO order_items (order_id, variant_id, quantity, price_at_purchase)
SELECT 
    (SELECT MAX(id) FROM orders),
    (SELECT id FROM product_variants WHERE sku = 'WH1KXM5-BK'),
    1,
    7490000.00
WHERE EXISTS (SELECT 1 FROM orders);

-- 4.4. Payments
INSERT INTO payments (order_id, amount, method, status, transaction_code)
SELECT MIN(id), 66980000.00, 'CREDIT_CARD', 'COMPLETED', 'PAY-20251016-ABC123'
FROM orders;

INSERT INTO payments (order_id, amount, method, status, transaction_code)
SELECT MIN(id) FROM orders WHERE id > (SELECT MIN(id) FROM orders), 36390000.00, 'COD', 'PENDING', 'PAY-20251018-XYZ456'
FROM (SELECT 1) AS dummy;

-- 4.5. Shipments
INSERT INTO shipments (order_id, tracking_code, status, shipped_at)
SELECT MIN(id), 'GHN-123456789', 'DELIVERED', '2025-10-17 09:00:00+07'
FROM orders;

INSERT INTO shipments (order_id, tracking_code, status, shipped_at)
SELECT MIN(id) FROM orders WHERE id > (SELECT MIN(id) FROM orders), 'GHTK-987654321', 'SHIPPING', '2025-10-19 11:00:00+07'
FROM (SELECT 1) AS dummy;

-- 4.6. Order Status History
INSERT INTO order_status_history (order_id, status, notes, created_at, updated_by_employee_id)
SELECT 
    MIN(id), 
    'PENDING', 
    'Đơn hàng mới tạo', 
    '2025-10-16 10:30:00+07', 
    NULL
FROM orders;

INSERT INTO order_status_history (order_id, status, notes, created_at, updated_by_employee_id)
SELECT 
    MIN(id), 
    'CONFIRMED', 
    'Xác nhận thanh toán thành công', 
    '2025-10-16 11:00:00+07', 
    (SELECT id FROM employees WHERE employee_code = 'SALE001')
FROM orders
WHERE EXISTS (SELECT 1 FROM employees WHERE employee_code = 'SALE001');

INSERT INTO order_status_history (order_id, status, notes, created_at, updated_by_employee_id)
SELECT 
    MIN(id), 
    'PROCESSING', 
    'Đang chuẩn bị hàng', 
    '2025-10-16 15:00:00+07', 
    (SELECT id FROM employees WHERE employee_code = 'WH001')
FROM orders
WHERE EXISTS (SELECT 1 FROM employees WHERE employee_code = 'WH001');

INSERT INTO order_status_history (order_id, status, notes, created_at, updated_by_employee_id)
SELECT 
    MIN(id), 
    'SHIPPED', 
    'Đã giao cho ĐVVC GHN', 
    '2025-10-16 17:00:00+07', 
    (SELECT id FROM employees WHERE employee_code = 'WH001')
FROM orders
WHERE EXISTS (SELECT 1 FROM employees WHERE employee_code = 'WH001');

INSERT INTO order_status_history (order_id, status, notes, created_at, updated_by_employee_id)
SELECT 
    MIN(id), 
    'DELIVERED', 
    'Giao hàng thành công', 
    '2025-10-17 09:00:00+07', 
    NULL
FROM orders;

INSERT INTO order_status_history (order_id, status, notes, created_at, updated_by_employee_id)
SELECT 
    MIN(id), 
    'COMPLETED', 
    'Đơn hàng hoàn tất', 
    '2025-10-17 10:00:00+07', 
    NULL
FROM orders;

-- ===================================================================
-- MODULE 5: TÀI CHÍNH & KẾ TOÁN (CƠ BẢN)
-- ===================================================================

-- 5.1. Chart of Accounts (Hệ thống tài khoản kế toán)
INSERT INTO chart_of_accounts (account_code, account_name, account_type, is_active, description) VALUES
('111', 'Tiền mặt', 'ASSET', TRUE, 'Tiền mặt tại quầy/két'),
('112', 'Tiền gửi ngân hàng', 'ASSET', TRUE, 'Tiền gửi tại các ngân hàng'),
('131', 'Phải thu khách hàng', 'ASSET', TRUE, 'Công nợ phải thu từ khách hàng'),
('152', 'Nguyên liệu, vật liệu', 'ASSET', TRUE, 'Hàng tồn kho'),
('331', 'Phải trả người bán', 'LIABILITY', TRUE, 'Công nợ phải trả nhà cung cấp'),
('511', 'Doanh thu bán hàng', 'REVENUE', TRUE, 'Doanh thu từ bán hàng và cung cấp dịch vụ'),
('632', 'Giá vốn hàng bán', 'EXPENSE', TRUE, 'Chi phí giá vốn hàng bán');

-- 5.2. Financial Periods
INSERT INTO financial_periods (name, start_date, end_date, status) VALUES
('Tháng 10/2025', '2025-10-01', '2025-10-31', 'OPEN'),
('Tháng 11/2025', '2025-11-01', '2025-11-30', 'OPEN'),
('Tháng 12/2025', '2025-12-01', '2025-12-31', 'OPEN');

-- ===================================================================
-- HOÀN THÀNH
-- ===================================================================

SELECT '========================================' AS separator;
SELECT '✅ DỮ LIỆU MẪU ĐÃ ĐƯỢC INSERT THÀNH CÔNG!' AS status;
SELECT '========================================' AS separator;

-- Tổng kết dữ liệu
SELECT 'TỔNG KẾT DỮ LIỆU:' AS info;
SELECT '📦 Brands: ' || COUNT(*) AS count FROM brands
UNION ALL SELECT '📁 Categories: ' || COUNT(*) FROM product_categories
UNION ALL SELECT '🛍️ Products: ' || COUNT(*) FROM products
UNION ALL SELECT '🎨 Product Variants: ' || COUNT(*) FROM product_variants
UNION ALL SELECT '🖼️ Product Images: ' || COUNT(*) FROM product_images
UNION ALL SELECT '🏢 Suppliers: ' || COUNT(*) FROM suppliers
UNION ALL SELECT '🏪 Warehouses: ' || COUNT(*) FROM warehouses
UNION ALL SELECT '📋 Purchase Orders: ' || COUNT(*) FROM purchase_orders
UNION ALL SELECT '📦 Goods Receipts: ' || COUNT(*) FROM goods_receipts
UNION ALL SELECT '📊 Inventory: ' || COUNT(*) FROM inventory
UNION ALL SELECT '👥 Customers: ' || COUNT(*) FROM customers
UNION ALL SELECT '👔 Employees: ' || COUNT(*) FROM employees
UNION ALL SELECT '🛒 Orders: ' || COUNT(*) FROM orders
UNION ALL SELECT '📝 Order Items: ' || COUNT(*) FROM order_items
UNION ALL SELECT '💳 Payments: ' || COUNT(*) FROM payments
UNION ALL SELECT '🚚 Shipments: ' || COUNT(*) FROM shipments
UNION ALL SELECT '🎁 Promotions: ' || COUNT(*) FROM promotion_campaigns
UNION ALL SELECT '📈 Inventory Transactions: ' || COUNT(*) FROM inventory_transactions
UNION ALL SELECT '💰 Chart of Accounts: ' || COUNT(*) FROM chart_of_accounts
UNION ALL SELECT '📅 Financial Periods: ' || COUNT(*) FROM financial_periods;

SELECT '========================================' AS separator;
SELECT 'Kiểm tra Inventory sau khi nhập hàng và bán hàng:' AS info;
SELECT 
    pv.sku,
    p.name AS product_name,
    i.stock_quantity,
    w.name AS warehouse
FROM inventory i
JOIN product_variants pv ON i.variant_id = pv.id
JOIN products p ON pv.product_id = p.id
JOIN warehouses w ON i.warehouse_id = w.id
ORDER BY p.name, pv.sku;

SELECT '========================================' AS separator;
SELECT 'DONE! 🎉' AS status;

