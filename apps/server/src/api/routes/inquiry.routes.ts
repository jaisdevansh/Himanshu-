import { Router } from 'express';
import { getInquiries, createInquiry } from '../controllers/inquiry.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, getInquiries);
router.post('/', createInquiry);

export default router;
