export const VTO_CREDIT_COST = 1;
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const DENIM_SIZES = ['24', '26', '28', '30', '32', '34'];
export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Trending', value: 'popular' },
];
export const CATEGORIES = [
  { name: 'All', slug: '' },
  { name: 'Dresses', slug: 'dresses' },
  { name: 'Tops', slug: 'tops' },
  { name: 'Ethnic Wear', slug: 'ethnic-wear' },
  { name: 'Co-ord Sets', slug: 'coord-sets' },
  { name: 'Jeans', slug: 'jeans' },
  { name: 'Skirts', slug: 'skirts' },
  { name: 'Jackets', slug: 'jackets' },
];
export const AI_DISCLAIMER =
  'AI Preview — This visualization shows how the style may look on you. Actual fit may vary based on size, fabric, body measurements, and garment construction.';
export const ORDER_STATUSES = {
  placed: { label: 'Order Placed', color: 'bg-champagne-200 text-charcoal-600' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700' },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};
