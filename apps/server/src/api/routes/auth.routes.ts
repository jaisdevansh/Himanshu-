import { Router } from 'express';
import { login, initAdmin } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/init', initAdmin);

export default router;
