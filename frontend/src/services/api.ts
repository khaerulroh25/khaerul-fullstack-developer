import axios from 'axios';

/**
 * URL basis API Gateway backend
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Kunci penyimpanan token dan data sesi di LocalStorage
 */
export const TOKEN_STORAGE_KEY = 'indokerja_token';
export const USER_STORAGE_KEY = 'indokerja_user';

/**
 * Instance Axios terpusat untuk komunikasi data ke backend
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Otomatis menyematkan Bearer token JWT jika tersimpan
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Menangani respons gagal atau token kadaluarsa (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    return Promise.reject(error);
  }
);

/**
 * Helper terpusat untuk mem-parsing response error dari backend (Zod Validation / RFC 7807)
 */
export interface ParsedApiError {
  message: string;
  fieldErrors: Record<string, string>;
}

export function parseApiError(err: unknown, defaultMessage = 'Terjadi kesalahan sistem'): ParsedApiError {
  if (axios.isAxiosError(err)) {
    const resData = err.response?.data;
    const fieldErrors: Record<string, string> = {};

    if (resData?.errors && Array.isArray(resData.errors)) {
      resData.errors.forEach((e: { field?: string; message?: string }) => {
        if (e.field && e.message) {
          fieldErrors[e.field] = e.message;
        }
      });
    }

    return {
      message: resData?.message || defaultMessage,
      fieldErrors,
    };
  }

  return {
    message: defaultMessage,
    fieldErrors: {},
  };
}
