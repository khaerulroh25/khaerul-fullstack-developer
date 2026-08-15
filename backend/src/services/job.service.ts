import { prisma } from '../config/prisma.js';
import { CreateJobInput, UpdateJobInput, FilterJobQuery } from '../schemas/job.schema.js';
import { AppError } from '../errors/AppError.js';
import { Role, Prisma, JobStatus } from '@prisma/client';

export class JobService {
  static async getJobs(query: FilterJobQuery) {
    const {
      search,
      category,
      jobType,
      experienceLevel,
      location,
      status,
      minSalary,
      maxSalary,
      companyId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: Prisma.JobWhereInput = {};

    // Filter status (default ke ACTIVE jika tidak diatur secara eksplisit)
    if (status) {
      where.status = status;
    }

    // Pencarian teks pada judul, deskripsi, kategori, dan nama perusahaan
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (jobType) {
      where.jobType = jobType as any;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel as any;
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (minSalary !== undefined || maxSalary !== undefined) {
      where.AND = [
        ...(minSalary !== undefined ? [{ salaryMax: { gte: minSalary } }] : []),
        ...(maxSalary !== undefined ? [{ salaryMin: { lte: maxSalary } }] : []),
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              industry: true,
              location: true,
              logoUrl: true,
              website: true,
              description: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      jobs,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getJobById(id: string) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw AppError.notFound('Lowongan pekerjaan tidak ditemukan');
    }

    return job;
  }

  static async createJob(userId: string, input: CreateJobInput) {
    const company = await prisma.company.findUnique({
      where: { id: input.companyId },
    });

    if (!company) {
      throw AppError.notFound('Perusahaan yang dipilih tidak ditemukan');
    }

    if (company.userId && company.userId !== userId) {
      throw AppError.forbidden('Anda tidak memiliki izin memposting lowongan atas nama perusahaan ini');
    }

    return prisma.job.create({
      data: {
        companyId: input.companyId,
        title: input.title,
        category: input.category,
        jobType: input.jobType,
        experienceLevel: input.experienceLevel,
        location: input.location,
        salaryMin: input.salaryMin ?? null,
        salaryMax: input.salaryMax ?? null,
        isSalaryDisclosed: input.isSalaryDisclosed,
        description: input.description,
        requirements: input.requirements,
        benefits: input.benefits,
        status: input.status,
        deadline: input.deadline,
      },
      include: {
        company: true,
      },
    });
  }

  static async updateJob(
    id: string,
    userId: string,
    input: UpdateJobInput
  ) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) {
      throw AppError.notFound('Lowongan pekerjaan tidak ditemukan');
    }

    if (job.company.userId && job.company.userId !== userId) {
      throw AppError.forbidden('Anda tidak memiliki izin mengubah lowongan pekerjaan ini');
    }

    return prisma.job.update({
      where: { id },
      data: {
        ...(input.companyId ? { companyId: input.companyId } : {}),
        ...(input.title ? { title: input.title } : {}),
        ...(input.category ? { category: input.category } : {}),
        ...(input.jobType ? { jobType: input.jobType } : {}),
        ...(input.experienceLevel ? { experienceLevel: input.experienceLevel } : {}),
        ...(input.location ? { location: input.location } : {}),
        ...(input.salaryMin !== undefined ? { salaryMin: input.salaryMin } : {}),
        ...(input.salaryMax !== undefined ? { salaryMax: input.salaryMax } : {}),
        ...(input.isSalaryDisclosed !== undefined ? { isSalaryDisclosed: input.isSalaryDisclosed } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.requirements ? { requirements: input.requirements } : {}),
        ...(input.benefits ? { benefits: input.benefits } : {}),
        ...(input.status ? { status: input.status } : {}),
        ...(input.deadline !== undefined ? { deadline: input.deadline } : {}),
      },
      include: {
        company: true,
      },
    });
  }

  static async deleteJob(id: string, userId: string) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) {
      throw AppError.notFound('Lowongan pekerjaan tidak ditemukan');
    }

    if (job.company.userId && job.company.userId !== userId) {
      throw AppError.forbidden('Anda tidak memiliki izin menghapus lowongan pekerjaan ini');
    }

    await prisma.job.delete({
      where: { id },
    });

    return { message: 'Lowongan pekerjaan berhasil dihapus' };
  }
}
