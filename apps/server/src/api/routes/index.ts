import { Router } from 'express';
import aiRoutes from './ai.routes';
import projectRoutes from './project.routes';
import inquiryRoutes from './inquiry.routes';

const router = Router();

router.use('/ai', aiRoutes);
router.use('/projects', projectRoutes);
router.use('/inquiries', inquiryRoutes);

export default router;
