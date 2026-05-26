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

const router = Router();

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/upload', upload.single('file'), uploadMedia);
router.post('/:id/view', trackProjectView);

export default router;
