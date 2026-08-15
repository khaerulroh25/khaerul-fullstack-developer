import { Response } from 'express';

// Metadata paginasi untuk endpoint daftar data
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Struktur amplop standar respons JSON API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  timestamp: string;
}

// Helper pengiriman respons sukses terstandarisasi
export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message: string = 'Operasi berhasil',
  statusCode: number = 200,
  meta?: PaginationMeta
): Response => {
  const responsePayload: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
    ...(meta !== undefined ? { meta } : {}),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(responsePayload);
};
