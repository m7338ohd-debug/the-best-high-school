import { Router } from 'express';
import { PaymentModeController } from './payment-mode.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new PaymentModeController();

router.get('/', authMiddleware, controller.getAllModes);
router.patch('/:id/toggle', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.toggleMode);

export const paymentModeRoutes = router;
