import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import {
  createCompanySchema,
  updateCompanySchema,
  companyIdParamSchema,
} from '../schemas/company.schema.js';
import { Role } from '@prisma/client';

const router = Router();

// Mengambil daftar semua perusahaan
router.get('/', CompanyController.getAllCompanies);

// Mengambil detail perusahaan berdasarkan ID
router.get('/:id', validate({ params: companyIdParamSchema }), CompanyController.getCompanyById);

// Mendaftarkan profil perusahaan baru (Hanya Perekrut)
router.post(
  '/',
  authenticateToken,
  authorizeRoles(Role.RECRUITER),
  validate({ body: createCompanySchema }),
  CompanyController.createCompany
);

// Memperbarui profil perusahaan (Hanya Perekrut pemilik)
router.patch(
  '/:id',
  authenticateToken,
  authorizeRoles(Role.RECRUITER),
  validate({ params: companyIdParamSchema, body: updateCompanySchema }),
  CompanyController.updateCompany
);

export default router;
