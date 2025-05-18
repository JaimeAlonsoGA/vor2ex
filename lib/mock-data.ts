'use client';

import { Product } from "./types/product";

// Function to generate random number in range
const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate random Amazon products
export function generateMockAmazonProducts(searchTerm: string): Product[] {
  const categories = ['Electronics', 'Home & Kitchen', 'Sports & Outdoors', 'Toys & Games', 'Beauty & Personal Care'];
  const brands = ['Samsung', 'Apple', 'Sony', 'Anker', 'JBL', 'Logitech', 'Philips', 'Amazon Basics'];
  const shipping = ['Prime', 'Free Shipping', '2-Day Shipping', 'Standard Shipping'];
  
  const basePrice = searchTerm.includes('headphones') ? 35 : 
                    searchTerm.includes('camera') ? 150 :
                    searchTerm.includes('watch') ? 60 : 30;
  
  return Array.from({ length: randomInRange(5, 12) }, (_, i) => {
    const price = basePrice + randomInRange(-10, 50);
    
    return {
      id: `ASIN${String.fromCharCode(65 + i)}${randomInRange(10000, 99999)}`,
      name: `${brands[randomInRange(0, brands.length - 1)]} ${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} ${randomInRange(100, 999)} ${['Pro', 'Max', 'Ultra', 'Plus', ''][randomInRange(0, 4)]}`,
      price: price,
      currency: 'USD',
      brand: brands[randomInRange(0, brands.length - 1)],
      category: categories[randomInRange(0, categories.length - 1)],
      salesRank: randomInRange(1000, 500000),
      estimatedSales: randomInRange(50, 5000),
      shipping: shipping[randomInRange(0, shipping.length - 1)],
      imageUrl: `https://placehold.co/600x400?text=Amazon+${i + 1}`,
      url: 'https://www.amazon.com',
    };
  });
}

// Function to generate random Alibaba products
export function generateMockAlibabaProducts(searchTerm: string): Product[] {
  const suppliers = ['Guangzhou Tech Ltd.', 'Shenzhen Electronics Co.', 'Dongguan Industrial', 'Yiwu Trading Co.', 'Shanghai Import Export'];
  const categories = ['Consumer Electronics', 'Home Appliances', 'Office Supplies', 'Outdoor Products', 'Fashion Accessories'];
  const shipping = ['Express', 'Standard', 'Sea Freight', 'Air Freight'];
  
  const basePrice = searchTerm.includes('headphones') ? 15 : 
                    searchTerm.includes('camera') ? 90 :
                    searchTerm.includes('watch') ? 25 : 12;
  
  const today = new Date();
  
  return Array.from({ length: randomInRange(4, 10) }, (_, i) => {
    const price = basePrice + randomInRange(-5, 25);
    
    // Random date in last 2 years
    const createdDate = new Date();
    createdDate.setDate(today.getDate() - randomInRange(1, 730)); 
    
    return {
      id: `ALI${randomInRange(100000, 999999)}`,
      name: `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} ${['Wireless', 'Bluetooth', 'Premium', 'Budget', 'Mini'][randomInRange(0, 4)]} ${randomInRange(100, 999)}`,
      price: price,
      currency: 'USD',
      brand: suppliers[randomInRange(0, suppliers.length - 1)],
      category: categories[randomInRange(0, categories.length - 1)],
      minOrder: randomInRange(1, 50),
      createdAt: createdDate.toISOString(),
      shipping: shipping[randomInRange(0, shipping.length - 1)],
      imageUrl: `https://placehold.co/600x400?text=Alibaba+${i + 1}`,
      url: 'https://www.alibaba.com',
    };
  });
}