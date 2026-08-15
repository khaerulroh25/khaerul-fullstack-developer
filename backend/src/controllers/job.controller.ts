import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service.js';
import { sendSuccess } from '../utils/response.util.js';
import { AppError } from '../errors/AppError.js';
import { FilterJobQuery } from '../schemas/job.schema.js';

export class JobController {
  static async getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await JobService.getJobs(req.query as unknown as FilterJobQuery);
      sendSuccess(
        res,
        result.jobs,
        'Daftar lowongan pekerjaan berhasil diambil',
        200,
        result.meta
      );
    } catch (error) {
      next(error);
    }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await JobService.getJobById(req.params.id);
      sendSuccess(res, job, 'Detail lowongan pekerjaan berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  static async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const job = await JobService.createJob(req.user.userId, req.body);
      sendSuccess(res, job, 'Lowongan pekerjaan berhasil dipublikasikan', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const job = await JobService.updateJob(
        req.params.id,
        req.user.userId,
        req.body
      );
      sendSuccess(res, job, 'Lowongan pekerjaan berhasil diperbarui');
    } catch (error) {
      next(error);
    }
  }

  static async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized();
      }
      const result = await JobService.deleteJob(req.params.id, req.user.userId);
      sendSuccess(res, result, 'Lowongan pekerjaan berhasil dihapus');
    } catch (error) {
      next(error);
    }
  }
}
