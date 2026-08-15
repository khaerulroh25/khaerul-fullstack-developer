import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/company.service.js';
import { sendSuccess } from '../utils/response.util.js';
import { AppError } from '../errors/AppError.js';

export class CompanyController {
  static async getAllCompanies(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await CompanyService.getAllCompanies();
      sendSuccess(res, companies, 'Daftar perusahaan berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  static async getCompanyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const company = await CompanyService.getCompanyById(req.params.id);
      sendSuccess(res, company, 'Detail perusahaan berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  static async createCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const company = await CompanyService.createCompany(req.user.userId, req.body);
      sendSuccess(res, company, 'Perusahaan baru berhasil didaftarkan', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const company = await CompanyService.updateCompany(
        req.params.id,
        req.user.userId,
        req.body
      );
      sendSuccess(res, company, 'Profil perusahaan berhasil diperbarui');
    } catch (error) {
      next(error);
    }
  }
}
