import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util.js';
import { AppError } from '../errors/AppError.js';

// Middleware autentikasi wajib untuk memproteksi endpoint yang memerlukan login
export const authenticateToken = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Token autentikasi diperlukan (Bearer token)'));
  }

  const token = authHeader.split(' ')[1];
  if (!token || token.trim() === '') {
    return next(AppError.unauthorized('Format Bearer token tidak valid atau token kosong'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware autentikasi opsional untuk endpoint publik yang membutuhkan identifikasi user jika tersedia
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token && token.trim() !== '') {
      try {
        const decoded = verifyToken(token);
        req.user = decoded;
      } catch {
        // Abaikan error token jika autentikasi bersifat opsional
      }
    }
  }

  next();
};
