import express from 'express';
import { AuthRouter } from '../modules/Auth/auth.route.js';
import { MessagesRouter } from '../modules/messages/messages.route.js';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/messages', MessagesRouter);

export { router as ApiRouter };
