import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authRateLimiter } from '../middlewares/rate-limiter.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

// Rute pendaftaran akun pengguna baru dengan proteksi rate limit dan validasi skema
router.post('/register', authRateLimiter, validate({ body: registerSchema }), AuthController.register);

// Rute masuk pengguna dengan proteksi rate limit dan validasi skema
router.post('/login', authRateLimiter, validate({ body: loginSchema }), AuthController.login);

// Rute pengambilan profil data pengguna yang sedang aktif (terautentikasi)
router.get('/me', authenticateToken, AuthController.getMe);

export default router;
