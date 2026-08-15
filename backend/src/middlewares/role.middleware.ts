import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../errors/AppError.js';

// Middleware otorisasi berbasis peran (Role-Based Access Control)
export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Pengguna belum terautentikasi'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          `Akses ditolak: role '${req.user.role}' tidak memiliki izin untuk tindakan ini`
        )
      );
    }

    next();
  };
};
