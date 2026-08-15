import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.util.js';
import { AppError } from '../errors/AppError.js';

// Controller untuk menangani alur permintaan autentikasi dan profil pengguna
export class AuthController {
  // Menangani pendaftaran akun pengguna baru
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      sendSuccess(res, result, 'Registrasi akun berhasil', 201);
    } catch (error) {
      next(error);
    }
  }

  // Menangani autentikasi masuk pengguna
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      sendSuccess(res, result, 'Login berhasil');
    } catch (error) {
      next(error);
    }
  }

  // Mengambil data profil pengguna yang sedang login
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const user = await AuthService.getProfile(req.user.userId);
      sendSuccess(res, user, 'Data profil berhasil diambil');
    } catch (error) {
      next(error);
    }
  }
}
