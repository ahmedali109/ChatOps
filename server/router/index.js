import express from 'express';
import { AuthRouter } from '../modules/Auth/auth.route.js';

const router = express.Router();

router.use('/auth', AuthRouter);

export { router as ApiRouter };
