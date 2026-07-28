import { Router } from 'express';
import { FinancialSettingsController } from './financial-settings.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new FinancialSettingsController();

router.get('/', authMiddleware, controller.getSettings);
router.put('/', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.updateSettings);

export const financialSettingsRoutes = router;
