import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service.js';
import { sendSuccess } from '../utils/response.util.js';
import { AppError } from '../errors/AppError.js';
import { FilterApplicationQuery } from '../schemas/application.schema.js';

export class ApplicationController {
  static async submitApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const application = await ApplicationService.submitApplication(req.body, req.user);
      sendSuccess(
        res,
        application,
        'Berkas lamaran pekerjaan berhasil diajukan',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  static async getApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const result = await ApplicationService.getApplications(
        req.query as unknown as FilterApplicationQuery,
        req.user
      );
      sendSuccess(
        res,
        result.applications,
        'Daftar berkas lamaran berhasil diambil',
        200,
        result.meta
      );
    } catch (error) {
      next(error);
    }
  }

  static async getApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const application = await ApplicationService.getApplicationById(
        req.params.id,
        req.user
      );
      sendSuccess(res, application, 'Detail berkas lamaran berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  static async updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const application = await ApplicationService.updateApplicationStatus(
        req.params.id,
        req.body,
        req.user
      );
      sendSuccess(
        res,
        application,
        'Status tahapan lamaran berhasil diperbarui'
      );
    } catch (error) {
      next(error);
    }
  }
}
