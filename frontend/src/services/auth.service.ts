import { api, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './api.js';
import type { AuthUser, UserRole } from '../types/index.js';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
}

export interface AuthResponseData {
  user: AuthUser;
  token: string;
}

export const authService = {
  /**
   * Mengirim permintaan autentikasi login ke backend
   */
  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
    const { user, token } = response.data.data;

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    return { user, token };
  },

  /**
   * Mendaftarkan akun baru ke backend
   */
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
    const { user, token } = response.data.data;

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    return { user, token };
  },

  /**
   * Mengambil data profil user saat ini yang terautentikasi (GET /api/auth/me)
   */
  async getMe(): Promise<AuthUser> {
    const response = await api.get<ApiResponse<AuthUser>>('/auth/me');
    const user = response.data.data;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  /**
   * Menghapus sesi autentikasi dan token dari localStorage
   */
  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  /**
   * Mendapatkan token JWT yang tersimpan
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  /**
   * Mendapatkan data user dari cache localStorage
   */
  getStoredUser(): AuthUser | null {
    try {
      const userJson = localStorage.getItem(USER_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  },
};
