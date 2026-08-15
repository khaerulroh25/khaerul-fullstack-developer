import { api } from './api.js';
import type { Company } from '../types/index.js';

export interface GetCompaniesResponse {
  success: boolean;
  message: string;
  data: Company[];
}

export const companyService = {
  /**
   * Mengambil daftar seluruh mitra perusahaan dari database backend
   */
  async getCompanies(): Promise<Company[]> {
    const response = await api.get<GetCompaniesResponse>('/companies');
    return response.data.data;
  },

  /**
   * Mengambil detail satu profil perusahaan
   */
  async getCompanyById(id: string): Promise<Company> {
    const response = await api.get<{ success: boolean; data: Company }>(`/companies/${id}`);
    return response.data.data;
  },
};
