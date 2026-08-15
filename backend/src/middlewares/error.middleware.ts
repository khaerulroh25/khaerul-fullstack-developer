import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError, FieldError } from "../errors/AppError.js";
import { env } from "../config/env.js";

// Middleware penanganan error global terpusat
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Mencegah penulisan header ganda jika response sudah terkirim sebagian
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = "Terjadi kesalahan pada server internal";
  let errors: FieldError[] | undefined;

  // Penanganan Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Penanganan Error Validasi Zod
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validasi payload data permintaan gagal";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }
  // Penanganan Error Operasi Database Prisma
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        statusCode = 409;
        const target = (err.meta?.target as string[]) || [];
        message =
          target.length > 0
            ? `Data duplikat terdeteksi pada field (${target.join(", ")})`
            : "Data duplikat terdeteksi dalam database";
        break;
      }
      case "P2025": {
        statusCode = 404;
        message = "Data yang diminta tidak ditemukan dalam database";
        break;
      }
      case "P2003": {
        statusCode = 400;
        message =
          "Relasi foreign key database tidak valid atau data relasi tidak ada";
        break;
      }
      default: {
        statusCode = 400;
        message = `Kesalahan Database [${err.code}]: Operasi database gagal`;
        break;
      }
    }
  }
  // Penanganan Error Koneksi & Inisialisasi Database Prisma
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    message =
      "Gagal terhubung ke database. Silakan periksa koneksi server database.";
  }
  // Penanganan Error Token JWT
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token autentikasi tidak valid";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Sesi token autentikasi telah berakhir, silakan login kembali";
  }
  // Penanganan Error Format JSON Body Express
  else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Format JSON dalam request body tidak valid";
  }
  // Penanganan Error Generic Uncaught
  else if (err instanceof Error) {
    message = err.message || message;
  }

  // Pencatatan log terminal untuk error 500 atau unexpected error
  if (statusCode >= 500) {
    console.error("Internal Server Error", err);
  }

  // Format respons amplop standar API
  const responsePayload: any = {
    success: false,
    message,
    ...(errors && errors.length > 0 ? { errors } : {}),
    timestamp: new Date().toISOString(),
  };

  // Sertakan stack trace hanya pada mode development untuk keperluan debugging
  if (env.NODE_ENV === "development" && statusCode >= 500 && err.stack) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
