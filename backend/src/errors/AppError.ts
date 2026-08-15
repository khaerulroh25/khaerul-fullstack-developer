// Struktur detail error validasi field spesifik
export interface FieldError {
  field: string;
  message: string;
}

// Kelas custom error terpusat untuk aplikasi
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: FieldError[];

  constructor(message: string, statusCode: number = 500, errors?: FieldError[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // Error 400 - Permintaan tidak valid
  static badRequest(message: string = 'Permintaan tidak valid atau data tidak lengkap', errors?: FieldError[]): AppError {
    return new AppError(message, 400, errors);
  }

  // Error 401 - Belum terautentikasi
  static unauthorized(message: string = 'Autentikasi diperlukan atau token tidak valid'): AppError {
    return new AppError(message, 401);
  }

  // Error 403 - Akses ditolak / tidak memiliki wewenang
  static forbidden(message: string = 'Akses ditolak, Anda tidak memiliki izin untuk tindakan ini'): AppError {
    return new AppError(message, 403);
  }

  // Error 404 - Sumber daya tidak ditemukan
  static notFound(message: string = 'Data atau sumber daya yang diminta tidak ditemukan'): AppError {
    return new AppError(message, 404);
  }

  // Error 409 - Konflik / Data duplikat
  static conflict(message: string = 'Terjadi konflik atau data sudah ada dalam sistem'): AppError {
    return new AppError(message, 409);
  }

  // Error 429 - Terlalu banyak permintaan (Rate limit)
  static tooManyRequests(message: string = 'Terlalu banyak permintaan, silakan coba lagi beberapa saat kemudian'): AppError {
    return new AppError(message, 429);
  }

  // Error 500 - Kesalahan server internal
  static internal(message: string = 'Terjadi kesalahan pada server internal'): AppError {
    return new AppError(message, 500);
  }
}
