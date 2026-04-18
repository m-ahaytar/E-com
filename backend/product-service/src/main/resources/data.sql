-- ============================================================
-- E-Commerce Sample Data Initialization
-- Categories and Products for realistic testing
-- ============================================================

-- INSERT CATEGORIES
INSERT INTO CATEGORY (name) VALUES ('Electronics');
INSERT INTO CATEGORY (name) VALUES ('Clothing');
INSERT INTO CATEGORY (name) VALUES ('Accessories');
INSERT INTO CATEGORY (name) VALUES ('Home & Garden');

-- INSERT ELECTRONICS PRODUCTS (Category 1)
INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Wireless Headphones', 'Premium noise-canceling wireless headphones with 30-hour battery life', 129.99, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 1);

INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('USB-C Charging Cable', 'Durable 2-meter USB-C to USB-C cable for fast charging', 19.99, 200, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop', 1);

INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Portable Power Bank', '20000mAh power bank with dual USB ports and LED display', 39.99, 85, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop', 1);

INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('4K Webcam', 'Professional 4K webcam with auto-focus and built-in microphone', 89.99, 30, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop', 1);

-- INSERT CLOTHING PRODUCTS (Category 2)
INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Cotton T-Shirt', 'Classic comfortable cotton t-shirt available in multiple colors', 24.99, 150, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', 2);

INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Denim Jeans', 'Modern fit denim jeans with stretch comfort technology', 59.99, 75, 'https://images.unsplash.com/photo-1604695573706-e9b1e83c66e8?w=500&h=500&fit=crop', 2);

INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Winter Jacket', 'Waterproof and insulated winter jacket for extreme cold weather', 149.99, 40, 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop', 2);

-- INSERT ACCESSORIES PRODUCTS (Category 3)
INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Leather Wallet', 'Premium leather RFID-blocking wallet with card slots', 49.99, 60, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', 3);

INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Sunglasses', 'UV-protection polarized sunglasses with stylish frame design', 79.99, 45, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', 3);

INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Watch', 'Elegant stainless steel watch with waterproof design', 199.99, 25, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop', 3);

-- INSERT HOME & GARDEN PRODUCTS (Category 4)
INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('LED Desk Lamp', 'Smart LED desk lamp with adjustable brightness and color temperature', 69.99, 55, 'https://images.unsplash.com/photo-1565636192335-14ae0a06e3e1?w=500&h=500&fit=crop', 4);

INSERT INTO PRODUCT (name, description, price, stock, image_url, category_id) 
VALUES ('Coffee Maker', 'Programmable coffee maker with thermal carafe and brew timer', 89.99, 35, 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop', 4);
