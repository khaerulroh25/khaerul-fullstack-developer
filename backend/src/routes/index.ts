import { Router } from 'express';
import authRoutes from './auth.routes.js';
import companyRoutes from './company.routes.js';
import jobRoutes from './job.routes.js';
import applicationRoutes from './application.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/companies', companyRoutes);
apiRouter.use('/jobs', jobRoutes);
apiRouter.use('/applications', applicationRoutes);

export default apiRouter;
