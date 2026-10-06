import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

const multerConfig = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

export const uploadSingle = multerConfig.single('image');
export const uploadMultiple = multerConfig.array('images', 5);
export const uploadProductFields = multerConfig.fields([
  { name: 'images', maxCount: 5 },
  { name: 'tryOnImage', maxCount: 1 },
]);
