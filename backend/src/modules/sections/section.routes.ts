import { Router } from 'express';
import { SectionController } from './section.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new SectionController();

router.get('/class/:classId', authMiddleware, controller.getSectionsByClass);
router.post('/', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.createSection);

export const sectionRoutes = router;
