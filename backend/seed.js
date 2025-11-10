import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@techfusion.com',
    password: 'admin@9396',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'user@techfusion.com',
    password: 'user123',
    role: 'user'
  }
];

const products = [
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'The most powerful MacBook Pro ever. With M3 Max chip, stunning Liquid Retina XDR display, and up to 22 hours of battery life.',
    price: 349900,
    originalPrice: 399900,
    category: 'Laptops',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
    stock: 15,
    isFeatured: true,
    specifications: {
      'Processor': 'Apple M3 Max',
      'RAM': '64GB',
      'Storage': '2TB SSD',
      'Display': '16.2-inch Liquid Retina XDR',
      'Graphics': 'Integrated GPU'
    }
  },
  {
    name: 'iPhone 15 Pro Max',
    description: 'Forged in titanium with the powerful A17 Pro chip. Features an advanced camera system and Action button.',
    price: 159900,
    originalPrice: 174900,
    category: 'Smartphones',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1592286927505-3fd13aa84ed0?w=600'],
    stock: 30,
    isFeatured: true,
    specifications: {
      'Display': '6.7-inch Super Retina XDR',
      'Chip': 'A17 Pro',
      'Storage': '256GB',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto'
    }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Meet the new Galaxy S24 Ultra with the most powerful Galaxy camera system yet.',
    price: 129999,
    originalPrice: 139999,
    category: 'Smartphones',
    brand: 'Samsung',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'],
    stock: 25,
    isFeatured: true,
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Storage': '512GB'
    }
  },
  {
    name: 'Dell XPS 15',
    description: 'Ultra-thin and light laptop with stunning InfinityEdge display and powerful Intel processors.',
    price: 149999,
    originalPrice: 174999,
    category: 'Laptops',
    brand: 'Dell',
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600'],
    stock: 20,
    isFeatured: true,
    specifications: {
      'Processor': 'Intel Core i7-13700H',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Display': '15.6-inch FHD+'
    }
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality and all-day comfort.',
    price: 29990,
    originalPrice: 34990,
    category: 'Headphones',
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'],
    stock: 50,
    isFeatured: true,
    specifications: {
      'Type': 'Over-ear, Wireless',
      'Battery Life': 'Up to 30 hours',
      'Connectivity': 'Bluetooth 5.2',
      'Features': 'Active Noise Cancellation, Hi-Res Audio'
    }
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'The ultimate iPad experience with the M2 chip, Liquid Retina XDR display, and pro cameras.',
    price: 112900,
    originalPrice: 129900,
    category: 'Tablets',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'],
    stock: 18,
    isFeatured: false,
    specifications: {
      'Display': '12.9-inch Liquid Retina XDR',
      'Chip': 'Apple M2',
      'Storage': '256GB',
      'Camera': '12MP Wide + 10MP Ultra Wide'
    }
  },
  {
    name: 'Apple Watch Series 9',
    description: 'The most advanced Apple Watch with a brighter display, faster chip, and new double tap gesture.',
    price: 45900,
    originalPrice: 54900,
    category: 'Smart Watches',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600'],
    stock: 40,
    isFeatured: true,
    specifications: {
      'Display': 'Always-On Retina LTPO OLED',
      'Chip': 'S9 SiP',
      'Case Size': '45mm',
      'Battery Life': 'Up to 18 hours'
    }
  },
  {
    name: 'PlayStation 5',
    description: 'Experience lightning-fast loading with an ultra-high-speed SSD and stunning 4K graphics.',
    price: 54990,
    category: 'Gaming',
    brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600'],
    stock: 12,
    isFeatured: true,
    specifications: {
      'Storage': '1TB SSD',
      'Resolution': 'Up to 4K at 120Hz',
      'Features': 'Ray Tracing, 3D Audio',
      'Controller': 'DualSense Wireless'
    }
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Advanced wireless mouse with ultra-fast scrolling, quiet clicks, and customizable buttons.',
    price: 8495,
    originalPrice: 9995,
    category: 'Accessories',
    brand: 'Logitech',
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=600'],
    stock: 60,
    isFeatured: false,
    specifications: {
      'Type': 'Wireless Mouse',
      'DPI': 'Up to 8000',
      'Battery Life': 'Up to 70 days',
      'Connectivity': 'Bluetooth, USB-C'
    }
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: 'Professional mirrorless camera with 24.2MP full-frame sensor and advanced autofocus.',
    price: 234990,
    originalPrice: 259990,
    category: 'Cameras',
    brand: 'Canon',
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600'],
    stock: 8,
    isFeatured: false,
    specifications: {
      'Sensor': '24.2MP Full-Frame CMOS',
      'Video': '4K 60fps',
      'ISO Range': '100-102400',
      'Autofocus': 'Dual Pixel CMOS AF II'
    }
  },
  {
    name: 'AirPods Pro (2nd Gen)',
    description: 'Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio for immersive sound.',
    price: 26900,
    category: 'Headphones',
    brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600'],
    stock: 75,
    isFeatured: false,
    specifications: {
      'Type': 'True Wireless Earbuds',
      'Chip': 'Apple H2',
      'Battery Life': 'Up to 6 hours (ANC on)',
      'Features': 'Active Noise Cancellation, Spatial Audio'
    }
  },
  {
    name: 'Microsoft Surface Pro 9',
    description: 'Versatile 2-in-1 laptop and tablet with vibrant touchscreen and all-day battery life.',
    price: 119990,
    originalPrice: 139990,
    category: 'Tablets',
    brand: 'Microsoft',
    images: ['https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600'],
    stock: 14,
    isFeatured: false,
    specifications: {
      'Display': '13-inch PixelSense',
      'Processor': 'Intel Core i7',
      'RAM': '16GB',
      'Storage': '512GB SSD'
    }
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log('Users seeded successfully');

    // Create products
    await Product.insertMany(products);
    console.log('Products seeded successfully');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n👤 Admin and user accounts created');
    console.log('📦 12 products added to the catalog');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
