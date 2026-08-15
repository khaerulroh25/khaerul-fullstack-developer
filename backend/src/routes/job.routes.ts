import { Router } from 'express';
import { JobController } from '../controllers/job.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import {
  createJobSchema,
  updateJobSchema,
  filterJobQuerySchema,
  jobIdParamSchema,
} from '../schemas/job.schema.js';
import { Role } from '@prisma/client';

const router = Router();

// Mengambil daftar semua lowongan pekerjaan dengan filter dan pencarian
router.get('/', validate({ query: filterJobQuerySchema }), JobController.getJobs);

// Mengambil detail spesifik lowongan pekerjaan berdasarkan ID
router.get('/:id', validate({ params: jobIdParamSchema }), JobController.getJobById);

// Mempublikasikan lowongan pekerjaan baru (Hanya Perekrut)
router.post(
  '/',
  authenticateToken,
  authorizeRoles(Role.RECRUITER),
  validate({ body: createJobSchema }),
  JobController.createJob
);

// Memperbarui informasi lowongan pekerjaan (Hanya Perekrut pemilik)
router.patch(
  '/:id',
  authenticateToken,
  authorizeRoles(Role.RECRUITER),
  validate({ params: jobIdParamSchema, body: updateJobSchema }),
  JobController.updateJob
);

// Menghapus lowongan pekerjaan (Hanya Perekrut pemilik)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(Role.RECRUITER),
  validate({ params: jobIdParamSchema }),
  JobController.deleteJob
);

export default router;
