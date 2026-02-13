import coursesData from '../data/courses.json';
import roadmapsData from '../data/roadmaps.json';

/**
 * Fetch product by ID and type
 * @param {string} id - Product ID (slug)
 * @param {string} type - 'course' or 'track'
 * @returns {object|null} Product object
 */
export const getProduct = (id, type) => {
  if (!id || !type) return null;

  if (type === 'course') {
    return coursesData.find(c => c.id === id) || null;
  }

  if (type === 'track') {
    return roadmapsData.find(r => r.id === id) || null;
  }

  return null;
};

/**
 * Calculate order totals
 * @param {object} product 
 * @param {string} type - 'course' or 'track'
 * @returns {object} { subtotal, tax, discount, total, originalPrice }
 */
export const calculateOrderTotals = (product, type) => {
  if (!product) return { subtotal: 0, tax: 0, discount: 0, total: 0, originalPrice: 0 };

  let price = 0;
  let originalPrice = 0;

  if (type === 'course') {
    // Course data structure
    if (product.pricing) {
      price = Number(product.pricing.price) || 0;
      originalPrice = Number(product.pricing.original_price) || price;
    }
  } else if (type === 'track') {
    // Roadmap data structure
    price = Number(product.price) || 0;
    // For roadmaps, assuming 'price' is the final price.
    // Let's assume original price is same as price if not specified.
    originalPrice = price + (Number(product.discount) || 0);
  }

  // Calculate totals
  const subtotal = price;
  const taxRate = 0.15; // 15% VAT
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const discount = originalPrice > price ? originalPrice - price : 0;

  return {
    subtotal,
    tax,
    discount,
    total,
    originalPrice
  };
};

/**
 * Save order to local storage (simulating backend)
 * @param {object} orderData 
 */
export const saveOrder = (orderData) => {
  const orders = JSON.parse(localStorage.getItem('shams_orders') || '[]');
  const newOrder = {
    ...orderData,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  orders.push(newOrder);
  localStorage.setItem('shams_orders', JSON.stringify(orders));
  return newOrder;
};
