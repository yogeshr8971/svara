import Product from '../models/Product.js';

/**
 * Get product recommendations based on category.
 * Returns up to 6 products from the same category, excluding the current product.
 */
export const getRecommendations = async (productId, categoryId, limit = 6) => {
  if (!categoryId) return [];
  const products = await Product.aggregate([
    { $match: { _id: { $ne: productId }, category: categoryId, stock: { $gt: 0 } } },
    { $sample: { size: limit } },
    {
      $project: {
        name: 1, slug: 1, price: 1, compareAtPrice: 1,
        images: { $slice: ['$images', 1] }, trending: 1, featured: 1,
      },
    },
  ]);
  return products;
};
