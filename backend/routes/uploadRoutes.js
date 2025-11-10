import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Upload single image
router.post('/', protect, admin, upload.single('image'), uploadImage);

// Delete image by public ID
router.delete('/:publicId', protect, admin, deleteImage);

export default router;
