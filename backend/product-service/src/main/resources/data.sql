-- ============================================================
-- TECH & GAMING E-COMMERCE DATABASE SEED (Product Service)
-- ============================================================

-- Clean old product seed data
DELETE FROM PRODUCT;
DELETE FROM CATEGORY;

-- ========================
-- CATEGORIES
-- ========================
INSERT INTO CATEGORY (id, name) VALUES (1, 'Gaming Hardware');
INSERT INTO CATEGORY (id, name) VALUES (2, 'PC Components');
INSERT INTO CATEGORY (id, name) VALUES (3, 'Gaming Accessories');
INSERT INTO CATEGORY (id, name) VALUES (4, 'Streaming Setup');
INSERT INTO CATEGORY (id, name) VALUES (5, 'Games');
INSERT INTO CATEGORY (id, name) VALUES (6, 'Software');
INSERT INTO CATEGORY (id, name) VALUES (7, 'Networking');
INSERT INTO CATEGORY (id, name) VALUES (8, 'Smart Devices');

-- ========================
-- PRODUCTS
-- ========================
INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (1, 'ASUS ROG Laptop RTX 4080', 'High-end gaming laptop 240Hz', 2299.99, 15, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop', 1);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (2, 'PlayStation 5', 'Next-gen console', 599.99, 40, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop', 1);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (3, 'Xbox Series X', '4K gaming console', 549.99, 35, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&h=500&fit=crop', 1);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (4, 'RTX 4070 GPU', 'High-end GPU', 799.99, 50, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop', 2);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (5, 'Ryzen 7 7800X', 'Gaming CPU', 329.99, 45, 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=500&h=500&fit=crop', 2);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (6, '16GB DDR5 RAM', 'Fast RAM', 129.99, 100, 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&h=500&fit=crop', 2);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (7, '1TB NVMe SSD', 'Fast storage', 109.99, 90, 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=500&h=500&fit=crop', 2);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (8, 'Razer Keyboard', 'RGB mechanical keyboard', 149.99, 60, 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=500&fit=crop', 3);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (9, 'Logitech Mouse', 'Gaming mouse', 89.99, 80, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&h=500&fit=crop', 3);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (10, 'Gaming Headset', 'Surround headset', 99.99, 70, 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&h=500&fit=crop', 3);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (11, 'Blue Yeti Mic', 'Streaming mic', 129.99, 50, 'https://images.unsplash.com/photo-1580894908361-967195033215?w=500&h=500&fit=crop', 4);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (12, '4K Webcam', 'Streaming webcam', 99.99, 60, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop', 4);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (13, 'Elden Ring', 'RPG game', 59.99, 120, 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=500&h=500&fit=crop', 5);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (14, 'FIFA 25', 'Football game', 69.99, 140, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=500&fit=crop', 5);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (15, 'Call of Duty', 'FPS game', 69.99, 130, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=500&fit=crop', 5);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (16, 'Windows 11 Pro', 'OS license', 199.99, 100, 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=500&h=500&fit=crop', 6);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (17, 'Office 365', 'Office suite', 99.99, 120, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop', 6);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (18, 'WiFi 6 Router', 'Fast router', 129.99, 70, 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=500&fit=crop', 7);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (19, 'Ethernet Cable', '10m cable', 19.99, 200, 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&h=500&fit=crop', 7);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (20, 'Smart LED Strip', 'RGB lighting', 39.99, 110, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=500&fit=crop', 8);

INSERT INTO PRODUCT (id, name, description, price, stock, image_url, category_id) VALUES (21, 'Smart Plug', 'WiFi plug', 19.99, 150, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop', 8);