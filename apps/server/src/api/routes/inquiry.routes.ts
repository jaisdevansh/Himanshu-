import { Router } from 'express';
import { getInquiries, createInquiry } from '../controllers/inquiry.controller';

const router = Router();

router.get('/', getInquiries);
router.post('/', createInquiry);

export default router;
