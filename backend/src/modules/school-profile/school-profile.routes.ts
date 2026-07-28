import { Router } from 'express';
import { SchoolProfileController } from './school-profile.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new SchoolProfileController();

router.get('/', authMiddleware, controller.getProfile);
router.put('/', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.updateProfile);

export const schoolProfileRoutes = router;
