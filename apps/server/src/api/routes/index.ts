import { Router } from 'express';
import aiRoutes from './ai.routes';
import projectRoutes from './project.routes';
import inquiryRoutes from './inquiry.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/projects', projectRoutes);
router.use('/inquiries', inquiryRoutes);

export default router;
