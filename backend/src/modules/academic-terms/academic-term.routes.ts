import { Router } from 'express';
import { AcademicTermController } from './academic-term.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new AcademicTermController();

router.get('/', authMiddleware, controller.getAllTerms);
router.post('/', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.createTerm);
router.patch('/:id/set-current', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.setCurrentTerm);

export const academicTermRoutes = router;
