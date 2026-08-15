import { api } from './api.js';
import type { Application, ApplicationStatus } from '../types/index.js';

export interface SubmitApplicationPayload {
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: number;
  noticePeriod?: string;
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
  comment?: string;
}

export const applicationService = {
  /**
   * Mengajukan berkas lamaran baru ke backend API
   */
  async submitApplication(payload: SubmitApplicationPayload): Promise<Application> {
    const response = await api.post<{ success: boolean; data: Application }>('/applications', payload);
    return response.data.data;
  },

  /**
   * Mengambil daftar berkas lamaran (Pelamar: lamaran pribadi, Recruiter: ATS pipeline)
   */
  async getApplications(params?: { jobId?: string; status?: string }): Promise<Application[]> {
    const response = await api.get<{ success: boolean; data: Application[] }>('/applications', { params });
    return response.data.data;
  },

  /**
   * Mengambil rincian berkas lamaran beserta riwayat audit log
   */
  async getApplicationById(id: string): Promise<Application> {
    const response = await api.get<{ success: boolean; data: Application }>(`/applications/${id}`);
    return response.data.data;
  },

  /**
   * Memperbarui status lamaran (Screening, Interview, Offered, Rejected) oleh Recruiter
   */
  async updateStatus(id: string, payload: UpdateApplicationStatusPayload): Promise<Application> {
    const response = await api.patch<{ success: boolean; data: Application }>(`/applications/${id}/status`, payload);
    return response.data.data;
  },
};
