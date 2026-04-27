import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

const categories = [
  { name: "Women's Fashion", slug: 'womens-fashion', description: "Trending women's clothing and accessories" },
  { name: "Men's Fashion", slug: 'mens-fashion', description: "Premium men's clothing and accessories" },
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronics' },
  { name: 'Home & Living', slug: 'home-living', description: 'Beautiful home decor and furniture' },
  { name: 'Sports & Fitness', slug: 'sports', description: 'Sports equipment and fitness gear' },
  { name: 'Beauty & Care', slug: 'beauty', description: 'Premium beauty and personal care products' },
];

const generateProducts = (catMap) => [
  { name: 'Luxury Silk Blouse', slug: 'luxury-silk-blouse', price: 89.99, comparePrice: 129.99, discount: 30, stock: 50, category: catMap["Women's Fashion"], brand: 'Élégance', isFeatured: true, isNewArrival: true, ratings: 4.8, numReviews: 124, description: 'Exquisite silk blouse crafted from 100% pure mulberry silk. Features a flowing silhouette with delicate pearl buttons and a timeless collar design.', images: [{ url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop' }] },
  { name: 'Premium Leather Jacket', slug: 'premium-leather-jacket', price: 299.99, comparePrice: 399.99, discount: 25, stock: 30, category: catMap["Men's Fashion"], brand: 'UrbanEdge', isFeatured: true, isBestSeller: true, ratings: 4.9, numReviews: 89, description: 'Handcrafted genuine leather jacket with premium YKK zippers, quilted lining, and timeless biker silhouette.', images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop' }] },
  { name: 'Diamond Watch Collection', slug: 'diamond-watch', price: 499.99, comparePrice: 699.99, discount: 28, stock: 15, category: catMap["Men's Fashion"], brand: 'Temporal Luxury', isFeatured: true, isBestSeller: true, ratings: 4.7, numReviews: 56, description: 'Swiss-made automatic movement with sapphire crystal glass and genuine leather strap. Water resistant to 100m.', images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop' }] },
  { name: 'Cashmere Sweater', slug: 'cashmere-sweater', price: 149.99, comparePrice: 199.99, discount: 25, stock: 40, category: catMap["Women's Fashion"], brand: 'SoftLux', isNewArrival: true, ratings: 4.6, numReviews: 201, description: 'Pure Grade-A cashmere from Inner Mongolia. Exceptionally soft with a relaxed fit perfect for all seasons.', images: [{ url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop' }] },
  { name: 'Designer Handbag', slug: 'designer-handbag', price: 399.99, comparePrice: 549.99, discount: 27, stock: 20, category: catMap["Women's Fashion"], brand: 'MaisonLux', isFeatured: true, isBestSeller: true, ratings: 4.9, numReviews: 145, description: 'Handcrafted Italian leather handbag with 24k gold hardware, adjustable shoulder strap, and multiple compartments.', images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop' }] },
  { name: 'Wireless ANC Headphones', slug: 'wireless-anc-headphones', price: 249.99, comparePrice: 349.99, discount: 28, stock: 60, category: catMap['Electronics'], brand: 'SoundWave', isFeatured: true, isNewArrival: true, ratings: 4.8, numReviews: 312, description: '40dB active noise cancellation, 30-hour battery life, premium leather ear cups, and studio-quality sound.', images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop' }] },
  { name: 'Premium Yoga Mat', slug: 'premium-yoga-mat', price: 79.99, comparePrice: 109.99, discount: 27, stock: 80, category: catMap['Sports & Fitness'], brand: 'ZenFlow', isNewArrival: true, ratings: 4.5, numReviews: 178, description: 'Eco-friendly natural rubber yoga mat with superior grip, alignment guides, and carrying strap.', images: [{ url: 'https://images.unsplash.com/photo-1601925228361-6bd5f0e5dc07?w=600&auto=format&fit=crop' }] },
  { name: 'Luxury Skincare Set', slug: 'luxury-skincare-set', price: 189.99, comparePrice: 259.99, discount: 26, stock: 35, category: catMap['Beauty & Care'], brand: 'GlowLab', isFeatured: true, isBestSeller: true, ratings: 4.9, numReviews: 267, description: 'Complete 5-piece skincare regimen with vitamin C serum, hyaluronic acid toner, retinol moisturizer, and SPF 50 sunscreen.', images: [{ url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop' }] },
  { name: 'Running Sneakers Pro', slug: 'running-sneakers-pro', price: 179.99, comparePrice: 229.99, discount: 21, stock: 45, category: catMap['Sports & Fitness'], brand: 'SwiftStride', isBestSeller: true, ratings: 4.7, numReviews: 394, description: 'Carbon fiber plate, responsive foam midsole, and breathable mesh upper for marathon-ready performance.', images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop' }] },
  { name: 'Scented Candle Collection', slug: 'scented-candle-set', price: 49.99, comparePrice: 69.99, discount: 28, stock: 100, category: catMap['Home & Living'], brand: 'AromaCraft', isNewArrival: true, ratings: 4.6, numReviews: 89, description: 'Set of 6 hand-poured soy wax candles with premium fragrance oils. Burns for 60+ hours each.', images: [{ url: 'https://images.unsplash.com/photo-1602607153850-7e3d6f22d5e8?w=600&auto=format&fit=crop' }] },
  { name: 'Smart Watch Series X', slug: 'smart-watch-x', price: 349.99, comparePrice: 449.99, discount: 22, stock: 25, category: catMap['Electronics'], brand: 'TechVision', isFeatured: true, isBestSeller: true, ratings: 4.8, numReviews: 521, description: 'Health monitoring, GPS, AMOLED display, 5-day battery, and 100+ workout modes in an ultra-thin design.', images: [{ url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop' }] },
  { name: 'Vintage Sunglasses', slug: 'vintage-sunglasses', price: 129.99, comparePrice: 179.99, discount: 27, stock: 55, category: catMap["Men's Fashion"], brand: 'RetroVision', isNewArrival: true, ratings: 4.4, numReviews: 67, description: 'Polarized UV400 lenses in an Italian acetate frame. Handcrafted with stainless steel hinges.', images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop' }] },
];

const seed = async () => {
  await connectDB();
  console.log('\n🌱 Starting database seed...\n');

  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log('✅ Collections cleared');

    // Create admin
    const admin = await User.create({ name: 'Admin User', email: 'admin@doneshop.com', password: 'admin123', role: 'admin' });
    const user = await User.create({ name: 'Test User', email: 'user@doneshop.com', password: 'user1234' });
    console.log('✅ Users created');
    console.log('   Admin: admin@doneshop.com / admin123');
    console.log('   User:  user@doneshop.com / user1234');

    // Create categories
    const createdCats = await Category.insertMany(categories);
    const catMap = {};
    createdCats.forEach((c) => { catMap[c.name] = c._id; });
    console.log(`✅ ${createdCats.length} categories created`);

    // Create products
    const products = generateProducts(catMap);
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products created`);

    console.log('\n🎉 Seed complete!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
