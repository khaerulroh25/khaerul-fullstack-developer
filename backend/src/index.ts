import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiRateLimiter } from './middlewares/rate-limiter.middleware.js';
import { AppError } from './errors/AppError.js';
import { sendSuccess } from './utils/response.util.js';

const app = express();

// Konfigurasi reverse proxy untuk mendeteksi IP klien di lingkungan cloud/hosting
app.set('trust proxy', 1);

// Middleware keamanan dan pencatatan log
app.use(helmet());
app.use(apiRateLimiter);
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true,
  })
);
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Middleware parser body permintaan HTTP
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Endpoint pemeriksaan kesehatan server
app.get('/api/health', (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }, 'API Gateway IndoKerja.id berjalan dengan baik');
});

// Pendaftaran rute API utama
app.use('/api', apiRouter);

// Penanganan rute yang tidak ditemukan (404 Not Found)
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`));
});

// Penanganan error global terpusat
app.use(errorHandler);

// Inisialisasi server dan mekanisme graceful shutdown
const server = app.listen(env.PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Server Backend IndoKerja.id berhasil dijalankan!`);
  console.log(`📡 URL: http://localhost:${env.PORT}`);
  console.log(`🌍 Lingkungan: ${env.NODE_ENV}`);
  console.log(`🛡️  Pemeriksaan Kesehatan: http://localhost:${env.PORT}/api/health`);
  console.log('====================================================');
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Menerima sinyal ${signal}. Menutup server secara aman...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('🔒 Koneksi Database Prisma terputus dengan aman.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
