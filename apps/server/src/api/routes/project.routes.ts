import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadMedia,
  trackProjectView
} from '../controllers/project.controller'; // Project controllers module
import { upload } from '../../middlewares/upload.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getProjects);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);
router.post('/upload', requireAuth, upload.single('file'), uploadMedia);
router.post('/:id/view', trackProjectView);

export default router;
