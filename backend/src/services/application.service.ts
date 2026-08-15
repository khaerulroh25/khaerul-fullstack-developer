import { prisma } from '../config/prisma.js';
import {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
  FilterApplicationQuery,
} from '../schemas/application.schema.js';
import { AppError } from '../errors/AppError.js';
import { Role, Prisma, ApplicationStatus } from '@prisma/client';
import { JwtPayload } from '../utils/jwt.util.js';

export class ApplicationService {
  static async submitApplication(input: CreateApplicationInput, user?: JwtPayload) {
    const job = await prisma.job.findUnique({
      where: { id: input.jobId },
      include: { company: true },
    });

    if (!job) {
      throw AppError.notFound('Lowongan pekerjaan yang dilamar tidak ditemukan');
    }

    if (job.status !== 'ACTIVE') {
      throw AppError.badRequest('Lowongan pekerjaan ini sudah tidak aktif / ditutup');
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        unique_job_applicant: {
          jobId: input.jobId,
          applicantEmail: input.applicantEmail,
        },
      },
    });

    if (existingApplication) {
      throw AppError.conflict(
        'Anda sudah pernah mengajukan berkas lamaran untuk lowongan ini sebelumnya'
      );
    }

    const application = await prisma.$transaction(async (tx) => {
      const createdApp = await tx.application.create({
        data: {
          jobId: input.jobId,
          userId: user?.userId || null,
          applicantName: input.applicantName,
          applicantEmail: input.applicantEmail,
          applicantPhone: input.applicantPhone,
          linkedinUrl: input.linkedinUrl || null,
          portfolioUrl: input.portfolioUrl || null,
          resumeUrl: input.resumeUrl,
          coverLetter: input.coverLetter || null,
          expectedSalary: input.expectedSalary || null,
          noticePeriod: input.noticePeriod || null,
          status: ApplicationStatus.SUBMITTED,
        },
        include: {
          job: {
            include: { company: true },
          },
        },
      });

      await tx.applicationLog.create({
        data: {
          applicationId: createdApp.id,
          previousStatus: ApplicationStatus.SUBMITTED,
          newStatus: ApplicationStatus.SUBMITTED,
          changedBy: 'SYSTEM',
          comment: 'Berkas lamaran berhasil diajukan dan masuk ke pipeline seleksi IndoKerja.id',
        },
      });

      return tx.application.findUnique({
        where: { id: createdApp.id },
        include: {
          job: { include: { company: true } },
          logs: { orderBy: { timestamp: 'desc' } },
        },
      });
    });

    return application;
  }

  static async getApplications(query: FilterApplicationQuery, user: JwtPayload) {
    const { jobId, status, applicantEmail, page = 1, limit = 10 } = query;

    const where: Prisma.ApplicationWhereInput = {};

    if (jobId) {
      where.jobId = jobId;
    }

    if (status) {
      where.status = status;
    }

    // Penegakan visibilitas berdasarkan peran
    if (user.role === Role.JOB_SEEKER) {
      where.OR = [{ userId: user.userId }, { applicantEmail: user.email }];
    } else if (user.role === Role.RECRUITER) {
      // Perekrut hanya melihat lamaran untuk lowongan milik perusahaannya
      where.job = {
        company: {
          userId: user.userId,
        },
      };
    }

    if (applicantEmail && user.role !== Role.JOB_SEEKER) {
      where.applicantEmail = { contains: applicantEmail, mode: 'insensitive' };
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            include: { company: true },
          },
          logs: {
            orderBy: { timestamp: 'desc' },
          },
        },
      }),
      prisma.application.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      applications,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getApplicationById(id: string, user: JwtPayload) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: { company: true },
        },
        logs: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!application) {
      throw AppError.notFound('Berkas lamaran tidak ditemukan');
    }

    // Pengecekan Otorisasi RBAC
    if (user.role === Role.JOB_SEEKER) {
      const isOwner =
        application.userId === user.userId ||
        application.applicantEmail.toLowerCase() === user.email.toLowerCase();
      if (!isOwner) {
        throw AppError.forbidden('Anda tidak memiliki akses ke berkas lamaran ini');
      }
    } else if (user.role === Role.RECRUITER) {
      const isCompanyOwner = application.job.company.userId === user.userId;
      if (!isCompanyOwner) {
        throw AppError.forbidden('Anda tidak memiliki akses ke berkas lamaran pada perusahaan lain');
      }
    }

    return application;
  }

  static async updateApplicationStatus(
    id: string,
    input: UpdateApplicationStatusInput,
    user: JwtPayload
  ) {
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: { company: true },
        },
      },
    });

    if (!application) {
      throw AppError.notFound('Berkas lamaran tidak ditemukan');
    }

    if (application.job.company.userId !== user.userId) {
      throw AppError.forbidden('Anda tidak memiliki izin mengubah status lamaran pada lowongan ini');
    }

    const previousStatus = application.status;
    const newStatus = input.status;

    const updated = await prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id },
        data: {
          status: newStatus,
          ...(input.recruiterNotes !== undefined
            ? { recruiterNotes: input.recruiterNotes }
            : {}),
        },
      });

      await tx.applicationLog.create({
        data: {
          applicationId: id,
          previousStatus,
          newStatus,
          changedBy: user.fullName || 'RECRUITER',
          comment:
            input.comment ||
            input.recruiterNotes ||
            `Status tahapan seleksi diubah dari ${previousStatus} menjadi ${newStatus}`,
        },
      });

      return tx.application.findUnique({
        where: { id: app.id },
        include: {
          job: {
            include: { company: true },
          },
          logs: {
            orderBy: { timestamp: 'desc' },
          },
        },
      });
    });

    return updated;
  }
}
