import express from 'express';
import { protectRoute } from '../Auth/auth.middleware.js';
import {
  getSidebarUsers,
  getMessages,
  sendMessage,
} from './messages.controller.js';
import multer from 'multer';

const upload = multer();

const router = express.Router();

router.get('/users', protectRoute, getSidebarUsers);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, upload.single('image'), sendMessage);

export { router as MessagesRouter };
