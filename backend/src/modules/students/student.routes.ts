import { Router } from 'express';
import { StudentController } from './student.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new StudentController();

router.post('/admission', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.admitStudent);
router.get('/:id', authMiddleware, controller.getStudentProfile);
router.post('/bulk-promote', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.bulkPromote);

export const studentRoutes = router;
