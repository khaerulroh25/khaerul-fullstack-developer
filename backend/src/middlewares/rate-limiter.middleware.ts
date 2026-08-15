import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const isDev = env.NODE_ENV === 'development';

// Pembatas laju permintaan khusus untuk endpoint autentikasi sensitif (login dan registrasi)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: isDev ? 1000 : 10, // Dilonggarkan saat mode development agar tidak terkunci saat testing
  skipSuccessfulRequests: true, // Hanya menghitung percobaan yang gagal
  standardHeaders: true, // Mengembalikan info rate limit pada header `RateLimit-*`
  legacyHeaders: false, // Menonaktifkan header usang `X-RateLimit-*`
  skip: () => isDev, // Otomatis bypass rate limit saat development
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak percobaan autentikasi dari IP ini. Silakan coba lagi setelah 15 menit.',
      timestamp: new Date().toISOString(),
    });
  },
});

// Pembatas laju permintaan umum untuk seluruh gateway API (mencegah flooding & DDoS)
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: isDev ? 5000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak permintaan ke server. Silakan tunggu beberapa saat lagi.',
      timestamp: new Date().toISOString(),
    });
  },
});
