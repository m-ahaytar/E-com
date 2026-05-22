const CATEGORIES = [
  { id: 1, name: 'Phones' },
  { id: 2, name: 'Laptops' },
  { id: 3, name: 'Accessories' },
  { id: 4, name: 'Gadgets' },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    description: 'A18 Pro chip, 48MP pro camera system with 5x optical zoom, titanium design, and all-day battery life. The most powerful iPhone ever.',
    price: 1299.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
    categoryId: 1,
    categoryName: 'Phones',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S25 Ultra',
    description: 'Snapdragon 8 Elite processor, 200MP camera with AI enhancements, built-in S Pen, and a stunning Dynamic AMOLED 2X display.',
    price: 1199.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
    categoryId: 1,
    categoryName: 'Phones',
  },
  {
    id: 3,
    name: 'Google Pixel 9 Pro',
    description: 'Tensor G4 chip, advanced AI photography with Magic Editor, 48MP triple camera, and 7 years of OS updates guaranteed.',
    price: 999.99,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1724322637761-1fef6ca8c8b3?w=500&h=500&fit=crop',
    categoryId: 1,
    categoryName: 'Phones',
  },
  {
    id: 4,
    name: 'OnePlus 13',
    description: 'Snapdragon 8 Elite, 50MP Hasselblad triple camera, 100W SUPERVOOC charging, and a buttery-smooth 120Hz ProXDR display.',
    price: 899.99,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&h=500&fit=crop',
    categoryId: 1,
    categoryName: 'Phones',
  },
  {
    id: 5,
    name: 'Nothing Phone (3)',
    description: 'Transparent design with Glyph Interface lighting, 50MP dual camera, MediaTek Dimensity chipset, and clean Nothing OS experience.',
    price: 699.99,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=500&h=500&fit=crop',
    categoryId: 1,
    categoryName: 'Phones',
  },
  {
    id: 6,
    name: 'MacBook Pro 16" M4',
    description: 'Apple M4 Max chip with 16-core CPU and 40-core GPU, 48GB unified memory, 22-hour battery life, and stunning Liquid Retina XDR display.',
    price: 2499.99,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    categoryId: 2,
    categoryName: 'Laptops',
  },
  {
    id: 7,
    name: 'ASUS ROG Zephyrus G16',
    description: 'Intel Core Ultra 9 with RTX 4070, 16-core processor, 32GB DDR5 RAM, 240Hz QHD display, and premium CNC-milled aluminium chassis.',
    price: 2299.99,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop',
    categoryId: 2,
    categoryName: 'Laptops',
  },
  {
    id: 8,
    name: 'Dell XPS 15',
    description: 'Intel Core Ultra 7, 16GB RAM, 512GB SSD, 15.6" 3.5K OLED InfinityEdge display, and premium build with machined aluminium and carbon fiber.',
    price: 1899.99,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=500&h=500&fit=crop',
    categoryId: 2,
    categoryName: 'Laptops',
  },
  {
    id: 9,
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Intel Core Ultra 7 vPro, 16GB LPDDR5 RAM, 512GB PCIe SSD, 14" 2.8K OLED display, and MIL-STD-810H durability in a 2.2lb chassis.',
    price: 1699.99,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=500&h=500&fit=crop',
    categoryId: 2,
    categoryName: 'Laptops',
  },
  {
    id: 10,
    name: 'Microsoft Surface Laptop 7',
    description: 'Snapdragon X Elite processor, 16GB RAM, 512GB SSD, 13.8" PixelSense touchscreen, and all-day battery with sleek, lightweight design.',
    price: 1299.99,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=500&h=500&fit=crop',
    categoryId: 2,
    categoryName: 'Laptops',
  },
  {
    id: 11,
    name: 'AirPods Pro 3',
    description: 'Apple H3 chip with adaptive audio, active noise cancellation with Transparency mode, personalized spatial audio, and USB-C MagSafe case.',
    price: 249.99,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=500&h=500&fit=crop',
    categoryId: 3,
    categoryName: 'Accessories',
  },
  {
    id: 12,
    name: 'Sony WH-1000XM6',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer, 40-hour battery, DSEE Extreme upscaling, and ultra-comfortable lightweight design.',
    price: 349.99,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    categoryId: 3,
    categoryName: 'Accessories',
  },
  {
    id: 13,
    name: 'Logitech MX Master 3S',
    description: '8K DPI optical sensor, silent click buttons, MagSpeed electromagnetic scroll wheel, USB-C fast charging, and ergonomic sculpted design.',
    price: 99.99,
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&h=500&fit=crop',
    categoryId: 3,
    categoryName: 'Accessories',
  },
  {
    id: 14,
    name: 'Samsung Galaxy Watch 7',
    description: '3nm Exynos chipset, BioActive sensor with body composition analysis, sapphire crystal display, and up to 60-hour battery life on a single charge.',
    price: 399.99,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=500&h=500&fit=crop',
    categoryId: 3,
    categoryName: 'Accessories',
  },
  {
    id: 15,
    name: 'Anker PowerCore 20K',
    description: '20,000mAh high-capacity power bank with 65W Power Delivery, dual USB-C ports, trickle-charging mode, and smart temperature control.',
    price: 49.99,
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?w=500&h=500&fit=crop',
    categoryId: 3,
    categoryName: 'Accessories',
  },
  {
    id: 16,
    name: 'Apple AirTag 4-Pack',
    description: 'Precision Finding with Ultra Wideband, built-in speaker, replaceable battery lasts over a year, and seamless integration with Find My network.',
    price: 29.99,
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1586943101559-4cdcf86a6f87?w=500&h=500&fit=crop',
    categoryId: 3,
    categoryName: 'Accessories',
  },
  {
    id: 17,
    name: 'Nintendo Switch 2',
    description: 'Next-gen hybrid console with 8-inch HDR display, magnetic Joy-Con with hall-effect sticks, DLSS upscaling, and full backward compatibility.',
    price: 449.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&h=500&fit=crop',
    categoryId: 4,
    categoryName: 'Gadgets',
  },
  {
    id: 18,
    name: 'Meta Quest 3S',
    description: 'Mixed reality headset with pancake lenses, Snapdragon XR2 Gen 2 chip, full-color passthrough, and an expanding library of immersive experiences.',
    price: 329.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&h=500&fit=crop',
    categoryId: 4,
    categoryName: 'Gadgets',
  },
  {
    id: 19,
    name: 'DJI Osmo Pocket 3',
    description: '1-inch CMOS sensor with 4K/120fps video, 3-axis gimbal stabilization, 2-inch rotatable touchscreen, and intelligent tracking for smooth content.',
    price: 519.99,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop',
    categoryId: 4,
    categoryName: 'Gadgets',
  },
  {
    id: 20,
    name: 'Amazon Kindle Paperwhite',
    description: '7-inch 300ppi glare-free display with adjustable warm light, weeks-long battery life, USB-C charging, and 16GB storage for thousands of books.',
    price: 149.99,
    stock: 55,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop',
    categoryId: 4,
    categoryName: 'Gadgets',
  },
];

const generateDeals = () => {
  const now = new Date();
  const shuffled = [...PRODUCTS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);
  const discounts = [25, 15, 40, 30];

  return selected.map((product, i) => {
    const discount = discounts[i % discounts.length];
    const discountedPrice = +(product.price * (1 - discount / 100)).toFixed(2);
    return {
      id: i + 1,
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      originalPrice: product.price,
      discountPercentage: discount,
      discountedPrice,
      startDate: new Date(now.getTime() - (i + 1) * 86400000).toISOString(),
      endDate: new Date(now.getTime() + (7 - i) * 86400000).toISOString(),
      active: true,
    };
  });
};

let cachedDeals = null;

export const getMockProducts = () => PRODUCTS;

export const getMockProduct = (id) => PRODUCTS.find((p) => p.id === Number(id)) || null;

export const getMockCategories = () => CATEGORIES;

export const getMockDeals = () => {
  if (!cachedDeals) {
    cachedDeals = generateDeals();
  }
  return cachedDeals;
};

export const refreshMockDeals = () => {
  cachedDeals = null;
};
