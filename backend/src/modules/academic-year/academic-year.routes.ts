import { Router } from 'express';
import { AcademicYearController } from './academic-year.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new AcademicYearController();

router.get('/', authMiddleware, controller.getAllYears);
router.get('/active', authMiddleware, controller.getActiveYear);
router.post('/', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.createYear);
router.patch('/:id/activate', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.activateYear);
router.patch('/:id/close', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.closeYear);

export const academicYearRoutes = router;
