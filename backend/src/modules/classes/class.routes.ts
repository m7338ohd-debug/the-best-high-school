import { Router } from 'express';
import { ClassController } from './class.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new ClassController();

router.get('/', authMiddleware, controller.getAllClasses);
router.post('/', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.createClass);

export const classRoutes = router;
