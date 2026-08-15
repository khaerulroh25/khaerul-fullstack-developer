import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Role } from '@prisma/client';

// Struktur payload data pengguna yang disimpan di dalam token JWT
export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  fullName: string;
}

// Menghasilkan token JWT baru berdasarkan data payload pengguna
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

// Memverifikasi dan mendekode token JWT menjadi data payload pengguna
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
