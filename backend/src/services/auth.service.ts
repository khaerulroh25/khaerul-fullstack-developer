import { prisma } from '../config/prisma.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { signToken, JwtPayload } from '../utils/jwt.util.js';
import { AppError } from '../errors/AppError.js';

// Service logika bisnis autentikasi dan manajemen akun pengguna
export class AuthService {
  // Mendaftarkan akun pengguna baru ke sistem
  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw AppError.conflict('Email sudah terdaftar dalam sistem');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        fullName: input.fullName,
        role: input.role,
        phone: input.phone,
        avatarUrl: input.avatarUrl || undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const tokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const token = signToken(tokenPayload);

    return { user, token };
  }

  // Melakukan autentikasi kredensial pengguna dan menerbitkan JWT token
  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        companies: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!user) {
      throw AppError.unauthorized('Email atau password tidak valid');
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Email atau password tidak valid');
    }

    const tokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const token = signToken(tokenPayload);

    const { passwordHash: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  // Mengambil data detail profil pengguna beserta data perusahaan terkait jika recruiter
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        companies: {
          select: {
            id: true,
            name: true,
            industry: true,
            location: true,
            logoUrl: true,
            website: true,
          },
        },
      },
    });

    if (!user) {
      throw AppError.notFound('Pengguna tidak ditemukan');
    }

    return user;
  }
}
