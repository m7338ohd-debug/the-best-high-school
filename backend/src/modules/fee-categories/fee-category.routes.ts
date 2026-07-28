import { Router } from 'express';
import { FeeCategoryController } from './fee-category.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new FeeCategoryController();

router.get('/', authMiddleware, controller.getAllCategories);
router.post('/', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.createCategory);

export const feeCategoryRoutes = router;
