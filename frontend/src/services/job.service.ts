import { api } from './api.js';
import type { Job, JobFilterState } from '../types/index.js';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetJobsResponse {
  success: boolean;
  message: string;
  data: Job[];
  meta: PaginationMeta;
}

export interface GetJobDetailResponse {
  success: boolean;
  message: string;
  data: Job;
}

export const jobService = {
  /**
   * Mengambil daftar lowongan kerja dari backend dengan filter dan paginasi
   */
  async getJobs(filters?: Partial<JobFilterState>, page: number = 1, limit: number = 50): Promise<{ jobs: Job[]; meta?: PaginationMeta }> {
    const params: Record<string, any> = { page, limit };

    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (filters?.jobType) params.jobType = filters.jobType;
    if (filters?.experienceLevel) params.experienceLevel = filters.experienceLevel;
    if (filters?.location) params.location = filters.location;
    if (filters?.minSalary) params.minSalary = filters.minSalary;

    const response = await api.get<GetJobsResponse>('/jobs', { params });
    return {
      jobs: response.data.data,
      meta: response.data.meta,
    };
  },

  /**
   * Mengambil detail lengkap satu lowongan kerja berdasarkan ID
   */
  async getJobById(id: string): Promise<Job> {
    const response = await api.get<GetJobDetailResponse>(`/jobs/${id}`);
    return response.data.data;
  },

  /**
   * Membuat lowongan baru oleh recruiter
   */
  async createJob(payload: Partial<Job>): Promise<Job> {
    const body: Record<string, any> = {
      companyId: payload.companyId,
      title: payload.title,
      category: payload.category,
      jobType: payload.jobType,
      experienceLevel: payload.experienceLevel,
      location: payload.location,
      isSalaryDisclosed: payload.isSalaryDisclosed ?? true,
      description: payload.description,
      requirements: payload.requirements || [],
      benefits: payload.benefits || [],
      status: payload.status || 'ACTIVE',
    };

    if (payload.salaryMin !== undefined && payload.salaryMin !== null) {
      body.salaryMin = Number(payload.salaryMin);
    }
    if (payload.salaryMax !== undefined && payload.salaryMax !== null) {
      body.salaryMax = Number(payload.salaryMax);
    }
    if (payload.deadline) {
      body.deadline = payload.deadline;
    }

    const response = await api.post<GetJobDetailResponse>('/jobs', body);
    return response.data.data;
  },

  /**
   * Memperbarui lowongan kerja oleh recruiter
   */
  async updateJob(id: string, payload: Partial<Job>): Promise<Job> {
    const response = await api.patch<GetJobDetailResponse>(`/jobs/${id}`, payload);
    return response.data.data;
  },

  /**
   * Menghapus lowongan kerja
   */
  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};
