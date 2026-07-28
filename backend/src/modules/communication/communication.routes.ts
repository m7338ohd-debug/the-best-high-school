import { Router } from 'express';
import { CommunicationController } from './communication.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireRoles } from '../../middlewares/rbac.middleware.js';
import { Roles } from '../../shared/constants/global.constants.js';

const router = Router();
const controller = new CommunicationController();

router.post('/send-sms', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.sendSms);
router.post('/send-email', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT), controller.sendEmail);
router.get('/templates', authMiddleware, controller.getTemplates);
router.post('/templates', authMiddleware, requireRoles(Roles.SCHOOL_ADMIN, Roles.SUPER_ADMIN), controller.createTemplate);
router.get('/metrics', authMiddleware, controller.getDeliveryMetrics);

export const communicationRoutes = router;
