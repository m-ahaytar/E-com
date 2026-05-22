-- ============================================================
-- WITH ME SHOP E-COMMERCE DATABASE SEED (Product Service)
-- ============================================================

-- Clean old product seed data
DELETE FROM DEAL;
DELETE FROM products;
DELETE FROM categories;

-- ========================
-- CATEGORIES
-- ========================
INSERT INTO categories (id, name) VALUES (1, 'Phones');
INSERT INTO categories (id, name) VALUES (2, 'Laptops');
INSERT INTO categories (id, name) VALUES (3, 'Accessories');
INSERT INTO categories (id, name) VALUES (4, 'Gadgets');

-- ========================
-- PRODUCTS
-- ========================
INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (1, 'iPhone 16 Pro Max', 'A18 Pro chip, 48MP pro camera system with 5x optical zoom, titanium design, and all-day battery life. The most powerful iPhone ever.', 1299.99, 25, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop', 1);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (2, 'Samsung Galaxy S25 Ultra', 'Snapdragon 8 Elite processor, 200MP camera with AI enhancements, built-in S Pen, and a stunning Dynamic AMOLED 2X display.', 1199.99, 30, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop', 1);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (3, 'Google Pixel 9 Pro', 'Tensor G4 chip, advanced AI photography with Magic Editor, 48MP triple camera, and 7 years of OS updates guaranteed.', 999.99, 20, 'https://images.unsplash.com/photo-1724322637761-1fef6ca8c8b3?w=500&h=500&fit=crop', 1);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (4, 'OnePlus 13', 'Snapdragon 8 Elite, 50MP Hasselblad triple camera, 100W SUPERVOOC charging, and a buttery-smooth 120Hz ProXDR display.', 899.99, 35, 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&h=500&fit=crop', 1);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (5, 'Nothing Phone (3)', 'Transparent design with Glyph Interface lighting, 50MP dual camera, MediaTek Dimensity chipset, and clean Nothing OS experience.', 699.99, 40, 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=500&h=500&fit=crop', 1);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (6, 'MacBook Pro 16" M4', 'Apple M4 Max chip with 16-core CPU and 40-core GPU, 48GB unified memory, 22-hour battery life, and stunning Liquid Retina XDR display.', 2499.99, 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop', 2);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (7, 'ASUS ROG Zephyrus G16', 'Intel Core Ultra 9 with RTX 4070, 16-core processor, 32GB DDR5 RAM, 240Hz QHD display, and premium CNC-milled aluminium chassis.', 2299.99, 18, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop', 2);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (8, 'Dell XPS 15', 'Intel Core Ultra 7, 16GB RAM, 512GB SSD, 15.6" 3.5K OLED InfinityEdge display, and premium build with machined aluminium and carbon fiber.', 1899.99, 22, 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=500&h=500&fit=crop', 2);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (9, 'Lenovo ThinkPad X1 Carbon', 'Intel Core Ultra 7 vPro, 16GB LPDDR5 RAM, 512GB PCIe SSD, 14" 2.8K OLED display, and MIL-STD-810H durability in a 2.2lb chassis.', 1699.99, 12, 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=500&h=500&fit=crop', 2);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (10, 'Microsoft Surface Laptop 7', 'Snapdragon X Elite processor, 16GB RAM, 512GB SSD, 13.8" PixelSense touchscreen, and all-day battery with sleek, lightweight design.', 1299.99, 28, 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=500&h=500&fit=crop', 2);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (11, 'AirPods Pro 3', 'Apple H3 chip with adaptive audio, active noise cancellation with Transparency mode, personalized spatial audio, and USB-C MagSafe case.', 249.99, 60, 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=500&h=500&fit=crop', 3);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (12, 'Sony WH-1000XM6', 'Industry-leading noise cancellation with Auto NC Optimizer, 40-hour battery, DSEE Extreme upscaling, and ultra-comfortable lightweight design.', 349.99, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 3);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (13, 'Logitech MX Master 3S', '8K DPI optical sensor, silent click buttons, MagSpeed electromagnetic scroll wheel, USB-C fast charging, and ergonomic sculpted design.', 99.99, 80, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&h=500&fit=crop', 3);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (14, 'Samsung Galaxy Watch 7', '3nm Exynos chipset, BioActive sensor with body composition analysis, sapphire crystal display, and up to 60-hour battery life on a single charge.', 399.99, 35, 'https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=500&h=500&fit=crop', 3);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (15, 'Anker PowerCore 20K', '20,000mAh high-capacity power bank with 65W Power Delivery, dual USB-C ports, trickle-charging mode, and smart temperature control.', 49.99, 120, 'https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?w=500&h=500&fit=crop', 3);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (16, 'Apple AirTag 4-Pack', 'Precision Finding with Ultra Wideband, built-in speaker, replaceable battery lasts over a year, and seamless integration with Find My network.', 29.99, 90, 'https://images.unsplash.com/photo-1586943101559-4cdcf86a6f87?w=500&h=500&fit=crop', 3);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (17, 'Nintendo Switch 2', 'Next-gen hybrid console with 8-inch HDR display, magnetic Joy-Con with hall-effect sticks, DLSS upscaling, and full backward compatibility.', 449.99, 30, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&h=500&fit=crop', 4);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (18, 'Meta Quest 3S', 'Mixed reality headset with pancake lenses, Snapdragon XR2 Gen 2 chip, full-color passthrough, and an expanding library of immersive experiences.', 329.99, 25, 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&h=500&fit=crop', 4);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (19, 'DJI Osmo Pocket 3', '1-inch CMOS sensor with 4K/120fps video, 3-axis gimbal stabilization, 2-inch rotatable touchscreen, and intelligent tracking for smooth content.', 519.99, 20, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop', 4);

INSERT INTO products (id, name, description, price, stock, image_url, category_id) VALUES (20, 'Amazon Kindle Paperwhite', '7-inch 300ppi glare-free display with adjustable warm light, weeks-long battery life, USB-C charging, and 16GB storage for thousands of books.', 149.99, 55, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop', 4);
