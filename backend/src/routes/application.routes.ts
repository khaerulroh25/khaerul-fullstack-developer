import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticateToken, optionalAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  filterApplicationQuerySchema,
  applicationIdParamSchema,
} from '../schemas/application.schema.js';
import { Role } from '@prisma/client';

const router = Router();

// Mengirim lamaran (Hanya Pencari Kerja yang terautentikasi)
router.post(
  '/',
  authenticateToken,
  authorizeRoles(Role.JOB_SEEKER),
  validate({ body: createApplicationSchema }),
  ApplicationController.submitApplication
);

// Daftar lamaran (Pencari Kerja melihat miliknya, Perekrut melihat pelamar perusahaannya)
router.get(
  '/',
  authenticateToken,
  validate({ query: filterApplicationQuerySchema }),
  ApplicationController.getApplications
);

// Melihat detail lamaran spesifik dan log audit status
router.get(
  '/:id',
  authenticateToken,
  validate({ params: applicationIdParamSchema }),
  ApplicationController.getApplicationById
);

// Perekrut memperbarui status dan catatan umpan balik di pipeline ATS
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles(Role.RECRUITER),
  validate({
    params: applicationIdParamSchema,
    body: updateApplicationStatusSchema,
  }),
  ApplicationController.updateApplicationStatus
);

export default router;
