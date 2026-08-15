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
    const response = await api.post<GetJobDetailResponse>('/jobs', payload);
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
