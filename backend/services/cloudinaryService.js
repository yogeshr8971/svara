import cloudinary from '../config/cloudinary.js';

/**
 * Upload a buffer to Cloudinary in the specified folder.
 */
export const uploadToCloudinary = (buffer, folder, prefix = 'img') => {
  return new Promise((resolve, reject) => {
    const publicId = `${prefix}_${Date.now()}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `svara/${folder}`,
        public_id: publicId,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by public_id.
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

/**
 * Transform a Cloudinary URL to serve an optimized thumbnail.
 * Replaces /upload/ with /upload/w_{width},q_auto,f_auto/
 */
export const getOptimizedUrl = (url, width = 400, quality = 'auto') => {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
};
