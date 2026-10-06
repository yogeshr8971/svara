import express from 'express';
import { uploadAvatar, getAvatar, deleteAvatar, updateAvatarImageUrl } from '../controllers/avatarController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);
router.get('/', getAvatar);
router.post('/', uploadSingle, uploadAvatar);
router.patch('/', updateAvatarImageUrl);
router.delete('/', deleteAvatar);

export default router;
