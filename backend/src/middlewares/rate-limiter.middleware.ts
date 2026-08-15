import rateLimit from 'express-rate-limit';

// Pembatas laju permintaan khusus untuk endpoint autentikasi sensitif (login dan registrasi)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10 percobaan gagal per IP per rentang waktu
  skipSuccessfulRequests: true, // Hanya menghitung percobaan yang gagal (mencegah user terkunci saat login berhasil)
  standardHeaders: true, // Mengembalikan info rate limit pada header `RateLimit-*`
  legacyHeaders: false, // Menonaktifkan header usang `X-RateLimit-*`
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
  max: 200, // Maksimal 200 permintaan per IP per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak permintaan ke server. Silakan tunggu beberapa saat lagi.',
      timestamp: new Date().toISOString(),
    });
  },
});
