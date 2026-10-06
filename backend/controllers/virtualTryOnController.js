import Avatar from '../models/Avatar.js';
import Product from '../models/Product.js';
import VirtualTryOnGeneration from '../models/VirtualTryOnGeneration.js';
import Wardrobe from '../models/Wardrobe.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { generateTryOn } from '../services/virtualTryOnService.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { reserveCredits, consumeReservedCredits, refundReservedCredits } from '../services/creditService.js';

const CREDIT_COST = 1;

export const generateVTO = asyncHandler(async (req, res) => {
  const productIds = req.body.productIds || (req.body.productId ? [req.body.productId] : []);
  if (!productIds || productIds.length === 0) throw new ApiError(400, 'At least one Product ID is required.');

  // 1. Check avatar
  const avatar = await Avatar.findOne({ userId: req.user._id, isActive: true });
  if (!avatar || avatar.validationStatus === 'invalid') {
    throw new ApiError(400, 'Please upload a valid full-body avatar photo first.');
  }

  // 2. Check products
  const products = [];
  for (const pid of productIds) {
    const product = await Product.findById(pid);
    if (!product) throw new ApiError(404, `Product not found: ${pid}`);
    if (!product.tryOnImage?.url) throw new ApiError(400, `Product does not have a try-on image: ${pid}`);
    products.push(product);
  }

  // 3. Reserve credits for ALL products
  const totalCost = CREDIT_COST * products.length;
  await reserveCredits(req.user._id, totalCost);

  let currentPersonImage = avatar.imageUrl;
  const generationIds = [];
  let finalGeneration = null;
  let finalWardrobeData = null;

  try {
    for (const product of products) {
      // 4. Create generation record
      const generation = await VirtualTryOnGeneration.create({
        userId: req.user._id,
        avatarId: avatar._id,
        productId: product._id,
        status: 'PROCESSING',
        processingStartedAt: new Date(),
        provider: process.env.VTO_PROVIDER || 'gemini',
        creditCost: CREDIT_COST,
        creditReserved: true,
      });

      // 5. Call AI provider
      const result = await generateTryOn({
        personImageUrl: currentPersonImage,
        garmentImageUrl: product.tryOnImage.url,
      });

      let wardrobeData = {
        userId: req.user._id,
        avatarId: avatar._id,
        productId: product._id,
        provider: process.env.VTO_PROVIDER || 'gemini',
        generationId: generation._id,
        productSnapshot: {
          name: product.name,
          image: product.images[0]?.url || '',
          price: product.price,
        },
      };

      // 6. Handle result based on type
      if (result.type === 'image' && result.imageBuffer) {
        const cloudResult = await uploadToCloudinary(result.imageBuffer, 'tryons', `tryon_${req.user._id}`);
        generation.resultType = 'image';
        generation.resultImageUrl = cloudResult.secure_url;
        generation.resultPublicId = cloudResult.public_id;
        
        wardrobeData.resultType = 'image';
        wardrobeData.generatedImageUrl = cloudResult.secure_url;
        wardrobeData.publicId = cloudResult.public_id;

        // Use the generated image for the next garment
        currentPersonImage = cloudResult.secure_url;
      } else {
        const styleData = result.styleData || {};
        generation.resultType = 'style_description';
        generation.styleData = styleData;
        
        wardrobeData.resultType = 'style_description';
        wardrobeData.styleData = styleData;
        wardrobeData.styleDescription = styleData.styleDescription || '';
      }

      // 7. Update generation: COMPLETED
      generation.status = 'COMPLETED';
      generation.completedAt = new Date();
      generation.creditConsumed = true;
      await generation.save();

      // 8. Consume reserved credit for this product
      await consumeReservedCredits(
        req.user._id,
        CREDIT_COST,
        `Try-on: ${product.name}`,
        generation._id.toString()
      );

      generationIds.push(generation._id);
      finalGeneration = generation;
      finalWardrobeData = wardrobeData;
    }

    // 9. Auto-save final to Wardrobe
    let wardrobeEntry = null;
    if (finalWardrobeData) {
      if (products.length > 1) {
        finalWardrobeData.productSnapshot = {
          name: products.map((p) => p.name).join(' + '),
          image: products[0]?.images?.[0]?.url || '',
          price: products.reduce((sum, p) => sum + (p.price || 0), 0),
        };
      }
      wardrobeEntry = await Wardrobe.create(finalWardrobeData);
    }

    return res.json({
      success: true,
      generation: finalGeneration.toObject(),
      generationIds,
      wardrobeId: wardrobeEntry?._id,
      message: finalGeneration.resultType === 'style_description'
        ? 'AI Style Analysis complete! Your look has been saved to Wardrobe.'
        : 'AI Fashion Preview generated! Saved to your Wardrobe.',
    });
  } catch (err) {
    // Refund remaining credit on failure
    const remainingCost = totalCost - (generationIds.length * CREDIT_COST);
    if (remainingCost > 0) {
      await refundReservedCredits(
        req.user._id,
        remainingCost,
        `Refund: failed try-on`,
        'multi-product-fail'
      );
    }
    
    throw new ApiError(
      500,
      `Couldn't complete your look. Unused credits have been refunded. (${err.message})`
    );
  }
});

export const getGeneration = asyncHandler(async (req, res) => {
  const generation = await VirtualTryOnGeneration.findOne({
    _id: req.params.id,
    userId: req.user._id,
  })
    .populate('productId', 'name images price')
    .populate('avatarId', 'imageUrl thumbnailUrl');

  if (!generation) throw new ApiError(404, 'Generation not found.');
  res.json({ success: true, generation });
});
