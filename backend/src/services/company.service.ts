import { prisma } from '../config/prisma.js';
import { CreateCompanyInput, UpdateCompanyInput } from '../schemas/company.schema.js';
import { AppError } from '../errors/AppError.js';
import { Role } from '@prisma/client';

export class CompanyService {
  static async getAllCompanies() {
    const companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            jobs: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
    });

    return companies.map((comp) => ({
      ...comp,
      openJobsCount: comp._count.jobs,
    }));
  }

  static async getCompanyById(id: string) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        jobs: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { jobs: true },
        },
      },
    });

    if (!company) {
      throw AppError.notFound('Perusahaan tidak ditemukan');
    }

    return {
      ...company,
      openJobsCount: company.jobs.length,
    };
  }

  static async createCompany(userId: string, input: CreateCompanyInput) {
    return prisma.company.create({
      data: {
        userId,
        name: input.name,
        industry: input.industry,
        location: input.location,
        logoUrl: input.logoUrl || null,
        website: input.website || null,
        description: input.description || null,
      },
    });
  }

  static async updateCompany(
    id: string,
    userId: string,
    input: UpdateCompanyInput
  ) {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw AppError.notFound('Perusahaan tidak ditemukan');
    }

    if (company.userId !== userId) {
      throw AppError.forbidden('Anda tidak memiliki hak akses untuk mengubah profil perusahaan ini');
    }

    return prisma.company.update({
      where: { id },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.industry ? { industry: input.industry } : {}),
        ...(input.location ? { location: input.location } : {}),
        ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl || null } : {}),
        ...(input.website !== undefined ? { website: input.website || null } : {}),
        ...(input.description !== undefined ? { description: input.description || null } : {}),
      },
    });
  }
}
