import { loadStripe } from '@stripe/stripe-js';

// This will be set from environment variables
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.');
}

export const stripePromise = loadStripe(stripePublishableKey || '');

export const formatPrice = (amount: number, currency: string = 'thb') => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
};

export const STRIPE_PRODUCTS = {
  PREMIUM_MONTHLY: {
    priceId: 'price_premium_monthly', // This will be replaced with actual Stripe price ID
    name: 'Premium Monthly',
    nameTh: 'พรีเมี่ยมรายเดือน',
    price: 19900, // 199 THB in cents
    interval: 'month' as const,
    features: [
      'Unlimited AI Chat',
      'Premium Content Library',
      'Advanced Analytics',
      'Priority Support'
    ],
    featuresTh: [
      'แชท AI ไม่จำกัด',
      'คลังเนื้อหาพรีเมี่ยม',
      'การวิเคราะห์ขั้นสูง',
      'การสนับสนุนลำดับความสำคัญ'
    ]
  },
  PREMIUM_YEARLY: {
    priceId: 'price_premium_yearly', // This will be replaced with actual Stripe price ID
    name: 'Premium Yearly',
    nameTh: 'พรีเมี่ยมรายปี',
    price: 149900, // 1499 THB in cents
    interval: 'year' as const,
    originalPrice: 238800, // 2388 THB in cents (12 months * 199)
    features: [
      'Unlimited AI Chat',
      'Premium Content Library',
      'Advanced Analytics',
      'Priority Support',
      '2 Months Free'
    ],
    featuresTh: [
      'แชท AI ไม่จำกัด',
      'คลังเนื้อหาพรีเมี่ยม',
      'การวิเคราะห์ขั้นสูง',
      'การสนับสนุนลำดับความสำคัญ',
      'ฟรี 2 เดือน'
    ]
  }
};