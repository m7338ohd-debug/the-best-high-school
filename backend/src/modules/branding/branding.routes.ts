import { Router } from 'express';
import { BrandingController } from './branding.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new BrandingController();

router.get('/', authMiddleware, controller.getBranding);
router.put('/', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.updateBranding);

export const brandingRoutes = router;
